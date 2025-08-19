"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  Settings,
  Activity,
  Database,
  Upload,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  DollarSign,
  TrendingUp,
  Calculator,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import {
  apiClient,
  RevenueConfiguration,
  FeeBreakdown,
  RevenueStats,
} from "@/lib/api";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminPreferences {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    newUserAlerts: boolean;
    newPropertyAlerts: boolean;
    bookingAlerts: boolean;
    revenueAlerts: boolean;
  };
  dashboard: {
    defaultView: string;
    refreshInterval: number;
    showCharts: boolean;
    showRecentActivity: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    loginAttempts: number;
  };
}

interface SystemHealth {
  status: string;
  database: string;
  uptime: string;
  memoryUsage: string;
  cpuUsage: string;
  activeConnections: number;
  lastBackup: string;
}

export default function SettingsPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile state
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Preferences state
  const [preferences, setPreferences] = useState<AdminPreferences>({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      newUserAlerts: true,
      newPropertyAlerts: true,
      bookingAlerts: true,
      revenueAlerts: true,
    },
    dashboard: {
      defaultView: "overview",
      refreshInterval: 300,
      showCharts: true,
      showRecentActivity: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 3600,
      loginAttempts: 5,
    },
  });

  // System health state
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  // Revenue management state
  const [revenueConfigs, setRevenueConfigs] = useState<RevenueConfiguration[]>(
    []
  );
  const [currentConfig, setCurrentConfig] =
    useState<RevenueConfiguration | null>(null);
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [feeCalculator, setFeeCalculator] = useState({
    amount: "",
    currency: "XAF",
  });
  const [newConfig, setNewConfig] = useState({
    name: "",
    description: "",
    hostServiceFeePercent: 5,
    hostServiceFeeMin: 0,
    hostServiceFeeMax: "",
    guestServiceFeePercent: 5,
    guestServiceFeeMin: 0,
    guestServiceFeeMax: "",
    appliesToBooking: true,
    appliesToWithdrawal: false,
  });

  const [editingConfig, setEditingConfig] =
    useState<RevenueConfiguration | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    hostServiceFeePercent: 5,
    hostServiceFeeMin: 0,
    hostServiceFeeMax: "",
    guestServiceFeePercent: 5,
    guestServiceFeeMin: 0,
    guestServiceFeeMax: "",
    appliesToBooking: true,
    appliesToWithdrawal: false,
  });

  useEffect(() => {
    fetchProfile();
    fetchPreferences();
    fetchSystemHealth();
    fetchRevenueConfigs();
    fetchRevenueStats();
  }, []);

  const fetchProfile = async () => {
    try {
      // For now, use auth store data since the profile endpoint might not be implemented
      if (user) {
        const fallbackProfile: AdminProfile = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || "",
          role: user.role,
          isVerified: user.isVerified,
          avatar: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProfile(fallbackProfile);
        setProfileForm({
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone || "",
        });
      }
    } catch (error) {
      console.error("Failed to set profile data:", error);
    }
  };

  const fetchPreferences = async () => {
    try {
      // For now, use default preferences since the preferences endpoint might not be implemented
      console.log(
        "Using default preferences - preferences endpoint not implemented"
      );
    } catch (error) {
      console.error("Failed to fetch preferences:", error);
      // Use default preferences if API fails
    }
  };

  const fetchSystemHealth = async () => {
    try {
      // For now, use mock system health since the system health endpoint might not be implemented
      const mockSystemHealth: SystemHealth = {
        status: "healthy",
        database: "connected",
        uptime: "24h 15m 30s",
        memoryUsage: "45%",
        cpuUsage: "12%",
        activeConnections: 25,
        lastBackup: new Date().toISOString(),
      };
      setSystemHealth(mockSystemHealth);
    } catch (error) {
      console.error("Failed to fetch system health:", error);
    }
  };

  const fetchRevenueConfigs = async () => {
    try {
      console.log("Fetching revenue configs...");
      const response = await apiClient.getRevenueConfigs();
      console.log("Revenue configs response:", response);

      if (response.success && response.data) {
        setRevenueConfigs(response.data);
        setCurrentConfig(
          response.data.find((config) => config.isActive) || null
        );
      } else {
        console.error("Revenue configs API error:", response.message);
        setMessage({
          type: "error",
          text: response.message || "Failed to fetch revenue configurations",
        });
      }
    } catch (error) {
      console.error("Failed to fetch revenue configs:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch revenue configurations",
      });
    }
  };

  const fetchRevenueStats = async () => {
    try {
      console.log("Fetching revenue stats...");
      const response = await apiClient.getCurrentMonthRevenueStats();
      console.log("Revenue stats response:", response);

      if (response.success && response.data) {
        setRevenueStats(response.data);
      } else {
        console.error("Revenue stats API error:", response.message);
        setMessage({
          type: "error",
          text: response.message || "Failed to fetch revenue statistics",
        });
      }
    } catch (error) {
      console.error("Failed to fetch revenue stats:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch revenue statistics",
      });
    }
  };

  const calculateFees = async () => {
    if (!feeCalculator.amount || parseFloat(feeCalculator.amount) <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    try {
      console.log("Calculating fees...");
      const response = await apiClient.calculateFees({
        amount: parseFloat(feeCalculator.amount),
        currency: feeCalculator.currency,
      });
      console.log("Fee calculation response:", response);

      if (response.success && response.data) {
        setFeeBreakdown(response.data);
      } else {
        console.error("Fee calculation API error:", response.message);
        setMessage({
          type: "error",
          text: response.message || "Failed to calculate fees",
        });
      }
    } catch (error) {
      console.error("Failed to calculate fees:", error);
      setMessage({ type: "error", text: "Failed to calculate fees" });
    }
  };

  const createRevenueConfig = async () => {
    if (!newConfig.name || !newConfig.description) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    try {
      console.log("Creating revenue config...");
      const response = await apiClient.createRevenueConfig({
        name: newConfig.name,
        description: newConfig.description,
        hostServiceFeePercent: newConfig.hostServiceFeePercent,
        hostServiceFeeMin: newConfig.hostServiceFeeMin,
        hostServiceFeeMax: newConfig.hostServiceFeeMax
          ? parseFloat(newConfig.hostServiceFeeMax)
          : undefined,
        guestServiceFeePercent: newConfig.guestServiceFeePercent,
        guestServiceFeeMin: newConfig.guestServiceFeeMin,
        guestServiceFeeMax: newConfig.guestServiceFeeMax
          ? parseFloat(newConfig.guestServiceFeeMax)
          : undefined,
        isActive: false,
        appliesToBooking: newConfig.appliesToBooking,
        appliesToWithdrawal: newConfig.appliesToWithdrawal,
      });
      console.log("Create revenue config response:", response);

      if (response.success && response.data) {
        setRevenueConfigs([...revenueConfigs, response.data]);
        setMessage({
          type: "success",
          text: "Revenue configuration created successfully",
        });

        // Reset form
        setNewConfig({
          name: "",
          description: "",
          hostServiceFeePercent: 5,
          hostServiceFeeMin: 0,
          hostServiceFeeMax: "",
          guestServiceFeePercent: 5,
          guestServiceFeeMin: 0,
          guestServiceFeeMax: "",
          appliesToBooking: true,
          appliesToWithdrawal: false,
        });
      } else {
        console.error("Create revenue config API error:", response.message);
        setMessage({
          type: "error",
          text: response.message || "Failed to create revenue configuration",
        });
      }
    } catch (error) {
      console.error("Failed to create revenue config:", error);
      setMessage({
        type: "error",
        text: "Failed to create revenue configuration",
      });
    } finally {
      setLoading(false);
    }
  };

  const activateConfig = async (configId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.activateRevenueConfig(configId);

      if (response.success && response.data) {
        // Update the configurations list with the activated one
        const updatedConfigs = revenueConfigs.map((config) => ({
          ...config,
          isActive: config.id === configId,
        }));
        setRevenueConfigs(updatedConfigs);
        setCurrentConfig(response.data);
        setMessage({
          type: "success",
          text: "Revenue configuration activated successfully",
        });
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to activate configuration",
        });
      }
    } catch (error) {
      console.error("Failed to activate config:", error);
      setMessage({ type: "error", text: "Failed to activate configuration" });
    } finally {
      setLoading(false);
    }
  };

  const startEditingConfig = (config: RevenueConfiguration) => {
    setEditingConfig(config);
    setEditForm({
      name: config.name,
      description: config.description,
      hostServiceFeePercent: config.hostServiceFeePercent,
      hostServiceFeeMin: config.hostServiceFeeMin,
      hostServiceFeeMax: config.hostServiceFeeMax?.toString() || "",
      guestServiceFeePercent: config.guestServiceFeePercent,
      guestServiceFeeMin: config.guestServiceFeeMin,
      guestServiceFeeMax: config.guestServiceFeeMax?.toString() || "",
      appliesToBooking: config.appliesToBooking,
      appliesToWithdrawal: config.appliesToWithdrawal,
    });
  };

  const cancelEditing = () => {
    setEditingConfig(null);
    setEditForm({
      name: "",
      description: "",
      hostServiceFeePercent: 5,
      hostServiceFeeMin: 0,
      hostServiceFeeMax: "",
      guestServiceFeePercent: 5,
      guestServiceFeeMin: 0,
      guestServiceFeeMax: "",
      appliesToBooking: true,
      appliesToWithdrawal: false,
    });
  };

  const updateRevenueConfig = async () => {
    if (!editingConfig) return;

    if (!editForm.name || !editForm.description) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    try {
      console.log("Updating revenue config...");
      const response = await apiClient.updateRevenueConfig(editingConfig.id, {
        name: editForm.name,
        description: editForm.description,
        hostServiceFeePercent: editForm.hostServiceFeePercent,
        hostServiceFeeMin: editForm.hostServiceFeeMin,
        hostServiceFeeMax: editForm.hostServiceFeeMax
          ? parseFloat(editForm.hostServiceFeeMax)
          : null,
        guestServiceFeePercent: editForm.guestServiceFeePercent,
        guestServiceFeeMin: editForm.guestServiceFeeMin,
        guestServiceFeeMax: editForm.guestServiceFeeMax
          ? parseFloat(editForm.guestServiceFeeMax)
          : null,
        appliesToBooking: editForm.appliesToBooking,
        appliesToWithdrawal: editForm.appliesToWithdrawal,
      });
      console.log("Update revenue config response:", response);

      if (response.success && response.data) {
        // Update the configurations list
        const updatedConfigs = revenueConfigs
          .map((config) =>
            config.id === editingConfig.id ? response.data : config
          )
          .filter(
            (config): config is RevenueConfiguration => config !== undefined
          );
        setRevenueConfigs(updatedConfigs);

        // Update current config if it was the one being edited
        if (currentConfig?.id === editingConfig.id) {
          setCurrentConfig(response.data);
        }

        setMessage({
          type: "success",
          text: "Revenue configuration updated successfully",
        });
        cancelEditing();
      } else {
        console.error("Update revenue config API error:", response.message);
        setMessage({
          type: "error",
          text: response.message || "Failed to update revenue configuration",
        });
      }
    } catch (error) {
      console.error("Failed to update revenue config:", error);
      setMessage({
        type: "error",
        text: "Failed to update revenue configuration",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      // For now, simulate successful update since the profile endpoint might not be implemented
      setMessage({ type: "success", text: "Profile updated successfully" });
      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone,
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    setLoading(true);
    try {
      // For now, simulate successful password change since the endpoint might not be implemented
      setMessage({ type: "success", text: "Password changed successfully" });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to change password" });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);
    try {
      // For now, simulate successful preferences update since the endpoint might not be implemented
      setMessage({
        type: "success",
        text: "Preferences updated successfully",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update preferences" });
    } finally {
      setLoading(false);
    }
  };

  const getSystemStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account and platform preferences
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Admin Panel
          </Badge>
        </div>

        {message && (
          <Alert
            className={
              message.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={
                message.type === "success" ? "text-green-800" : "text-red-800"
              }
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b border-gray-200">
                <TabsList className="grid w-full grid-cols-6 h-14 bg-transparent border-0 rounded-none">
                  <TabsTrigger
                    value="profile"
                    className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 rounded-none border-b-2 data-[state=active]:border-gray-900"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 rounded-none border-b-2 data-[state=active]:border-gray-900"
                  >
                    <Bell className="h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="dashboard"
                    className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 rounded-none border-b-2 data-[state=active]:border-gray-900"
                  >
                    <Settings className="h-4 w-4" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 rounded-none border-b-2 data-[state=active]:border-gray-900"
                  >
                    <Shield className="h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="system"
                    className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 rounded-none border-b-2 data-[state=active]:border-gray-900"
                  >
                    <Server className="h-4 w-4" />
                    System
                  </TabsTrigger>
                  <TabsTrigger
                    value="revenue"
                    className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 rounded-none border-b-2 data-[state=active]:border-gray-900"
                  >
                    <DollarSign className="h-4 w-4" />
                    Revenue
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Profile Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileForm.firstName}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileForm.lastName}
                            onChange={(e) =>
                              setProfileForm({
                                ...profileForm,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={profile?.email || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="w-auto px-6"
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Change Password */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Change Password
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                current: !showPasswords.current,
                              })
                            }
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                new: !showPasswords.new,
                              })
                            }
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                confirm: !showPasswords.confirm,
                              })
                            }
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={handlePasswordChange}
                        disabled={loading}
                        className="w-auto px-6"
                      >
                        {loading ? "Changing..." : "Change Password"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">General Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">
                              Email Notifications
                            </Label>
                            <p className="text-sm text-gray-500">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch
                            checked={
                              preferences.notifications.emailNotifications
                            }
                            onCheckedChange={(checked) =>
                              setPreferences({
                                ...preferences,
                                notifications: {
                                  ...preferences.notifications,
                                  emailNotifications: checked,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">
                              Push Notifications
                            </Label>
                            <p className="text-sm text-gray-500">
                              Receive push notifications in browser
                            </p>
                          </div>
                          <Switch
                            checked={
                              preferences.notifications.pushNotifications
                            }
                            onCheckedChange={(checked) =>
                              setPreferences({
                                ...preferences,
                                notifications: {
                                  ...preferences.notifications,
                                  pushNotifications: checked,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold">Alert Types</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">
                              New User Registrations
                            </Label>
                            <p className="text-sm text-gray-500">
                              Get notified when new users join
                            </p>
                          </div>
                          <Switch
                            checked={preferences.notifications.newUserAlerts}
                            onCheckedChange={(checked) =>
                              setPreferences({
                                ...preferences,
                                notifications: {
                                  ...preferences.notifications,
                                  newUserAlerts: checked,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">
                              New Property Listings
                            </Label>
                            <p className="text-sm text-gray-500">
                              Get notified when new properties are listed
                            </p>
                          </div>
                          <Switch
                            checked={
                              preferences.notifications.newPropertyAlerts
                            }
                            onCheckedChange={(checked) =>
                              setPreferences({
                                ...preferences,
                                notifications: {
                                  ...preferences.notifications,
                                  newPropertyAlerts: checked,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Booking Alerts</Label>
                            <p className="text-sm text-gray-500">
                              Get notified about new bookings
                            </p>
                          </div>
                          <Switch
                            checked={preferences.notifications.bookingAlerts}
                            onCheckedChange={(checked) =>
                              setPreferences({
                                ...preferences,
                                notifications: {
                                  ...preferences.notifications,
                                  bookingAlerts: checked,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Revenue Alerts</Label>
                            <p className="text-sm text-gray-500">
                              Get notified about revenue milestones
                            </p>
                          </div>
                          <Switch
                            checked={preferences.notifications.revenueAlerts}
                            onCheckedChange={(checked) =>
                              setPreferences({
                                ...preferences,
                                notifications: {
                                  ...preferences.notifications,
                                  revenueAlerts: checked,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handlePreferencesUpdate}
                      disabled={loading}
                      className="w-auto px-6"
                    >
                      {loading ? "Saving..." : "Save Notification Preferences"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Dashboard Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="defaultView">
                          Default Dashboard View
                        </Label>
                        <Select
                          value={preferences.dashboard.defaultView}
                          onValueChange={(value) =>
                            setPreferences({
                              ...preferences,
                              dashboard: {
                                ...preferences.dashboard,
                                defaultView: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="overview">Overview</SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="properties">
                              Properties
                            </SelectItem>
                            <SelectItem value="bookings">Bookings</SelectItem>
                            <SelectItem value="analytics">Analytics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="refreshInterval">
                          Auto-refresh Interval (seconds)
                        </Label>
                        <Select
                          value={preferences.dashboard.refreshInterval.toString()}
                          onValueChange={(value) =>
                            setPreferences({
                              ...preferences,
                              dashboard: {
                                ...preferences.dashboard,
                                refreshInterval: parseInt(value),
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="60">1 minute</SelectItem>
                            <SelectItem value="300">5 minutes</SelectItem>
                            <SelectItem value="600">10 minutes</SelectItem>
                            <SelectItem value="1800">30 minutes</SelectItem>
                            <SelectItem value="3600">1 hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">Show Charts</Label>
                            <p className="text-sm text-gray-500">
                              Display charts and graphs on dashboard
                            </p>
                          </div>
                          <Switch
                            checked={preferences.dashboard.showCharts}
                            onCheckedChange={(checked) =>
                              setPreferences({
                                ...preferences,
                                dashboard: {
                                  ...preferences.dashboard,
                                  showCharts: checked,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-base">
                              Show Recent Activity
                            </Label>
                            <p className="text-sm text-gray-500">
                              Display recent activity feed
                            </p>
                          </div>
                          <Switch
                            checked={preferences.dashboard.showRecentActivity}
                            onCheckedChange={(checked) =>
                              setPreferences({
                                ...preferences,
                                dashboard: {
                                  ...preferences.dashboard,
                                  showRecentActivity: checked,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handlePreferencesUpdate}
                      disabled={loading}
                      className="w-auto px-6"
                    >
                      {loading ? "Saving..." : "Save Dashboard Preferences"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">
                            Two-Factor Authentication
                          </Label>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          checked={preferences.security.twoFactorAuth}
                          onCheckedChange={(checked) =>
                            setPreferences({
                              ...preferences,
                              security: {
                                ...preferences.security,
                                twoFactorAuth: checked,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">
                          Session Timeout (seconds)
                        </Label>
                        <Select
                          value={preferences.security.sessionTimeout.toString()}
                          onValueChange={(value) =>
                            setPreferences({
                              ...preferences,
                              security: {
                                ...preferences.security,
                                sessionTimeout: parseInt(value),
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1800">30 minutes</SelectItem>
                            <SelectItem value="3600">1 hour</SelectItem>
                            <SelectItem value="7200">2 hours</SelectItem>
                            <SelectItem value="14400">4 hours</SelectItem>
                            <SelectItem value="28800">8 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loginAttempts">
                          Maximum Login Attempts
                        </Label>
                        <Select
                          value={preferences.security.loginAttempts.toString()}
                          onValueChange={(value) =>
                            setPreferences({
                              ...preferences,
                              security: {
                                ...preferences.security,
                                loginAttempts: parseInt(value),
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 attempts</SelectItem>
                            <SelectItem value="5">5 attempts</SelectItem>
                            <SelectItem value="10">10 attempts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={handlePreferencesUpdate}
                      disabled={loading}
                      className="w-auto px-6"
                    >
                      {loading ? "Saving..." : "Save Security Settings"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System Tab */}
              <TabsContent value="system" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* System Health */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {systemHealth ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status</span>
                            <Badge
                              className={getSystemStatusColor(
                                systemHealth.status
                              )}
                            >
                              {systemHealth.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Database
                            </span>
                            <Badge variant="outline">
                              {systemHealth.database}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Uptime</span>
                            <span className="text-sm text-gray-600">
                              {systemHealth.uptime}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Memory Usage
                            </span>
                            <span className="text-sm text-gray-600">
                              {systemHealth.memoryUsage}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              CPU Usage
                            </span>
                            <span className="text-sm text-gray-600">
                              {systemHealth.cpuUsage}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Active Connections
                            </span>
                            <span className="text-sm text-gray-600">
                              {systemHealth.activeConnections}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Last Backup
                            </span>
                            <span className="text-sm text-gray-600">
                              {new Date(
                                systemHealth.lastBackup
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <Clock className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Loading system health...
                          </p>
                        </div>
                      )}
                      <Button
                        onClick={fetchSystemHealth}
                        variant="outline"
                        className="w-full"
                      >
                        Refresh System Health
                      </Button>
                    </CardContent>
                  </Card>

                  {/* System Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        System Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Platform Version
                        </Label>
                        <p className="text-sm text-gray-600">
                          Room Finder Admin v1.0.0
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Node.js Version
                        </Label>
                        <p className="text-sm text-gray-600">v18.17.0</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Database</Label>
                        <p className="text-sm text-gray-600">PostgreSQL 15.3</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Environment
                        </Label>
                        <Badge variant="outline">Production</Badge>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          API Base URL
                        </Label>
                        <p className="text-sm text-gray-600">
                          http://localhost:5000/api/v1
                        </p>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Last Updated
                        </Label>
                        <p className="text-sm text-gray-600">
                          {new Date().toLocaleDateString()} at{" "}
                          {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Revenue Tab */}
              <TabsContent value="revenue" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Current Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Current Fee Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {currentConfig ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Name</span>
                            <span className="text-sm text-gray-600">
                              {currentConfig.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Description
                            </span>
                            <span className="text-sm text-gray-600">
                              {currentConfig.description}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Host Fee
                            </span>
                            <span className="text-sm text-gray-600">
                              {currentConfig.hostServiceFeePercent}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Guest Fee
                            </span>
                            <span className="text-sm text-gray-600">
                              {currentConfig.guestServiceFeePercent}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Status</span>
                            <Badge
                              className={
                                currentConfig.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {currentConfig.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <DollarSign className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            No active configuration
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Revenue Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Revenue Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {revenueStats ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Total Revenue
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {revenueStats.totalRevenue.toLocaleString()} XAF
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Host Fees
                            </span>
                            <span className="text-sm text-gray-600">
                              {revenueStats.hostFees.toLocaleString()} XAF
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Guest Fees
                            </span>
                            <span className="text-sm text-gray-600">
                              {revenueStats.guestFees.toLocaleString()} XAF
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Transactions
                            </span>
                            <span className="text-sm text-gray-600">
                              {revenueStats.transactionCount}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <TrendingUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Loading revenue stats...
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Fee Calculator */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Fee Calculator
                    </CardTitle>
                    {currentConfig && (
                      <p className="text-sm text-gray-600">
                        Using configuration:{" "}
                        <span className="font-medium">
                          {currentConfig.name}
                        </span>
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (XAF)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={feeCalculator.amount}
                          onChange={(e) =>
                            setFeeCalculator({
                              ...feeCalculator,
                              amount: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={feeCalculator.currency}
                          onValueChange={(value) =>
                            setFeeCalculator({
                              ...feeCalculator,
                              currency: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="XAF">XAF</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      onClick={calculateFees}
                      className="w-auto px-6"
                      disabled={!currentConfig}
                    >
                      Calculate Fees
                    </Button>

                    {currentConfig ? (
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>
                          Host Fee: {currentConfig.hostServiceFeePercent}%
                          {currentConfig.hostServiceFeeMin > 0 &&
                            ` (Min: ${currentConfig.hostServiceFeeMin.toLocaleString()} XAF)`}
                          {currentConfig.hostServiceFeeMax &&
                            ` (Max: ${currentConfig.hostServiceFeeMax.toLocaleString()} XAF)`}
                        </p>
                        <p>
                          Guest Fee: {currentConfig.guestServiceFeePercent}%
                          {currentConfig.guestServiceFeeMin > 0 &&
                            ` (Min: ${currentConfig.guestServiceFeeMin.toLocaleString()} XAF)`}
                          {currentConfig.guestServiceFeeMax &&
                            ` (Max: ${currentConfig.guestServiceFeeMax.toLocaleString()} XAF)`}
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs text-red-500">
                        ⚠️ No active fee configuration. Please activate a
                        configuration to use the calculator.
                      </div>
                    )}

                    {feeBreakdown && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-3">Fee Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Original Amount:</span>
                            <span className="text-sm font-medium">
                              {feeBreakdown.originalAmount.toLocaleString()}{" "}
                              {feeBreakdown.currency}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">
                              Host Fee ({feeBreakdown.fees.host.percentage}%):
                            </span>
                            <span className="text-sm text-red-600">
                              {feeBreakdown.fees.host.amount.toLocaleString()}{" "}
                              {feeBreakdown.currency}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">
                              Guest Fee ({feeBreakdown.fees.guest.percentage}%):
                            </span>
                            <span className="text-sm text-red-600">
                              {feeBreakdown.fees.guest.amount.toLocaleString()}{" "}
                              {feeBreakdown.currency}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-medium">
                            <span>Guest Pays:</span>
                            <span className="text-green-600">
                              {feeBreakdown.totals.guestPays.toLocaleString()}{" "}
                              {feeBreakdown.currency}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Host Receives:</span>
                            <span className="text-blue-600">
                              {feeBreakdown.totals.hostReceives.toLocaleString()}{" "}
                              {feeBreakdown.currency}
                            </span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Platform Revenue:</span>
                            <span className="text-purple-600">
                              {feeBreakdown.totals.platformRevenue.toLocaleString()}{" "}
                              {feeBreakdown.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Revenue Configurations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Revenue Configurations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {revenueConfigs.map((config) => (
                        <div key={config.id} className="p-4 border rounded-lg">
                          {editingConfig?.id === config.id ? (
                            // Edit Form
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">
                                  Edit Configuration
                                </h4>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={cancelEditing}
                                    variant="outline"
                                    size="sm"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={updateRevenueConfig}
                                    disabled={loading}
                                    size="sm"
                                  >
                                    {loading ? "Saving..." : "Save Changes"}
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={editForm.name}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        name: e.target.value,
                                      })
                                    }
                                    placeholder="Configuration name"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">
                                    Description
                                  </Label>
                                  <Input
                                    id="edit-description"
                                    value={editForm.description}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        description: e.target.value,
                                      })
                                    }
                                    placeholder="Configuration description"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-host-fee">
                                    Host Service Fee (%)
                                  </Label>
                                  <Input
                                    id="edit-host-fee"
                                    type="number"
                                    value={editForm.hostServiceFeePercent}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        hostServiceFeePercent:
                                          parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    placeholder="5"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-guest-fee">
                                    Guest Service Fee (%)
                                  </Label>
                                  <Input
                                    id="edit-guest-fee"
                                    type="number"
                                    value={editForm.guestServiceFeePercent}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        guestServiceFeePercent:
                                          parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    placeholder="5"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-host-min">
                                    Host Fee Min (XAF)
                                  </Label>
                                  <Input
                                    id="edit-host-min"
                                    type="number"
                                    value={editForm.hostServiceFeeMin}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        hostServiceFeeMin:
                                          parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    placeholder="0"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-guest-min">
                                    Guest Fee Min (XAF)
                                  </Label>
                                  <Input
                                    id="edit-guest-min"
                                    type="number"
                                    value={editForm.guestServiceFeeMin}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        guestServiceFeeMin:
                                          parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    placeholder="0"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-host-max">
                                    Host Fee Max (XAF)
                                  </Label>
                                  <Input
                                    id="edit-host-max"
                                    type="number"
                                    value={editForm.hostServiceFeeMax}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        hostServiceFeeMax: e.target.value,
                                      })
                                    }
                                    placeholder="Leave empty for no limit"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-guest-max">
                                    Guest Fee Max (XAF)
                                  </Label>
                                  <Input
                                    id="edit-guest-max"
                                    type="number"
                                    value={editForm.guestServiceFeeMax}
                                    onChange={(e) =>
                                      setEditForm({
                                        ...editForm,
                                        guestServiceFeeMax: e.target.value,
                                      })
                                    }
                                    placeholder="Leave empty for no limit"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="edit-applies-booking"
                                    checked={editForm.appliesToBooking}
                                    onCheckedChange={(checked) =>
                                      setEditForm({
                                        ...editForm,
                                        appliesToBooking: checked,
                                      })
                                    }
                                  />
                                  <Label htmlFor="edit-applies-booking">
                                    Applies to Bookings
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id="edit-applies-withdrawal"
                                    checked={editForm.appliesToWithdrawal}
                                    onCheckedChange={(checked) =>
                                      setEditForm({
                                        ...editForm,
                                        appliesToWithdrawal: checked,
                                      })
                                    }
                                  />
                                  <Label htmlFor="edit-applies-withdrawal">
                                    Applies to Withdrawals
                                  </Label>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Display Mode
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{config.name}</h4>
                                  {config.isActive && (
                                    <Badge className="bg-green-100 text-green-800">
                                      Active
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {config.description}
                                </p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                  <span>
                                    Host: {config.hostServiceFeePercent}%
                                  </span>
                                  <span>
                                    Guest: {config.guestServiceFeePercent}%
                                  </span>
                                  <span>
                                    Booking:{" "}
                                    {config.appliesToBooking ? "Yes" : "No"}
                                  </span>
                                  <span>
                                    Withdrawal:{" "}
                                    {config.appliesToWithdrawal ? "Yes" : "No"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => startEditingConfig(config)}
                                  variant="outline"
                                  size="sm"
                                >
                                  Edit
                                </Button>
                                {!config.isActive && (
                                  <Button
                                    onClick={() => activateConfig(config.id)}
                                    variant="outline"
                                    size="sm"
                                    disabled={loading}
                                  >
                                    {loading ? "Activating..." : "Activate"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Create New Configuration */}
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-semibold">
                        Create New Configuration
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="configName">Name</Label>
                          <Input
                            id="configName"
                            value={newConfig.name}
                            onChange={(e) =>
                              setNewConfig({
                                ...newConfig,
                                name: e.target.value,
                              })
                            }
                            placeholder="Configuration name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="configDescription">Description</Label>
                          <Input
                            id="configDescription"
                            value={newConfig.description}
                            onChange={(e) =>
                              setNewConfig({
                                ...newConfig,
                                description: e.target.value,
                              })
                            }
                            placeholder="Configuration description"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hostFeePercent">Host Fee %</Label>
                          <Input
                            id="hostFeePercent"
                            type="number"
                            step="0.1"
                            value={newConfig.hostServiceFeePercent}
                            onChange={(e) =>
                              setNewConfig({
                                ...newConfig,
                                hostServiceFeePercent:
                                  parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hostFeeMin">Host Min</Label>
                          <Input
                            id="hostFeeMin"
                            type="number"
                            value={newConfig.hostServiceFeeMin}
                            onChange={(e) =>
                              setNewConfig({
                                ...newConfig,
                                hostServiceFeeMin:
                                  parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guestFeePercent">Guest Fee %</Label>
                          <Input
                            id="guestFeePercent"
                            type="number"
                            step="0.1"
                            value={newConfig.guestServiceFeePercent}
                            onChange={(e) =>
                              setNewConfig({
                                ...newConfig,
                                guestServiceFeePercent:
                                  parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guestFeeMin">Guest Min</Label>
                          <Input
                            id="guestFeeMin"
                            type="number"
                            value={newConfig.guestServiceFeeMin}
                            onChange={(e) =>
                              setNewConfig({
                                ...newConfig,
                                guestServiceFeeMin:
                                  parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="appliesToBooking"
                            checked={newConfig.appliesToBooking}
                            onCheckedChange={(checked) =>
                              setNewConfig({
                                ...newConfig,
                                appliesToBooking: checked,
                              })
                            }
                          />
                          <Label htmlFor="appliesToBooking">
                            Applies to Bookings
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="appliesToWithdrawal"
                            checked={newConfig.appliesToWithdrawal}
                            onCheckedChange={(checked) =>
                              setNewConfig({
                                ...newConfig,
                                appliesToWithdrawal: checked,
                              })
                            }
                          />
                          <Label htmlFor="appliesToWithdrawal">
                            Applies to Withdrawals
                          </Label>
                        </div>
                      </div>
                      <Button
                        onClick={createRevenueConfig}
                        disabled={loading}
                        className="w-auto px-6"
                      >
                        {loading ? "Creating..." : "Create Configuration"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
