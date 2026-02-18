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
  Clock,
} from "lucide-react";
import { OnboardingStatus } from "@/types/host-onboarding";
import ProfileForm from "@/components/host-onboarding/ProfileForm";
import IDVerificationForm from "@/components/host-onboarding/IDVerificationForm";
import DocumentUploadForm from "@/components/host-onboarding/DocumentUploadForm";

type OnboardingStep = "profile" | "idVerification" | "documents" | "complete";

function determineStep(status: OnboardingStatus): OnboardingStep {
  const approval = status.user?.hostApprovalStatus;
  const profileDone = status.profile?.completed;
  const idStatus = status.verification?.idVerification;
  const hasVerificationRecord = !!(status.verification as any)?.data;
  const ownershipStatus = status.verification?.ownershipVerification;
  const hasUploadedDocuments =
    ownershipStatus && ownershipStatus !== "NOT_REQUIRED";

  // Already approved — nothing to do
  if (approval === "APPROVED") return "complete";

  // Rejected — let them re-edit from the start
  if (approval === "REJECTED") return "profile";

  // Profile not done yet
  if (!profileDone) return "profile";

  // Profile done, check if ID verification has been submitted
  if (!hasVerificationRecord) return "idVerification";

  // ID verification was rejected — let them redo it
  if (idStatus === "REJECTED") return "idVerification";

  // ID verification submitted — check documents step
  // If user already uploaded documents or application is pending review, go to complete
  if (hasUploadedDocuments || approval === "PENDING") return "complete";

  // ID verification submitted but documents not yet handled — show documents step
  return "documents";
}

