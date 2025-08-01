"use client";
import { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

interface WalletData {
  wallet: number;
  code: string;
  signupcredit: number;
  refercredit: number;
  tax: number;
}

interface TransactionItem {
  message: string;
  status: "Credit" | "Debit";
  amt: number;
  tdate: string;
}

const WalletBody = () => {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mtn" | "orange" | "">("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  // Fetch wallet data
  const fetchWalletData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get wallet balance and transactions from u_wallet_report.php
      const walletResponse = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_wallet_report.php",
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

      const walletData = await walletResponse.json();

      // Get signup credit, referral credit, and tax rate from u_getdata.php
      const getDataResponse = await fetch(
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

      const getData = await getDataResponse.json();

      if (
        walletData.ResponseCode === "200" &&
        walletData.Result === "true" &&
        getData.ResponseCode === "200" &&
        getData.Result === "true"
      ) {
        setWalletData({
          wallet: walletData.wallet || 0,
          code: getData.code || "",
          signupcredit: getData.signupcredit || 0,
          refercredit: getData.refercredit || 0,
          tax: getData.tax || 0,
        });
        setTransactions(walletData.Walletitem || []);
      } else {
        toast.error("Failed to load wallet data");
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("An error occurred while loading wallet data");
    } finally {
      setLoading(false);
    }
  };

  // Check payment status
  const checkPaymentStatus = async (transactionId: string) => {
    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_payment_status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction_id: transactionId,
            uid: user?.id.toString(),
          }),
        }
      );

      const data = await response.json();
      console.log("Payment status check:", data);

      if (data.ResponseCode === "200" && data.Result === "true") {
        if (data.status === "completed") {
          toast.success("✅ Payment completed successfully!");
          toast.info("🔄 Updating wallet balance...");
          await fetchWalletData();
          toast.success("✅ Wallet updated with new balance!");

          // Clear the interval since payment is completed
          if (refreshInterval) {
            clearInterval(refreshInterval);
            setRefreshInterval(null);
          }
        } else if (data.status === "pending") {
          console.log("Payment still pending...");
        } else if (data.status === "failed") {
          toast.error("❌ Payment failed. Please try again.");
          // Clear the interval since payment failed
          if (refreshInterval) {
            clearInterval(refreshInterval);
            setRefreshInterval(null);
          }
        } else {
          console.log("Payment status:", data.status);
        }
      } else {
        console.error("Payment status check failed:", data.ResponseMsg);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  // Handle wallet top-up
  const handleTopup = async () => {
    console.log("handleTopup function called");
    console.log("Current state:", {
      topupAmount,
      paymentMethod,
      phoneNumber,
      user,
    });

    if (!user) {
      toast.error("❌ Please log in to top up your wallet");
      return;
    }

    const amount = parseFloat(topupAmount);
    if (!amount || amount <= 0) {
      toast.error("❌ Please enter a valid amount");
      return;
    }

    if (!paymentMethod) {
      toast.error("❌ Please select a payment method");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error("❌ Please enter a valid phone number");
      return;
    }

    setTopupLoading(true);

    // Show initial loading toast
    toast.info("🔄 Initializing payment... Please wait.");

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_wallet_topup_fapshi.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
            amount: amount,
            payment_method: paymentMethod,
            phone_number: phoneNumber,
          }),
        }
      );

      const data = await response.json();
      console.log("Payment response:", data);

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("✅ Payment initialized successfully!");
        toast.info("🔄 Setting up payment monitoring...");

        // Store transaction ID for status checking
        if (data.transaction_id) {
          toast.info(
            "📱 Payment link will open in a new tab. Please complete the payment."
          );

          // Start polling for payment status
          const interval = setInterval(async () => {
            await checkPaymentStatus(data.transaction_id);
          }, 5000); // Check every 5 seconds

          setRefreshInterval(interval);

          // Stop polling after 2 minutes
          setTimeout(() => {
            if (interval) {
              clearInterval(interval);
              setRefreshInterval(null);
              toast.info(
                "⏰ Payment monitoring stopped. You can manually refresh to check status."
              );
            }
          }, 120000);
        }

        // Redirect to payment URL if provided
        if (data.payment_url) {
          toast.info("🔗 Opening payment page in new tab...");
          setTimeout(() => {
            window.open(data.payment_url, "_blank");
          }, 1000);
        }

        // Clear form fields
        setTopupAmount("");
        setPaymentMethod("");
        setPhoneNumber("");

        // Refresh wallet data
        toast.info("🔄 Refreshing wallet data...");
        await fetchWalletData();
        toast.success("✅ Wallet data updated!");
      } else {
        toast.error(
          `❌ Failed to initialize payment: ${
            data.ResponseMsg || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
      toast.error(
        "❌ An error occurred while processing payment. Please try again."
      );
    } finally {
      setTopupLoading(false);
    }
  };

  // Refresh data manually
  const handleRefresh = async () => {
    toast.info("🔄 Refreshing wallet data...");
    try {
      await fetchWalletData();
      toast.success("✅ Wallet data refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing wallet data:", error);
      toast.error("❌ Failed to refresh wallet data. Please try again.");
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchWalletData();
  }, [user]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo title="Wallet" />
        <h2 className="main-title d-block d-lg-none">Wallet</h2>

        {/* Wallet Balance Section */}
        <div className="bg-white card-box border-20 mb-30">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="dash-title-three mb-0">Wallet Balance</h4>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleRefresh}
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
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
            <div className="col-lg-6">
              <div className="wallet-balance-card bg-primary text-white p-4 rounded-3 mb-3">
                <h3 className="mb-2">Current Balance</h3>
                <div className="balance-amount fs-1 fw-bold">
                  {loading
                    ? "Loading..."
                    : `${Number(walletData?.wallet || 0).toLocaleString()} XAF`}
                </div>
                <small className="text-white-50">
                  Available for booking guesthouses
                </small>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="wallet-info">
                <div className="info-item d-flex justify-content-between mb-2">
                  <span>Signup Credit:</span>
                  <span className="fw-bold">
                    {Number(walletData?.signupcredit || 0).toLocaleString()} XAF
                  </span>
                </div>
                <div className="info-item d-flex justify-content-between mb-2">
                  <span>Referral Credit:</span>
                  <span className="fw-bold">
                    {Number(walletData?.refercredit || 0).toLocaleString()} XAF
                  </span>
                </div>
                <div className="info-item d-flex justify-content-between">
                  <span>Tax Rate:</span>
                  <span className="fw-bold">{walletData?.tax || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top-up Section */}
        <div className="bg-white card-box border-20 mb-30">
          <h4 className="dash-title-three">Add Funds</h4>

          {/* Payment Method Selection - Full Width */}
          <div className="dash-input-wrapper mb-20">
            <label>Payment Method</label>
            <div className="payment-methods d-flex gap-4">
              <div className="payment-option">
                <div className="d-flex align-items-center">
                  <input
                    type="radio"
                    id="mtn"
                    name="paymentMethod"
                    value="mtn"
                    checked={paymentMethod === "mtn"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "mtn" | "orange")
                    }
                    style={{ transform: "scale(0.8)", marginRight: "6px" }}
                  />
                  <label htmlFor="mtn" className="mb-0">
                    MTN Mobile Money
                  </label>
                </div>
              </div>
              <div className="payment-option">
                <div className="d-flex align-items-center">
                  <input
                    type="radio"
                    id="orange"
                    name="paymentMethod"
                    value="orange"
                    checked={paymentMethod === "orange"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "mtn" | "orange")
                    }
                    style={{ transform: "scale(0.8)", marginRight: "6px" }}
                  />
                  <label htmlFor="orange" className="mb-0">
                    Orange Money
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Amount and Payment Number Row */}
          <div className="row">
            <div className="col-lg-4">
              <div className="dash-input-wrapper mb-20">
                <label htmlFor="topup-amount">Amount (XAF)</label>
                <input
                  type="number"
                  id="topup-amount"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="100"
                  step="100"
                />
                <small className="text-muted">Min: 100 XAF</small>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="dash-input-wrapper mb-20">
                <label htmlFor="phone-number">Payment Number</label>
                <input
                  type="tel"
                  id="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number"
                  className="type-input"
                />
                <small className="text-muted">
                  {paymentMethod === "mtn"
                    ? "MTN"
                    : paymentMethod === "orange"
                    ? "Orange"
                    : "Mobile"}{" "}
                  number
                </small>
              </div>
            </div>
          </div>

          {/* Submit Button Row */}
          <div className="row">
            <div className="col-lg-3">
              <button
                type="button"
                className="dash-btn-two tran3s w-100"
                onClick={() => {
                  console.log("Wallet button clicked");
                  handleTopup();
                }}
                disabled={
                  topupLoading || !topupAmount || !paymentMethod || !phoneNumber
                }
                style={{
                  height: "45px",
                  fontSize: "14px",
                  opacity:
                    topupLoading ||
                    !topupAmount ||
                    !paymentMethod ||
                    !phoneNumber
                      ? 0.7
                      : 1,
                  cursor:
                    topupLoading ||
                    !topupAmount ||
                    !paymentMethod ||
                    !phoneNumber
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {topupLoading ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-wallet2 me-2"></i>
                    Add Funds
                  </>
                )}
              </button>
            </div>
            <div className="col-lg-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  console.log("Test button clicked");
                  toast.success("Test toast notification");
                }}
              >
                Test Button
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Transaction History</h4>
          <div className="transaction-list">
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="transaction-item d-flex align-items-center justify-content-between p-3 border-bottom"
                >
                  <div className="transaction-info">
                    <div className="transaction-message fw-semibold">
                      {transaction.message}
                    </div>
                    <div className="transaction-date text-muted small">
                      {transaction.tdate}
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <span
                      className={`badge ${
                        transaction.status === "Credit"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {transaction.status === "Credit" ? "+" : "-"}{" "}
                      {Number(transaction.amt).toLocaleString()} XAF
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBody;
