"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Clear any existing messages when component mounts
    setError("");
    setSuccess("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await login(email, password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back! Please sign in to continue.
          </p>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          suppressHydrationWarning={true}
        >
          <div className="space-y-4">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                icon={<Mail className="h-4 w-4" />}
              />
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={<Lock className="h-4 w-4" />}
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

            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {error && (
            <div
              className="p-4 bg-red-50 rounded-lg"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div
              className="p-4 bg-green-50 rounded-lg"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
