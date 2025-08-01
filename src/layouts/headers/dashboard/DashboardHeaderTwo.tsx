"use client";
import Image from "next/image";
import Link from "next/link";
import Notification from "./Notification";
import Profile from "./Profile";
import { useState, useEffect } from "react";
import DashboardHeaderOne from "./DashboardHeaderOne";
import { useAuth } from "@/contexts/AuthContext";

import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_43.svg";
import dashboardIcon_2 from "@/assets/images/dashboard/icon/icon_11.svg";
import dashboardAvatar from "@/assets/images/dashboard/avatar_01.jpg";
import userIcon from "@/assets/images/dashboard/icon/icon_3.svg";

const DashboardHeaderTwo = ({ title }: any) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = useAuth();

  // Fetch notification count
  const fetchNotificationCount = async () => {
    if (!user) return;

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
        setNotificationCount(notificationList.length);
      }
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  // Load notification count on component mount
  useEffect(() => {
    fetchNotificationCount();
  }, [user]);

  return (
    <>
      <header className="dashboard-header">
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="m0">{title}</h4>
          <div className="d-flex align-items-center">
            <button
              onClick={() => setIsActive(true)}
              className="dash-mobile-nav-toggler d-block d-md-none me-3"
            >
              <span></span>
            </button>
            <div className="profile-notification position-relative dropdown-center me-3">
              <button
                className="noti-btn dropdown-toggle"
                type="button"
                id="notification-dropdown"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                <Image src={dashboardIcon_2} alt="" className="lazy-img" />
                {notificationCount > 0 && (
                  <div className="badge-pill">
                    <span>{notificationCount}</span>
                  </div>
                )}
              </button>
              <Notification />
            </div>
            <div className="user-data position-relative me-3">
              <button
                className="user-avatar position-relative dropdown-toggle"
                type="button"
                id="profile-dropdown"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
                style={{ border: "none", background: "transparent" }}
              >
                <Image
                  src={userIcon}
                  alt="User"
                  className="lazy-img"
                  style={{ width: 30, height: 30, marginLeft: "10px" }}
                />
              </button>
              <Profile />
            </div>
            <div className="d-none d-md-block">
              <Link href="/dashboard/add-property" className="btn-two">
                <span>Add Listing</span>{" "}
                <i className="fa-thin fa-arrow-up-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <DashboardHeaderOne isActive={isActive} setIsActive={setIsActive} />
    </>
  );
};

export default DashboardHeaderTwo;
