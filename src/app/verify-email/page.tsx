"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "@/components/ui";
import { CheckCircle, XCircle, Mail } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the URL");
      setTimeout(() => router.push("/"), 2000);
      return;
    }

    verifyEmail(token);
  }, [searchParams, router]);

  // Countdown timer for redirect
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      router.push("/login");
    }
  }, [status, countdown, router]);

  async function verifyEmail(token: string) {
    try {
      console.log(
        "🔍 Verifying email with token:",
        token.substring(0, 10) + "..."
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();
      console.log("🔍 Verification response:", data);

      if (response.ok && data.user) {
        setStatus("success");
        setMessage("Email verified successfully! ✅");
        console.log("✅ Email verified for user:", data.user.email);
      } else {
        setStatus("error");
        setMessage(
          data.message || data.error || "Invalid or expired verification token"
        );
        console.error("❌ Verification failed:", data);
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
      console.error("❌ Verification error:", error);
    }
  }

  const handleResendEmail = () => {
    router.push("/resend-verification");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div
          className="bg-white rounded-2xl p-8 shadow-xl text-center"
          style={{
            border: "1px solid rgb(221, 221, 221)",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          {/* Loading State */}
          {status === "loading" && (
            <>
              <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader size="md" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Email
              </h1>
              <p className="text-gray-600">{message}</p>
              <div className="mt-6 flex items-center justify-center space-x-2">
                <div className="animate-pulse h-2 w-2 bg-blue-600 rounded-full"></div>
                <div className="animate-pulse h-2 w-2 bg-blue-600 rounded-full delay-75"></div>
                <div className="animate-pulse h-2 w-2 bg-blue-600 rounded-full delay-150"></div>
              </div>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <>
              <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting you to login in {countdown} second
                {countdown !== 1 ? "s" : ""}...
              </p>
              <button
                onClick={() => router.push("/login")}
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Go to Login Now
              </button>
            </>
          )}

          {/* Error State */}
          {status === "error" && (
            <>
              <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={handleResendEmail}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Mail className="h-5 w-5" />
                  <span>Resend Verification Email</span>
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help?{" "}
          <a
            href="/support"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <Loader size="md" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
