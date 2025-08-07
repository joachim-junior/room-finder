"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import HeaderTwo from "@/layouts/headers/HeaderTwo";
import FooterFour from "@/layouts/footers/FooterFour";
import BottomNavigation from "@/components/common/BottomNavigation";
import { toast } from "react-toastify";
import "@/styles/homepage-responsive.css";

interface Property {
  id: number;
  title: string;
  rate?: string;
  buyorrent?: string;
  plimit?: string;
  city?: string;
  image?: string;
  property_type?: string;
  price: string;
  IS_FAVOURITE?: number;
  beds?: string;
  bathroom?: string;
  sqrft?: string;
}

const BasicHomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedBedrooms, setSelectedBedrooms] = useState("all");
  const [selectedBathrooms, setSelectedBathrooms] = useState("all");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [favLoading, setFavLoading] = useState<{ [key: string]: boolean }>({});
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const propertiesPerPage = 10;

  // Filter options from API
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);

  const router = useRouter();

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    selectedType !== "all" ||
    selectedBedrooms !== "any" ||
    selectedBathrooms !== "any" ||
    selectedAmenities.length > 0;

  // Check if any filters are active for mobile
  const hasActiveFiltersMobile =
    searchQuery ||
    selectedType !== "all" ||
    selectedBedrooms !== "any" ||
    selectedBathrooms !== "any" ||
    selectedAmenities.length > 0;

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_home_data.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: "0",
              country_id: "1",
            }),
          }
        );
        const data = await res.json();

        if (data.Result === "true" && data.HomeData?.Featured_Property) {
          console.log("Properties data:", data.HomeData.Featured_Property);
          setProperties(data.HomeData.Featured_Property);
        } else {
          console.log("No properties found or API error:", data);
          setProperties([]);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Fetch filter options from API
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch property types
        const propertyTypeResponse = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_property_type.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        );
        const propertyTypeData = await propertyTypeResponse.json();
        if (
          propertyTypeData.Result === "true" &&
          Array.isArray(propertyTypeData.typelist)
        ) {
          setPropertyTypes(propertyTypeData.typelist);
        }

        // Fetch facilities
        const facilityResponse = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_facility.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        );
        const facilityData = await facilityResponse.json();
        if (
          facilityData.Result === "true" &&
          Array.isArray(facilityData.facilitylist)
        ) {
          setFacilities(facilityData.facilitylist);
        }

        // Fetch countries
        const countryResponse = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_country.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        );
        const countryData = await countryResponse.json();
        if (
          countryData.Result === "true" &&
          Array.isArray(countryData.CountryData)
        ) {
          setCountries(countryData.CountryData);
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
      } finally {
        setFilterOptionsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch favorites if authenticated
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_favlist.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.id,
              property_type: "0",
              country_id: "1",
            }),
          }
        );
        const data = await res.json();

        if (data.Result === "true" && Array.isArray(data.propetylist)) {
          const favMap: { [key: string]: boolean } = {};
          data.propetylist.forEach((item: any) => {
            favMap[item.id] = true;
          });
          setFavorites(favMap);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [user?.id]);

  // Handle favorite toggle
  const handleFavorite = async (propertyId: number) => {
    if (!user?.id) {
      toast.error("Please log in to save favorites");
      return;
    }

    setFavLoading((prev) => ({ ...prev, [propertyId]: true }));

    try {
      const res = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_fav.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            pid: propertyId,
            property_type: "1",
          }),
        }
      );
      const data = await res.json();

      if (data.Result === "true") {
        setFavorites((prev) => ({
          ...prev,
          [propertyId]: !prev[propertyId],
        }));
        toast.success(
          favorites[propertyId]
            ? "Removed from favorites"
            : "Added to favorites"
        );
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error("Failed to update favorite");
    } finally {
      setFavLoading((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  // Handle search with API
  const handleSearch = async () => {
    if (
      !searchQuery.trim() &&
      selectedType === "all" &&
      selectedBedrooms === "all" &&
      selectedBathrooms === "all" &&
      selectedAmenities.length === 0
    ) {
      // If no filters are applied, fetch all properties
      const res = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_home_data.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: "0",
            country_id: "1",
          }),
        }
      );
      const data = await res.json();
      if (data.Result === "true" && data.HomeData?.Featured_Property) {
        setProperties(data.HomeData.Featured_Property);
      }
      return;
    }

    setLoading(true);
    try {
      // Use search API for keyword search
      if (searchQuery.trim()) {
        const res = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_search_property.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              keyword: searchQuery,
              uid: user?.id || "0",
              country_id: "1",
            }),
          }
        );
        const data = await res.json();

        if (data.Result === "true" && Array.isArray(data.search_propety)) {
          setProperties(data.search_propety);
        } else {
          setProperties([]);
        }
      } else {
        // If no keyword but other filters, fetch all and filter client-side
        const res = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_home_data.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: "0",
              country_id: "1",
            }),
          }
        );
        const data = await res.json();
        if (data.Result === "true" && data.HomeData?.Featured_Property) {
          setProperties(data.HomeData.Featured_Property);
        } else {
          setProperties([]);
        }
      }
    } catch (err) {
      console.error("Error searching properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter properties based on selected filters
  const filteredProperties = properties.filter((property) => {
    // Type filter
    const matchesType =
      selectedType === "all" ||
      property.property_type?.toString() === selectedType;

    // Bedrooms filter
    const matchesBedrooms =
      selectedBedrooms === "all" ||
      property.beds?.toString() === selectedBedrooms;

    // Bathrooms filter
    const matchesBathrooms =
      selectedBathrooms === "all" ||
      property.bathroom?.toString() === selectedBathrooms;

    // Amenities filter (placeholder - would need property-specific amenity data)
    // For now, we'll skip amenities filtering as it requires property-specific data
    const matchesAmenities = selectedAmenities.length === 0 || true;

    return (
      matchesType && matchesBedrooms && matchesBathrooms && matchesAmenities
    );
  });

  // Handle filter changes
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    // Trigger search when filter changes
    setTimeout(() => handleSearch(), 100);
  };

  const handleBedroomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBedrooms(e.target.value);
    // Trigger search when filter changes
    setTimeout(() => handleSearch(), 100);
  };

  const handleBathroomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBathrooms(e.target.value);
    // Trigger search when filter changes
    setTimeout(() => handleSearch(), 100);
  };

  const handleAmenitiesChange = (selectedAmenities: string[]) => {
    setSelectedAmenities(selectedAmenities);
    // Trigger search when filter changes
    setTimeout(() => handleSearch(), 100);
  };

  // Handle amenities selection
  const handleAmenityToggle = (amenityId: string) => {
    const newAmenities = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter((id) => id !== amenityId)
      : [...selectedAmenities, amenityId];

    setSelectedAmenities(newAmenities);
    // Trigger search when amenities change
    setTimeout(() => handleSearch(), 100);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedBedrooms("all");
    setSelectedBathrooms("all");
    setSelectedAmenities([]);
    // Trigger search to refresh results
    setTimeout(() => handleSearch(), 100);
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const imageUrl = target.src;
    if (!failedImages.has(imageUrl)) {
      setFailedImages((prev) => new Set([...prev, imageUrl]));
      target.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
    }
  };

  // Calculate pagination
  const startIndex = 0;
  const endIndex = showAllProperties
    ? filteredProperties.length
    : Math.min(propertiesPerPage, filteredProperties.length);
  const displayedProperties = filteredProperties.slice(startIndex, endIndex);
  const hasMoreProperties = filteredProperties.length > propertiesPerPage;

  return (
    <React.Fragment>
      <HeaderTwo />
      <div className="main-content">
        {/* Hero Section with Search - Airbnb Style */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "80px 0 60px 0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            <h1
              className="hero-title"
              style={{
                fontSize: "2.5rem",
                fontWeight: "600",
                color: "#222222",
                marginBottom: "8px",
              }}
            >
              Find your perfect place
            </h1>
            <p
              className="hero-subtitle"
              style={{
                fontSize: "1.1rem",
                color: "#717171",
                marginBottom: "40px",
              }}
            >
              Discover amazing properties in Cameroon
            </p>

            {/* Search Box - Airbnb Style */}
            <div
              className="search-container"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "50px",
                padding: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                maxWidth: "1200px",
                margin: "0 auto",
                border: "1px solid #dddddd",
              }}
            >
              {/* Desktop Search - Horizontal Layout */}
              <div
                className="search-filters desktop-only"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px",
                }}
              >
                {/* Keyword */}
                <div
                  className="filter-field"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRight: "1px solid #dddddd",
                  }}
                >
                  <div
                    className="filter-label"
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#222222",
                      marginBottom: "2px",
                    }}
                  >
                    Keyword
                  </div>
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-pill"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #dddddd",
                      borderRadius: "25px",
                      fontSize: "16px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>

                {/* Type */}
                <div
                  className="filter-field"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRight: "1px solid #dddddd",
                  }}
                >
                  <div
                    className="filter-label"
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#222222",
                      marginBottom: "2px",
                    }}
                  >
                    Type
                  </div>
                  <select
                    value={selectedType}
                    onChange={handleTypeChange}
                    className="rounded-pill"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #dddddd",
                      borderRadius: "25px",
                      fontSize: "16px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                      appearance: "none",
                      backgroundImage:
                        "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 13px center",
                      backgroundSize: "12px auto",
                      paddingRight: "35px",
                    }}
                  >
                    <option value="all">All types</option>
                    {propertyTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms */}
                <div
                  className="filter-field"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRight: "1px solid #dddddd",
                  }}
                >
                  <div
                    className="filter-label"
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#222222",
                      marginBottom: "2px",
                    }}
                  >
                    Bedrooms
                  </div>
                  <select
                    value={selectedBedrooms}
                    onChange={handleBedroomsChange}
                    className="rounded-pill"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #dddddd",
                      borderRadius: "25px",
                      fontSize: "16px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                      appearance: "none",
                      backgroundImage:
                        "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 13px center",
                      backgroundSize: "12px auto",
                      paddingRight: "35px",
                    }}
                  >
                    <option value="all">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
                  </select>
                </div>

                {/* Bathrooms */}
                <div
                  className="filter-field"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRight: "1px solid #dddddd",
                  }}
                >
                  <div
                    className="filter-label"
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#222222",
                      marginBottom: "2px",
                    }}
                  >
                    Bathrooms
                  </div>
                  <select
                    value={selectedBathrooms}
                    onChange={handleBathroomsChange}
                    className="rounded-pill"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #dddddd",
                      borderRadius: "25px",
                      fontSize: "16px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                      appearance: "none",
                      backgroundImage:
                        "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 13px center",
                      backgroundSize: "12px auto",
                      paddingRight: "35px",
                    }}
                  >
                    <option value="all">Any</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3+</option>
                  </select>
                </div>

                {/* Amenities */}
                <div
                  className="filter-field"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRight: "1px solid #dddddd",
                  }}
                >
                  <div
                    className="filter-label"
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#222222",
                      marginBottom: "2px",
                    }}
                  >
                    Amenities
                  </div>
                  <button
                    onClick={() => setShowAmenitiesModal(true)}
                    className="rounded-pill"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #dddddd",
                      borderRadius: "25px",
                      fontSize: "16px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                      appearance: "none",
                      backgroundImage:
                        "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 13px center",
                      backgroundSize: "12px auto",
                      paddingRight: "35px",
                    }}
                  >
                    {selectedAmenities.length > 0
                      ? `${selectedAmenities.length} selected`
                      : "Add amenities"}
                  </button>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "25px",
                    backgroundColor: "#007bff",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "4px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0056b3";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#007bff";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <i className="fas fa-search" style={{ fontSize: "14px" }}></i>
                </button>

                {/* Clear All Button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    style={{
                      borderRadius: "20px",
                      padding: "8px 12px",
                      fontSize: "12px",
                      backgroundColor: "#f8f9fa",
                      color: "#6c757d",
                      border: "1px solid #dee2e6",
                      cursor: "pointer",
                      marginLeft: "8px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#e9ecef";
                      e.currentTarget.style.borderColor = "#adb5bd";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.borderColor = "#dee2e6";
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Mobile Search - Single Input */}
              <div
                className="mobile-search-input rounded-pill"
                style={{
                  display: "none",
                  alignItems: "center",
                  padding: "16px 20px",
                  cursor: "pointer",
                  borderRadius: "24px",
                  backgroundColor: "#f7f7f7",
                }}
                onClick={() => setShowMobileSearchModal(true)}
              >
                <i
                  className="fas fa-search"
                  style={{
                    fontSize: "18px",
                    color: "#007bff",
                    marginRight: "12px",
                  }}
                ></i>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#222222",
                      marginBottom: "2px",
                    }}
                  >
                    Search properties
                  </div>
                  <div style={{ fontSize: "14px", color: "#717171" }}>
                    {searchQuery || "Start your search"}
                  </div>
                </div>
                <i
                  className="fas fa-chevron-right"
                  style={{ fontSize: "14px", color: "#717171" }}
                ></i>
              </div>
            </div>

            {/* Mobile Search Modal */}
            {showMobileSearchModal && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "flex-end",
                }}
                onClick={() => setShowMobileSearchModal(false)}
              >
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    width: "100%",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                    padding: "24px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "24px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#222222",
                        margin: 0,
                      }}
                    >
                      Search filters
                    </h3>
                    <button
                      onClick={() => setShowMobileSearchModal(false)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        color: "#717171",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Keyword Search */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#222222",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Keyword
                    </label>
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="rounded-pill"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #dddddd",
                        borderRadius: "25px",
                        fontSize: "16px",
                        outline: "none",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>

                  {/* Property Type */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#222222",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Property Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={handleTypeChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #dddddd",
                        borderRadius: "25px",
                        fontSize: "16px",
                        outline: "none",
                        backgroundColor: "#ffffff",
                        appearance: "none",
                        backgroundImage:
                          "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 13px center",
                        backgroundSize: "12px auto",
                        paddingRight: "35px",
                      }}
                    >
                      <option value="all">All types</option>
                      {propertyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bedrooms */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#222222",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Bedrooms
                    </label>
                    <select
                      value={selectedBedrooms}
                      onChange={handleBedroomsChange}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #dddddd",
                        borderRadius: "25px",
                        fontSize: "16px",
                        outline: "none",
                        backgroundColor: "#ffffff",
                        appearance: "none",
                        backgroundImage:
                          "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 13px center",
                        backgroundSize: "12px auto",
                        paddingRight: "35px",
                      }}
                    >
                      <option value="all">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </div>

                  {/* Bathrooms */}
                  <div style={{ marginBottom: "24px" }}>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#222222",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Bathrooms
                    </label>
                    <select
                      value={selectedBathrooms}
                      onChange={handleBathroomsChange}
                      className="rounded-pill"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #dddddd",
                        borderRadius: "25px",
                        fontSize: "16px",
                        outline: "none",
                        backgroundColor: "#ffffff",
                        appearance: "none",
                        backgroundImage:
                          "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 13px center",
                        backgroundSize: "12px auto",
                        paddingRight: "35px",
                      }}
                    >
                      <option value="all">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                  </div>

                  {/* Amenities */}
                  <div style={{ marginBottom: "32px" }}>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#222222",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Amenities
                    </label>
                    <button
                      onClick={() => {
                        setShowMobileSearchModal(false);
                        setShowAmenitiesModal(true);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #dddddd",
                        borderRadius: "25px",
                        fontSize: "16px",
                        backgroundColor: "#ffffff",
                        color: "#222222",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      {selectedAmenities.length > 0
                        ? `${selectedAmenities.length} selected`
                        : "Add amenities"}
                    </button>
                  </div>

                  {/* Mobile Search Modal Buttons */}
                  <div
                    style={{ display: "flex", gap: "12px", marginTop: "24px" }}
                  >
                    <button
                      onClick={() => {
                        clearAllFilters();
                        setShowMobileSearchModal(false);
                      }}
                      style={{
                        flex: 1,
                        padding: "14px 20px",
                        border: "1px solid #dddddd",
                        borderRadius: "25px",
                        backgroundColor: "#ffffff",
                        color: "#222222",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f7f7f7";
                        e.currentTarget.style.borderColor = "#cccccc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.borderColor = "#dddddd";
                      }}
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => {
                        handleSearch();
                        setShowMobileSearchModal(false);
                      }}
                      style={{
                        flex: 1,
                        padding: "14px 20px",
                        border: "none",
                        borderRadius: "25px",
                        backgroundColor: "#007bff",
                        color: "#ffffff",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#0056b3";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#007bff";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Properties Section - Full Width Airbnb Style */}
          <div
            style={{
              width: "100%",
              padding: "60px 0",
              backgroundColor: "#ffffff",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "100%",
                padding: "0 80px",
              }}
              className="properties-container"
            >
              {/* Section Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "40px",
                  padding: "0 20px",
                }}
                className="properties-header"
              >
                <div>
                  <h2
                    style={{
                      fontSize: "28px",
                      fontWeight: "700",
                      color: "#222222",
                      marginBottom: "8px",
                    }}
                    className="properties-title"
                  >
                    {searchQuery
                      ? `Search results for "${searchQuery}"`
                      : "Available Properties"}
                  </h2>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#717171",
                      margin: 0,
                    }}
                    className="properties-subtitle"
                  >
                    Find your perfect rental property
                  </p>
                </div>
                <button
                  onClick={() => setShowAllProperties(!showAllProperties)}
                  style={{
                    color: "#222222",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: "500",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f7f7f7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {showAllProperties ? "Show less" : "Show all"} →
                </button>
              </div>

              {/* Loading Skeleton */}
              {loading && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: "20px",
                    padding: "0 20px",
                  }}
                  className="properties-grid"
                >
                  {[...Array(12)].map((_, index) => (
                    <div
                      key={index}
                      style={{
                        borderRadius: "16px",
                        height: "160px",
                        backgroundColor: "#f8f9fa",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                        border: "1px solid #f0f0f0",
                      }}
                      className="property-skeleton"
                    >
                      <div
                        style={{
                          height: "60%",
                          backgroundColor: "#e9ecef",
                          borderRadius: "16px 16px 0 0",
                        }}
                      />
                      <div
                        style={{
                          padding: "12px",
                        }}
                        className="property-skeleton-content"
                      >
                        <div
                          style={{
                            height: "12px",
                            backgroundColor: "#e9ecef",
                            marginBottom: "8px",
                            borderRadius: "6px",
                          }}
                          className="property-skeleton-line"
                        />
                        <div
                          style={{
                            height: "10px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "6px",
                          }}
                          className="property-skeleton-line-small"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Properties Found */}
              {!loading && filteredProperties.length === 0 && (
                <div
                  style={{
                    padding: "80px 0",
                    textAlign: "center",
                  }}
                  className="no-properties"
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#222222",
                      marginBottom: "8px",
                    }}
                    className="no-properties-title"
                  >
                    No properties found
                  </h3>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#717171",
                      margin: 0,
                    }}
                    className="no-properties-text"
                  >
                    Try adjusting your search criteria
                  </p>
                </div>
              )}

              {/* Properties Grid */}
              {!loading && filteredProperties.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: "20px",
                    padding: "0 20px",
                  }}
                  className="properties-grid"
                >
                  {displayedProperties.map((property) => {
                    console.log("Property data:", property);
                    return (
                      <Link
                        key={property.id}
                        href={`/listing_details_01/${property.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div
                          style={{
                            borderRadius: "16px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                            border: "1px solid #f0f0f0",
                            transition:
                              "transform 0.2s ease, box-shadow 0.2s ease",
                            cursor: "pointer",
                            backgroundColor: "#ffffff",
                            overflow: "hidden",
                          }}
                          className="property-card"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 1px 2px rgba(0,0,0,0.08)";
                          }}
                        >
                          {/* Property Image */}
                          <div
                            className="property-image-container"
                            style={{
                              position: "relative",
                              height: "100px",
                            }}
                          >
                            <img
                              src={
                                property.image
                                  ? `https://cpanel.roomfinder237.com/${property.image}`
                                  : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=="
                              }
                              alt={property.title || "Property image"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
                              }}
                            />

                            {/* Favorite Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleFavorite(property.id);
                              }}
                              disabled={favLoading[property.id]}
                              className="favorite-button"
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                backgroundColor: "rgba(255,255,255,0.9)",
                                border: "none",
                                borderRadius: "50%",
                                width: "28px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: favorites[property.id]
                                  ? "#007bff"
                                  : "#222222",
                                backdropFilter: "blur(4px)",
                              }}
                            >
                              <i
                                className={`fas fa-heart ${
                                  favorites[property.id] ? "fas" : "far"
                                }`}
                                style={{ fontSize: "12px" }}
                              ></i>
                            </button>

                            {/* Guest Favorite Badge */}
                            <div
                              className="guest-favorite-badge rounded-pill"
                              style={{
                                position: "absolute",
                                top: "8px",
                                left: "8px",
                                backgroundColor: "rgba(0,0,0,0.7)",
                                color: "#ffffff",
                                padding: "3px 6px",
                                borderRadius: "20px",
                                fontSize: "9px",
                                fontWeight: "500",
                                backdropFilter: "blur(4px)",
                              }}
                            >
                              Guest favorite
                            </div>
                          </div>

                          {/* Property Details */}
                          <div
                            className="property-details"
                            style={{
                              padding: "8px",
                              backgroundColor: "#ffffff",
                              minHeight: "60px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "4px",
                              }}
                            >
                              <h3
                                className="property-title"
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: "#222222",
                                  margin: 0,
                                  flex: 1,
                                  lineHeight: "1.2",
                                }}
                              >
                                {property.title || "Property Title"}
                              </h3>
                            </div>

                            {/* Property Features */}
                            <div
                              className="property-features"
                              style={{
                                display: "flex",
                                gap: "4px",
                                marginBottom: "6px",
                                fontSize: "11px",
                                color: "#717171",
                              }}
                            >
                              {property.beds && (
                                <span>{property.beds} beds</span>
                              )}
                              {property.bathroom && (
                                <span>• {property.bathroom} baths</span>
                              )}
                              {property.sqrft && property.sqrft !== "0" && (
                                <span>• {property.sqrft} sq ft</span>
                              )}
                            </div>

                            {/* Price and Rating */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <span
                                  className="property-price"
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#222222",
                                  }}
                                >
                                  {Number(property.price || 0).toLocaleString()}{" "}
                                  XAF
                                </span>
                                <span
                                  className="property-unit"
                                  style={{
                                    fontSize: "11px",
                                    color: "#717171",
                                    marginLeft: "3px",
                                  }}
                                >
                                  /
                                  {String(property.buyorrent) === "1"
                                    ? "month"
                                    : "total"}
                                </span>
                              </div>

                              {property.rate && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "2px",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#222222",
                                      fontSize: "11px",
                                    }}
                                  >
                                    ★
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {property.rate}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* How It Works Section */}
          <div
            className="how-it-works-section"
            style={{
              width: "100%",
              padding: "80px 0",
              backgroundColor: "#f8f9fa",
            }}
          >
            <div
              className="how-it-works-container"
              style={{
                width: "100%",
                maxWidth: "100%",
                padding: "0 80px",
              }}
            >
              {/* Section Header */}
              <div
                className="how-it-works-header"
                style={{
                  textAlign: "center",
                  marginBottom: "80px",
                }}
              >
                <h2
                  className="how-it-works-title"
                  style={{
                    fontSize: "32px",
                    fontWeight: "600",
                    color: "#222222",
                    marginBottom: "16px",
                  }}
                >
                  How It Works
                </h2>
                <p
                  className="how-it-works-subtitle"
                  style={{
                    fontSize: "16px",
                    color: "#717171",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Book your perfect rental in just 4 simple steps
                </p>
              </div>

              {/* Timeline Container */}
              <div
                className="timeline-container"
                style={{
                  position: "relative",
                  maxWidth: "1000px",
                  margin: "0 auto",
                  padding: "0 20px",
                }}
              >
                {/* Timeline Line */}
                <div
                  className="timeline-line"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "0",
                    bottom: "0",
                    width: "3px",
                    backgroundColor: "#e9ecef",
                    transform: "translateX(-50%)",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(to bottom, #007bff, #0056b3)",
                      animation: "timeline 4s ease-in-out infinite",
                    }}
                  ></div>
                </div>

                {/* Steps */}
                <div className="timeline-steps">
                  {[
                    {
                      step: "01",
                      title: "Search Properties",
                      description:
                        "Browse through thousands of verified properties using our advanced filters and find your perfect match",
                      icon: (
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                        >
                          <circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="#007bff"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <circle
                            cx="16"
                            cy="16"
                            r="6"
                            stroke="#ffffff"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            d="M22 22L30 30"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ),
                      color: "#e3f2fd",
                      gradient:
                        "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                    },
                    {
                      step: "02",
                      title: "Book by Paying",
                      description:
                        "Secure your rental instantly by making a payment through our safe and transparent platform",
                      icon: (
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                        >
                          <rect
                            x="6"
                            y="10"
                            width="28"
                            height="20"
                            rx="3"
                            fill="#4CAF50"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <rect
                            x="10"
                            y="14"
                            width="20"
                            height="1.5"
                            fill="#ffffff"
                          />
                          <rect
                            x="10"
                            y="17"
                            width="14"
                            height="1.5"
                            fill="#ffffff"
                          />
                          <rect
                            x="10"
                            y="20"
                            width="18"
                            height="1.5"
                            fill="#ffffff"
                          />
                          <rect
                            x="10"
                            y="23"
                            width="10"
                            height="1.5"
                            fill="#ffffff"
                          />
                          <circle cx="30" cy="13" r="1.5" fill="#ffffff">
                            <animate
                              attributeName="opacity"
                              values="1;0.5;1"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </svg>
                      ),
                      color: "#e8f5e8",
                      gradient:
                        "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                    },
                    {
                      step: "03",
                      title: "Contact Owner",
                      description:
                        "Connect directly with the property owner through our secure messaging system",
                      icon: (
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                        >
                          <circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="#FF9800"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <path
                            d="M14 16C14 13.79 15.79 12 18 12H22C24.21 12 26 13.79 26 16V24C26 26.21 24.21 28 22 28H18C15.79 28 14 26.21 14 24V16Z"
                            fill="#ffffff"
                          />
                          <path
                            d="M20 30V34"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <animate
                              attributeName="stroke-dasharray"
                              values="0,8;8,0"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </path>
                        </svg>
                      ),
                      color: "#fff3e0",
                      gradient:
                        "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                    },
                    {
                      step: "04",
                      title: "Schedule Viewing",
                      description:
                        "Arrange a convenient time to visit and inspect your booked property",
                      icon: (
                        <svg
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                        >
                          <circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="#9C27B0"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <rect
                            x="14"
                            y="14"
                            width="12"
                            height="12"
                            rx="1.5"
                            fill="#ffffff"
                          />
                          <path
                            d="M14 18H26"
                            stroke="#9C27B0"
                            strokeWidth="1"
                          />
                          <path
                            d="M16 22H24"
                            stroke="#9C27B0"
                            strokeWidth="1"
                          />
                          <path
                            d="M16 26H22"
                            stroke="#9C27B0"
                            strokeWidth="1"
                          />
                          <circle cx="16" cy="18" r="0.8" fill="#9C27B0" />
                          <circle cx="20" cy="18" r="0.8" fill="#9C27B0" />
                          <circle cx="24" cy="18" r="0.8" fill="#9C27B0" />
                        </svg>
                      ),
                      color: "#f3e5f5",
                      gradient:
                        "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                    },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="timeline-step"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "60px",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      {/* Desktop: Left Side (even steps) */}
                      <div
                        className="timeline-empty-side"
                        style={{ flex: 1, paddingRight: "60px" }}
                      >
                        {index % 2 === 0 && (
                          <div
                            className="step-card"
                            style={{
                              backgroundColor: "#ffffff",
                              borderRadius: "16px",
                              padding: "32px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                              border: "1px solid #e9ecef",
                              position: "relative",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-8px)";
                              e.currentTarget.style.boxShadow =
                                "0 12px 40px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 20px rgba(0,0,0,0.08)";
                            }}
                          >
                            {/* Background Pattern */}
                            <div
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                                width: "100px",
                                height: "100px",
                                background: step.gradient,
                                borderRadius: "0 16px 0 100px",
                                opacity: 0.1,
                              }}
                            ></div>

                            <div
                              className="step-content"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "20px",
                                marginBottom: "20px",
                              }}
                            >
                              <div
                                className="step-icon-container"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "12px",
                                  background: step.gradient,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {step.icon}
                              </div>
                              <div>
                                <div
                                  className="step-badge"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backgroundColor: "#f8f9fa",
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#007bff",
                                    marginBottom: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "8px",
                                      height: "8px",
                                      backgroundColor: "#007bff",
                                      borderRadius: "50%",
                                    }}
                                  ></div>
                                  Step {step.step}
                                </div>
                                <h3
                                  className="step-title"
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#222222",
                                    margin: "0",
                                  }}
                                >
                                  {step.title}
                                </h3>
                              </div>
                            </div>

                            <p
                              className="step-description"
                              style={{
                                fontSize: "16px",
                                color: "#6c757d",
                                lineHeight: "1.6",
                                margin: "0",
                              }}
                            >
                              {step.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Timeline Dot */}
                      <div
                        className="timeline-dot"
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#007bff",
                          borderRadius: "50%",
                          border: "4px solid #ffffff",
                          boxShadow: "0 2px 8px rgba(0,123,255,0.3)",
                          zIndex: 3,
                        }}
                      ></div>

                      {/* Desktop: Right Side (odd steps) */}
                      <div
                        className="timeline-empty-side"
                        style={{ flex: 1, paddingLeft: "60px" }}
                      >
                        {index % 2 === 1 && (
                          <div
                            className="step-card"
                            style={{
                              backgroundColor: "#ffffff",
                              borderRadius: "16px",
                              padding: "32px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                              border: "1px solid #e9ecef",
                              position: "relative",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform =
                                "translateY(-8px)";
                              e.currentTarget.style.boxShadow =
                                "0 12px 40px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 20px rgba(0,0,0,0.08)";
                            }}
                          >
                            {/* Background Pattern */}
                            <div
                              style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                width: "100px",
                                height: "100px",
                                background: step.gradient,
                                borderRadius: "0 0 100px 0",
                                opacity: 0.1,
                              }}
                            ></div>

                            <div
                              className="step-content"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "20px",
                                marginBottom: "20px",
                              }}
                            >
                              <div
                                className="step-icon-container"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "12px",
                                  background: step.gradient,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {step.icon}
                              </div>
                              <div>
                                <div
                                  className="step-badge"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backgroundColor: "#f8f9fa",
                                    padding: "6px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#007bff",
                                    marginBottom: "8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "8px",
                                      height: "8px",
                                      backgroundColor: "#007bff",
                                      borderRadius: "50%",
                                    }}
                                  ></div>
                                  Step {step.step}
                                </div>
                                <h3
                                  className="step-title"
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#222222",
                                    margin: "0",
                                  }}
                                >
                                  {step.title}
                                </h3>
                              </div>
                            </div>

                            <p
                              className="step-description"
                              style={{
                                fontSize: "16px",
                                color: "#6c757d",
                                lineHeight: "1.6",
                                margin: "0",
                              }}
                            >
                              {step.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Mobile: Always render the step card */}
                      <div
                        className="step-card-mobile"
                        style={{
                          display: "none",
                          backgroundColor: "#ffffff",
                          borderRadius: "16px",
                          padding: "32px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          border: "1px solid #e9ecef",
                          position: "relative",
                          transition: "all 0.3s ease",
                          width: "100%",
                          maxWidth: "320px",
                          margin: "0 auto",
                        }}
                      >
                        {/* Background Pattern */}
                        <div
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            width: "100px",
                            height: "100px",
                            background: step.gradient,
                            borderRadius: "0 16px 0 100px",
                            opacity: 0.1,
                          }}
                        ></div>

                        <div
                          className="step-content"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            marginBottom: "20px",
                          }}
                        >
                          <div
                            className="step-icon-container"
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "12px",
                              background: step.gradient,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {step.icon}
                          </div>
                          <div>
                            <div
                              className="step-badge"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                backgroundColor: "#f8f9fa",
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: "#007bff",
                                marginBottom: "8px",
                              }}
                            >
                              <div
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  backgroundColor: "#007bff",
                                  borderRadius: "50%",
                                }}
                              ></div>
                              Step {step.step}
                            </div>
                            <h3
                              className="step-title"
                              style={{
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#222222",
                                margin: "0",
                              }}
                            >
                              {step.title}
                            </h3>
                          </div>
                        </div>

                        <p
                          className="step-description"
                          style={{
                            fontSize: "16px",
                            color: "#6c757d",
                            lineHeight: "1.6",
                            margin: "0",
                          }}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Animation Keyframes */}
              <style>{`
                @keyframes timeline {
                  0% { opacity: 0.3; }
                  50% { opacity: 1; }
                  100% { opacity: 0.3; }
                }
              `}</style>
            </div>
          </div>

          {/* Why Choose RoomFinder Section */}
          <div
            className="why-choose-section"
            style={{
              width: "100%",
              padding: "80px 0",
              backgroundColor: "#ffffff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background Pattern */}
            <div
              className="why-choose-background"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
                zIndex: 0,
              }}
            ></div>

            <div
              className="why-choose-container"
              style={{
                width: "100%",
                maxWidth: "100%",
                padding: "0 80px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Section Header */}
              <div
                className="why-choose-header"
                style={{
                  textAlign: "center",
                  marginBottom: "80px",
                }}
              >
                <div
                  className="why-choose-badge"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    backgroundColor: "#e3f2fd",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    marginBottom: "24px",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10 2L12.09 7.26L18 8L13 12.14L14.18 18.02L10 15.77L5.82 18.02L7 12.14L2 8L7.91 7.26L10 2Z"
                      fill="#007bff"
                    />
                  </svg>
                  <span
                    className="why-choose-badge-text"
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#007bff",
                    }}
                  >
                    Trusted Platform
                  </span>
                </div>

                <h2
                  className="why-choose-title"
                  style={{
                    fontSize: "40px",
                    fontWeight: "700",
                    color: "#222222",
                    marginBottom: "20px",
                    lineHeight: "1.2",
                  }}
                >
                  Why Choose RoomFinder
                </h2>
                <p
                  className="why-choose-subtitle"
                  style={{
                    fontSize: "18px",
                    color: "#717171",
                    maxWidth: "600px",
                    margin: "0 auto",
                    lineHeight: "1.6",
                  }}
                >
                  We make finding your perfect rental simple, secure, and
                  stress-free with cutting-edge technology
                </p>
              </div>

              {/* Features Grid */}
              <div
                className="why-choose-features-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "32px",
                  padding: "0 20px",
                }}
              >
                {[
                  {
                    title: "Verified Properties",
                    description:
                      "Every listing undergoes thorough verification to ensure quality, authenticity, and accurate information",
                    icon: (
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="verifiedGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: "#4CAF50", stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: "#45a049", stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          fill="url(#verifiedGradient)"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <path
                          d="M14 24L20 30L34 16"
                          stroke="#ffffff"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <animate
                            attributeName="stroke-dasharray"
                            values="0,50;50,0"
                            dur="1s"
                            begin="0.5s"
                            fill="freeze"
                          />
                          <animate
                            attributeName="stroke-dashoffset"
                            values="0;-50"
                            dur="1s"
                            begin="0.5s"
                            fill="freeze"
                          />
                        </path>
                      </svg>
                    ),
                    color: "#e8f5e8",
                    gradient:
                      "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
                  },
                  {
                    title: "Secure Payments",
                    description:
                      "Bank-grade security with multiple payment options and transparent transaction processing",
                    icon: (
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="secureGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: "#2196F3", stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: "#1976D2", stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        <rect
                          x="8"
                          y="16"
                          width="32"
                          height="20"
                          rx="2"
                          fill="url(#secureGradient)"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <rect
                          x="12"
                          y="20"
                          width="24"
                          height="2"
                          fill="#ffffff"
                        />
                        <rect
                          x="12"
                          y="24"
                          width="16"
                          height="2"
                          fill="#ffffff"
                        />
                        <rect
                          x="12"
                          y="28"
                          width="20"
                          height="2"
                          fill="#ffffff"
                        />
                        <circle cx="36" cy="20" r="2" fill="#ffffff">
                          <animate
                            attributeName="opacity"
                            values="1;0.5;1"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </svg>
                    ),
                    color: "#e3f2fd",
                    gradient:
                      "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                  },
                  {
                    title: "24/7 Support",
                    description:
                      "Round-the-clock customer support with real-time assistance and dedicated help channels",
                    icon: (
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="supportGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: "#FF9800", stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: "#F57C00", stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          fill="url(#supportGradient)"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <path
                          d="M16 20C16 17.79 17.79 16 20 16H28C30.21 16 32 17.79 32 20V28C32 30.21 30.21 32 28 32H20C17.79 32 16 30.21 16 28V20Z"
                          fill="#ffffff"
                        />
                        <path
                          d="M24 36V40"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <animate
                            attributeName="stroke-dasharray"
                            values="0,10;10,0"
                            dur="1.5s"
                            repeatCount="indefinite"
                          />
                        </path>
                      </svg>
                    ),
                    color: "#fff3e0",
                    gradient:
                      "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                  },
                  {
                    title: "No Hidden Fees",
                    description:
                      "Complete transparency with upfront pricing and no surprise charges or hidden commissions",
                    icon: (
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                      >
                        <defs>
                          <linearGradient
                            id="transparentGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              style={{ stopColor: "#9C27B0", stopOpacity: 1 }}
                            />
                            <stop
                              offset="100%"
                              style={{ stopColor: "#7B1FA2", stopOpacity: 1 }}
                            />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          fill="url(#transparentGradient)"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <path
                          d="M16 24C16 19.58 19.58 16 24 16C28.42 16 32 19.58 32 24C32 28.42 28.42 32 24 32C19.58 32 16 28.42 16 24Z"
                          fill="#ffffff"
                        />
                        <path
                          d="M24 20V28"
                          stroke="#9C27B0"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M20 24H28"
                          stroke="#9C27B0"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    ),
                    color: "#f3e5f5",
                    gradient:
                      "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="why-choose-feature-card"
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "20px",
                      padding: "40px 32px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      border: "1px solid #f0f0f0",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(0,0,0,0.08)";
                    }}
                  >
                    {/* Background Pattern */}
                    <div
                      className="feature-background-pattern"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "120px",
                        height: "120px",
                        background: feature.gradient,
                        borderRadius: "0 20px 0 120px",
                        opacity: 0.1,
                      }}
                    ></div>

                    {/* Icon */}
                    <div
                      className="feature-icon-container"
                      style={{
                        marginBottom: "24px",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {feature.icon}
                    </div>

                    {/* Content */}
                    <div
                      className="feature-content"
                      style={{ position: "relative", zIndex: 1 }}
                    >
                      <h3
                        className="feature-title"
                        style={{
                          fontSize: "22px",
                          fontWeight: "600",
                          color: "#222222",
                          margin: "0 0 16px 0",
                          lineHeight: "1.3",
                        }}
                      >
                        {feature.title}
                      </h3>

                      <p
                        className="feature-description"
                        style={{
                          fontSize: "16px",
                          color: "#6c757d",
                          lineHeight: "1.6",
                          margin: "0",
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>

                    {/* Decorative Element */}
                    <div
                      className="feature-decorative-element"
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "4px",
                        background: feature.gradient,
                        borderRadius: "0 0 20px 20px",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities Modal */}
          {showAmenitiesModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  padding: "24px",
                  maxWidth: "500px",
                  width: "90%",
                  maxHeight: "80vh",
                  overflow: "auto",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#222222",
                      margin: 0,
                    }}
                  >
                    Select Amenities
                  </h3>
                  <button
                    onClick={() => setShowAmenitiesModal(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "24px",
                      color: "#717171",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    ×
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {facilities.map((facility) => (
                    <label
                      key={facility.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px",
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: selectedAmenities.includes(
                          facility.id.toString()
                        )
                          ? "#f8f9fa"
                          : "#ffffff",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(
                          facility.id.toString()
                        )}
                        onChange={() =>
                          handleAmenityToggle(facility.id.toString())
                        }
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "#007bff",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#222222",
                          fontWeight: "500",
                        }}
                      >
                        {facility.title}
                      </span>
                    </label>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedAmenities([]);
                      setShowAmenitiesModal(false);
                    }}
                    style={{
                      padding: "12px 24px",
                      border: "1px solid #dddddd",
                      borderRadius: "8px",
                      backgroundColor: "transparent",
                      color: "#717171",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowAmenitiesModal(false)}
                    style={{
                      padding: "12px 24px",
                      border: "none",
                      borderRadius: "8px",
                      backgroundColor: "#007bff",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action Section */}
          <div
            className="cta-section"
            style={{
              width: "100%",
              padding: "100px 0",
              backgroundColor: "#ffffff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background Pattern */}
            <div
              className="cta-background-pattern"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background:
                  'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f8f9fa" fill-opacity="0.5"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
                opacity: 0.3,
              }}
            ></div>

            <div
              className="cta-container"
              style={{
                width: "100%",
                maxWidth: "100%",
                padding: "0 80px",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                className="cta-content-wrapper"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "60px",
                  maxWidth: "1200px",
                  margin: "0 auto",
                }}
              >
                {/* Content */}
                <div className="cta-content" style={{ flex: 1 }}>
                  <div
                    className="cta-badge"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#f8f9fa",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      marginBottom: "24px",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 2L9.5 5.5L13 6L10 8.5L10.5 12L8 10.5L5.5 12L6 8.5L3 6L6.5 5.5L8 2Z"
                        fill="#007bff"
                      />
                    </svg>
                    <span
                      className="cta-badge-text"
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#495057",
                      }}
                    >
                      Join thousands of users
                    </span>
                  </div>

                  <h2
                    className="cta-title"
                    style={{
                      fontSize: "48px",
                      fontWeight: "700",
                      color: "#212529",
                      marginBottom: "20px",
                      lineHeight: "1.2",
                    }}
                  >
                    Ready to Find Your Perfect Home?
                  </h2>

                  <p
                    className="cta-subtitle"
                    style={{
                      fontSize: "20px",
                      color: "#6c757d",
                      marginBottom: "40px",
                      lineHeight: "1.6",
                    }}
                  >
                    Sign up today and get access to thousands of verified
                    properties, secure payments, and 24/7 support. Start your
                    journey to finding the perfect rental.
                  </p>

                  {/* Features List */}
                  <div
                    className="cta-features-list"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      marginBottom: "40px",
                    }}
                  >
                    {[
                      "✓ Free account creation",
                      "✓ Access to verified properties",
                      "✓ Secure payment processing",
                      "✓ 24/7 customer support",
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="cta-feature-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          className="cta-feature-icon"
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="#007bff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span
                          className="cta-feature-text"
                          style={{
                            fontSize: "16px",
                            color: "#495057",
                            fontWeight: "500",
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div
                    className="cta-buttons"
                    style={{
                      display: "flex",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Link href="/register" style={{ textDecoration: "none" }}>
                      <button
                        className="cta-primary-button"
                        style={{
                          backgroundColor: "#007bff",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "40px",
                          padding: "16px 32px",
                          fontSize: "16px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 20px rgba(0,123,255,0.2)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 32px rgba(0,123,255,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 20px rgba(0,123,255,0.2)";
                        }}
                      >
                        Sign Up Now
                      </button>
                    </Link>

                    <Link
                      href="/about_us_01"
                      style={{ textDecoration: "none" }}
                    >
                      <button
                        className="cta-secondary-button"
                        style={{
                          backgroundColor: "transparent",
                          color: "#495057",
                          border: "2px solid #dee2e6",
                          borderRadius: "40px",
                          padding: "16px 32px",
                          fontSize: "16px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f8f9fa";
                          e.currentTarget.style.borderColor = "#adb5bd";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.borderColor = "#dee2e6";
                        }}
                      >
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Visual Element */}
                <div
                  className="cta-visual-element"
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="cta-animation-container"
                    style={{
                      position: "relative",
                      width: "300px",
                      height: "300px",
                    }}
                  >
                    {/* Main Circle */}
                    <div
                      className="cta-main-circle"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                        border: "2px solid #dee2e6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "pulse 3s ease-in-out infinite",
                      }}
                    >
                      <div
                        className="cta-inner-circle"
                        style={{
                          width: "80%",
                          height: "80%",
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                          border: "1px solid #dee2e6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="80"
                          height="80"
                          viewBox="0 0 80 80"
                          fill="none"
                        >
                          <path
                            d="M20 40C20 28.954 28.954 20 40 20C51.046 20 60 28.954 60 40C60 51.046 51.046 60 40 60C28.954 60 20 51.046 20 40Z"
                            fill="#e9ecef"
                          />
                          <path
                            d="M32 40C32 35.582 35.582 32 40 32C44.418 32 48 35.582 48 40C48 44.418 44.418 48 40 48C35.582 48 32 44.418 32 40Z"
                            fill="#dee2e6"
                          />
                          <path
                            d="M36 40C36 37.791 37.791 36 40 36C42.209 36 44 37.791 44 40C44 42.209 42.209 44 40 44C37.791 44 36 42.209 36 40Z"
                            fill="#adb5bd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div
                      className="cta-floating-element-1"
                      style={{
                        position: "absolute",
                        top: "20px",
                        right: "20px",
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "float 4s ease-in-out infinite",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2L13.09 7.26L18 8L13 12.14L14.18 18.02L12 15.77L9.82 18.02L11 12.14L6 8L10.91 7.26L12 2Z"
                          fill="#007bff"
                        />
                      </svg>
                    </div>

                    <div
                      className="cta-floating-element-2"
                      style={{
                        position: "absolute",
                        bottom: "30px",
                        left: "10px",
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "float 4s ease-in-out infinite reverse",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M8 2L9.5 5.5L13 6L10 8.5L10.5 12L8 10.5L5.5 12L6 8.5L3 6L6.5 5.5L8 2Z"
                          fill="#007bff"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Animation Keyframes */}
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <FooterFour />

      <BottomNavigation />
    </React.Fragment>
  );
};

export default BasicHomePage;
