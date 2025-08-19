"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookingOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchBookingDetails();
  }, [bookingId, user]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll fetch from the bookings list and find the specific booking
      // In a real implementation, you'd have a specific endpoint like GET /bookings/{id}
      const response =
        user?.role === "HOST"
          ? await apiClient.getHostBookings()
          : await apiClient.getGuestBookings();

      if (response.success && response.data) {
        const bookings = response.data.data || [];
        const foundBooking = bookings.find((b: Booking) => b.id === bookingId);

        if (foundBooking) {
          setBooking(foundBooking);
        } else {
          setError("Booking not found");
        }
      } else {
        setError("Failed to load booking details");
      }
    } catch (err: unknown) {
      console.error("Error fetching booking details:", err);
      setError("Failed to load booking details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <div className="animate-pulse bg-gray-200 h-6 w-6 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
          </div>
          <div className="animate-pulse bg-white rounded-xl p-6">
            <div className="space-y-4">
              <div className="animate-pulse bg-gray-200 h-8 w-1/3 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-2/3 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="bg-white rounded-xl p-6 text-center">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {error || "Booking not found"}
            </h1>
            <p className="text-gray-600">
              The booking you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have permission to view it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.status}
          </span>
        </div>

        {/* Booking Details */}
        <div
          className="bg-white rounded-xl p-6 mb-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Booking Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Property Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Property Name
                  </label>
                  <p className="text-gray-900">{booking.propertyTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Property ID
                  </label>
                  <p className="text-gray-900 font-mono text-sm">
                    {booking.propertyId}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Booking Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Booking ID
                  </label>
                  <p className="text-gray-900 font-mono text-sm">
                    {booking.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Total Price
                  </label>
                  <p className="text-gray-900 text-lg font-semibold">
                    {formatCurrency(booking.totalPrice, "XAF")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dates and Guests */}
        <div
          className="bg-white rounded-xl p-6 mb-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Stay Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Check-in Date
              </label>
              <p className="text-gray-900">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Check-out Date
              </label>
              <p className="text-gray-900">{formatDate(booking.checkOut)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Number of Guests
              </label>
              <p className="text-gray-900">{booking.guests} guests</p>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {booking.specialRequests && (
          <div
            className="bg-white rounded-xl p-6 mb-6"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Special Requests
            </h2>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
              {booking.specialRequests}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div
          className="bg-white rounded-xl p-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Booking Timeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Created At
              </label>
              <p className="text-gray-900">
                {formatDateTime(booking.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Last Updated
              </label>
              <p className="text-gray-900">
                {formatDateTime(booking.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
