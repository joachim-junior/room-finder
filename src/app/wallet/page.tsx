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

  useEffect(() => {
    const loadWalletData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const [walletResponse, transactionsResponse] = await Promise.all([
          apiClient.getWalletBalance(),
          apiClient.getTransactionHistory(),
        ]);

        if (walletResponse.success && walletResponse.data) {
          setWallet(walletResponse.data);
        }

        if (transactionsResponse.success && transactionsResponse.data) {
          setTransactions(transactionsResponse.data.data);
        }
      } catch (error) {
        console.error("Failed to load wallet data:", error);
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
        ) : (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium mb-2">Current Balance</h2>
                  <p className="text-3xl font-bold">
                    {wallet
                      ? `${wallet.balance.toLocaleString()} ${wallet.currency}`
                      : "0 XAF"}
                  </p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Transaction History */}
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
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              transaction.createdAt
                            ).toLocaleDateString()}
                          </p>
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
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-muted-foreground">
                    Your transaction history will appear here once you make
                    bookings or payments.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
