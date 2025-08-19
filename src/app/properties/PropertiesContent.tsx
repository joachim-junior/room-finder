"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Property, SearchFilters } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";
import {
  Search,
  MapPin,
  Users,
  Star,
  Filter,
  ArrowRight,
  ArrowLeft,
  Heart,
  Bed,
  Bath,
} from "lucide-react";

export default function PropertiesContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<
    SearchFilters & { page: number; limit: number }
  >({
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get initial params from URL
    const page = searchParams.get("page") || "1";
    const city = searchParams.get("city") || "";
    const type = searchParams.get("type") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const guests = searchParams.get("guests") || "";

    setFilters({
      page: parseInt(page),
      limit: 12,
      city: city || undefined,
      type: (type as Property["type"]) || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      guests: guests ? parseInt(guests) : undefined,
    });

    fetchProperties({
      page: parseInt(page),
      limit: 12,
      city: city || undefined,
      type: (type as Property["type"]) || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      guests: guests ? parseInt(guests) : undefined,
    });
  }, [searchParams]);

  const fetchProperties = async (
    searchFilters: SearchFilters & { page: number; limit: number }
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.getProperties(searchFilters);

      if (response.success && response.data) {
        setProperties(response.data.properties || []);
        setPagination({
          page: response.data.pagination?.page || 1,
          limit: response.data.pagination?.limit || 12,
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.totalPages || 1,
        });
      } else {
        setError(response.message || "Failed to load properties");
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.city) params.set("city", filters.city);
    if (filters.type) params.set("type", filters.type);
    if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.guests) params.set("guests", filters.guests.toString());
    params.set("page", "1");
    router.push(`/properties?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (filters.city) params.set("city", filters.city);
    if (filters.type) params.set("type", filters.type);
    if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.guests) params.set("guests", filters.guests.toString());
    params.set("page", page.toString());
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
    });
    router.push("/properties");
  };

  const propertyTypes = [
    { value: "ROOM", label: "Room" },
    { value: "STUDIO", label: "Studio" },
    { value: "APARTMENT", label: "Apartment" },
    { value: "VILLA", label: "Villa" },
    { value: "SUITE", label: "Suite" },
    { value: "DORMITORY", label: "Dormitory" },
    { value: "COTTAGE", label: "Cottage" },
    { value: "PENTHOUSE", label: "Penthouse" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Stay
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing properties across Cameroon
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="City or area"
                  value={filters.city || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <Select
                  value={filters.type || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: e.target.value as Property["type"],
                    }))
                  }
                  options={[
                    { value: "", label: "All Types" },
                    ...propertyTypes,
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button type="submit" className="flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search Properties
              </Button>

              {(filters.city ||
                filters.type ||
                filters.minPrice ||
                filters.maxPrice) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Error loading properties
            </p>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🏠</span>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              No properties found
            </p>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Property Image */}
                  <div className="relative h-48">
                    <ImageWithPlaceholder
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                      fallbackSrc="/placeholder-property.svg"
                    />
                    <div className="absolute top-2 right-2">
                      <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Property Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        <Link
                          href={`/property/${property.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {property.title}
                        </Link>
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{property.rating || "N/A"}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="line-clamp-1">
                        {property.city}, {property.state}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{property.maxGuests}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ${property.price}
                        </span>
                        <span className="text-sm text-gray-600">/night</span>
                      </div>
                      <Link
                        href={`/property/${property.id}`}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span className="text-sm font-medium">
                          View details
                        </span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    variant="outline"
                    size="sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>

                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
