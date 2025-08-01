"use client";
import Image from "next/image";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import NiceSelect from "@/ui/NiceSelect";
import UseShortedProperty from "@/hooks/useShortedProperty";
import DropdownOne from "@/components/search-dropdown/inner-dropdown/DropdownOne";
import { useEffect, useState, useMemo } from "react";

import icon from "@/assets/images/icon/icon_46.svg";
import featureIcon_1 from "@/assets/images/icon/icon_04.svg";
import featureIcon_2 from "@/assets/images/icon/icon_05.svg";
import featureIcon_3 from "@/assets/images/icon/icon_06.svg";

const API_URL =
  "https://cpanel.roomfinder237.com/user_api/u_cat_wise_property.php";

const ListingOneArea = () => {
  const itemsPerPage = 8;
  // Filters
  const [properties, setProperties] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [sortOption, setSortOption] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string | null>(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState<string | null>(
    null
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [priceValue, setPriceValue] = useState<[number, number]>([
    0, 100000000,
  ]);
  const [loading, setLoading] = useState(true);

  // Filter options from API
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);

  // Fetch properties from backend
  useEffect(() => {
    setLoading(true);

    // Ensure required parameters are not empty
    const requestData = {
      uid: "0", // Default user ID for public access
      cid: "0", // 0 = all categories, or specific category ID
      country_id: "1", // Cameroon country ID
    };

    // Validate that all required parameters are present
    if (!requestData.uid || !requestData.cid || !requestData.country_id) {
      console.error("Missing required parameters for property search");
      setProperties([]);
      setLoading(false);
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })
      .then((res) => res.json())
      .then((data) => {
        // API_RESPONSE_REFERENCE: data.Result, data.ResponseMsg, data.Property_cat (array)
        if (data.Result === "true" && Array.isArray(data.Property_cat)) {
          setProperties(data.Property_cat);
        } else {
          console.log("API Response:", data);
          setProperties([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setProperties([]);
        setLoading(false);
      });
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

        setFilterOptionsLoading(false);
      } catch (error) {
        console.error("Error fetching filter options:", error);
        setFilterOptionsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.city?.toLowerCase().includes(search.toLowerCase()) ||
          item.address?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Property type filter (status field)
    if (status && status !== "0") {
      filtered = filtered.filter(
        (item) => String(item.property_type) === status
      );
    }

    // Location filter
    if (location && location !== "0") {
      filtered = filtered.filter((item) =>
        item.city?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Bedrooms filter
    if (selectedBedrooms && selectedBedrooms !== "0") {
      filtered = filtered.filter(
        (item) => String(item.beds) === selectedBedrooms
      );
    }

    // Bathrooms filter
    if (selectedBathrooms && selectedBathrooms !== "0") {
      filtered = filtered.filter(
        (item) => String(item.bathroom) === selectedBathrooms
      );
    }

    // Amenities filter (if available in API response)
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((item) => {
        // Note: API response doesn't include amenities, so this filter won't work
        // until the API provides facility data
        return true; // Skip amenities filter for now
      });
    }

    // Price filter
    filtered = filtered.filter((item) => {
      const price = Number(item.price) || 0;
      return price >= priceValue[0] && price <= priceValue[1];
    });

    // Sorting
    let sorted = [...filtered];
    switch (sortOption) {
      case "newest":
        // Sort by ID (assuming higher ID = newer)
        sorted = sorted.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "price_low":
        sorted = sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_high":
        sorted = sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        // Sort by rating (if available)
        sorted = sorted.sort((a, b) => Number(b.rate) - Number(a.rate));
        break;
      case "name":
        // Sort alphabetically by title
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Default: newest first
        sorted = sorted.sort((a, b) => Number(b.id) - Number(a.id));
        break;
    }

    setFiltered(sorted);
    setItemOffset(0);
  }, [
    properties,
    search,
    status,
    location,
    selectedBedrooms,
    selectedBathrooms,
    selectedAmenities,
    priceValue,
    sortOption,
  ]);

  // Pagination
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filtered.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const handlePageClick = (event: any) => {
    const newOffset = event.selected * itemsPerPage;
    setItemOffset(newOffset);
  };

  // Handlers
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSortOption(event.target.value);
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setStatus(event.target.value);
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setLocation(event.target.value);
  const handleBedroomChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedBedrooms(event.target.value);
  const handleBathroomChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedBathrooms(event.target.value);
  const handleAmenityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amenity = event.target.value;
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);
  const handlePriceChange = (val: [number, number]) => setPriceValue(val);
  const resetFilters = () => {
    setSortOption("newest");
    setStatus(null);
    setLocation(null);
    setSelectedBedrooms(null);
    setSelectedBathrooms(null);
    setSelectedAmenities([]);
    setPriceValue([0, 100000000]);
    setSearch("");
  };

  // Map API property to UI structure
  const mapCarouselThumb = (gallery: any[] = [], mainImg: string = "") => {
    const thumbs = [];
    if (mainImg && mainImg.trim() !== "") {
      thumbs.push({ img: mainImg, active: "active" });
    }
    if (Array.isArray(gallery)) {
      gallery.forEach((img: any) => {
        if (
          img &&
          typeof img === "string" &&
          img.trim() !== "" &&
          img !== mainImg
        )
          thumbs.push({ img });
      });
    }
    return thumbs.length > 0
      ? thumbs
      : [{ img: "/assets/images/media/no_image.jpg", active: "active" }];
  };

  return (
    <div className="property-listing-six bg-white pt-110 md-pt-80 pb-150 xl-pb-120 mt-150 xl-mt-120">
      <div className="container container-large">
        <div className="row">
          <div className="col-lg-8">
            <div className="ps-xxl-5">
              <div className="listing-header-filter d-sm-flex justify-content-between align-items-center mb-40 lg-mb-30">
                <div>
                  Showing{" "}
                  <span className="color-dark fw-500">
                    {itemOffset + 1}–{itemOffset + currentItems.length}
                  </span>{" "}
                  of{" "}
                  <span className="color-dark fw-500">{filtered.length}</span>{" "}
                  results
                </div>
                <div className="d-flex align-items-center xs-mt-20">
                  <div className="short-filter d-flex align-items-center">
                    <div className="fs-16 me-2">Short by:</div>
                    <NiceSelect
                      className="nice-select"
                      options={[
                        { value: "newest", text: "Newest First" },
                        { value: "price_low", text: "Price: Low to High" },
                        { value: "price_high", text: "Price: High to Low" },
                        { value: "rating", text: "Highest Rated" },
                        { value: "name", text: "Name A-Z" },
                      ]}
                      defaultCurrent={0}
                      onChange={handleTypeChange}
                      name=""
                      placeholder=""
                    />
                  </div>
                  <Link
                    href="/listing_02"
                    className="tran3s layout-change rounded-circle ms-auto ms-sm-3"
                    data-bs-toggle="tooltip"
                    title="Switch To List View"
                  >
                    <i className="fa-regular fa-bars"></i>
                  </Link>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-5">Loading properties...</div>
              ) : (
                <div className="row gx-xxl-5">
                  {currentItems.map((item: any) => {
                    return (
                      <div
                        key={item.id}
                        className="col-md-6 d-flex mb-50 wow fadeInUp"
                        data-wow-delay={item.data_delay_time}
                      >
                        <div className="listing-card-one border-25 h-100 w-100">
                          <div className="img-gallery p-15">
                            <div className="position-relative border-25 overflow-hidden">
                              <div className={`tag border-25 ${item.tag_bg}`}>
                                {item.tag || item.status}
                              </div>
                              <Link href="#" className="fav-btn tran3s">
                                <i className="fa-light fa-heart"></i>
                              </Link>
                              <Link
                                href={`/listing_details_01/${item.id}`}
                                className="d-block"
                              >
                                <img
                                  src={
                                    item.image && item.image.trim() !== ""
                                      ? item.image.startsWith("http")
                                        ? item.image
                                        : `https://cpanel.roomfinder237.com/${item.image}`
                                      : "/assets/images/media/no_image.jpg"
                                  }
                                  className="w-100"
                                  alt={item.title || "Property image"}
                                  style={{
                                    height: "350px",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                  }}
                                  onError={(e) => {
                                    const t = e.target as HTMLImageElement;
                                    t.src = "/assets/images/media/no_image.jpg";
                                  }}
                                />
                              </Link>
                            </div>
                          </div>
                          <div className="property-info p-25">
                            <Link
                              href={`/listing_details_01/${item.id}`}
                              className="title tran3s"
                            >
                              {item.title}
                            </Link>
                            <div className="address">{item.address}</div>
                            <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between">
                              <li className="d-flex align-items-center">
                                <Image
                                  src={featureIcon_1}
                                  alt=""
                                  className="lazy-img icon me-2"
                                />
                                <span className="fs-16">
                                  {item.sqrft || item.sqft || "-"} sqft
                                </span>
                              </li>
                              <li className="d-flex align-items-center">
                                <Image
                                  src={featureIcon_2}
                                  alt=""
                                  className="lazy-img icon me-2"
                                />
                                <span className="fs-16">
                                  {item.beds || "-"} bed
                                </span>
                              </li>
                              <li className="d-flex align-items-center">
                                <Image
                                  src={featureIcon_3}
                                  alt=""
                                  className="lazy-img icon me-2"
                                />
                                <span className="fs-16">
                                  {item.bathroom || "-"} bath
                                </span>
                              </li>
                            </ul>
                            <div className="pl-footer top-border d-flex align-items-center justify-content-between">
                              <strong className="price fw-500 color-dark">
                                {item.price
                                  ? `${Number(item.price).toLocaleString()} XAF`
                                  : "-"}
                              </strong>
                              <Link
                                href={`/listing_details_01/${item.id}`}
                                className="btn-four rounded-circle"
                              >
                                <i className="bi bi-arrow-up-right"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <ReactPaginate
                breakLabel="..."
                nextLabel={<Image src={icon} alt="" className="ms-2" />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={pageCount}
                pageCount={pageCount}
                previousLabel={<Image src={icon} alt="" className="ms-2" />}
                renderOnZeroPageCount={null}
                className="pagination-one d-flex align-items-center justify-content-center justify-content-sm-start style-none pt-30"
              />
            </div>
          </div>
          <div className="col-lg-4 order-lg-first">
            <div className="advance-search-panel dot-bg md-mt-80">
              <div className="main-bg">
                <DropdownOne
                  handleSearchChange={handleSearchChange}
                  handleBedroomChange={handleBedroomChange}
                  handleBathroomChange={handleBathroomChange}
                  handlePriceChange={handlePriceChange}
                  maxPrice={priceValue[1]}
                  priceValue={priceValue}
                  handleResetFilter={resetFilters}
                  selectedAmenities={selectedAmenities}
                  handleAmenityChange={handleAmenityChange}
                  handleLocationChange={handleLocationChange}
                  handleStatusChange={handleStatusChange}
                  propertyTypes={propertyTypes}
                  facilities={facilities}
                  countries={countries}
                  filterOptionsLoading={filterOptionsLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingOneArea;
