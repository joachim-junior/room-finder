"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader } from "@/components/ui/Loader";
import { Card } from "@/components/ui/Card";
import {
  PayoutEligibleAmount,
  PayoutFees,
  PayoutRequest,
  PayoutRequestsResponse,
} from "@/types/host-onboarding";
import {
  Wallet,
  DollarSign,
  Clock,
  Lock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  History,
  Home,
  Calendar,
  Building,
  Star,
  CreditCard,
  LogOut,
} from "lucide-react";

export default function PayoutRequestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [eligibleAmount, setEligibleAmount] =
    useState<PayoutEligibleAmount | null>(null);
  const [fees, setFees] = useState<PayoutFees | null>(null);
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestAmount, setRequestAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Navigation items for sidebar
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      onClick: () => router.push("/dashboard"),
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: <Calendar className="h-5 w-5" />,
      onClick: () => router.push("/dashboard?section=bookings"),
    },
    {
      id: "properties",
      label: "Properties",
      icon: <Building className="h-5 w-5" />,
      onClick: () => router.push("/dashboard?section=properties"),
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star className="h-5 w-5" />,
      onClick: () => router.push("/dashboard?section=reviews"),
    },
    {
      id: "payouts",
      label: "Payouts",
      icon: <CreditCard className="h-5 w-5" />,
      onClick: () => router.push("/payout-requests"),
    },
  ];

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "HOST") {
      router.push("/dashboard");
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [eligibleResponse, requestsResponse] = await Promise.all([
        apiClient.getEligibleAmount(),
        apiClient.getPayoutRequests(),
      ]);

      if (eligibleResponse.success && eligibleResponse.data) {
        // Transform API response to match expected structure
        const apiData = eligibleResponse.data.data;

        const transformedData = {
          totalEligibleAmount: apiData.eligibleAmount || 0,
          pendingAmount: apiData.breakdown?.pendingAmount || 0,
          lockedAmount: apiData.lockedAmount || 0,
          totalBalance: apiData.totalBalance || 0,
        };

        setEligibleAmount(transformedData);
      } else {
        console.log("🔍 Eligible Amount API failed:", eligibleResponse);
        setError("Failed to load eligible amount data");
      }

      if (requestsResponse.success && requestsResponse.data) {
        setRequests(requestsResponse.data.requests || []);
      }
    } catch (err) {
      setError("Failed to load payout information");
    } finally {
      setLoading(false);
    }
  };

  const calculateFees = async (amount: number) => {
    try {
      const response = await apiClient.calculatePayoutFees(amount);
      if (response.success && response.data) {
        setFees(response.data);
      }
    } catch (err) {
      console.error("Error calculating fees:", err);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Validate amount
    const amount = parseFloat(requestAmount);
    if (!requestAmount || amount <= 0) {
      errors.amount = "Please enter a valid amount";
    } else if (amount < 1000) {
      errors.amount = "Minimum withdrawal amount is 1,000 XAF";
    } else if (eligibleAmount && amount > eligibleAmount.totalEligibleAmount) {
      errors.amount = "Amount exceeds available balance";
    }

    // Validate phone number
    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (
      !/^(\+237|237)?[6-7][0-9]{8}$/.test(phoneNumber.replace(/\s/g, ""))
    ) {
      errors.phoneNumber = "Please enter a valid Cameroonian phone number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAmountChange = (value: string) => {
    setRequestAmount(value);
    setValidationErrors((prev) => ({ ...prev, amount: "" }));

    const amount = parseFloat(value);
    if (amount > 0) {
      calculateFees(amount);
    } else {
      setFees(null);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eligibleAmount || !user) return;

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const amount = parseFloat(requestAmount);
      const requestData = {
        amount,
        phoneNumber,
      };

      const response = await apiClient.createPayoutRequest(requestData);

      if (response.success) {
        setShowRequestForm(false);
        setRequestAmount("");
        setPhoneNumber("");
        setFees(null);
        setValidationErrors({});
        await fetchData(); // Refresh data
      } else {
        setError(response.message || "Failed to create payout request");
      }
    } catch (err) {
      console.error("Error creating payout request:", err);
      setError("Failed to create payout request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const response = await apiClient.cancelPayoutRequest(requestId);
      if (response.success) {
        await fetchData(); // Refresh data
      } else {
        setError(response.message || "Failed to cancel request");
      }
    } catch (err) {
      console.error("Error canceling request:", err);
      setError("Failed to cancel request");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-72 flex-shrink-0">
            <div
              className="bg-white rounded-xl p-6 shadow-sm"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Payout Requests
              </h2>
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      item.id === "payouts"
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="pt-4 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Payout Requests
              </h1>
              <p className="text-gray-600">
                Manage your earnings and payout requests
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Balance */}
            {eligibleAmount && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {console.log(
                  "🔍 Displaying Stats with eligibleAmount:",
                  eligibleAmount
                )}
                {console.log(
                  "🔍 Stats Values - Available:",
                  eligibleAmount.totalEligibleAmount,
                  "Pending:",
                  eligibleAmount.pendingAmount,
                  "Locked:",
                  eligibleAmount.lockedAmount,
                  "Total:",
                  eligibleAmount.totalBalance
                )}
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Wallet className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Available Now
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(eligibleAmount.totalEligibleAmount)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Pending (3 days)
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(eligibleAmount.pendingAmount)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Lock className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Locked
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(eligibleAmount.lockedAmount)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Balance
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(eligibleAmount.totalBalance)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Request Payout Button */}
            {eligibleAmount && eligibleAmount.totalEligibleAmount > 0 && (
              <div className="mb-8">
                <Button
                  onClick={() => setShowRequestForm(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Request Payout</span>
                </Button>
              </div>
            )}

            {/* Payout Request Form */}
            {showRequestForm && eligibleAmount && (
              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Request Payout
                  </h2>
                  <button
                    onClick={() => {
                      setShowRequestForm(false);
                      setRequestAmount("");
                      setPhoneNumber("");
                      setFees(null);
                      setValidationErrors({});
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount to Withdraw
                    </label>
                    <Input
                      type="number"
                      value={requestAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="Enter amount"
                      min="1000"
                      max={eligibleAmount.totalEligibleAmount}
                      required
                      className={
                        validationErrors.amount ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.amount && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationErrors.amount}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Minimum: 1,000 XAF | Maximum:{" "}
                      {formatCurrency(eligibleAmount.totalEligibleAmount)}
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setValidationErrors((prev) => ({
                          ...prev,
                          phoneNumber: "",
                        }));
                      }}
                      placeholder="+237 6XX XXX XXX"
                      required
                      className={
                        validationErrors.phoneNumber ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationErrors.phoneNumber}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Enter your MTN Mobile Money or Orange Money number
                    </p>
                  </div>

                  {fees && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Fee Breakdown
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Requested Amount:
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(fees.requestedAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Withdrawal Fee:
                          </span>
                          <span className="text-sm font-medium text-red-600">
                            -{formatCurrency(fees.withdrawalFee)}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">
                              You'll Receive:
                            </span>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(fees.netAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                      {fees.note && (
                        <p className="mt-2 text-xs text-gray-500">
                          {fees.note}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      disabled={
                        submitting ||
                        !requestAmount ||
                        parseFloat(requestAmount) <= 0
                      }
                      className="flex-1"
                    >
                      {submitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowRequestForm(false);
                        setRequestAmount("");
                        setPhoneNumber("");
                        setFees(null);
                        setValidationErrors({});
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Payout History */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Payout History
                </h2>
              </div>

              {!requests || requests.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <History className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Payout Requests
                  </h3>
                  <p className="text-gray-600">
                    You haven't made any payout requests yet.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {requests?.map((request) => (
                    <Card key={request.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <span className="text-lg font-semibold text-gray-900">
                              {formatCurrency(request.amount)}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {getStatusIcon(request.status)}
                              <span className="ml-1">{request.status}</span>
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Phone: {request.phoneNumber}</p>
                            <p>
                              Requested:{" "}
                              {new Date(
                                request.requestedAt
                              ).toLocaleDateString()}
                            </p>
                            {request.approvedAt && (
                              <p>
                                Approved:{" "}
                                {new Date(
                                  request.approvedAt
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {request.rejectionReason && (
                              <p className="text-red-600">
                                Reason: {request.rejectionReason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {request.status === "PENDING" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelRequest(request.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