export default function HostOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("profile");
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchOnboardingStatus = useCallback(async () => {
    try {
      const response = await apiClient.getOnboardingStatus();

      if (response.success && response.data) {
        // The API client wraps the backend response, so the actual
        // onboarding data may be nested under response.data.data
        const raw = response.data as any;
        const statusData: OnboardingStatus =
          raw.data && raw.data.user ? raw.data : raw;

        setStatus(statusData);
        setCurrentStep(determineStep(statusData));
      }
    } catch (err) {
      console.error("Error fetching onboarding status:", err);
      setError("Failed to load onboarding status");
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

    if (user.hostApprovalStatus === "APPROVED") {
      router.push("/dashboard");
      return;
    }

    fetchOnboardingStatus().finally(() => setInitialLoading(false));
  }, [user, router, fetchOnboardingStatus]);

  const handleFileUpload = async (files: File[]) => {
    const response = await apiClient.uploadImages(files);
    if (response.success && response.data) {
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
  };

  const refreshStatusOnly = useCallback(async () => {
    try {
      const response = await apiClient.getOnboardingStatus();
      if (response.success && response.data) {
        const raw = response.data as any;
        const statusData: OnboardingStatus =
          raw.data && raw.data.user ? raw.data : raw;
        setStatus(statusData);
      }
    } catch {
      // Silently ignore — the step was already advanced
    }
  }, []);

  const handleStepComplete = async (step: string, data: unknown) => {
    try {
      setSubmitting(true);
      setError("");

      switch (step) {
        case "profile": {
          const resp = await apiClient.saveHostProfile(data as any);
          if (resp.success) {
            setCurrentStep("idVerification");
            await refreshStatusOnly();
          } else {
            setError(resp.message || "Failed to save profile");
          }
          break;
        }

        case "idVerification": {
          const resp = await apiClient.submitIdVerification(data as any);
          if (resp.success) {
            setCurrentStep("documents");
            await refreshStatusOnly();
          } else {
            setError(resp.message || "Failed to submit ID verification");
          }
          break;
        }

        case "documents": {
          const resp = await apiClient.uploadOwnershipDocuments(data as any);
          if (resp.success) {
            setCurrentStep("complete");
            await refreshStatusOnly();
          } else {
            setError(resp.message || "Failed to upload documents");
          }
          break;
        }
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipDocuments = async () => {
    setCurrentStep("complete");
    await refreshStatusOnly();
  };

  if (initialLoading) {
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
          <Button
            onClick={() => {
              setError("");
              setInitialLoading(true);
              fetchOnboardingStatus().finally(() => setInitialLoading(false));
            }}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const isRejected = status.user?.hostApprovalStatus === "REJECTED";
  const isPending = status.user?.hostApprovalStatus === "PENDING";

  const steps: { key: OnboardingStep; label: string; icon: any }[] = [
    { key: "profile", label: "Profile", icon: User },
    { key: "idVerification", label: "ID Verification", icon: Shield },
    { key: "documents", label: "Documents", icon: FileText },
  ];

  const stepOrder: OnboardingStep[] = [
    "profile",
    "idVerification",
    "documents",
    "complete",
  ];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRejected ? "Update Your Application" : "Host Onboarding"}
          </h1>
          <p className="text-gray-600">
            {isRejected
              ? "Review the feedback below and update your information to resubmit"
              : "Complete your host profile to start listing properties"}
          </p>
        </div>

        {/* Rejection Notice */}
        {isRejected && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  Application Rejected
                </h3>
                {status.verification?.data?.idRejectionReason && (
                  <p className="text-sm text-red-700">
                    <strong>Reason:</strong>{" "}
                    {status.verification.data.idRejectionReason}
                  </p>
                )}
                {status.verification?.data?.adminNotes && (
                  <p className="text-sm text-red-700 mt-1">
                    <strong>Admin Notes:</strong>{" "}
                    {status.verification.data.adminNotes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        {currentStep !== "complete" && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              {steps.map((s, i) => {
                const stepIdx = stepOrder.indexOf(s.key);
                const isActive = s.key === currentStep;
                const isDone = stepIdx < currentIndex;
                const Icon = s.icon;

                return (
                  <div key={s.key} className="flex items-center">
                    {i > 0 && (
                      <div
                        className={`w-6 sm:w-10 h-0.5 mr-2 sm:mr-4 ${
                          isDone ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                    <button
                      onClick={() => {
                        if (isRejected || isDone) setCurrentStep(s.key);
                      }}
                      disabled={!isRejected && !isDone && !isActive}
                      className={`flex items-center space-x-2 ${
                        isActive
                          ? "text-blue-600"
                          : isDone
                            ? "text-green-600 cursor-pointer"
                            : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : isDone
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span className="hidden sm:inline text-sm font-medium">
                        {s.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
          {/* Overlay spinner during submission -- keeps form visible */}
          {submitting && (
            <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
              <Loader size="lg" />
            </div>
          )}

          {currentStep === "profile" && (
            <ProfileForm
              initialData={status.profile?.data}
              onSubmit={(data) => handleStepComplete("profile", data)}
              isLoading={submitting}
            />
          )}

          {currentStep === "idVerification" && (
            <div>
              <IDVerificationForm
                onUpload={handleFileUpload}
                onSubmit={(data) =>
                  handleStepComplete("idVerification", data)
                }
                isLoading={submitting}
              />
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("profile")}
                  disabled={submitting}
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {currentStep === "documents" && (
            <div>
              <DocumentUploadForm
                onUpload={handleFileUpload}
                onSubmit={(data) => handleStepComplete("documents", data)}
                isLoading={submitting}
              />
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("idVerification")}
                  disabled={submitting}
                >
                  Back
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSkipDocuments}
                  disabled={submitting}
                >
                  Skip (Optional)
                </Button>
              </div>
            </div>
          )}

          {currentStep === "complete" && (
            <div className="text-center py-8">
              {isPending || status.verification?.idVerification === "PENDING" ? (
                <>
                  <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Application Submitted
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your host profile has been submitted for review. We will
                    notify you once it is approved. This usually takes 1-2
                    business days.
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isRejected
                      ? "Resubmission Complete!"
                      : "Onboarding Complete!"}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your host profile is complete. You can now start listing
                    your properties.
                  </p>
                </>
              )}
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full max-w-xs mx-auto"
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
