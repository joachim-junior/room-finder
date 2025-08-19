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
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { apiClient, PlatformOverview } from "@/lib/api";
import {
  Users,
  Home,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
} from "lucide-react";

export default function DashboardPage() {
  const [overview, setOverview] = useState<PlatformOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching platform overview...");

        // Try to fetch analytics overview first
        try {
          const response = await apiClient.getPlatformOverview();
          console.log("Platform overview response:", response);

          if (response.success && response.data) {
            setOverview(response.data);
            return;
          }
        } catch (analyticsError) {
          console.log(
            "Analytics endpoint not available, falling back to basic stats"
          );
        }

        // Fallback: Build overview from available endpoints
        const [usersResponse, propertiesResponse, bookingsResponse] =
          await Promise.all([
            apiClient.getUsers({ limit: 1000 }),
            apiClient.getProperties({ limit: 1000 }),
            apiClient.getBookings({ limit: 1000 }),
          ]);

        if (
          usersResponse.success &&
          propertiesResponse.success &&
          bookingsResponse.success
        ) {
          const users = usersResponse.data?.users || [];
          const properties = propertiesResponse.data?.properties || [];
          const bookings = bookingsResponse.data?.bookings || [];

          // Calculate basic stats
          const totalUsers = users.length;
          const guests = users.filter((u) => u.role === "GUEST").length;
          const hosts = users.filter((u) => u.role === "HOST").length;
          const admins = users.filter((u) => u.role === "ADMIN").length;

          const totalProperties = properties.length;
          const verifiedProperties = properties.filter(
            (p) => p.isVerified
          ).length;
          const pendingProperties = properties.filter(
            (p) => !p.isVerified
          ).length;
          const availableProperties = properties.filter(
            (p) => p.isAvailable
          ).length;

          // Calculate booking stats
          const totalBookings = bookings.length;
          const pendingBookings = bookings.filter(
            (b) => b.status === "PENDING"
          ).length;
          const confirmedBookings = bookings.filter(
            (b) => b.status === "CONFIRMED"
          ).length;
          const completedBookings = bookings.filter(
            (b) => b.status === "COMPLETED"
          ).length;
          const cancelledBookings = bookings.filter(
            (b) => b.status === "CANCELLED"
          ).length;

          const mockOverview: PlatformOverview = {
            users: {
              total: totalUsers,
              guests,
              hosts,
              admins,
              newThisMonth: 0, // We don't have this data
            },
            properties: {
              total: totalProperties,
              verified: verifiedProperties,
              pending: pendingProperties,
              available: availableProperties,
              newThisMonth: 0, // We don't have this data
            },
            bookings: {
              total: totalBookings,
              pending: pendingBookings,
              confirmed: confirmedBookings,
              completed: completedBookings,
              cancelled: cancelledBookings,
              newThisMonth: 0,
            },
            revenue: {
              total: 0,
              thisMonth: 0,
              platformFees: 0,
              averageBookingValue: 0,
            },
            reviews: {
              total: 0,
              averageRating: 0,
              thisMonth: 0,
            },
          };

          setOverview(mockOverview);
        } else {
          setError("Failed to fetch basic platform data");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
            <Badge variant="outline" className="text-xs text-orange-600">
              Basic Mode
            </Badge>
          </div>
        </div>

        {overview && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(overview.users.total)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{overview.users.newThisMonth} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Properties
                  </CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(overview.properties.total)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {overview.properties.verified} verified
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Bookings
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(overview.bookings.total)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{overview.bookings.newThisMonth} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(overview.revenue.total)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(overview.revenue.thisMonth)} this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of users by role
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Guests</span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatNumber(overview.users.guests)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Hosts</span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatNumber(overview.users.hosts)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Admins</span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatNumber(overview.users.admins)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Status</CardTitle>
                  <CardDescription>
                    Current booking distribution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatNumber(overview.bookings.pending)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Confirmed</span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatNumber(overview.bookings.confirmed)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatNumber(overview.bookings.completed)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue and Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Platform financial metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Platform Fees</span>
                    <span className="text-sm font-bold">
                      {formatCurrency(overview.revenue.platformFees)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Average Booking Value
                    </span>
                    <span className="text-sm font-bold">
                      {formatCurrency(overview.revenue.averageBookingValue)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reviews & Ratings</CardTitle>
                  <CardDescription>Platform quality metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        Average Rating
                      </span>
                    </div>
                    <span className="text-sm font-bold">
                      {overview.reviews.averageRating}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Reviews</span>
                    <span className="text-sm font-bold">
                      {formatNumber(overview.reviews.total)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
