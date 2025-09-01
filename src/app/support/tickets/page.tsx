"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { SupportTicket } from "@/types";
import { Button, Card, Input, Select } from "@/components/ui";
import {
  MessageCircle,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Loader2,
  Search,
  Filter,
  Eye,
  Plus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    OPEN: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    WAITING_FOR_USER: "bg-orange-100 text-orange-800",
    RESOLVED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
    ESCALATED: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    LOW: "text-gray-600",
    MEDIUM: "text-blue-600",
    HIGH: "text-orange-600",
    URGENT: "text-red-600",
  };
  return colors[priority] || "text-gray-600";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SupportTicketsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchTickets = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await apiClient.getUserSupportTickets(
        page,
        pagination.limit,
        statusFilter !== "all" ? statusFilter : undefined,
        categoryFilter !== "all" ? categoryFilter : undefined
      );

      if (response.success && response.data) {
        setTickets(response.data.tickets);
        setPagination(response.data.pagination);
      } else {
        addToast("Failed to load support tickets", "error");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      addToast("Failed to load support tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTickets(1);
    }
  }, [user, statusFilter, categoryFilter]);

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Please log in to view your support tickets
          </h3>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/support">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Support
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Support Tickets
                </h1>
                <p className="text-gray-600 mt-1">
                  Track your support requests and responses
                </p>
              </div>
            </div>
            <Link href="/support">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card
          className="p-6 mb-8"
          style={{
            border: "1px solid rgb(221, 221, 221)",
            borderRadius: "20px",
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tickets by subject, description, or ticket ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "OPEN", label: "Open" },
                  { value: "IN_PROGRESS", label: "In Progress" },
                  { value: "WAITING_FOR_USER", label: "Waiting for User" },
                  { value: "RESOLVED", label: "Resolved" },
                  { value: "CLOSED", label: "Closed" },
                ]}
              />
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "BOOKING_ISSUES", label: "Booking Issues" },
                  { value: "PAYMENTS_BILLING", label: "Payments & Billing" },
                  { value: "ACCOUNT_MANAGEMENT", label: "Account Management" },
                  { value: "TECHNICAL_SUPPORT", label: "Technical Support" },
                  { value: "SAFETY_SECURITY", label: "Safety & Security" },
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your support tickets...</p>
          </div>
        ) : filteredTickets.length > 0 ? (
          <div className="space-y-6">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="p-6 hover:shadow-lg transition-shadow"
                style={{
                  border: "1px solid rgb(221, 221, 221)",
                  borderRadius: "20px",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {ticket.subject}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`text-sm font-medium ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Created {formatDate(ticket.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{ticket.messages.length} messages</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        #{ticket.ticketId}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {ticket.assignedTo && (
                      <div className="text-right text-sm">
                        <p className="text-gray-500">Assigned to</p>
                        <p className="font-medium">
                          {ticket.assignedTo.firstName}{" "}
                          {ticket.assignedTo.lastName}
                        </p>
                      </div>
                    )}
                    <Link href={`/support/tickets/${ticket.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>

                {ticket.resolution && (
                  <div
                    className="mt-4 p-4 bg-green-50 rounded-lg"
                    style={{ border: "1px solid rgb(34, 197, 94)" }}
                  >
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-900 mb-1">
                          Resolution
                        </p>
                        <p className="text-sm text-green-800">
                          {ticket.resolution}
                        </p>
                        {ticket.resolvedAt && (
                          <p className="text-xs text-green-600 mt-2">
                            Resolved on {formatDate(ticket.resolvedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} tickets
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => fetchTickets(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => fetchTickets(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No support tickets found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "No tickets match your current filters. Try adjusting your search criteria."
                : "You haven&apos;t submitted any support requests yet."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(searchTerm ||
                statusFilter !== "all" ||
                categoryFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
              <Link href="/support">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Support Ticket
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
