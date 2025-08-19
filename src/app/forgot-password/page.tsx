"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.forgotPassword(email.trim());

      if (response.success) {
        setSuccess("Password reset link sent! Please check your email.");
        setEmailSent(true);
      } else {
        setError(response.message || "Failed to send reset link");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiClient.forgotPassword(email.trim());

      if (response.success) {
        setSuccess("Password reset link resent! Please check your email.");
      } else {
        setError(response.message || "Failed to resend reset link");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to resend reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>

          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        {!emailSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                icon={<Mail className="h-4 w-4" />}
                disabled={loading}
              />
            </div>

            {error && (
              <div
                className="p-4 bg-red-50 rounded-lg"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full flex justify-center py-3 px-4"
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div
              className="p-4 bg-green-50 rounded-lg"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>What happens next?</strong>
                </p>
                <ul className="text-xs text-blue-600 mt-2 space-y-1">
                  <li>• Check your email inbox</li>
                  <li>• Click the reset link in the email</li>
                  <li>• Create a new password</li>
                  <li>• Sign in with your new password</li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                >
                  {loading ? "Sending..." : "resend the link"}
                </button>
              </p>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full flex justify-center py-3 px-4"
                >
                  Back to login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
