"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";
import { apiClient } from "@/lib/api";
import { User as UserIcon, Mail, Phone, Camera, Save, X } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await apiClient.getProfile();
        if (response.success && response.data) {
          setProfile(response.data);
          setFormData({
            firstName: response.data.firstName || "",
            lastName: response.data.lastName || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(formData);
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Please log in to view your profile
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="bg-muted rounded-lg p-8">
              <div className="h-32 w-32 bg-muted rounded-full mx-auto mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-background rounded-lg shadow-lg p-8">
            {error && (
              <div
                className="bg-destructive/10 rounded-lg p-4 mb-6"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div
                className="bg-green-50 rounded-lg p-4 mb-6"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            {/* Avatar Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold text-4xl">
                    {profile?.firstName?.charAt(0)}
                    {profile?.lastName?.charAt(0)}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        border: "1px solid #DDDDDD",
                        boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      disabled={!editing}
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        border: "1px solid #DDDDDD",
                        boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      border: "1px solid #DDDDDD",
                      boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      border: "1px solid #DDDDDD",
                      boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                {editing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          firstName: profile?.firstName || "",
                          lastName: profile?.lastName || "",
                          email: profile?.email || "",
                          phone: profile?.phone || "",
                        });
                        setError("");
                        setSuccess("");
                      }}
                      className="flex items-center space-x-2 px-4 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-muted transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
