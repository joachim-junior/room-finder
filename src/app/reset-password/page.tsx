"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  // Countdown timer for redirect after success
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      router.push("/login");
    }
  }, [success, countdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = searchParams.get("token");

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🔍 Resetting password with token...");

      const response = await apiClient.resetPassword({
        token,
        newPassword: password,
      });

      console.log("🔍 Reset password response:", response);

      if (response.success) {
        setSuccess(true);
        console.log("✅ Password reset successfully");
      } else {
        const errorMsg =
          response.message ||
          "Failed to reset password. The link may be invalid or expired.";
        setError(errorMsg);
        console.error("❌ Password reset failed:", errorMsg);
      }
    } catch (err) {
      console.error("❌ Error resetting password:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(password);

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div
            className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10"
            style={{
              border: "1px solid rgb(221, 221, 221)",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="text-center">
              <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 mb-4">
                Your password has been successfully reset. You can now log in
                with your new password.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting you to login in {countdown} second
                {countdown !== 1 ? "s" : ""}...
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Go to Login Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Reset Your Password
            </h2>
            <p className="text-gray-600 mt-2">Enter your new password below</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-sm text-red-700">{error}</span>
                  {(error.includes("expired") || error.includes("invalid")) && (
                    <div className="mt-3">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Request New Reset Link →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-500">
                    Password strength:
                  </div>
                  <div className="space-y-1">
                    <div
                      className={`text-xs flex items-center ${
                        passwordValidation.minLength
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordValidation.minLength ? "✓" : "○"} At least 8
                      characters
                    </div>
                    <div
                      className={`text-xs flex items-center ${
                        passwordValidation.hasUpperCase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordValidation.hasUpperCase ? "✓" : "○"} One
                      uppercase letter
                    </div>
                    <div
                      className={`text-xs flex items-center ${
                        passwordValidation.hasLowerCase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordValidation.hasLowerCase ? "✓" : "○"} One
                      lowercase letter
                    </div>
                    <div
                      className={`text-xs flex items-center ${
                        passwordValidation.hasNumbers
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordValidation.hasNumbers ? "✓" : "○"} One number
                    </div>
                    <div
                      className={`text-xs flex items-center ${
                        passwordValidation.hasSpecialChar
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordValidation.hasSpecialChar ? "✓" : "○"} One
                      special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  Passwords do not match
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
