"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface WalletData {
  balance: string;
}

const DashboardBody = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [walletData, setWalletData] = useState<WalletData>({ balance: "0" });
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch wallet data
  const fetchWalletData = async () => {
    if (!user) return;

    try {
      console.log("Fetching wallet data for user ID:", user.id);
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_wallet_report.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.id }),
        }
      );
      const data = await response.json();
      console.log("Wallet API response:", data);

      if (data.ResponseCode === "200" && data.Result === "true") {
        console.log("Setting wallet balance:", data.wallet);
        setWalletData({
          balance: data.wallet || "0",
        });
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  // Handle add funds
  const handleAddFunds = () => {
    router.push("/dashboard/wallet");
  };

  // Handle logout
  const handleLogout = async () => {
    if (!user) return;

    try {
      setLoggingOut(true);

      // Call logout API if available
      try {
        const response = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_logout.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: user.id }),
          }
        );
        const data = await response.json();

        if (data.ResponseCode === "200" && data.Result === "true") {
          toast.success("✅ Logged out successfully!");
        } else {
          // Even if API fails, proceed with local logout
          console.log("Logout API not available, proceeding with local logout");
        }
      } catch (error) {
        // API might not exist, proceed with local logout
        console.log("Logout API error, proceeding with local logout");
      }

      // Perform local logout
      logout();

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("❌ Error during logout");
    } finally {
      setLoggingOut(false);
    }
  };

  // Load wallet data on component mount
  useEffect(() => {
    fetchWalletData();
  }, [user]);

  if (!user) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view your dashboard.</p>
          </div>
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
        {/* Welcome Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="p-4 rounded"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e9ecef",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#f8f9fa",
                    color: "#6c757d",
                  }}
                >
                  <i className="fas fa-user" style={{ fontSize: "24px" }}></i>
                </div>
                <div>
                  <h4 className="fw-bold text-dark mb-1">Welcome back!</h4>
                  <p className="text-muted mb-0">{user.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="p-4 rounded"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e9ecef",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#007bff",
                      color: "white",
                    }}
                  >
                    <i
                      className="fas fa-wallet"
                      style={{ fontSize: "20px" }}
                    ></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Wallet Balance</h6>
                    <p className="text-muted mb-0">Your available funds</p>
                  </div>
                </div>
                <div className="text-end">
                  <h4 className="fw-bold text-primary mb-1">
                    {Number(walletData.balance).toLocaleString()} XAF
                  </h4>
                  <button
                    onClick={handleAddFunds}
                    className="btn btn-primary"
                    style={{
                      borderRadius: "20px",
                      padding: "8px 16px",
                      fontSize: "12px",
                      border: "none",
                    }}
                  >
                    Add Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="row">
          <div className="col-12">
            <div
              className="rounded"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e9ecef",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                className="p-3 border-bottom"
                style={{ borderColor: "#e9ecef" }}
              >
                <h6 className="fw-bold text-dark mb-0">Quick Actions</h6>
              </div>

              <Link
                href="/dashboard/bookings"
                className="d-flex align-items-center justify-content-between p-3 border-bottom"
                style={{ borderColor: "#e9ecef" }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#6c757d",
                      color: "white",
                    }}
                  >
                    <i className="fas fa-calendar"></i>
                  </div>
                  <span className="fw-bold text-dark">Bookings</span>
                </div>
                <i className="fas fa-chevron-right text-muted"></i>
              </Link>

              <Link
                href="/dashboard/profile"
                className="d-flex align-items-center justify-content-between p-3 border-bottom"
                style={{ borderColor: "#e9ecef" }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#6c757d",
                      color: "white",
                    }}
                  >
                    <i className="fas fa-user"></i>
                  </div>
                  <span className="fw-bold text-dark">Profile</span>
                </div>
                <i className="fas fa-chevron-right text-muted"></i>
              </Link>

              <Link
                href="/dashboard/referral"
                className="d-flex align-items-center justify-content-between p-3 border-bottom"
                style={{ borderColor: "#e9ecef" }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#6c757d",
                      color: "white",
                    }}
                  >
                    <i className="fas fa-gift"></i>
                  </div>
                  <span className="fw-bold text-dark">Referral</span>
                </div>
                <i className="fas fa-chevron-right text-muted"></i>
              </Link>

              <Link
                href="/dashboard/favourites"
                className="d-flex align-items-center justify-content-between p-3 border-bottom"
                style={{ borderColor: "#e9ecef" }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#6c757d",
                      color: "white",
                    }}
                  >
                    <i className="fas fa-heart"></i>
                  </div>
                  <span className="fw-bold text-dark">Favourites</span>
                </div>
                <i className="fas fa-chevron-right text-muted"></i>
              </Link>

              <Link
                href="/dashboard/notifications"
                className="d-flex align-items-center justify-content-between p-3 border-bottom"
                style={{ borderColor: "#e9ecef" }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#6c757d",
                      color: "white",
                    }}
                  >
                    <i className="fas fa-bell"></i>
                  </div>
                  <span className="fw-bold text-dark">Notifications</span>
                </div>
                <i className="fas fa-chevron-right text-muted"></i>
              </Link>

              <Link
                href="/faq"
                className="d-flex align-items-center justify-content-between p-3 border-bottom"
                style={{ borderColor: "#e9ecef" }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#6c757d",
                      color: "white",
                    }}
                  >
                    <i className="fas fa-question-circle"></i>
                  </div>
                  <span className="fw-bold text-dark">FAQ</span>
                </div>
                <i className="fas fa-chevron-right text-muted"></i>
              </Link>

              <div
                className="d-flex align-items-center justify-content-between p-3"
                style={{ cursor: "pointer" }}
                onClick={handleLogout}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#dc3545",
                      color: "white",
                    }}
                  >
                    {loggingOut ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-sign-out-alt"></i>
                    )}
                  </div>
                  <span className="fw-bold text-danger">
                    {loggingOut ? "Logging out..." : "Log out"}
                  </span>
                </div>
                <i className="fas fa-chevron-right text-muted"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBody;
