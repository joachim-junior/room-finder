"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PropertiesTable } from "@/components/tables/properties-table";
import { apiClient, Property, PaginationInfo } from "@/lib/api";
import { Home, CheckCircle, Clock, MapPin } from "lucide-react";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [verifyModal, setVerifyModal] = useState<{
    isOpen: boolean;
    propertyId: string | null;
    isVerified: boolean;
    notes: string;
  }>({
    isOpen: false,
    propertyId: null,
    isVerified: false,
    notes: "",
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    propertyId: string | null;
  }>({
    isOpen: false,
    propertyId: null,
  });

  useEffect(() => {
    fetchProperties(1, 10); // Initial load
  }, []);

  const fetchProperties = async (
    page: number = currentPage,
    limit: number = itemsPerPage
  ) => {
    try {
      setIsLoading(true);
      const response = await apiClient.getProperties({
        page,
        limit,
        // Add any additional filters here if needed
      });
      if (response.success && response.data) {
        setProperties(response.data.properties);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || "Failed to fetch properties");
      }
    } catch (err) {
      setError("Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyProperty = async (
    id: string,
    isVerified: boolean,
    notes: string
  ) => {
    try {
      const response = await apiClient.verifyProperty(id, isVerified, notes);
      if (response.success) {
        // Refresh current page to get updated data
        fetchProperties(currentPage, itemsPerPage);
        setVerifyModal({
          isOpen: false,
          propertyId: null,
          isVerified: false,
          notes: "",
        });
      }
    } catch (err) {
      console.error("Failed to verify property:", err);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      const response = await apiClient.deleteProperty(id);
      if (response.success) {
        // Refresh current page to get updated data
        fetchProperties(currentPage, itemsPerPage);
        setDeleteModal({ isOpen: false, propertyId: null });
      }
    } catch (err) {
      console.error("Failed to delete property:", err);
    }
  };

  const openVerifyModal = (propertyId: string, isVerified: boolean) => {
    setVerifyModal({
      isOpen: true,
      propertyId,
      isVerified,
      notes: "",
    });
  };

  const closeVerifyModal = () => {
    setVerifyModal({
      isOpen: false,
      propertyId: null,
      isVerified: false,
      notes: "",
    });
  };

  const openDeleteModal = (propertyId: string) => {
    setDeleteModal({
      isOpen: true,
      propertyId,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      propertyId: null,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProperties(page, itemsPerPage);
  };

  const handleLimitChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing limit
    fetchProperties(1, limit);
  };

  const getStats = () => {
    const total = properties.length;
    const verified = properties.filter((prop) => prop.isVerified).length;
    const pending = properties.filter((prop) => !prop.isVerified).length;
    const available = properties.filter((prop) => prop.isAvailable).length;

    return { total, verified, pending, available };
  };

  const stats = getStats();

  const formatCurrency = (amount: number) => {
    if (typeof window === "undefined") {
      // Server-side fallback
      return `XAF ${amount.toLocaleString()}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <Badge variant="secondary" className="text-sm">
            {stats.total} total properties
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verified}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.verified / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Verification
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.pending / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.available}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.available / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>Property Management</CardTitle>
            <CardDescription>
              View and manage all properties on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <PropertiesTable
                properties={properties}
                pagination={pagination || undefined}
                onVerifyProperty={openVerifyModal}
                onDeleteProperty={openDeleteModal}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            )}
          </CardContent>
        </Card>

        {/* Verify Property Modal */}
        <Dialog open={verifyModal.isOpen} onOpenChange={closeVerifyModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {verifyModal.isVerified
                  ? "Verify Property"
                  : "Unverify Property"}
              </DialogTitle>
              <DialogDescription>
                {verifyModal.isVerified
                  ? "Are you sure you want to verify this property? This will make it visible to guests."
                  : "Are you sure you want to unverify this property? This will hide it from guests."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Verification Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter verification notes..."
                  value={verifyModal.notes}
                  onChange={(e) =>
                    setVerifyModal((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeVerifyModal}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (verifyModal.propertyId) {
                    handleVerifyProperty(
                      verifyModal.propertyId,
                      verifyModal.isVerified,
                      verifyModal.notes
                    );
                  }
                }}
              >
                {verifyModal.isVerified
                  ? "Verify Property"
                  : "Unverify Property"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Property Modal */}
        <Dialog open={deleteModal.isOpen} onOpenChange={closeDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Property</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this property? This action
                cannot be undone and will permanently remove the property from
                the platform.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteModal.propertyId) {
                    handleDeleteProperty(deleteModal.propertyId);
                  }
                }}
              >
                Delete Property
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
