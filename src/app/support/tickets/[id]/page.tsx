"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { SupportTicket, SupportMessage } from "@/types";
import { Button, Card, Textarea } from "@/components/ui";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";
import {
  MessageCircle,
  Clock,
  User,
  ArrowLeft,
  Send,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Paperclip,
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

export default function SupportTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchTicket = async () => {
    try {
      const response = await apiClient.getSupportTicket(params.id as string);
      if (response.success && response.data) {
        setTicket(response.data.ticket);
      } else {
        addToast("Failed to load ticket details", "error");
        router.push("/support/tickets");
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
      addToast("Failed to load ticket details", "error");
      router.push("/support/tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      addToast("Please enter a message", "error");
      return;
    }

    setSendingMessage(true);
    try {
      const response = await apiClient.addMessageToSupportTicket(
        params.id as string,
        { message: newMessage.trim() }
      );

      if (response.success) {
        setNewMessage("");
        addToast("Message sent successfully", "success");
        // Refresh ticket to get updated messages
        await fetchTicket();
      } else {
        addToast("Failed to send message", "error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addToast("Failed to send message", "error");
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    if (user && params.id) {
      fetchTicket();
    }
  }, [user, params.id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Please log in to view this ticket
          </h3>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ticket not found
          </h3>
          <p className="text-gray-600 mb-6">
            The ticket you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <Link href="/support/tickets">
            <Button>Back to Support Tickets</Button>
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
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/support/tickets">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tickets
              </Button>
            </Link>
            <div className="text-sm text-gray-500">
              Ticket #{ticket.ticketId}
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {ticket.subject}
              </h1>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
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
                  {ticket.priority} Priority
                </span>
                <span className="text-sm text-gray-500">
                  Created {formatDate(ticket.createdAt)}
                </span>
              </div>
            </div>
            {ticket.assignedTo && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Assigned to</p>
                <p className="font-medium text-gray-900">
                  {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages */}
          <div className="lg:col-span-2">
            <Card
              className="p-6"
              style={{
                border: "1px solid rgb(221, 221, 221)",
                borderRadius: "20px",
              }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Conversation
              </h2>

              {/* Initial Ticket Description */}
              <div
                className="mb-8 p-4 bg-gray-50 rounded-lg"
                style={{ border: "1px solid rgb(221, 221, 221)" }}
              >
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="font-bold text-white">
                      {ticket.user.firstName?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {ticket.user.firstName} {ticket.user.lastName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Category:</strong>{" "}
                      {ticket.category.replace(/_/g, " ")}
                    </div>
                    <p className="text-gray-700">{ticket.description}</p>
                    {ticket.attachments.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">
                          Attachments:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ticket.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Paperclip className="h-3 w-3" />
                              <span>Attachment {index + 1}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-6">
                {ticket.messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {message.sender.avatar ? (
                        <ImageWithPlaceholder
                          src={message.sender.avatar}
                          alt={`${message.sender.firstName} avatar`}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            message.sender.role === "ADMIN"
                              ? "bg-gradient-to-br from-green-500 to-blue-600"
                              : "bg-gradient-to-br from-blue-500 to-purple-600"
                          }`}
                        >
                          <span className="font-bold text-white text-sm">
                            {message.sender.firstName?.charAt(0) || "S"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {message.sender.firstName} {message.sender.lastName}
                        </span>
                        {message.sender.role === "ADMIN" && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Support Agent
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <div
                        className="bg-white p-4 rounded-lg"
                        style={{ border: "1px solid rgb(221, 221, 221)" }}
                      >
                        <p className="text-gray-700">{message.message}</p>
                        {message.attachments.length > 0 && (
                          <div className="mt-3">
                            <div className="text-sm text-gray-600 mb-2">
                              Attachments:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {message.attachments.map((attachment, index) => (
                                <a
                                  key={index}
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                                >
                                  <Paperclip className="h-3 w-3" />
                                  <span>Attachment {index + 1}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Message Form */}
              {ticket.status !== "CLOSED" && ticket.status !== "RESOLVED" && (
                <div
                  className="mt-8 pt-6"
                  style={{ borderTop: "1px solid rgb(221, 221, 221)" }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add a message
                  </h3>
                  <div className="space-y-4">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      rows={4}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSendMessage}
                        disabled={sendingMessage || !newMessage.trim()}
                      >
                        {sendingMessage ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Details */}
            <Card
              className="p-6"
              style={{
                border: "1px solid rgb(221, 221, 221)",
                borderRadius: "20px",
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ticket Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Priority</p>
                  <span
                    className={`text-sm ${getPriorityColor(ticket.priority)}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Category</p>
                  <p className="text-sm text-gray-600">
                    {ticket.category.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Created</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(ticket.createdAt)}
                  </p>
                </div>
                {ticket.updatedAt !== ticket.createdAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Last Updated
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(ticket.updatedAt)}
                    </p>
                  </div>
                )}
                {ticket.resolvedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Resolved
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(ticket.resolvedAt)}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Resolution */}
            {ticket.resolution && (
              <Card
                className="p-6 bg-green-50"
                style={{
                  border: "1px solid rgb(34, 197, 94)",
                  borderRadius: "20px",
                }}
              >
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      Resolution
                    </h3>
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
              </Card>
            )}

            {/* Contact Info */}
            <Card
              className="p-6"
              style={{
                border: "1px solid rgb(221, 221, 221)",
                borderRadius: "20px",
              }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Immediate Help?
              </h3>
              <div className="space-y-3 text-sm">
                <p className="text-gray-600">
                  For urgent issues, you can contact us directly:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong> support@roomfinder237.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> +237 6XX XXX XXX
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
