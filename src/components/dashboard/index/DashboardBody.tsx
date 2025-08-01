"use client";
import Image, { StaticImageData } from "next/image";
import NiceSelect from "@/ui/NiceSelect";
import RecentMessage from "./RecentMessage";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

import icon_1 from "@/assets/images/dashboard/icon/icon_12.svg";
import icon_2 from "@/assets/images/dashboard/icon/icon_13.svg";
import icon_3 from "@/assets/images/dashboard/icon/icon_14.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_15.svg";
import DashboardChart from "./DashboardChart";

// Import appropriate icons for each function
import propertyIcon from "@/assets/images/dashboard/icon/icon_12.svg"; // House/Property icon
import walletIcon from "@/assets/images/dashboard/icon/icon_13.svg"; // Money/Wallet icon
import earningsIcon from "@/assets/images/dashboard/icon/icon_14.svg"; // Chart/Earnings icon
import transactionIcon from "@/assets/images/dashboard/icon/icon_15.svg"; // Transaction icon

interface DataType {
  id: number;
  icon: StaticImageData;
  title: string;
  value: string;
  class_name?: string;
}

interface DashboardData {
  total_properties?: number;
  total_users?: number;
  total_earnings?: number;
  total_transactions?: number;
  recent_activity?: any[];
}

const DashboardBody = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_dashboard.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.id,
            }),
          }
        );
        const data = await response.json();

        if (data.Result === "true" && data.dashboard) {
          setDashboardData(data.dashboard);
        } else {
          console.log("Dashboard API response:", data);
          // Set default values if API doesn't return data
          setDashboardData({
            total_properties: 0,
            total_users: 0,
            total_earnings: 0,
            total_transactions: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
        // Set default values on error
        setDashboardData({
          total_properties: 0,
          total_users: 0,
          total_earnings: 0,
          total_transactions: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const selectHandler = (e: any) => {};

  // Create dashboard cards data with real API data
  const dashboard_card_data: DataType[] = [
    {
      id: 1,
      icon: propertyIcon,
      title: "My Properties",
      value: loading ? "..." : `${dashboardData.total_properties || 0}`,
      class_name: "skew-none",
    },
    {
      id: 2,
      icon: walletIcon,
      title: "Wallet Balance",
      value: loading
        ? "..."
        : `${user?.wallet ? Number(user.wallet).toLocaleString() : 0} XAF`,
      class_name: "skew-none",
    },
    {
      id: 3,
      icon: earningsIcon,
      title: "Total Earnings",
      value: loading
        ? "..."
        : `${
            dashboardData.total_earnings
              ? Number(dashboardData.total_earnings).toLocaleString()
              : 0
          } XAF`,
      class_name: "skew-none",
    },
    {
      id: 4,
      icon: transactionIcon,
      title: "Total Transactions",
      value: loading ? "..." : `${dashboardData.total_transactions || 0}`,
      class_name: "skew-none",
    },
  ];

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo title="Dashboard" />

        <h2 className="main-title d-block d-lg-none">Dashboard</h2>

        {!user ? (
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view your dashboard.</p>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="bg-white border-20 p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="mb-2">Welcome back, {user.name}!</h4>
                  <p className="text-muted mb-0">
                    Here&apos;s what&apos;s happening with your account today.
                  </p>
                </div>
                <div className="text-end">
                  <div className="fw-bold text-primary fs-5">
                    {user.wallet ? Number(user.wallet).toLocaleString() : 0} XAF
                  </div>
                  <small className="text-muted">Wallet Balance</small>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-danger text-white border-20 p-3 mb-4">
                <p className="mb-0">{error}</p>
              </div>
            )}

            <div className="bg-white border-20">
              <div className="row g-3">
                {dashboard_card_data.map((item) => (
                  <div key={item.id} className="col-lg-3 col-md-6 col-12">
                    <div
                      className={`dash-card-one bg-white border-30 position-relative mb-15 ${item.class_name}`}
                      style={{
                        padding: "15px",
                        minHeight: "90px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <div
                          className="icon rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            minWidth: "40px",
                          }}
                        >
                          <Image
                            src={item.icon}
                            alt=""
                            className="lazy-img"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              display: "block",
                              marginBottom: "3px",
                            }}
                          >
                            {item.title}
                          </span>
                          <div
                            className="value fw-500"
                            style={{ fontSize: "16px", color: "#333" }}
                          >
                            {item.value}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="row g-3 d-flex pt-15 lg-pt-10">
              <div className="col-xl-7 col-lg-6 col-12 d-flex flex-column">
                <div className="user-activity-chart bg-white border-20 mt-30 h-100">
                  <div className="d-flex align-items-center justify-content-between plr flex-wrap gap-2">
                    <h5 className="dash-title-two mb-0">Property View</h5>
                    <div className="short-filter d-flex align-items-center">
                      <div className="fs-16 me-2 d-none d-sm-block">
                        Short by:
                      </div>
                      <NiceSelect
                        className="nice-select fw-normal"
                        options={[
                          { value: "1", text: "Weekly" },
                          { value: "2", text: "Daily" },
                          { value: "3", text: "Monthly" },
                        ]}
                        defaultCurrent={0}
                        onChange={selectHandler}
                        name=""
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="plr mt-30">
                    <div
                      className="chart-wrapper"
                      style={{ height: "300px", minHeight: "250px" }}
                    >
                      <DashboardChart dashboardData={dashboardData} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-5 col-lg-6 col-12 d-flex">
                <div className="recent-job-tab bg-white border-20 mt-30 plr w-100">
                  <h5 className="dash-title-two">Recent Activity</h5>
                  <RecentMessage
                    recent_activity={dashboardData.recent_activity}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardBody;
