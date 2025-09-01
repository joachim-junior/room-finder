"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  X,
  Calendar,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Input,
  Button,
  Select,
  Divider,
  Label,
  Modal,
  Checkbox,
} from "@/components/ui";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const guestPickerRef = useRef<HTMLDivElement>(null);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    city: searchParams.get("city") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: Number(searchParams.get("guests")) || 1,
    page: 1,
    limit: 20,
  });

  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 20,
    isAvailable: true, // Only show available properties by default
  });

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Load properties when component mounts or filters change
  useEffect(() => {
    loadProperties();
  }, [filters, searchParams]);

  // Click outside handler for guest picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestPickerRef.current &&
        !guestPickerRef.current.contains(event.target as Node)
      ) {
        setShowGuestPicker(false);
      }
    };

    if (showGuestPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuestPicker]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      let response;

      // If there's a search query, use search endpoint
      if (searchQuery.trim()) {
        response = await apiClient.searchProperties(
          searchQuery.trim(),
          filters
        );

        // Handle ApiResponse structure
        if (response.success && response.data) {
          setProperties(response.data.data);
          setTotalPages(response.data.pagination.totalPages);
          setCurrentPage(response.data.pagination.currentPage);
          setTotalItems(response.data.pagination.totalItems);
        } else {
          console.error("Failed to load properties:", response.message);
          setProperties([]);
        }
      } else {
        // Otherwise use regular properties endpoint with filters
        response = await apiClient.getProperties(filters);

        // Handle PropertiesResponse structure
        if (response.properties) {
          setProperties(response.properties);
          setTotalPages(response.pagination.totalPages);
          setCurrentPage(response.pagination.page);
          setTotalItems(response.pagination.total);
        } else {
          console.error("Failed to load properties:", response.message);
          setProperties([]);
        }
      }
    } catch (error) {
      console.error("Failed to load properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchFilters.city) params.append("city", searchFilters.city);
    if (searchFilters.checkIn) params.append("checkIn", searchFilters.checkIn);
    if (searchFilters.checkOut)
      params.append("checkOut", searchFilters.checkOut);
    if (searchFilters.guests)
      params.append("guests", searchFilters.guests.toString());

    // Update the filters state with search criteria
    const newFilters: SearchFilters = {
      ...filters,
      city: searchFilters.city || undefined,
      checkIn: searchFilters.checkIn || undefined,
      checkOut: searchFilters.checkOut || undefined,
      guests: searchFilters.guests || undefined,
      page: 1, // Reset to first page
    };

    setFilters(newFilters);
    router.push(`/search?${params.toString()}`);
  };

  const handleGuestChange = (
    type: "adults" | "children" | "infants",
    action: "increment" | "decrement"
  ) => {
    setSearchFilters((prev) => {
      const currentGuests = prev.guests || 1;
      let newGuests = currentGuests;

      if (action === "increment") {
        newGuests = Math.min(newGuests + 1, 16); // Max 16 guests
      } else {
        newGuests = Math.max(newGuests - 1, 1); // Min 1 guest
      }

      return { ...prev, guests: newGuests };
    });
  };

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

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFilters((prev) => {
      const currentAmenities = prev.amenities || [];
      let newAmenities: string[];

      if (checked) {
        newAmenities = [...currentAmenities, amenity];
      } else {
        newAmenities = currentAmenities.filter((a) => a !== amenity);
      }

      return {
        ...prev,
        amenities: newAmenities.length > 0 ? newAmenities : undefined,
        page: 1,
      };
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      isAvailable: true, // Keep only available properties filter
    });
    setSearchQuery("");
  };

  const applyFilters = () => {
    // Apply the filters and close modal
    setShowFilters(false);
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (key) =>
      key !== "page" &&
      key !== "limit" &&
      key !== "isAvailable" && // Don't count default filter
      filters[key as keyof SearchFilters]
  ).length;

  const propertyTypeOptions = [
    { value: "", label: "All Types" },
    { value: "ROOM", label: "Room" },
    { value: "STUDIO", label: "Studio" },
    { value: "APARTMENT", label: "Apartment" },
    { value: "VILLA", label: "Villa" },
    { value: "SUITE", label: "Suite" },
    { value: "DORMITORY", label: "Dormitory" },
    { value: "COTTAGE", label: "Cottage" },
    { value: "PENTHOUSE", label: "Penthouse" },
  ];

  const priceOptions = [
    { value: "", label: "Any" },
    { value: "10000", label: "Under 10,000 XAF" },
    { value: "25000", label: "Under 25,000 XAF" },
    { value: "50000", label: "Under 50,000 XAF" },
    { value: "75000", label: "Under 75,000 XAF" },
    { value: "100000", label: "Under 100,000 XAF" },
    { value: "150000", label: "Under 150,000 XAF" },
    { value: "200000", label: "Under 200,000 XAF" },
    { value: "300000", label: "Under 300,000 XAF" },
    { value: "500000", label: "Under 500,000 XAF" },
    { value: "1000000", label: "Under 1,000,000 XAF" },
  ];

  const locationOptions = [
    { value: "", label: "Any location" },
    { value: "Limbe", label: "Limbe" },
    { value: "Buea", label: "Buea" },
    { value: "Douala", label: "Douala" },
    { value: "Kribi", label: "Kribi" },
    { value: "Bamenda", label: "Bamenda" },
    { value: "Yaounde", label: "Yaounde" },
    { value: "Bafoussam", label: "Bafoussam" },
    { value: "Garoua", label: "Garoua" },
  ];

  const amenityOptions = [
    { value: "WiFi", label: "WiFi" },
    { value: "AC", label: "Air Conditioning" },
    { value: "Kitchen", label: "Kitchen" },
    { value: "Pool", label: "Swimming Pool" },
    { value: "Parking", label: "Parking" },
    { value: "Balcony", label: "Balcony" },
    { value: "Gym", label: "Gym" },
    { value: "Spa", label: "Spa" },
    { value: "Pet Friendly", label: "Pet Friendly" },
    { value: "Wheelchair Accessible", label: "Wheelchair Accessible" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Search Properties
          </h1>
          <p className="text-muted-foreground">
            {totalItems > 0
              ? `Found ${totalItems} property${totalItems !== 1 ? "ies" : "y"}`
              : "Find your perfect stay"}
          </p>
        </div>

        {/* Search Bar with Filters - Using Home Page Style */}
        <div className="bg-white mb-8 sticky top-0 z-50 shadow-sm py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <form
                onSubmit={handleSearch}
                className="flex-1 bg-white rounded-full p-2 flex items-center hover:shadow-lg transition-shadow"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex-1 flex items-center space-x-4 px-6">
                  {/* Where */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Where
                    </label>
                    <input
                      type="text"
                      placeholder="Search destinations"
                      value={searchFilters.city || ""}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      className="w-full border-none outline-none text-sm text-gray-900 placeholder-gray-500 bg-transparent"
                    />
                  </div>

                  {/* Divider */}
                  <Divider
                    orientation="vertical"
                    className="h-8 hidden sm:block"
                  />

                  {/* Check in */}
                  <div className="flex-1 hidden sm:block">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Check in
                    </label>
                    <input
                      type="date"
                      value={searchFilters.checkIn || ""}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          checkIn: e.target.value,
                        }))
                      }
                      className="w-full border-none outline-none text-sm text-gray-900 placeholder-gray-500 bg-transparent"
                    />
                  </div>

                  {/* Divider */}
                  <Divider
                    orientation="vertical"
                    className="h-8 hidden sm:block"
                  />

                  {/* Check out */}
                  <div className="flex-1 hidden sm:block">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Check out
                    </label>
                    <input
                      type="date"
                      value={searchFilters.checkOut || ""}
                      onChange={(e) =>
                        setSearchFilters((prev) => ({
                          ...prev,
                          checkOut: e.target.value,
                        }))
                      }
                      className="w-full border-none outline-none text-sm text-gray-900 placeholder-gray-500 bg-transparent"
                    />
                  </div>

                  {/* Divider */}
                  <Divider
                    orientation="vertical"
                    className="h-8 hidden sm:block"
                  />

                  {/* Who */}
                  <div
                    className="flex-1 relative hidden sm:block"
                    ref={guestPickerRef}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Who
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGuestPicker(!showGuestPicker)}
                      className="w-full text-left border-none outline-none text-sm text-gray-900 placeholder-gray-500 bg-transparent flex items-center justify-between"
                    >
                      <span
                        className={
                          searchFilters.guests
                            ? "text-gray-900"
                            : "text-gray-500"
                        }
                      >
                        {searchFilters.guests
                          ? `${searchFilters.guests} guest${
                              searchFilters.guests > 1 ? "s" : ""
                            }`
                          : "Add guests"}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>

                    {/* Guest Picker Dropdown */}
                    {showGuestPicker && (
                      <div
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl p-4 z-50"
                        style={{
                          border: "1px solid #DDDDDD",
                          boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium text-gray-900">
                            Guests
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowGuestPicker(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700">Adults</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleGuestChange("adults", "decrement")
                              }
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                              style={{ border: "1px solid #DDDDDD" }}
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm">
                              {searchFilters.guests}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleGuestChange("adults", "increment")
                              }
                              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                              style={{ border: "1px solid #DDDDDD" }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                  style={{ boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)" }}
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {/* Filters Button */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setShowFilters(true)}
                  variant="outline"
                  icon={<Filter className="h-4 w-4" />}
                >
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full ml-2">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
                {activeFiltersCount > 0 && (
                  <Button onClick={clearFilters} variant="ghost" size="sm">
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div
                  className="bg-gray-200 h-48 mb-4"
                  style={{ borderRadius: "20px" }}
                ></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No properties found</h3>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  variant={currentPage === i + 1 ? "primary" : "outline"}
                  size="sm"
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        <Modal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          title="Filters"
          className="max-w-lg"
        >
          <div className="space-y-6">
            {/* Location Filter */}
            <div>
              <Label>Location</Label>
              <Select
                value={filters.city || ""}
                onChange={(e) =>
                  handleFilterChange("city", e.target.value || undefined)
                }
                options={locationOptions}
              />
            </div>

            {/* Property Type Filter */}
            <div>
              <Label>Property Type</Label>
              <Select
                value={filters.type || ""}
                onChange={(e) =>
                  handleFilterChange("type", e.target.value || undefined)
                }
                options={propertyTypeOptions}
              />
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Price</Label>
                <Select
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  options={priceOptions}
                />
              </div>
              <div>
                <Label>Max Price</Label>
                <Select
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  options={priceOptions}
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <Label>Bedrooms</Label>
              <Select
                value={filters.bedrooms || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "bedrooms",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                options={[
                  { value: "", label: "Any" },
                  { value: "1", label: "1 bedroom" },
                  { value: "2", label: "2 bedrooms" },
                  { value: "3", label: "3 bedrooms" },
                  { value: "4", label: "4+ bedrooms" },
                ]}
              />
            </div>

            {/* Bathrooms */}
            <div>
              <Label>Bathrooms</Label>
              <Select
                value={filters.bathrooms || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "bathrooms",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                options={[
                  { value: "", label: "Any" },
                  { value: "1", label: "1 bathroom" },
                  { value: "2", label: "2 bathrooms" },
                  { value: "3", label: "3 bathrooms" },
                  { value: "4", label: "4+ bathrooms" },
                ]}
              />
            </div>

            {/* Max Guests */}
            <div>
              <Label>Max Guests</Label>
              <Select
                value={filters.maxGuests || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxGuests",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                options={[
                  { value: "", label: "Any" },
                  { value: "1", label: "1 guest" },
                  { value: "2", label: "2 guests" },
                  { value: "3", label: "3 guests" },
                  { value: "4", label: "4 guests" },
                  { value: "5", label: "5+ guests" },
                ]}
              />
            </div>

            {/* Amenities */}
            <div>
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                {amenityOptions.map((amenity) => (
                  <Checkbox
                    key={amenity.value}
                    id={`amenity-${amenity.value}`}
                    label={amenity.label}
                    checked={
                      filters.amenities?.includes(amenity.value) || false
                    }
                    onChange={(e) =>
                      handleAmenityChange(amenity.value, e.target.checked)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="flex-1"
              >
                Clear all
              </Button>
              <Button onClick={applyFilters} className="flex-1">
                Apply filters
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/property/${property.id}`} className="group block">
      <div
        className="bg-white overflow-hidden hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
        style={{
          border: "1px solid #DDDDDD",
          boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          borderRadius: "20px",
        }}
      >
        <div className="relative h-48 overflow-hidden">
          <ImageWithPlaceholder
            src={property.images?.[0]}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Heart button */}
          <div className="absolute top-3 right-3">
            <button
              className="p-2 bg-white/95 rounded-full hover:bg-white transition-colors"
              style={{ boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)" }}
            >
              <Heart className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {property.title}
              </h3>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
              <span>
                {property.city}, {property.state}
              </span>
            </div>

            {/* Beds and baths information */}
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span className="mr-2">
                {property.bedrooms} {property.bedrooms === 1 ? "bed" : "beds"}
              </span>
              <span className="mx-2">•</span>
              <span>
                {property.bathrooms}{" "}
                {property.bathrooms === 1 ? "bath" : "baths"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-1">
              {(property.reviews?.totalReviews || 0) > 0 ? (
                <>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {property.reviews?.averageRating || 0}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({property.reviews?.totalReviews || 0})
                  </span>
                </>
              ) : (
                <>
                  <Star className="h-3 w-3 text-gray-300" />
                  <span className="text-sm text-gray-500">No rating</span>
                </>
              )}
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {property.price.toLocaleString()} {property.currency}
              </div>
              <div className="text-sm text-gray-500">per night</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
