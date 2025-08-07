"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface ReferralData {
  referral_code: string;
  total_referrals: number;
  total_earnings: number;
  referral_credit: number;
}

interface ReferralHistory {
  id: number;
  referred_user: string;
  referred_email: string;
  signup_date: string;
  status: string;
  earnings: number;
}

const ReferralBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>([]);

  // Fetch referral data from API
  const fetchReferralData = async () => {
    if (!user) {
      toast.error("❌ Please log in to view your referral data");
      return;
    }

    setLoading(true);
    toast.info("🔄 Loading referral data...");

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_getdata.php",
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
      console.log("Referral data response:", data);

      if (data.ResponseCode === "200" && data.Result === "true") {
        // Extract referral data from the response
        setReferralData({
          referral_code: data.code || (user as any).refercode || "",
          total_referrals: 0, // This might not be available in u_getdata.php
          total_earnings: 0, // This might not be available in u_getdata.php
          referral_credit: data.refercredit || 0,
        });

        // For now, we'll set an empty history since u_getdata.php doesn't provide referral history
        setReferralHistory([]);
        toast.success("✅ Referral data loaded successfully!");
      } else {
        toast.error(
          `❌ Failed to load referral data: ${
            data.ResponseMsg || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      toast.error("❌ An error occurred while loading referral data");
    } finally {
      setLoading(false);
    }
  };

  // Generate referral code (if needed)
  const generateReferralCode = async () => {
    if (!user) {
      toast.error("❌ Please log in to generate a referral code");
      return;
    }

    setLoading(true);
    toast.info("🔄 Generating referral code...");

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_getdata.php",
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
        setReferralData((prev) => ({
          ...prev!,
          referral_code: data.code || (user as any).refercode || "",
        }));
        toast.success("✅ Referral code generated successfully!");
      } else {
        toast.error(
          `❌ Failed to generate referral code: ${
            data.ResponseMsg || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error generating referral code:", error);
      toast.error("❌ An error occurred while generating referral code");
    } finally {
      setLoading(false);
    }
  };

  // Copy referral code to clipboard
  const copyReferralCode = async () => {
    if (!referralData?.referral_code) {
      toast.error("❌ No referral code available to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(referralData.referral_code);
      toast.success("✅ Referral code copied to clipboard!");
    } catch (error) {
      console.error("Error copying referral code:", error);
      toast.error("❌ Failed to copy referral code");
    }
  };

  // Refresh referral data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReferralData();
    setRefreshing(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning";
      case "inactive":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  // Load referral data on component mount
  useEffect(() => {
    fetchReferralData();
  }, [user]);

  if (!user) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view your referral data.</p>
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
            text="Loading referral data..."
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
                  <span className="text-dark fw-bold">Referral</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div>
              <h2 className="fw-bold text-dark mb-1">Referral Program</h2>
              <p className="text-muted mb-0">
                Earn rewards by inviting friends
              </p>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
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
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#28a745",
                    color: "white",
                  }}
                >
                  <i className="fas fa-share-alt"></i>
                </div>
                <h5 className="mb-0 fw-bold text-dark">Your Referral Code</h5>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={referralData?.referral_code || ""}
                  readOnly
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px 0 0 8px",
                    padding: "12px 16px",
                    fontSize: "16px",
                    backgroundColor: "#f8f9fa",
                  }}
                />
                <button
                  className="btn btn-primary"
                  onClick={copyReferralCode}
                  style={{
                    borderRadius: "0 8px 8px 0",
                    padding: "12px 20px",
                    border: "none",
                    backgroundColor: "#007bff",
                  }}
                >
                  <i className="fas fa-copy me-2"></i>
                  Copy
                </button>
              </div>
              <p className="text-muted mt-2 mb-0">
                Share this code with friends to earn rewards
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div
              className="p-4 rounded text-center"
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
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#28a745",
                  color: "white",
                }}
              >
                <i className="fas fa-users"></i>
              </div>
              <h6 className="fw-bold text-dark mb-1">
                {referralData?.total_referrals || 0}
              </h6>
              <small className="text-muted">Total Referrals</small>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div
              className="p-4 rounded text-center"
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
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#ffc107",
                  color: "white",
                }}
              >
                <i className="fas fa-coins"></i>
              </div>
              <h6 className="fw-bold text-dark mb-1">
                {Number(referralData?.total_earnings || 0).toLocaleString()} XAF
              </h6>
              <small className="text-muted">Total Earnings</small>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div
              className="p-4 rounded text-center"
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
                  width: "50px",
                  height: "50px",
                  backgroundColor: "#17a2b8",
                  color: "white",
                }}
              >
                <i className="fas fa-wallet"></i>
              </div>
              <h6 className="fw-bold text-dark mb-1">
                {Number(referralData?.referral_credit || 0).toLocaleString()}{" "}
                XAF
              </h6>
              <small className="text-muted">Referral Credit</small>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="row">
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
              <h5 className="fw-bold text-dark mb-3">Referral History</h5>
              {referralHistory.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th className="border-0 text-muted">User</th>
                        <th className="border-0 text-muted">Email</th>
                        <th className="border-0 text-muted">Signup Date</th>
                        <th className="border-0 text-muted">Status</th>
                        <th className="border-0 text-muted">Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralHistory.map((referral) => (
                        <tr key={referral.id}>
                          <td className="fw-bold text-dark">
                            {referral.referred_user}
                          </td>
                          <td className="text-muted">
                            {referral.referred_email}
                          </td>
                          <td className="text-muted">
                            {formatDate(referral.signup_date)}
                          </td>
                          <td>
                            <span className={getStatusBadge(referral.status)}>
                              {referral.status}
                            </span>
                          </td>
                          <td className="fw-bold text-success">
                            {referral.earnings.toLocaleString()} XAF
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#f8f9fa",
                      color: "#6c757d",
                    }}
                  >
                    <i
                      className="fas fa-history"
                      style={{ fontSize: "24px" }}
                    ></i>
                  </div>
                  <h6 className="text-muted mb-2">No Referral History</h6>
                  <p className="text-muted mb-0">
                    Start sharing your referral code to see history here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralBody;
