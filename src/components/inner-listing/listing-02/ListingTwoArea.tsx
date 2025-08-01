"use client";
import Image from "next/image";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import NiceSelect from "@/ui/NiceSelect";
import Fancybox from "@/components/common/Fancybox";
import DropdownOne from "@/components/search-dropdown/inner-dropdown/DropdownOne";
import { useEffect, useState } from "react";

import icon from "@/assets/images/icon/icon_46.svg";

const API_URL =
  "https://cpanel.roomfinder237.com/user_api/u_cat_wise_property.php";

const ListingTwoArea = ({ style }: any) => {
  const itemsPerPage = 5;

  // State for API data
  const [properties, setProperties] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [itemOffset, setItemOffset] = useState(0);
  const [sortOption, setSortOption] = useState<string>("newest");
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

    const requestData = {
      uid: "0",
      cid: "0",
      country_id: "1",
    };

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

        const countryResponse = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_country.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        );
        const countryData = await countryResponse.json();
        console.log("Country API response:", countryData);
        if (
          countryData.Result === "true" &&
          Array.isArray(countryData.CountryData) &&
          countryData.CountryData.length > 0
        ) {
          setCountries(countryData.CountryData);
        } else {
          console.log("No country data available, removing location filter");
          setCountries([]);
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

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.city?.toLowerCase().includes(search.toLowerCase()) ||
          item.address?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status && status !== "0") {
      filtered = filtered.filter(
        (item) => String(item.property_type) === status
      );
    }

    if (location && location !== "0") {
      filtered = filtered.filter((item) =>
        item.city?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (selectedBedrooms && selectedBedrooms !== "0") {
      filtered = filtered.filter(
        (item) => String(item.beds) === selectedBedrooms
      );
    }

    if (selectedBathrooms && selectedBathrooms !== "0") {
      filtered = filtered.filter(
        (item) => String(item.bathroom) === selectedBathrooms
      );
    }

    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((item) => {
        return true; // Skip amenities filter for now
      });
    }

    filtered = filtered.filter((item) => {
      const price = Number(item.price) || 0;
      return price >= priceValue[0] && price <= priceValue[1];
    });

    let sorted = [...filtered];
    switch (sortOption) {
      case "newest":
        sorted = sorted.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "price_low":
        sorted = sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_high":
        sorted = sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        sorted = sorted.sort((a, b) => Number(b.rate) - Number(a.rate));
        break;
      case "name":
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
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

  const handleResetFilter = () => {
    resetFilters();
  };

  return (
    <div
      className={`property-listing-six ${
        style
          ? "pt-150 xl-pt-100 pb-170 xl-pb-120"
          : "bg-pink-two pt-110 md-pt-80 pb-150 xl-pb-120 mt-150 xl-mt-120"
      }`}
    >
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
                        { value: "newest", text: "Newest" },
                        { value: "best_seller", text: "Best Seller" },
                        { value: "best_match", text: "Best Match" },
                        { value: "price_low", text: "Price Low" },
                        { value: "price_high", text: "Price High" },
                      ]}
                      defaultCurrent={0}
                      onChange={handleTypeChange}
                      name=""
                      placeholder=""
                    />
                  </div>
                  <Link
                    href="/listing_01"
                    className="tran3s layout-change rounded-circle ms-auto ms-sm-3"
                    data-bs-toggle="tooltip"
                    title="Switch To Grid View"
                  >
                    <i className="fa-regular fa-grid-2"></i>
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">Loading properties...</div>
              ) : (
                currentItems.map((item: any) => (
                  <div
                    key={item.id}
                    className={`listing-card-seven border-20 p-20 mb-50 wow fadeInUp ${
                      style ? "grey-bg" : ""
                    }`}
                  >
                    <div className="d-flex flex-wrap layout-one">
                      <div
                        className="property-image-container position-relative z-1 border-20 overflow-hidden"
                        style={{
                          width: "326px",
                          height: "280px",
                          flex: "0 0 326px",
                          borderRadius: "20px",
                          overflow: "hidden",
                          background: "#f7f7f7",
                        }}
                      >
                        <Image
                          src={
                            item.image && item.image.trim() !== ""
                              ? item.image.startsWith("http")
                                ? item.image
                                : `https://cpanel.roomfinder237.com/${item.image}`
                              : "/assets/images/media/no_image.jpg"
                          }
                          alt={item.title || "Property image"}
                          fill
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            console.log(`Image failed to load: ${target.src}`);
                            target.src = "/assets/images/media/no_image.jpg";
                          }}
                          onLoad={() => {
                            console.log(
                              `Image loaded successfully: ${item.image}`
                            );
                          }}
                          unoptimized={true}
                        />
                        <div
                          className={
                            style
                              ? "tag bg-white rounded-0 text-dark fw-500"
                              : `border-20 tag`
                          }
                          style={{
                            position: "absolute",
                            top: "17px",
                            left: "17px",
                            zIndex: "2",
                          }}
                        >
                          {item.buyorrent || "For Rent"}
                        </div>
                      </div>
                      <div className="property-info">
                        <Link
                          href={`/listing_details_01/${item.id}`}
                          className="title tran3s mb-15"
                        >
                          {item.title}
                        </Link>
                        <div className="address">
                          {item.city || item.address}
                        </div>
                        <div className="feature mt-30 mb-30 pt-30 pb-5">
                          <ul className="style-none d-flex flex-wrap align-items-center justify-content-between">
                            <li>
                              <strong>{item.sqrft || "-"}</strong> sqft
                            </li>
                            <li>
                              <strong>{item.beds || "-"}</strong> bed
                            </li>
                            <li>
                              <strong>{item.bathroom || "-"}</strong> bath
                            </li>
                            <li>
                              <strong>{item.plimit || "-"}</strong> Guests
                            </li>
                          </ul>
                        </div>
                        <div className="pl-footer d-flex flex-wrap align-items-center justify-content-between">
                          <strong className="price fw-500 color-dark me-auto">
                            {item.price
                              ? `${Number(item.price).toLocaleString()} XAF`
                              : "-"}
                          </strong>

                          <ul className="style-none d-flex action-icons me-4">
                            <li>
                              <Link href="#">
                                <i className="fa-light fa-heart"></i>
                              </Link>
                            </li>
                            <li>
                              <Link href="#">
                                <i className="fa-light fa-bookmark"></i>
                              </Link>
                            </li>
                            <li>
                              <Link href="#">
                                <i className="fa-light fa-circle-plus"></i>
                              </Link>
                            </li>
                          </ul>
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
                ))
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
                  handleResetFilter={handleResetFilter}
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

export default ListingTwoArea;
