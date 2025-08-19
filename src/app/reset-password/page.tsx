"use client";

import { useState, useEffect } from "react";
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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setIsValidToken(false);
      setError("Invalid or missing reset token");
    }
  }, [searchParams]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.resetPassword({
        token,
        newPassword: password,
      });

      if (response.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
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
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              The password reset link is invalid or has expired.
            </p>
          </div>

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

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Please request a new password reset link.
            </p>

            <Button
              onClick={() => router.push("/forgot-password")}
              className="w-full flex justify-center py-3 px-4"
            >
              Request New Reset Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {success ? (
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

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Redirecting to login page...
              </p>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  icon={<Lock className="h-4 w-4" />}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {password && (
                <div className="text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        password.length >= 6 ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <span>At least 6 characters</span>
                  </div>
                </div>
              )}

              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  icon={<Lock className="h-4 w-4" />}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {confirmPassword && password && (
                <div className="text-xs">
                  <div
                    className={`flex items-center space-x-2 ${
                      password === confirmPassword
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        password === confirmPassword
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span>
                      {password === confirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                </div>
              )}
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
                disabled={
                  loading ||
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword
                }
                className="w-full flex justify-center py-3 px-4"
              >
                {loading ? "Resetting..." : "Reset password"}
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
        )}
      </div>
    </div>
  );
}
