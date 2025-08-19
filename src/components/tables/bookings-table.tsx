"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaginationInfo } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Booking } from "@/lib/api";
import {
  Search,
  MoreHorizontal,
  Eye,
  User,
  Home,
  Calendar,
  DollarSign,
} from "lucide-react";

interface BookingsTableProps {
  bookings: Booking[];
  pagination?: PaginationInfo;
  onUpdateStatus: (id: string, status: string, notes: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function BookingsTable({
  bookings,
  pagination,
  onUpdateStatus,
  onPageChange,
  onLimitChange,
}: BookingsTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guest.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property.host.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.property.host.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
    if (!isClient) {
      return dateString.split("T")[0];
    }
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    if (!isClient) {
      return `XAF ${price.toLocaleString()}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-full sm:w-[180px] animate-pulse"></div>
        </div>
        <div className="border rounded-lg">
          <div className="h-64 bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">#{booking.id.slice(-8)}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {booking.guest.firstName} {booking.guest.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.guest.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{booking.property.title}</div>
                    <div className="text-sm text-gray-500">
                      Host: {booking.property.host.firstName}{" "}
                      {booking.property.host.lastName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {formatDate(booking.checkIn)}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {formatDate(booking.checkOut)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    {formatPrice(booking.totalPrice)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {booking.paymentMethod}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/bookings/${booking.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Overview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(booking.id, booking.status, "")
                        }
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/users/${booking.guest.id}`)
                        }
                      >
                        <User className="mr-2 h-4 w-4" />
                        View Guest
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/properties/${booking.property.id}`)
                        }
                      >
                        <Home className="mr-2 h-4 w-4" />
                        View Property
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No bookings found matching your criteria.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>
              Showing{" "}
              {((pagination?.currentPage || 1) - 1) *
                (pagination?.itemsPerPage || 10) +
                1}{" "}
              to{" "}
              {Math.min(
                (pagination?.currentPage || 1) *
                  (pagination?.itemsPerPage || 10),
                pagination?.totalItems || 0
              )}{" "}
              of {pagination?.totalItems || 0} bookings
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              value={(pagination?.itemsPerPage || 10).toString()}
              onValueChange={(value) => onLimitChange?.(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPageChange?.((pagination?.currentPage || 1) - 1)
                }
                disabled={!pagination?.hasPrevPage}
              >
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from(
                  { length: Math.min(5, pagination?.totalPages || 1) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={
                          page === (pagination?.currentPage || 1)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => onPageChange?.(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPageChange?.((pagination?.currentPage || 1) + 1)
                }
                disabled={!pagination?.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
