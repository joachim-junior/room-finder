"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { Mail, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function ResendVerificationPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setStatus("loading");
      setMessage("Sending verification email...");

      console.log("🔍 Resending verification email to:", email);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      console.log("🔍 Resend verification response:", data);

      if (response.ok) {
        setStatus("success");
        setMessage(
          "Verification email sent! Please check your inbox and spam folder."
        );
        console.log("✅ Verification email sent to:", email);
      } else {
        setStatus("error");
        setMessage(
          data.message || data.error || "Failed to send verification email"
        );
        console.error("❌ Failed to resend verification:", data);
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
      console.error("❌ Resend verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div
          className="bg-white rounded-2xl p-8 shadow-xl"
          style={{
            border: "1px solid rgb(221, 221, 221)",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Resend Verification Email
            </h1>
            <p className="text-gray-600">
              Enter your email address and we&apos;ll send you a new
              verification link
            </p>
          </div>

          {/* Success Message */}
          {status === "success" && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {status === "error" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Verification Email"}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/login")}
              className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </button>
          </div>
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
