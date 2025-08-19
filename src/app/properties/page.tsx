"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Property, SearchFilters } from "@/types";
import { apiClient } from "@/lib/api";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Heart,
  Bed,
  Bath,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 12,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getProperties(filters);
        if (response.properties) {
          setProperties(response.properties);
          setTotalPages(response.pagination.totalPages);
          setCurrentPage(response.pagination.page);
        }
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [filters]);

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Properties
          </h1>
          <p className="text-muted-foreground">
            Discover amazing places to stay
          </p>
        </div>

        {/* Filters */}
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search properties..."
                value={filters.city || ""}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              />
            </div>

            <select
              value={filters.type || ""}
              onChange={(e) =>
                handleFilterChange("type", e.target.value || undefined)
              }
              className="w-full px-4 py-2 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <option value="">All Types</option>
              <option value="ROOM">Room</option>
              <option value="STUDIO">Studio</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="SUITE">Suite</option>
              <option value="DORMITORY">Dormitory</option>
              <option value="COTTAGE">Cottage</option>
              <option value="PENTHOUSE">Penthouse</option>
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ""}
              onChange={(e) =>
                handleFilterChange(
                  "minPrice",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-4 py-2 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                handleFilterChange(
                  "maxPrice",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-4 py-2 rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-muted rounded-lg h-80 animate-pulse"
              ></div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-input rounded-lg bg-background text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                            page === currentPage
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-input bg-background hover:bg-accent"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 py-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-input rounded-lg bg-background text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all properties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/property/${property.id}`} className="group">
      <div className="bg-background rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={property.images[0] || "/placeholder-property.jpg"}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <button className="p-2 bg-background/80 rounded-full hover:bg-background transition-colors">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {property.title}
            </h3>
            <div className="text-right flex-shrink-0 ml-2">
              <p className="font-bold text-primary">
                {property.price.toLocaleString()} {property.currency}
              </p>
              <p className="text-xs text-muted-foreground">per night</p>
            </div>
          </div>

          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              {property.city}, {property.state}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Bed className="h-3 w-3 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-3 w-3 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>{property.maxGuests}</span>
              </div>
            </div>
            {property.reviews && (
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{property.reviews.averageRating}</span>
                <span className="ml-1">({property.reviews.totalReviews})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
