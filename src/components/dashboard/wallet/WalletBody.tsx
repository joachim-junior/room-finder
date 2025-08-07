"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface WalletData {
  balance: string;
  signup_credit: string;
  referral_credit: string;
  transactions: Transaction[];
}

interface Transaction {
  id: number;
  message: string;
  status: string;
  amt: number;
  tdate: string;
}

interface PaymentMethod {
  id: number;
  title: string;
  status: number;
}

const WalletBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState<WalletData>({
    balance: "0",
    signup_credit: "0",
    referral_credit: "0",
    transactions: [],
  });
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch wallet data
  const fetchWalletData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch wallet report
      const walletResponse = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_wallet_report.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.id }),
        }
      );
      const walletResult = await walletResponse.json();

      // Fetch user data for credits
      const userResponse = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_getdata.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.id }),
        }
      );
      const userResult = await userResponse.json();

      if (walletResult.Result === "true" && userResult.Result === "true") {
        setWalletData({
          balance: walletResult.wallet || "0",
          signup_credit: userResult.signupcredit || "0",
          referral_credit: userResult.refercredit || "0",
          transactions: walletResult.Walletitem || [],
        });
      } else {
        toast.error("❌ Failed to load wallet data");
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("❌ Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    // Set static payment methods
    setPaymentMethods([
      { id: 1, title: "MTN Mobile Money", status: 1 },
      { id: 2, title: "Orange Money", status: 1 },
    ]);
  };

  // Handle add funds
  const handleAddFunds = () => {
    setShowAddFundsModal(true);
    fetchPaymentMethods();
    // Pre-fill with user data
    setPhoneNumber(user?.mobile || "");
    setEmail(user?.email || "");
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPaymentMethod || !amount || !phoneNumber || !email) {
      toast.error("❌ Please fill in all required fields");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("❌ Please enter a valid amount");
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Generate transaction ID
      const transactionId = `WALLET_${Date.now()}_${user?.id}`;

      // Call wallet topup API
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_wallet_topup_fapshi.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user?.id,
            amount: parseFloat(amount),
            payment_method: selectedPaymentMethod,
            phone_number: phoneNumber,
            email: email,
            transaction_id: transactionId,
          }),
        }
      );

      const result = await response.json();

      if (result.Result === "true") {
        toast.success("✅ Payment initialized successfully!");
        setShowAddFundsModal(false);
        setAmount("");
        setSelectedPaymentMethod("");
        // Refresh wallet data
        fetchWalletData();
      } else {
        toast.error(`❌ ${result.ResponseMsg || "Payment failed"}`);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("❌ Payment processing failed");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return dateString; // API already returns formatted date
  };

  // Get transaction type styling
  const getTransactionTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case "credit":
        return "text-success";
      case "debit":
        return "text-danger";
      default:
        return "text-muted";
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
            <p>Please log in to view your wallet.</p>
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
            text="Loading wallet data..."
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
                  <span className="text-dark fw-bold">Wallet</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div>
              <h2 className="fw-bold text-dark mb-1">Wallet</h2>
              <p className="text-muted mb-0">
                Manage your wallet and transactions
              </p>
            </div>
          </div>
        </div>

        {/* Main Balance Card */}
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="p-4 rounded"
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                border: "1px solid #e9ecef",
              }}
            >
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h6 className="text-muted mb-2">Total Balance</h6>
                  <h1 className="fw-bold mb-3 text-dark">
                    {loading
                      ? "..."
                      : Number(walletData.balance).toLocaleString()}{" "}
                    XAF
                  </h1>
                  <div className="d-flex align-items-center">
                    <span className="text-muted me-3">
                      <i className="fas fa-shield-alt me-1"></i>
                      Secure
                    </span>
                    <span className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      Real-time
                    </span>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <button
                    className="btn btn-primary rounded-pill"
                    onClick={handleAddFunds}
                    style={{
                      borderRadius: "8px",
                      padding: "10px 20px",
                    }}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add Funds
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-6 col-md-6">
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}
            >
              <div className="d-flex align-items-center mb-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#e8f5e8",
                    color: "#28a745",
                  }}
                >
                  <i className="fas fa-gift"></i>
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">Signup Credit</h6>
                  <h6 className="mb-0 text-success">
                    {Number(walletData.signup_credit).toLocaleString()} XAF
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}
            >
              <div className="d-flex align-items-center mb-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#e8f4f8",
                    color: "#17a2b8",
                  }}
                >
                  <i className="fas fa-share-alt"></i>
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark">Referral Credit</h6>
                  <h6 className="mb-0 text-info">
                    {Number(walletData.referral_credit).toLocaleString()} XAF
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="row">
          <div className="col-12">
            <div
              className="p-4 rounded"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold text-dark">Recent Transactions</h5>
              </div>

              {walletData.transactions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="border-0 text-muted fw-bold">Type</th>
                        <th className="border-0 text-muted fw-bold">Amount</th>
                        <th className="border-0 text-muted fw-bold">
                          Description
                        </th>
                        <th className="border-0 text-muted fw-bold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletData.transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td>
                            <span
                              className={`fw-bold ${getTransactionTypeStyle(
                                transaction.status
                              )}`}
                            >
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </span>
                          </td>
                          <td className="fw-bold">
                            <span
                              className={
                                transaction.status.toLowerCase() === "credit"
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {transaction.status.toLowerCase() === "credit"
                                ? "+"
                                : "-"}
                              {transaction.amt.toLocaleString()} XAF
                            </span>
                          </td>
                          <td className="text-muted">{transaction.message}</td>
                          <td className="text-muted">
                            {formatDate(transaction.tdate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i
                    className="fas fa-receipt mb-3"
                    style={{ fontSize: "40px", color: "#6c757d" }}
                  ></i>
                  <h6 className="text-muted mb-2">No Transactions Yet</h6>
                  <p className="text-muted mb-0">
                    Your transaction history will appear here once you start
                    using your wallet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Funds to Wallet</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddFundsModal(false)}
                  disabled={isProcessingPayment}
                ></button>
              </div>
              <form onSubmit={handlePaymentSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Amount (XAF) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="100"
                      step="100"
                      required
                      disabled={isProcessingPayment}
                      style={{ borderRadius: "8px" }}
                    />
                    <small className="text-muted">
                      Minimum amount: 100 XAF
                    </small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Payment Method *
                    </label>
                    <select
                      className="form-select"
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      required
                      disabled={isProcessingPayment}
                      style={{ borderRadius: "8px" }}
                    >
                      <option value="">Select payment method</option>
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      required
                      disabled={isProcessingPayment}
                      style={{ borderRadius: "8px" }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      required
                      disabled={isProcessingPayment}
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill"
                    onClick={() => setShowAddFundsModal(false)}
                    disabled={isProcessingPayment}
                    style={{ borderRadius: "8px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill"
                    disabled={isProcessingPayment}
                    style={{ borderRadius: "8px" }}
                  >
                    {isProcessingPayment ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Processing...
                      </>
                    ) : (
                      <>Proceed to Payment</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletBody;
