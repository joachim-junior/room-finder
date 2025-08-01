"use client";
import { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

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
        toast.success("✅ Referral code retrieved successfully!");
        await fetchReferralData(); // Refresh data
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
      toast.error("❌ No referral code available");
      return;
    }

    try {
      await navigator.clipboard.writeText(referralData.referral_code);
      toast.success("✅ Referral code copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("❌ Failed to copy referral code");
    }
  };

  // Refresh referral data
  const handleRefresh = async () => {
    setRefreshing(true);
    toast.info("🔄 Refreshing referral data...");
    await fetchReferralData();
    setRefreshing(false);
  };

  // Load data on component mount
  useEffect(() => {
    fetchReferralData();
  }, [user]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      active: { class: "badge bg-success", text: "Active" },
      pending: { class: "badge bg-warning", text: "Pending" },
      completed: { class: "badge bg-info", text: "Completed" },
      cancelled: { class: "badge bg-danger", text: "Cancelled" },
    };

    const statusInfo = statusMap[status.toLowerCase()] || {
      class: "badge bg-secondary",
      text: status,
    };

    return <span className={statusInfo.class}>{statusInfo.text}</span>;
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo title="Referral Program" />
        <h2 className="main-title d-block d-lg-none">Referral Program</h2>

        {/* Referral Overview Section */}
        <div className="bg-white card-box border-20 mb-30">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="dash-title-three mb-0">Referral Overview</h4>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                backgroundColor: "var(--bs-primary)",
                color: "white",
                borderColor: "var(--bs-primary)",
              }}
            >
              {refreshing ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </>
              )}
            </button>
          </div>

          <div className="row">
            {/* Referral Code Section */}
            <div className="col-lg-6 mb-4">
              <div className="referral-code-card border rounded p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    <i className="bi bi-share me-2"></i>
                    Your Referral Code
                  </h5>
                </div>

                {referralData?.referral_code ? (
                  <div className="referral-code-display">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={referralData.referral_code}
                        readOnly
                        style={{ fontFamily: "monospace", fontWeight: "bold" }}
                      />
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={copyReferralCode}
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                    <small className="text-muted mt-2 d-block">
                      Share this code with friends to earn referral credits
                    </small>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-3">
                      <i
                        className="bi bi-share-circle text-muted"
                        style={{ fontSize: "3rem" }}
                      ></i>
                    </div>
                    <h5 className="text-muted">
                      No referral code generated yet
                    </h5>
                    <p className="text-muted mb-3">
                      Generate your referral code to start earning
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={generateReferralCode}
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Generate Referral Code"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Referral Statistics */}
            <div className="col-lg-6 mb-4">
              <div className="referral-stats-card border rounded p-4 h-100">
                <h5 className="mb-3">
                  <i className="bi bi-graph-up me-2"></i>
                  Referral Statistics
                </h5>

                <div className="row">
                  <div className="col-4 mb-2">
                    <div className="text-center">
                      <h5 className="text-primary mb-1">
                        {referralData?.total_referrals || 0}
                      </h5>
                      <small className="text-muted">Total Referrals</small>
                    </div>
                  </div>
                  <div className="col-4 mb-2">
                    <div className="text-center">
                      <h5 className="text-success mb-1">
                        {referralData?.total_earnings?.toLocaleString() || 0}
                      </h5>
                      <small className="text-muted">Total Earnings (XAF)</small>
                    </div>
                  </div>
                  <div className="col-4 mb-2">
                    <div className="text-center">
                      <h5 className="text-info mb-1">
                        {referralData?.referral_credit || 0}
                      </h5>
                      <small className="text-muted">Referral Credit</small>
                    </div>
                  </div>
                </div>

                {/* Progress bar for referral credit */}
                {referralData?.referral_credit && (
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Credit Progress</small>
                      <small>
                        {referralData.referral_credit > 0
                          ? (referralData.referral_credit / 100) * 100
                          : 0}
                        %
                      </small>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-info"
                        style={{
                          width: `${
                            referralData.referral_credit > 0
                              ? (referralData.referral_credit / 100) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Referral History Section */}
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three mb-3">Referral History</h4>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Loading referral history...</p>
            </div>
          ) : referralHistory.length === 0 ? (
            <div className="text-center py-4">
              <i
                className="bi bi-people text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="text-muted mt-3">No referrals yet</h5>
              <p className="text-muted">
                Start sharing your referral code to see your referral history
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Referred User</th>
                    <th>Email</th>
                    <th>Signup Date</th>
                    <th>Status</th>
                    <th>Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {referralHistory.map((referral) => (
                    <tr key={referral.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                            <span className="text-white fw-bold">
                              {referral.referred_user.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span>{referral.referred_user}</span>
                        </div>
                      </td>
                      <td>{referral.referred_email}</td>
                      <td>{formatDate(referral.signup_date)}</td>
                      <td>{getStatusBadge(referral.status)}</td>
                      <td className="fw-bold text-success">
                        {referral.earnings.toLocaleString()} XAF
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralBody;
