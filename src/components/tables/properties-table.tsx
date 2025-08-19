"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaginationInfo } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Property } from "@/lib/api";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";

interface PropertiesTableProps {
  properties: Property[];
  pagination?: PaginationInfo;
  onVerifyProperty: (id: string, isVerified: boolean, notes: string) => void;
  onDeleteProperty: (id: string) => void;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function PropertiesTable({
  properties,
  pagination,
  onVerifyProperty,
  onDeleteProperty,
  onPageChange,
  onLimitChange,
}: PropertiesTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.host?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      property.host?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && property.isVerified) ||
      (verificationFilter === "unverified" && !property.isVerified);

    const matchesType = typeFilter === "all" || property.type === typeFilter;

    return matchesSearch && matchesVerification && matchesType;
  });

  const getVerificationStatus = (property: Property) => {
    if (property.isVerified) {
      return (
        <div className="flex items-center space-x-1">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Verified</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1">
        <XCircle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">Unverified</span>
      </div>
    );
  };

  const getAvailabilityStatus = (property: Property) => {
    if (property.isAvailable) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Available
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        Unavailable
      </Badge>
    );
  };

  const formatPrice = (price: number, currency: string) => {
    if (!isClient) {
      // Server-side fallback
      return `${currency} ${price.toLocaleString()}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-full sm:w-[180px] animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-full sm:w-[180px] animate-pulse"></div>
        </div>
        <div className="border rounded-lg">
          <div className="h-64 bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={verificationFilter}
          onValueChange={setVerificationFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="APARTMENT">Apartment</SelectItem>
            <SelectItem value="HOUSE">House</SelectItem>
            <SelectItem value="VILLA">Villa</SelectItem>
            <SelectItem value="CABIN">Cabin</SelectItem>
            <SelectItem value="ROOM">Room</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{property.title}</div>
                    <div className="text-sm text-gray-500">{property.type}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {property.host?.firstName || "Unknown"}{" "}
                      {property.host?.lastName || "Host"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.host?.email || "No email"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{property.city}</div>
                    <div className="text-sm text-gray-500">
                      {property.address}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {formatPrice(property.price, property.currency)}
                  </div>
                </TableCell>
                <TableCell>{getAvailabilityStatus(property)}</TableCell>
                <TableCell>{getVerificationStatus(property)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium">
                        {property.reviews?.averageRating || 0}
                      </span>
                      <span className="text-sm text-gray-500">/ 5</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {property.reviews?.totalReviews || 0} reviews
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/properties/${property.id}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Overview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onVerifyProperty(
                            property.id,
                            !property.isVerified,
                            ""
                          )
                        }
                      >
                        {property.isVerified ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Unverify
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteProperty(property.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No properties found matching your criteria.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>
              Showing{" "}
              {((pagination?.currentPage || 1) - 1) *
                (pagination?.itemsPerPage || 10) +
                1}{" "}
              to{" "}
              {Math.min(
                (pagination?.currentPage || 1) *
                  (pagination?.itemsPerPage || 10),
                pagination?.totalItems || 0
              )}{" "}
              of {pagination?.totalItems || 0} properties
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              value={(pagination?.itemsPerPage || 10).toString()}
              onValueChange={(value) => onLimitChange?.(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPageChange?.((pagination?.currentPage || 1) - 1)
                }
                disabled={!pagination?.hasPrevPage}
              >
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from(
                  { length: Math.min(5, pagination?.totalPages || 1) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={
                          page === (pagination?.currentPage || 1)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => onPageChange?.(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onPageChange?.((pagination?.currentPage || 1) + 1)
                }
                disabled={!pagination?.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
