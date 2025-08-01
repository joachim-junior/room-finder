"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

import notificationIcon_1 from "@/assets/images/dashboard/icon/icon_36.svg";
import notificationIcon_2 from "@/assets/images/dashboard/icon/icon_37.svg";
import notificationIcon_3 from "@/assets/images/dashboard/icon/icon_38.svg";

interface NotificationItem {
  id: number;
  uid: number;
  datetime: string;
  title: string;
  description: string;
}

const Notification = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/notification.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
          }),
        }
      );

      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        const notificationList = data.NotificationData || [];
        setNotifications(notificationList);
        // Count unread notifications (you can add an 'is_read' field to the API if needed)
        setUnreadCount(notificationList.length);
      } else {
        console.error("Failed to fetch notifications:", data.ResponseMsg);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  // Get notification icon based on title
  const getNotificationIcon = (title: string) => {
    if (title.toLowerCase().includes("booking")) {
      return notificationIcon_1;
    } else if (
      title.toLowerCase().includes("listing") ||
      title.toLowerCase().includes("property")
    ) {
      return notificationIcon_2;
    } else {
      return notificationIcon_3;
    }
  };

  return (
    <ul className="dropdown-menu" aria-labelledby="notification-dropdown">
      <li>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h4 className="mb-0">
            Notifications{" "}
            {unreadCount > 0 && (
              <span className="badge bg-primary ms-2">{unreadCount}</span>
            )}
          </h4>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={fetchNotifications}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <i className="bi bi-arrow-clockwise"></i>
            )}
          </button>
        </div>
        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : notifications.length > 0 ? (
          <ul className="style-none notify-list">
            {notifications.map((notification) => (
              <li key={notification.id} className="d-flex align-items-center">
                <Image
                  src={getNotificationIcon(notification.title)}
                  alt=""
                  className="lazy-img icon"
                />
                <div className="flex-fill ps-2">
                  <h6>{notification.title}</h6>
                  <p className="mb-1 small text-muted">
                    {notification.description}
                  </p>
                  <span className="time">
                    {formatDate(notification.datetime)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-3">
            <p className="text-muted mb-0">No notifications</p>
          </div>
        )}
      </li>
    </ul>
  );
};

export default Notification;
