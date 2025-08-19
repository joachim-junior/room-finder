"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  Heart,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";
import { Property, SearchFilters } from "@/types";
import { apiClient } from "@/lib/api";
import { Divider } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";

export default function Home() {
  const [propertiesByTown, setPropertiesByTown] = useState<{
    [key: string]: Property[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const guestPickerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const cities = ["Limbe", "Buea", "Douala", "Kribi", "Bamenda"];

  // Set mounted to true after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadPropertiesByCity = async () => {
      try {
        const propertiesData: { [key: string]: Property[] } = {};

        // Fetch properties for each city
        for (const city of cities) {
          try {
            console.log(`Fetching properties for ${city}...`);
            const response = await apiClient.getProperties({
              limit: 7,
              isAvailable: true,
              // Remove isVerified requirement since properties might not be verified yet
              page: 1,
              city: city,
            });

            console.log(`✅ API response for ${city}:`, response);

            // Check if response has the expected structure
            if (
              response &&
              response.properties &&
              Array.isArray(response.properties)
            ) {
              console.log(
                `✅ Successfully loaded ${response.properties.length} properties for ${city} from backend`
              );
              propertiesData[city] = response.properties;
            } else {
              console.log(
                `⚠️ API returned invalid data structure for ${city}:`,
                response
              );
              propertiesData[city] = [];
            }
          } catch (error) {
            console.error(`❌ Failed to load properties for ${city}:`, error);
            // Don't throw the error, just set empty array for this city
            propertiesData[city] = [];
          }
        }

        console.log("Final properties data:", propertiesData);
        setPropertiesByTown(propertiesData);
      } catch (error) {
        console.error("Failed to load properties:", error);
        setPropertiesByTown({});
      } finally {
        setLoading(false);
      }
    };

    loadPropertiesByCity();
  }, []);

  // Click outside handler for guest picker and user menu
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    // Add search filters to URL - matching API documentation
    if (searchFilters.city) params.append("city", searchFilters.city);
    if (searchFilters.checkIn) params.append("checkIn", searchFilters.checkIn);
    if (searchFilters.checkOut)
      params.append("checkOut", searchFilters.checkOut);
    if (searchFilters.guests)
      params.append("guests", searchFilters.guests.toString());

    // Use the search endpoint if we have a city query, otherwise use properties endpoint
    const searchUrl = searchFilters.city
      ? `/search?q=${encodeURIComponent(
          searchFilters.city
        )}&${params.toString()}`
      : `/search?${params.toString()}`;

    window.location.href = searchUrl;
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

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            {mounted ? (
              <form
                onSubmit={handleSearch}
                className="bg-white rounded-full p-2 flex items-center hover:shadow-lg transition-shadow"
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
                    {mounted && (
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
                    )}
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
                    {mounted && (
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
                    )}
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
                    {mounted && showGuestPicker && (
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
                            <span className="w-8 text-center text-sm font-medium">
                              {searchFilters.guests || 1}
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
                  className="bg-primary text-primary-foreground p-4 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center"
                  style={{ boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)" }}
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div
                className="bg-white rounded-full p-2 flex items-center"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex-1 flex items-center space-x-4 px-6">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Where
                    </label>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <Divider orientation="vertical" className="h-8" />
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Check in
                    </label>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <Divider orientation="vertical" className="h-8" />
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Check out
                    </label>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <Divider orientation="vertical" className="h-8" />
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Who
                    </label>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-8 py-3 rounded-full font-medium hover:bg-red-600 transition-colors"
                    style={{ boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)" }}
                    disabled
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Limbe section */}
        {propertiesByTown["Limbe"] && propertiesByTown["Limbe"].length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8 w-full">
              <h2 className="text-3xl font-bold text-gray-900">
                Popular homes in Limbe
              </h2>
              <Link
                href="/search?city=Limbe"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                <span>See all</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid-7-cols w-full">
              {loading
                ? [...Array(7)].map((_, i) => (
                    <div key={i} className="animate-pulse h-full">
                      <div className="bg-gray-200 rounded-2xl h-48 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                : (propertiesByTown["Limbe"] || []).map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      mounted={mounted}
                    />
                  ))}
            </div>
          </section>
        )}

        {/* Buea section */}
        {propertiesByTown["Buea"] && propertiesByTown["Buea"].length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8 w-full">
              <h2 className="text-3xl font-bold text-gray-900">
                Popular homes in Buea
              </h2>
              <Link
                href="/search?city=Buea"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                <span>See all</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid-7-cols w-full">
              {loading
                ? [...Array(7)].map((_, i) => (
                    <div key={i} className="animate-pulse h-full">
                      <div className="bg-gray-200 rounded-2xl h-48 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                : (propertiesByTown["Buea"] || []).map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      mounted={mounted}
                    />
                  ))}
            </div>
          </section>
        )}

        {/* Douala section */}
        {propertiesByTown["Douala"] &&
          propertiesByTown["Douala"].length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8 w-full">
                <h2 className="text-3xl font-bold text-gray-900">
                  Popular homes in Douala
                </h2>
                <Link
                  href="/search?city=Douala"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  <span>See all</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid-7-cols w-full">
                {loading
                  ? [...Array(7)].map((_, i) => (
                      <div key={i} className="animate-pulse h-full">
                        <div className="bg-gray-200 rounded-2xl h-48 mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))
                  : (propertiesByTown["Douala"] || []).map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        mounted={mounted}
                      />
                    ))}
              </div>
            </section>
          )}

        {/* Kribi section */}
        {propertiesByTown["Kribi"] && propertiesByTown["Kribi"].length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8 w-full">
              <h2 className="text-3xl font-bold text-gray-900">
                Popular homes in Kribi
              </h2>
              <Link
                href="/search?city=Kribi"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                <span>See all</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid-7-cols w-full">
              {loading
                ? [...Array(7)].map((_, i) => (
                    <div key={i} className="animate-pulse h-full">
                      <div className="bg-gray-200 rounded-2xl h-48 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                : (propertiesByTown["Kribi"] || []).map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      mounted={mounted}
                    />
                  ))}
            </div>
          </section>
        )}

        {/* Bamenda section */}
        {propertiesByTown["Bamenda"] &&
          propertiesByTown["Bamenda"].length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8 w-full">
                <h2 className="text-3xl font-bold text-gray-900">
                  Popular homes in Bamenda
                </h2>
                <Link
                  href="/search?city=Bamenda"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  <span>See all</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid-7-cols w-full">
                {loading
                  ? [...Array(7)].map((_, i) => (
                      <div key={i} className="animate-pulse h-full">
                        <div className="bg-gray-200 rounded-2xl h-48 mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))
                  : (propertiesByTown["Bamenda"] || []).map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        mounted={mounted}
                      />
                    ))}
              </div>
            </section>
          )}

        {/* Fallback message when no properties are found */}
        {!loading && Object.keys(propertiesByTown).length === 0 && (
          <section className="mb-16">
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🏠</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No properties available yet
                </h2>
                <p className="text-gray-600 mb-6">
                  We&apos;re working on adding amazing properties to our
                  platform. Check back soon for the best accommodations in
                  Cameroon!
                </p>
                <Link href="/search">
                  <Button className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium">
                    Browse All Properties
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function PropertyCard({
  property,
  mounted,
}: {
  property: Property;
  mounted: boolean;
}) {
  console.log("PropertyCard image:", property.images?.[0]);

  return (
    <Link href={`/property/${property.id}`} className="group block h-full">
      <div
        className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
        style={{
          border: "1px solid #DDDDDD",
          boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
        }}
      >
        <div className="relative h-48 overflow-hidden">
          <ImageWithPlaceholder
            src={property.images?.[0]}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Guest favorite tag */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/95 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
              Guest favorite
            </span>
          </div>

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
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">
                {property.reviews?.averageRating || 4.5}
              </span>
              <span className="text-sm text-gray-500">
                ({property.reviews?.totalReviews || 0})
              </span>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {mounted
                  ? property.price.toLocaleString()
                  : property.price.toString()}{" "}
                {property.currency}
              </p>
              <p className="text-xs text-gray-500">night</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
