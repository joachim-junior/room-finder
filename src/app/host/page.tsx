"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Button, Input, Textarea } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import {
  Home,
  DollarSign,
  Users,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Heart,
  Zap,
} from "lucide-react";

export default function HostApplicationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [application, setApplication] = useState({
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if user already has an application
  useEffect(() => {
    if (user) {
      checkExistingApplication();
    } else {
      setCheckingStatus(false);
    }
  }, [user]);

  const checkExistingApplication = async () => {
    try {
      const response = await apiClient.getHostApplicationStatus();
      console.log("Host application status response:", response);
      if (response.success && response.data) {
        console.log("Setting existing application:", response.data);
        setExistingApplication(response.data);
      } else {
        console.log("No existing application found");
        setExistingApplication(null);
      }
    } catch (error) {
      console.error("Error checking application status:", error);
      setExistingApplication(null);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showError("Please log in to submit your application");
      return;
    }

    if (user.role === "HOST") {
      showError("You are already a host");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.submitHostApplication({
        notes: application.notes,
      });

      if (response.success) {
        showSuccess(
          "Host application submitted successfully! We'll review it and contact you soon."
        );
        setApplication({ notes: "" });
        // Refresh application status
        await checkExistingApplication();
      } else {
        showError(response.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      showError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "text-gray-600 bg-gray-50 border-gray-200";
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-50 border-green-200";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "REJECTED":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <FileText className="h-5 w-5 text-gray-600" />;
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "REJECTED":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusDisplay = (status: string | undefined) => {
    if (!status) return "Unknown";
    return status.toLowerCase();
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Checking your application status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Become a Host
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn your property into a source of income and join our community
              of successful hosts
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Existing Application Status */}
        {existingApplication && existingApplication.status && (
          <div className="mb-8">
            <div
              className={`rounded-xl border-2 p-6 ${getStatusColor(
                existingApplication.status
              )}`}
            >
              <div className="flex items-center space-x-3 mb-4">
                {getStatusIcon(existingApplication.status)}
                <h2 className="text-xl font-semibold">Application Status</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="capitalize">
                    {getStatusDisplay(existingApplication.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Submitted:</span>
                  <span>
                    {new Date(
                      existingApplication.applicationDate
                    ).toLocaleDateString()}
                  </span>
                </div>
                {existingApplication.notes && (
                  <div>
                    <span className="font-medium">Your Notes:</span>
                    <p className="mt-1 text-sm">{existingApplication.notes}</p>
                  </div>
                )}
                {existingApplication.approvalNotes && (
                  <div>
                    <span className="font-medium">Approval Notes:</span>
                    <p className="mt-1 text-sm">
                      {existingApplication.approvalNotes}
                    </p>
                  </div>
                )}
                {existingApplication.rejectionReason && (
                  <div>
                    <span className="font-medium">Rejection Reason:</span>
                    <p className="mt-1 text-sm">
                      {existingApplication.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              {existingApplication.status &&
                existingApplication.status === "APPROVED" && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-green-800">
                      🎉 Congratulations! You can now access all host features
                      in your dashboard.
                    </p>
                    <Button
                      onClick={() => router.push("/dashboard")}
                      className="mt-3 bg-green-600 hover:bg-green-700"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Become a Host?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">Earn Extra Income</h3>
              </div>
              <p className="text-gray-600">
                Turn your unused space into a profitable business. Set your own
                rates and earn money while you're away.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">Meet Travelers</h3>
              </div>
              <p className="text-gray-600">
                Connect with guests from around the world and share your local
                knowledge and culture.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold">Secure Platform</h3>
              </div>
              <p className="text-gray-600">
                Our platform handles payments, provides insurance, and offers
                24/7 support for peace of mind.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold">Flexible Control</h3>
              </div>
              <p className="text-gray-600">
                Choose your availability, set house rules, and manage bookings
                on your own schedule.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Star className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold">Build Reviews</h3>
              </div>
              <p className="text-gray-600">
                Earn positive reviews from satisfied guests to attract more
                bookings and increase your income.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold">Local Support</h3>
              </div>
              <p className="text-gray-600">
                Get support from our local team who understand the market and
                can help you succeed.
              </p>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Host Requirements
          </h2>

          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  What You Need
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>
                      A property in Cameroon (house, apartment, villa, etc.)
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>Valid government-issued ID</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>Proof of property ownership or rental agreement</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>Basic amenities (cleanliness, safety, comfort)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>Reliable internet connection for communication</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  What We Provide
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>Professional listing creation and optimization</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>Secure payment processing and insurance</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>24/7 customer support for hosts and guests</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>Marketing and promotion of your property</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>Host dashboard with analytics and insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Application Process
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Submit Application</h3>
              <p className="text-sm text-gray-600">
                Create a host account and submit your application below with
                your details and motivation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Review Process</h3>
              <p className="text-sm text-gray-600">
                Our team reviews your application (2-3 business days)
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Approval & Setup</h3>
              <p className="text-sm text-gray-600">
                Get approved and set up your property listing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Start Hosting</h3>
              <p className="text-sm text-gray-600">
                Welcome your first guests and start earning
              </p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        {!existingApplication && (
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Submit Your Application
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us about yourself and why you want to become a host
                </label>
                <Textarea
                  value={application.notes}
                  onChange={(e) => setApplication({ notes: e.target.value })}
                  placeholder="Share your experience, motivation, and what makes your property special..."
                  rows={6}
                  maxLength={1000}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {application.notes.length}/1000 characters
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  What to include in your application:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Your experience with hospitality or property management
                  </li>
                  <li>
                    • What makes your property unique and attractive to guests
                  </li>
                  <li>• Your availability and commitment to hosting</li>
                  <li>• Any special amenities or services you can offer</li>
                  <li>• Your motivation for becoming a host</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={loading || !application.notes.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition-all"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Contact Information */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Need Help?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-sm text-gray-600">+237 681 101 063</p>
              <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM</p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-sm text-gray-600">hosts@roomfinder237.com</p>
              <p className="text-xs text-gray-500">24/7 support</p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Host Community</h3>
              <p className="text-sm text-gray-600">Join our host community</p>
              <p className="text-xs text-gray-500">
                Tips, support, and networking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
