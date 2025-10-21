"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import {
  CheckCircle,
  AlertCircle,
  User,
  Shield,
  FileText,
  XCircle,
} from "lucide-react";
import { OnboardingStatus } from "@/types/host-onboarding";
import ProfileForm from "@/components/host-onboarding/ProfileForm";
import IDVerificationForm from "@/components/host-onboarding/IDVerificationForm";
import DocumentUploadForm from "@/components/host-onboarding/DocumentUploadForm";

type OnboardingStep = "profile" | "idVerification" | "documents" | "complete";

export default function HostOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("profile");
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOnboardingStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getOnboardingStatus();

      if (response.success && response.data) {
        console.log("🔍 Onboarding status response:", response.data);
        console.log("🔍 User data:", response.data.user);
        console.log("🔍 Profile data:", response.data.profile);
        console.log("🔍 Verification data:", response.data.verification);
        console.log(
          "🔍 Completion percentage:",
          response.data.completionPercentage
        );
        setStatus(response.data);

        // Determine current step based on status
        console.log("🔍 Determining step based on:", {
          profileCompleted: response.data.profile?.completed,
          idVerification: response.data.verification?.idVerification,
          overall: response.data.verification?.overall,
          hostApprovalStatus: response.data.user?.hostApprovalStatus,
        });

        // If user is approved, show completion
        if (response.data.user?.hostApprovalStatus === "APPROVED") {
          setCurrentStep("complete");
        }
        // If user is rejected, allow editing from profile step
        else if (response.data.user?.hostApprovalStatus === "REJECTED") {
          setCurrentStep("profile");
        }
        // If all steps are completed and verified, show completion
        else if (
          response.data.profile?.completed &&
          response.data.verification?.idVerification === "VERIFIED" &&
          response.data.verification?.overall === "VERIFIED"
        ) {
          setCurrentStep("complete");
        }
        // If user is pending but has completed all steps, show completion
        else if (
          response.data.user?.hostApprovalStatus === "PENDING" &&
          response.data.profile?.completed &&
          response.data.verification?.idVerification &&
          response.data.verification?.idVerification !== "PENDING"
        ) {
          setCurrentStep("complete");
        }
        // If profile is completed and ID verification is done (not pending), go to documents
        else if (
          response.data.profile?.completed &&
          response.data.verification?.idVerification &&
          response.data.verification?.idVerification !== "PENDING"
        ) {
          setCurrentStep("documents");
        }
        // If profile is completed, go to ID verification
        else if (response.data.profile?.completed) {
          setCurrentStep("idVerification");
        }
        // Default to profile step
        else {
          setCurrentStep("profile");
        }

        console.log("🔍 Final step determined:", currentStep);
        console.log(
          "🔍 Will show rejection flow:",
          response.data.user?.hostApprovalStatus === "REJECTED"
        );

        // If user becomes approved during the session, redirect to dashboard
        if (response.data.user?.hostApprovalStatus === "APPROVED") {
          router.push("/dashboard");
          return;
        }
      }
    } catch (err) {
      console.error("Error fetching onboarding status:", err);
      setError("Failed to load onboarding status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "HOST") {
      router.push("/dashboard");
      return;
    }

    // If user is already approved, redirect to dashboard
    if (user.hostApprovalStatus === "APPROVED") {
      router.push("/dashboard");
      return;
    }

    fetchOnboardingStatus();
  }, [user, router, fetchOnboardingStatus]);

  const handleFileUpload = async (files: File[]) => {
    try {
      const response = await apiClient.uploadImages(files);
      if (response.success && response.data) {
        // Handle different response formats
        let urls: string[] = [];
        if (response.data.images) {
          urls = response.data.images;
        } else if (response.data.urls) {
          urls = response.data.urls;
        }

        return {
          files: urls.map((url: string, index: number) => ({
            url,
            name: files[index]?.name || `file-${index}`,
            size: files[index]?.size || 0,
          })),
        };
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleStepComplete = async (step: string, data: unknown) => {
    try {
      setLoading(true);
      setError("");

      switch (step) {
        case "profile":
          const profileResponse = await apiClient.saveHostProfile(data as any);
          if (profileResponse.success) {
            setCurrentStep("idVerification");
            await fetchOnboardingStatus();
          } else {
            setError(profileResponse.message || "Failed to save profile");
          }
          break;

        case "idVerification":
          const idResponse = await apiClient.submitIdVerification(data as any);
          if (idResponse.success) {
            setCurrentStep("documents");
            await fetchOnboardingStatus();
          } else {
            setError(idResponse.message || "Failed to submit ID verification");
          }
          break;

        case "documents":
          const docsResponse = await apiClient.uploadOwnershipDocuments(
            data as any
          );
          if (docsResponse.success) {
            setCurrentStep("complete");
            await fetchOnboardingStatus();
          } else {
            setError(docsResponse.message || "Failed to upload documents");
          }
          break;
      }
    } catch (err) {
      console.error("Error completing step:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error && !status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Onboarding
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchOnboardingStatus} className="w-full">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Check if host is rejected - allow editing and resubmission
  console.log(
    "🔍 Checking rejection status:",
    status?.user?.hostApprovalStatus
  );
  console.log("🔍 Full status object:", status);
  if (status?.user?.hostApprovalStatus === "REJECTED") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Rejection Notice */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">
                  Application Rejected
                </h3>
                <p className="text-sm text-red-700 mb-2">
                  Your host application has been rejected. Please review the
                  feedback below and update your information.
                </p>
                {status.verification?.data?.idRejectionReason && (
                  <p className="text-sm text-red-700">
                    <strong>Reason:</strong>{" "}
                    {status.verification.data.idRejectionReason}
                  </p>
                )}
                {status.verification?.data?.adminNotes && (
                  <p className="text-sm text-red-700 mt-2">
                    <strong>Admin Notes:</strong>{" "}
                    {status.verification.data.adminNotes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentStep("profile")}
                  className={`flex items-center space-x-2 ${
                    currentStep === "profile"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === "profile"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm font-medium">Profile</span>
                </button>
                <div className="flex-1 h-0.5 bg-gray-300"></div>
                <button
                  onClick={() => setCurrentStep("idVerification")}
                  className={`flex items-center space-x-2 ${
                    currentStep === "idVerification"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === "idVerification"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm font-medium">ID Verification</span>
                </button>
                <div className="flex-1 h-0.5 bg-gray-300"></div>
                <button
                  onClick={() => setCurrentStep("documents")}
                  className={`flex items-center space-x-2 ${
                    currentStep === "documents"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === "documents"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm font-medium">Documents</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {currentStep === "profile" && (
              <div>
                <ProfileForm
                  initialData={status?.profile?.data}
                  onSubmit={(data) => handleStepComplete("profile", data)}
                  isLoading={loading}
                />
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    disabled={loading}
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("idVerification")}
                    disabled={loading}
                  >
                    Next: ID Verification
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "idVerification" && (
              <div>
                <IDVerificationForm
                  onUpload={handleFileUpload}
                  onSubmit={(data) =>
                    handleStepComplete("idVerification", data)
                  }
                  isLoading={loading}
                />
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("profile")}
                    disabled={loading}
                  >
                    Back: Profile
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("documents")}
                    disabled={loading}
                  >
                    Next: Documents
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "documents" && (
              <div>
                <DocumentUploadForm
                  onUpload={handleFileUpload}
                  onSubmit={(data) => handleStepComplete("documents", data)}
                  isLoading={loading}
                />
                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("idVerification")}
                    disabled={loading}
                  >
                    Back: ID Verification
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("complete")}
                    disabled={loading}
                  >
                    Submit Application
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "complete" && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Resubmission Complete!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your updated application has been submitted for review.
                  We&apos;ll notify you once it&apos;s approved.
                </p>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If we don't have status data yet, show loading
  if (!status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Host Onboarding
          </h1>
          <p className="text-gray-600">
            Complete your host profile to start listing properties
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center ${
                currentStep === "profile"
                  ? "text-blue-600"
                  : currentStep === "idVerification" ||
                    currentStep === "documents" ||
                    currentStep === "complete"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "profile"
                    ? "bg-blue-600 text-white"
                    : currentStep === "idVerification" ||
                      currentStep === "documents" ||
                      currentStep === "complete"
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                <User className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Profile</span>
            </div>

            <div
              className={`w-8 h-1 ${
                currentStep === "idVerification" ||
                currentStep === "documents" ||
                currentStep === "complete"
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center ${
                currentStep === "idVerification"
                  ? "text-blue-600"
                  : currentStep === "documents" || currentStep === "complete"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "idVerification"
                    ? "bg-blue-600 text-white"
                    : currentStep === "documents" || currentStep === "complete"
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                <Shield className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">ID Verification</span>
            </div>

            <div
              className={`w-8 h-1 ${
                currentStep === "documents" || currentStep === "complete"
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center ${
                currentStep === "documents"
                  ? "text-blue-600"
                  : currentStep === "complete"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "documents"
                    ? "bg-blue-600 text-white"
                    : currentStep === "complete"
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                <FileText className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium">Documents</span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Rejection Reasons */}
        {status?.verification?.data?.idRejectionReason && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-2">
                  Verification Rejected
                </h4>
                <p className="text-sm text-red-700 mb-2">
                  <strong>Reason:</strong>{" "}
                  {status.verification.data.idRejectionReason}
                </p>
                {status.verification.data.adminNotes && (
                  <p className="text-sm text-red-700">
                    <strong>Admin Notes:</strong>{" "}
                    {status.verification.data.adminNotes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        {status?.nextSteps && status.nextSteps.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Next Steps</h4>
            <div className="space-y-2">
              {status.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {step.completed ? "✓" : step.step}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-blue-900">{step.title}</h5>
                    <p className="text-sm text-blue-700">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentStep === "profile" && (
            <ProfileForm
              initialData={status?.profile?.data}
              onSubmit={(data) => handleStepComplete("profile", data)}
              isLoading={loading}
            />
          )}

          {currentStep === "idVerification" && (
            <IDVerificationForm
              onUpload={handleFileUpload}
              onSubmit={(data) => handleStepComplete("idVerification", data)}
              isLoading={loading}
            />
          )}

          {currentStep === "documents" && (
            <DocumentUploadForm
              onUpload={handleFileUpload}
              onSubmit={(data) => handleStepComplete("documents", data)}
              isLoading={loading}
            />
          )}

          {currentStep === "complete" && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Onboarding Complete!
              </h2>
              <p className="text-gray-600 mb-6">
                {status?.user?.hostApprovalStatus === "PENDING"
                  ? "Your host profile has been submitted for review. We'll notify you once it's approved."
                  : "Your host profile is complete. You can now start listing your properties."}
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
