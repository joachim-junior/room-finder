"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { ArrowLeft, DollarSign, Filter, Search } from "lucide-react";

interface WalletTransaction {
  id: string;
  amount: number;
  currency: string;
  type: "PAYMENT" | "REFUND" | "WITHDRAWAL";
  status: "PENDING" | "COMPLETED" | "FAILED";
  description: string;
  reference: string;
  createdAt: string;
}

export default function TransactionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all transaction types
        const [paymentResponse, refundResponse, withdrawalResponse] =
          await Promise.all([
            apiClient.getTransactionHistory("PAYMENT", 1, 50),
            apiClient.getRefundHistory(1, 50),
            apiClient.getWithdrawalHistory(1, 50),
          ]);

        let allTransactions: WalletTransaction[] = [];

        // Add payment transactions
        if (paymentResponse.success && paymentResponse.data) {
          allTransactions = [
            ...allTransactions,
            ...(paymentResponse.data.data || []),
          ];
        }

        // Add refund transactions (for GUEST users)
        if (
          user.role === "GUEST" &&
          refundResponse.success &&
          refundResponse.data
        ) {
          allTransactions = [
            ...allTransactions,
            ...(refundResponse.data.data || []),
          ];
        }

        // Add withdrawal transactions (for HOST users)
        if (
          user.role === "HOST" &&
          withdrawalResponse.success &&
          withdrawalResponse.data
        ) {
          allTransactions = [
            ...allTransactions,
            ...(withdrawalResponse.data.data || []),
          ];
        }

        // Sort by date (newest first)
        allTransactions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setTransactions(allTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, router]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return "bg-green-100 text-green-600";
      case "WITHDRAWAL":
        return "bg-blue-100 text-blue-600";
      case "REFUND":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      filter === "all" || transaction.type === filter.toUpperCase();
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/dashboard?section=wallet")}
              className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Transaction History
              </h1>
              <p className="text-gray-600">View all your wallet transactions</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          className="bg-white rounded-xl p-6 mb-6"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <option value="all">All Transactions</option>
                <option value="payment">Payments</option>
                {user.role === "HOST" && (
                  <option value="withdrawal">Withdrawals</option>
                )}
                {user.role === "GUEST" && (
                  <option value="refund">Refunds</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div
          className="bg-white rounded-xl"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${getTypeColor(
                          transaction.type
                        )}`}
                      >
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {transaction.reference}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            transaction.type === "PAYMENT"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "PAYMENT" ? "+" : "-"}
                          {formatCurrency(
                            transaction.amount,
                            transaction.currency
                          )}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        {transaction.type.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Your transaction history will appear here when you make transactions"}
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div
            className="mt-6 bg-white rounded-xl p-6"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-xl font-bold text-gray-900">
                  {filteredTransactions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                    filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
                    filteredTransactions[0]?.currency || "XAF"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date Range</p>
                <p className="text-xl font-bold text-gray-900">
                  {filteredTransactions.length > 0 && (
                    <>
                      {
                        formatDate(
                          filteredTransactions[filteredTransactions.length - 1]
                            .createdAt
                        ).split(",")[0]
                      }{" "}
                      -{" "}
                      {
                        formatDate(filteredTransactions[0].createdAt).split(
                          ","
                        )[0]
                      }
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
