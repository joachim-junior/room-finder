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
import { apiClient, Booking } from "@/lib/api";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Home,
  CreditCard,
  Users,
} from "lucide-react";

export default function BookingOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      // For now, we'll fetch from the bookings list and find the specific booking
      // In a real implementation, you'd have a GET /admin/bookings/:id endpoint
      const response = await apiClient.getBookings({ limit: 1000 });
      if (response.success && response.data) {
        const foundBooking = response.data.bookings.find(
          (b) => b.id === bookingId
        );
        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          setError("Booking not found");
        }
      } else {
        setError(response.message || "Failed to fetch booking");
      }
    } catch (err) {
      setError("Failed to load booking");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Confirmed
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "PAID":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Paid
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            Failed
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="secondary">{paymentStatus}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (typeof window === "undefined") {
      return dateString.split("T")[0];
    }
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    if (typeof window === "undefined") {
      return `XAF ${price.toLocaleString()}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price);
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

  if (error || !booking) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Booking Not Found
            </h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600">{error || "Booking not found"}</p>
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
            Back to Bookings
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Booking Overview</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
              <CardDescription>
                Basic booking details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">
                  Booking #{booking.id.slice(-8)}
                </h2>
                <p className="text-gray-500 mt-2">
                  Created on {formatDate(booking.createdAt)}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      Check-in: {formatDate(booking.checkIn)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Check-out: {formatDate(booking.checkOut)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {formatPrice(booking.totalPrice)}
                    </div>
                    <div className="text-sm text-gray-500">Total amount</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status and Payment Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Payment</CardTitle>
              <CardDescription>
                Current booking and payment status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Booking Status</span>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Status</span>
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Method</span>
                  <span className="text-sm">{booking.paymentMethod}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
              <CardDescription>
                Guest details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {booking.guest.firstName[0]}
                    {booking.guest.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {booking.guest.firstName} {booking.guest.lastName}
                  </h3>
                  <p className="text-gray-500">{booking.guest.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push(`/users/${booking.guest.id}`)}
                >
                  <User className="h-4 w-4 mr-2" />
                  View Guest Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Property Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>
                Property details and host information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">
                  {booking.property.title}
                </h3>
                <p className="text-gray-500">
                  Host: {booking.property.host.firstName}{" "}
                  {booking.property.host.lastName}
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    router.push(`/properties/${booking.property.id}`)
                  }
                >
                  <Home className="h-4 w-4 mr-2" />
                  View Property Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
