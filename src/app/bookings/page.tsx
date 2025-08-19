"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Booking } from "@/types";
import { apiClient } from "@/lib/api";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await apiClient.getMyBookings(
          filter === "all" ? undefined : filter
        );
        if (response.success && response.data) {
          setBookings(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user, filter]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await apiClient.cancelBooking(bookingId);
      // Reload bookings
      const response = await apiClient.getMyBookings(
        filter === "all" ? undefined : filter
      );
      if (response.success && response.data) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      case "COMPLETED":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4" />;
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Please log in to view your bookings
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            View and manage your booking history
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "PENDING"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("CONFIRMED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "CONFIRMED"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter("COMPLETED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "COMPLETED"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted rounded-lg p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-background rounded-lg shadow-lg p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  {/* Property Image */}
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-lg overflow-hidden">
                      <Image
                        src={
                          booking.property?.images[0] ||
                          "/placeholder-property.jpg"
                        }
                        alt={booking.property?.title || "Property"}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {booking.property?.title || "Property"}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>
                            {booking.property?.city}, {booking.property?.state}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                              {new Date(booking.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>
                              {booking.guests} guest
                              {booking.guests !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0">
                        <div
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          <span>{booking.status}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">
                            {booking.totalPrice.toLocaleString()}{" "}
                            {booking.currency}
                          </p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <Link
                      href={`/property/${booking.propertyId}`}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors text-center"
                    >
                      View Property
                    </Link>
                    {booking.status === "PENDING" && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-4 py-2 border border-destructive text-destructive rounded-lg text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-6">
              {filter === "all"
                ? "You haven't made any bookings yet."
                : `No ${filter.toLowerCase()} bookings found.`}
            </p>
            <Link
              href="/properties"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
