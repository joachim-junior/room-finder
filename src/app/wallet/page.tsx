"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Transaction } from "@/types";
import { apiClient } from "@/lib/api";
import { CreditCard, TrendingUp, TrendingDown, Clock } from "lucide-react";

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWalletData = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        console.log("Loading wallet data for user:", user?.email);
        const [walletResponse, transactionsResponse] = await Promise.all([
          apiClient.getWalletBalance(),
          apiClient.getTransactionHistory(),
        ]);

        console.log("Wallet response:", walletResponse);
        console.log("Transactions response:", transactionsResponse);

        if (walletResponse.success && walletResponse.data) {
          setWallet(walletResponse.data);
          console.log("Set wallet data:", walletResponse.data);
        }

        if (transactionsResponse.success && transactionsResponse.data) {
          // Parse the actual API response structure based on the real API
          const responseData = transactionsResponse.data as unknown as {
            transactions?: Transaction[];
            pagination?: {
              page: number;
              limit: number;
              total: number;
              pages: number;
            };
          };
          const transactions = responseData.transactions || [];
          setTransactions(transactions);
          console.log(
            "Loaded transactions for wallet page:",
            transactions.length,
            "transactions"
          );
        } else {
          console.log("No transactions data:", transactionsResponse);
        }
      } catch (error) {
        console.error("Failed to load wallet data:", error);
        setError("Failed to load wallet data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadWalletData();
  }, [user]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "REFUND":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "WITHDRAWAL":
        return <TrendingDown className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return "text-red-600";
      case "REFUND":
        return "text-green-600";
      case "WITHDRAWAL":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              Please log in to view your wallet
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your balance and view transaction history
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-6 animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-muted rounded w-1/2"></div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-1/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="h-16 w-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-red-600">
              Error Loading Wallet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Show content if wallet exists (including 0 balance) or transactions exist */}
            {!loading && (wallet || transactions.length > 0) ? (
              <>
                {/* Balance Card - Show if wallet data exists (including 0 balance) */}
                {wallet && (
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-medium mb-2">
                          Current Balance
                        </h2>
                        <p className="text-3xl font-bold">
                          {wallet.balance.toLocaleString()} {wallet.currency}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6" />
                      </div>
                    </div>

                    {/* Wallet Stats - Always show if wallet exists */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                      <div className="text-center">
                        <p className="text-white/80 text-xs">Transactions</p>
                        <p className="text-sm font-semibold">
                          {wallet.totalTransactions || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/80 text-xs">Total Paid</p>
                        <p className="text-sm font-semibold">
                          {wallet.totalPayments?.toLocaleString() || 0}{" "}
                          {wallet.currency}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/80 text-xs">Refunds</p>
                        <p className="text-sm font-semibold">
                          {wallet.totalRefunds?.toLocaleString() || 0}{" "}
                          {wallet.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Stats Cards */}
                {wallet && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-background rounded-lg shadow-lg p-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Transactions
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {wallet.totalTransactions || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background rounded-lg shadow-lg p-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <TrendingDown className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Payments
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {wallet.totalPayments?.toLocaleString() || 0}{" "}
                            {wallet.currency}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background rounded-lg shadow-lg p-6">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Refunds
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {wallet.totalRefunds?.toLocaleString() || 0}{" "}
                            {wallet.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction History - Always show if wallet exists */}
                {wallet && (
                  <div className="bg-background rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Transaction History
                    </h2>
                    {transactions.length > 0 ? (
                      <div className="space-y-4">
                        {transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 rounded-lg"
                            style={{
                              border: "1px solid #DDDDDD",
                              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                            }}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {transaction.booking?.property?.title ||
                                    transaction.description}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {transaction.booking?.property?.address && (
                                    <span>
                                      {transaction.booking.property.address} •{" "}
                                    </span>
                                  )}
                                  {new Date(
                                    transaction.createdAt
                                  ).toLocaleDateString()}
                                </p>
                                {transaction.reference && (
                                  <p className="text-xs text-muted-foreground">
                                    Ref: {transaction.reference}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-semibold ${getTransactionColor(
                                  transaction.type
                                )}`}
                              >
                                {transaction.type === "PAYMENT" ||
                                transaction.type === "WITHDRAWAL"
                                  ? "-"
                                  : "+"}
                                {transaction.amount.toLocaleString()}{" "}
                                {transaction.currency}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Transactions Yet
                        </h3>
                        <p className="text-gray-600">
                          Your transaction history will appear here once you
                          make your first booking or payment.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Empty State - No wallet or transactions */
              <div className="text-center py-16">
                <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  No Wallet Data Available
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Your wallet information will appear here once you make your
                  first booking or when wallet data becomes available.
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>• Make a booking to activate your wallet</p>
                  <p>• Receive refunds and manage payments</p>
                  <p>• View transaction history</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
