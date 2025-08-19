"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { Input, Button, Label, Divider, Select } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "GUEST" as "GUEST" | "HOST" | "ADMIN",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      });
      router.push("/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const roleOptions = [
    { value: "GUEST", label: "Guest" },
    { value: "HOST", label: "Host" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Join us and start your journey
          </p>
        </div>

        {error && (
          <div
            className="bg-destructive/10 rounded-lg p-4"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" required>
                  First name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  icon={<User className="h-4 w-4" />}
                />
              </div>
              <div>
                <Label htmlFor="lastName" required>
                  Last name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  icon={<User className="h-4 w-4" />}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" required>
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div>
              <Label htmlFor="phone" required>
                Phone number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                icon={<Phone className="h-4 w-4" />}
              />
            </div>

            <div>
              <Label htmlFor="role" required>
                Role
              </Label>
              <Select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
              />
            </div>

            <div>
              <Label htmlFor="password" required>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={<Lock className="h-4 w-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" required>
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  icon={<Lock className="h-4 w-4" />}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="mt-6">
          <Divider />
          <div className="mt-6">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Sign in to your account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
