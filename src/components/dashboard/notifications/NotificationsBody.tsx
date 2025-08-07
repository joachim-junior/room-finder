"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Notification {
  id: number;
  uid: number;
  datetime: string;
  title: string;
  description: string;
  is_read?: boolean;
  type?: string;
}

const NotificationsBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/notification.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.id }),
        }
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        const mappedNotifications = (data.NotificationData || []).map(
          (notification: any) => ({
            id: notification.id,
            uid: notification.uid,
            datetime: notification.datetime,
            title: notification.title,
            description: notification.description,
            is_read: notification.is_read || false,
            type: notification.type || "general",
          })
        );

        setNotifications(mappedNotifications);
        setUnreadCount(
          mappedNotifications.filter((n: Notification) => !n.is_read).length
        );
      } else {
        toast.error("❌ Failed to load notifications");
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("❌ Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
      toast.success("✅ All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInHours < 168) {
        return `${Math.floor(diffInHours / 24)}d ago`;
      } else {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      return "N/A";
    }
  };

  // Get notification icon
  const getNotificationIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes("booking") || lowerTitle.includes("confirm")) {
      return "fas fa-calendar-check";
    } else if (
      lowerTitle.includes("payment") ||
      lowerTitle.includes("wallet")
    ) {
      return "fas fa-credit-card";
    } else if (
      lowerTitle.includes("property") ||
      lowerTitle.includes("listing")
    ) {
      return "fas fa-home";
    } else if (
      lowerTitle.includes("message") ||
      lowerTitle.includes("enquiry")
    ) {
      return "fas fa-envelope";
    } else if (
      lowerTitle.includes("referral") ||
      lowerTitle.includes("bonus")
    ) {
      return "fas fa-gift";
    } else {
      return "fas fa-bell";
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  if (!user) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view your notifications.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div
        className="dashboard-body"
        style={{
          marginTop: "100px",
          padding: "20px 0",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="container-fluid">
          <LoadingSpinner
            size="lg"
            color="#007bff"
            text="Loading notifications..."
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="dashboard-body"
      style={{
        marginTop: "100px",
        padding: "20px 0",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="container-fluid">
        {/* Breadcrumb Navigation */}
        <div className="row mb-3">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/dashboard/home" className="text-decoration-none">
                    <i className="fas fa-arrow-left me-2"></i>
                    <span className="text-muted">Back to Dashboard</span>
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <span className="text-dark fw-bold">Notifications</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">Notifications</h2>
                <p className="text-muted mb-0">
                  Stay updated with your latest activities
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="btn btn-outline-primary btn-sm"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #007bff",
                    color: "#007bff",
                    backgroundColor: "#ffffff",
                    fontSize: "12px",
                    padding: "6px 12px",
                  }}
                >
                  <i className="fas fa-check-double me-2"></i>
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div
            className="text-center py-5"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#f8f9fa",
                color: "#6c757d",
              }}
            >
              <i className="fas fa-bell" style={{ fontSize: "24px" }}></i>
            </div>
            <h6 className="text-muted mb-2">No notifications</h6>
            <p className="text-muted mb-0">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="row">
            {notifications.map((notification) => (
              <div key={notification.id} className="col-12 mb-3">
                <div
                  className={`${
                    !notification.is_read
                      ? "border-start border-primary border-3"
                      : ""
                  }`}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e9ecef",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.05)";
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="p-3">
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#6c757d",
                          color: "white",
                          flexShrink: 0,
                        }}
                      >
                        <i
                          className={getNotificationIcon(notification.title)}
                          style={{ fontSize: "14px" }}
                        ></i>
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6
                            className={`fw-bold mb-0 ${
                              !notification.is_read ? "text-dark" : "text-muted"
                            }`}
                            style={{ fontSize: "14px" }}
                          >
                            {notification.title}
                          </h6>
                          <small
                            className="text-muted"
                            style={{ fontSize: "11px" }}
                          >
                            {formatDate(notification.datetime)}
                          </small>
                        </div>

                        <p
                          className={`mb-0 ${
                            !notification.is_read ? "text-dark" : "text-muted"
                          }`}
                          style={{
                            fontSize: "13px",
                            lineHeight: "1.4",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {notification.description}
                        </p>
                      </div>

                      {!notification.is_read && (
                        <div className="ms-2">
                          <div
                            className="rounded-circle"
                            style={{
                              width: "8px",
                              height: "8px",
                              backgroundColor: "#007bff",
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsBody;
