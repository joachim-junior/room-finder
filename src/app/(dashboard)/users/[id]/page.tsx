"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { apiClient, User } from "@/lib/api";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function UserOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      // For now, we'll fetch from the users list and find the specific user
      // In a real implementation, you'd have a GET /admin/users/:id endpoint
      const response = await apiClient.getUsers({ limit: 1000 });
      if (response.success && response.data) {
        const foundUser = response.data.users.find((u) => u.id === userId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          setError("User not found");
        }
      } else {
        setError(response.message || "Failed to fetch user");
      }
    } catch (err) {
      setError("Failed to load user");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      ADMIN: "destructive",
      HOST: "default",
      GUEST: "secondary",
    } as const;

    return (
      <Badge variant={variants[role as keyof typeof variants] || "secondary"}>
        {role}
      </Badge>
    );
  };

  const getVerificationStatus = (user: User) => {
    if (user.isVerified) {
      return (
        <div className="flex items-center space-x-1">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Verified</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1">
        <XCircle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">Unverified</span>
      </div>
    );
  };

  const getHostStatus = (user: User) => {
    if (user.role !== "HOST") return null;

    const status = user.hostApprovalStatus;
    if (status === "APPROVED") {
      return (
        <div className="flex items-center space-x-1">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Approved</span>
        </div>
      );
    } else if (status === "PENDING") {
      return (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-yellow-600">Pending</span>
        </div>
      );
    } else if (status === "REJECTED") {
      return (
        <div className="flex items-center space-x-1">
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600">Rejected</span>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">User Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600">{error || "User not found"}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">User Overview</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Basic user information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>
                User verification and role information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Role</span>
                  {getRoleBadge(user.role)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Verification Status
                  </span>
                  {getVerificationStatus(user)}
                </div>

                {user.role === "HOST" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Host Approval</span>
                    {getHostStatus(user)}
                  </div>
                )}

                {user.isSuspended && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Suspension Status
                    </span>
                    <Badge variant="destructive">Suspended</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage user account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/users/${user.id}/edit`)}
              >
                <Shield className="h-4 w-4 mr-2" />
                Edit User
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => router.push("/users")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Suspend User
              </Button>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Platform-specific details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User ID</span>
                <span className="text-sm text-gray-500 font-mono">
                  {user.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              {user.avatar && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avatar</span>
                  <span className="text-sm text-gray-500">Available</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
