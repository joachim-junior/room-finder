"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UsersTable } from "@/components/tables/users-table";
import { apiClient, User } from "@/lib/api";
import { Users, UserCheck, UserX } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suspendModal, setSuspendModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    reason: string;
    duration: string;
  }>({
    isOpen: false,
    userId: null,
    reason: "",
    duration: "30",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getUsers({ limit: 100 });
      if (response.success && response.data) {
        setUsers(response.data.users);
      } else {
        setError(response.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendUser = async (
    id: string,
    reason: string,
    duration: string
  ) => {
    try {
      const response = await apiClient.suspendUser(id, reason, duration);
      if (response.success) {
        setUsers(
          users.map((user) =>
            user.id === id ? { ...user, ...response.data?.user } : user
          )
        );
        setSuspendModal({
          isOpen: false,
          userId: null,
          reason: "",
          duration: "30",
        });
      }
    } catch (err) {
      console.error("Failed to suspend user:", err);
    }
  };

  const openSuspendModal = (userId: string) => {
    setSuspendModal({
      isOpen: true,
      userId,
      reason: "",
      duration: "30",
    });
  };

  const closeSuspendModal = () => {
    setSuspendModal({
      isOpen: false,
      userId: null,
      reason: "",
      duration: "30",
    });
  };

  const getStats = () => {
    const total = users.length;
    const verified = users.filter((user) => user.isVerified).length;
    const hosts = users.filter((user) => user.role === "HOST").length;
    const guests = users.filter((user) => user.role === "GUEST").length;

    return { total, verified, hosts, guests };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <Badge variant="secondary" className="text-sm">
            {stats.total} total users
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Verified Users
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verified}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.verified / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hosts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hosts}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.hosts / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guests</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.guests}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.guests / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage all users on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <UsersTable users={users} onSuspendUser={openSuspendModal} />
            )}
          </CardContent>
        </Card>

        {/* Suspend User Modal */}
        <Dialog open={suspendModal.isOpen} onOpenChange={closeSuspendModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Suspend User</DialogTitle>
              <DialogDescription>
                Are you sure you want to suspend this user? This action will
                prevent them from accessing the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Reason for suspension</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter the reason for suspension..."
                  value={suspendModal.reason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setSuspendModal((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={suspendModal.duration}
                  onChange={(e) =>
                    setSuspendModal((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeSuspendModal}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (
                    suspendModal.userId &&
                    suspendModal.reason &&
                    suspendModal.duration
                  ) {
                    handleSuspendUser(
                      suspendModal.userId,
                      suspendModal.reason,
                      suspendModal.duration
                    );
                  }
                }}
                disabled={!suspendModal.reason || !suspendModal.duration}
              >
                Suspend User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
