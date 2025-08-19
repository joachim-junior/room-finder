"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { apiClient, Property } from "@/lib/api";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Star,
  Calendar,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function PropertyOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      // For now, we'll fetch from the properties list and find the specific property
      // In a real implementation, you'd have a GET /admin/properties/:id endpoint
      const response = await apiClient.getProperties({ limit: 1000 });
      if (response.success && response.data) {
        const foundProperty = response.data.properties.find(
          (p) => p.id === propertyId
        );
        if (foundProperty) {
          setProperty(foundProperty);
        } else {
          setError("Property not found");
        }
      } else {
        setError(response.message || "Failed to fetch property");
      }
    } catch (err) {
      setError("Failed to load property");
    } finally {
      setIsLoading(false);
    }
  };

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
    if (typeof window === "undefined") {
      // Server-side fallback
      return `${currency} ${price.toLocaleString()}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

  if (error || !property) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Property Not Found
            </h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600">{error || "Property not found"}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Property Overview
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>
                Basic property details and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">{property.title}</h2>
                <p className="text-gray-500 mt-2">{property.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{property.address}</div>
                    <div className="text-sm text-gray-500">
                      {property.city}, {property.state}, {property.country}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {formatPrice(property.price, property.currency)}
                    </div>
                    <div className="text-sm text-gray-500">per night</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">Listed on</div>
                    <div className="text-sm text-gray-500">
                      {typeof window !== "undefined"
                        ? new Date(property.createdAt).toLocaleDateString()
                        : property.createdAt.split("T")[0]}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Property Status</CardTitle>
              <CardDescription>
                Verification and availability information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Type</span>
                  <Badge variant="outline">{property.type}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Availability</span>
                  {getAvailabilityStatus(property)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Verification Status
                  </span>
                  {getVerificationStatus(property)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Host Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Host Information</CardTitle>
              <CardDescription>Property owner details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {property.host?.firstName?.[0] || "U"}
                    {property.host?.lastName?.[0] || "H"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {property.host?.firstName || "Unknown"}{" "}
                    {property.host?.lastName || "Host"}
                  </h3>
                  <p className="text-gray-500">
                    {property.host?.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {property.host && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push(`/users/${property.host.id}`)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Host Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reviews and Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Statistics</CardTitle>
              <CardDescription>Guest feedback and booking data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Rating</span>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">
                      {property.reviews?.averageRating || 0}
                    </span>
                    <span className="text-gray-500">/ 5</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Reviews</span>
                  <span className="font-medium">
                    {property.reviews?.totalReviews || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Bookings</span>
                  <span className="font-medium">
                    {property.bookings?.totalBookings || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
