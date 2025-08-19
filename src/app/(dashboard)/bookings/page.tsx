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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BookingsTable } from "@/components/tables/bookings-table";
import { apiClient, Booking, PaginationInfo } from "@/lib/api";
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]); // For stats calculation
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    bookingId: string | null;
    currentStatus: string;
    newStatus: string;
    notes: string;
  }>({
    isOpen: false,
    bookingId: null,
    currentStatus: "",
    newStatus: "",
    notes: "",
  });

  useEffect(() => {
    fetchBookings(1, 10); // Initial load
    fetchAllBookings(); // Fetch all bookings for stats
  }, []);

  const fetchBookings = async (
    page: number = currentPage,
    limit: number = itemsPerPage
  ) => {
    try {
      setIsLoading(true);
      const response = await apiClient.getBookings({
        page,
        limit,
        // Add any additional filters here if needed
      });
      if (response.success && response.data) {
        setBookings(response.data.bookings);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || "Failed to fetch bookings");
      }
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    try {
      const response = await apiClient.getBookings({
        limit: 1000, // Get all bookings for stats
      });
      if (response.success && response.data) {
        setAllBookings(response.data.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch all bookings for stats:", err);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: string,
    notes: string
  ) => {
    try {
      const response = await apiClient.updateBookingStatus(id, status, notes);
      if (response.success) {
        // Refresh current page to get updated data
        fetchBookings(currentPage, itemsPerPage);
        fetchAllBookings(); // Also refresh stats
        setStatusModal({
          isOpen: false,
          bookingId: null,
          currentStatus: "",
          newStatus: "",
          notes: "",
        });
      }
    } catch (err) {
      console.error("Failed to update booking status:", err);
    }
  };

  const openStatusModal = (bookingId: string, currentStatus: string) => {
    setStatusModal({
      isOpen: true,
      bookingId,
      currentStatus,
      newStatus: currentStatus,
      notes: "",
    });
  };

  const closeStatusModal = () => {
    setStatusModal({
      isOpen: false,
      bookingId: null,
      currentStatus: "",
      newStatus: "",
      notes: "",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBookings(page, itemsPerPage);
  };

  const handleLimitChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing limit
    fetchBookings(1, limit);
  };

  const getStats = () => {
    const total = allBookings.length;
    const pending = allBookings.filter(
      (booking) => booking.status === "PENDING"
    ).length;
    const confirmed = allBookings.filter(
      (booking) => booking.status === "CONFIRMED"
    ).length;
    const completed = allBookings.filter(
      (booking) => booking.status === "COMPLETED"
    ).length;
    const cancelled = allBookings.filter(
      (booking) => booking.status === "CANCELLED"
    ).length;

    return { total, pending, confirmed, completed, cancelled };
  };

  const stats = getStats();

  const formatCurrency = (amount: number) => {
    if (typeof window === "undefined") {
      return `XAF ${amount.toLocaleString()}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <Badge variant="secondary" className="text-sm">
            {stats.total} total bookings
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? ((stats.pending / stats.total) * 100).toFixed(1)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? ((stats.confirmed / stats.total) * 100).toFixed(1)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? ((stats.completed / stats.total) * 100).toFixed(1)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cancelled}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? ((stats.cancelled / stats.total) * 100).toFixed(1)
                  : 0}
                % of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Management</CardTitle>
            <CardDescription>
              View and manage all bookings on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <BookingsTable
                bookings={bookings}
                pagination={pagination || undefined}
                onUpdateStatus={openStatusModal}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            )}
          </CardContent>
        </Card>

        {/* Update Status Modal */}
        <Dialog open={statusModal.isOpen} onOpenChange={closeStatusModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Booking Status</DialogTitle>
              <DialogDescription>
                Change the status of this booking and add any relevant notes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">New Status</Label>
                <Select
                  value={statusModal.newStatus}
                  onValueChange={(value) =>
                    setStatusModal((prev) => ({ ...prev, newStatus: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Admin Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any notes about this status change..."
                  value={statusModal.notes}
                  onChange={(e) =>
                    setStatusModal((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeStatusModal}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (statusModal.bookingId && statusModal.newStatus) {
                    handleUpdateStatus(
                      statusModal.bookingId,
                      statusModal.newStatus,
                      statusModal.notes
                    );
                  }
                }}
                disabled={!statusModal.newStatus}
              >
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
