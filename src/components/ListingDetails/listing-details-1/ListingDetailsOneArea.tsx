"use client";
import NiceSelect from "@/ui/NiceSelect";
import MediaGallery from "./MediaGallery";
import Review from "@/components/inner-pages/agency/agency-details/Review";
import Sidebar from "./Sidebar";
import CommonBanner from "../listing-details-common/CommonBanner";
import CommonPropertyOverview from "../listing-details-common/CommonPropertyOverview";
import CommonPropertyFeatureList from "../listing-details-common/CommonPropertyFeatureList";
import CommonAmenities from "../listing-details-common/CommonAmenities";
import CommonPropertyVideoTour from "../listing-details-common/CommonPropertyVideoTour";
import CommonPropertyFloorPlan from "../listing-details-common/CommonPropertyFloorPlan";
import CommonNearbyList from "../listing-details-common/CommonNearbyList";
import CommonSimilarProperty from "../listing-details-common/CommonSimilarProperty";
import CommonProPertyScore from "../listing-details-common/CommonProPertyScore";
import CommonLocation from "../listing-details-common/CommonLocation";
import CommonReviewForm from "../listing-details-common/CommonReviewForm";
import BookingSection from "./BookingSection";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ListingDetailsOneAreaProps {
  propertyData: any;
}

const ListingDetailsOneArea = ({
  propertyData,
}: ListingDetailsOneAreaProps) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Add null checks to prevent runtime errors during static generation
  if (!propertyData) {
    return (
      <div className="listing-details-one theme-details-one bg-white pt-180 lg-pt-150 pb-150 xl-pb-120">
        <div className="container">
          <div className="text-center">
            <h3>Loading property details...</h3>
          </div>
        </div>
      </div>
    );
  }

  const { propetydetails, facility, gallery, reviewlist, total_review } =
    propertyData || {};

  // Add null check for propetydetails
  if (!propetydetails) {
    return (
      <div className="listing-details-one theme-details-one bg-white pt-180 lg-pt-150 pb-150 xl-pb-120">
        <div className="container">
          <div className="text-center">
            <h3>Property not found</h3>
          </div>
        </div>
      </div>
    );
  }

  const selectHandler = (e: any) => {};

  // Combine main image and gallery
  let galleryImages = Array.isArray(gallery) ? [...gallery] : [];
  const mainImage = propetydetails.image?.[0]?.image;
  if (mainImage && (!galleryImages.length || galleryImages[0] !== mainImage)) {
    galleryImages = [mainImage, ...galleryImages];
  }

  // Calculate rating
  const rating = propetydetails.rate || 0;
  const reviewCount = total_review || 0;
  const price = Number(propetydetails.price) || 0;

  return (
    <div className="listing-details-one theme-details-one bg-white pt-180 lg-pt-150 pb-150 xl-pb-120">
      {/* Desktop Layout */}
      <div
        className="desktop-layout"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 40px",
          display: "flex",
          gap: "60px",
        }}
      >
        {/* Left Column - Main Content */}
        <div style={{ flex: "0.75", maxWidth: "calc(75% - 300px)" }}>
          {/* Breadcrumb Navigation */}
          <div style={{ marginBottom: "24px" }}>
            <nav aria-label="breadcrumb">
              <ol
                style={{
                  display: "flex",
                  alignItems: "center",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "14px",
                  color: "#717171",
                }}
              >
                <li style={{ marginRight: "8px" }}>
                  <Link
                    href="/"
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <i
                      className="fas fa-home"
                      style={{ marginRight: "4px", fontSize: "12px" }}
                    ></i>
                    Home
                  </Link>
                </li>
                <li style={{ marginRight: "8px", color: "#717171" }}>
                  <i
                    className="fas fa-chevron-right"
                    style={{ fontSize: "10px" }}
                  ></i>
                </li>
                <li style={{ color: "#222222" }}>{propetydetails.title}</li>
              </ol>
            </nav>
          </div>

          {/* Property Header */}
          <div style={{ marginBottom: "40px" }}>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#222222",
                marginBottom: "12px",
                lineHeight: "1.2",
              }}
            >
              {propetydetails.title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <span style={{ color: "#717171", fontSize: "16px" }}>
                {propetydetails.city || "Location not specified"}
              </span>
              <span style={{ color: "#717171" }}>•</span>
              <span style={{ color: "#717171", fontSize: "16px" }}>
                {propetydetails.beds || 0} beds • {propetydetails.bathroom || 0}{" "}
                baths
              </span>
            </div>

            {/* Rating and Reviews */}
            {rating > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span style={{ color: "#222222", fontSize: "16px" }}>★</span>
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>
                    {rating}
                  </span>
                </div>
                <span style={{ color: "#717171" }}>•</span>
                <span
                  style={{
                    color: "#717171",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  {reviewCount} reviews
                </span>
              </div>
            )}
          </div>

          {/* Image Gallery */}
          <div style={{ marginBottom: "48px" }}>
            <MediaGallery gallery={galleryImages} />
          </div>

          {/* Property Overview */}
          <div style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#222222",
                marginBottom: "24px",
              }}
            >
              About this place
            </h2>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#495057",
                marginBottom: "24px",
              }}
            >
              {propetydetails.description || "No description available."}
            </p>
          </div>

          {/* Property Features */}
          <div style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#222222",
                marginBottom: "24px",
              }}
            >
              Property Overview
            </h2>
            <CommonPropertyOverview propetydetails={propetydetails} />
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: "48px" }}>
            <CommonAmenities facility={facility} />
          </div>

          {/* Reviews */}
          <div style={{ marginBottom: "48px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "600",
                  color: "#222222",
                }}
              >
                Reviews
              </h2>
              <NiceSelect
                className="nice-select"
                options={[
                  { value: "01", text: "Newest" },
                  { value: "02", text: "Best Seller" },
                  { value: "03", text: "Best Match" },
                ]}
                defaultCurrent={0}
                onChange={selectHandler}
                name=""
                placeholder=""
              />
            </div>
            <Review
              style={true}
              reviewlist={reviewlist}
              total_review={total_review}
            />
          </div>

          {/* Similar Properties */}
          <div style={{ marginBottom: "48px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#222222",
                marginBottom: "24px",
              }}
            >
              Similar properties
            </h2>
            <CommonSimilarProperty currentPropertyId={propetydetails.id} />
          </div>
        </div>

        {/* Right Column - Fixed Booking Widget (Desktop Only) */}
        <div
          className="desktop-booking-widget"
          style={{
            width: "380px",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "fixed",
              top: "120px",
              right: "40px",
              width: "340px",
              height: "fit-content",
              zIndex: 1000,
            }}
          >
            <BookingSection property={propetydetails} />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="mobile-layout">
        {/* Mobile Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#222222",
              marginBottom: "8px",
              lineHeight: "1.3",
            }}
          >
            {propetydetails.title}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              fontSize: "14px",
              color: "#717171",
            }}
          >
            <span>{propetydetails.city || "Location not specified"}</span>
            <span>•</span>
            <span>
              {propetydetails.beds || 0} beds • {propetydetails.bathroom || 0}{" "}
              baths
            </span>
          </div>

          {/* Rating and Reviews - Mobile */}
          {rating > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                <span style={{ color: "#222222" }}>★</span>
                <span style={{ fontWeight: "600" }}>{rating}</span>
              </div>
              <span style={{ color: "#717171" }}>•</span>
              <span style={{ color: "#717171", textDecoration: "underline" }}>
                {reviewCount} reviews
              </span>
            </div>
          )}
        </div>

        {/* Mobile Content */}
        <div style={{ padding: "0 20px" }}>
          {/* Breadcrumb Navigation - Mobile */}
          <div style={{ marginBottom: "20px", padding: "0 4px" }}>
            <nav aria-label="breadcrumb">
              <ol
                style={{
                  display: "flex",
                  alignItems: "center",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "13px",
                  color: "#717171",
                }}
              >
                <li style={{ marginRight: "6px" }}>
                  <Link
                    href="/"
                    style={{
                      color: "#007bff",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <i
                      className="fas fa-home"
                      style={{ marginRight: "3px", fontSize: "11px" }}
                    ></i>
                    Home
                  </Link>
                </li>
                <li style={{ marginRight: "6px", color: "#717171" }}>
                  <i
                    className="fas fa-chevron-right"
                    style={{ fontSize: "9px" }}
                  ></i>
                </li>
                <li style={{ color: "#222222", fontSize: "12px" }}>
                  {propetydetails.title}
                </li>
              </ol>
            </nav>
          </div>

          {/* Image Gallery - Mobile */}
          <div style={{ marginBottom: "32px" }}>
            <MediaGallery gallery={galleryImages} />
          </div>

          {/* Property Overview - Mobile */}
          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#222222",
                marginBottom: "16px",
              }}
            >
              About this place
            </h2>
            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.5",
                color: "#495057",
                marginBottom: "16px",
              }}
            >
              {propetydetails.description || "No description available."}
            </p>
          </div>

          {/* Property Features - Mobile */}
          <div
            className="property-overview-section"
            style={{ marginBottom: "32px" }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#222222",
                marginBottom: "16px",
              }}
            >
              Property Overview
            </h2>
            <CommonPropertyOverview propetydetails={propetydetails} />
          </div>

          {/* Amenities - Mobile */}
          <div style={{ marginBottom: "32px" }}>
            <CommonAmenities facility={facility} />
          </div>

          {/* Reviews - Mobile */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#222222",
                }}
              >
                Reviews
              </h2>
            </div>
            <Review
              style={true}
              reviewlist={reviewlist}
              total_review={total_review}
            />
          </div>

          {/* Similar Properties - Mobile */}
          <div style={{ marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#222222",
                marginBottom: "16px",
              }}
            >
              Similar properties
            </h2>
            <CommonSimilarProperty currentPropertyId={propetydetails.id} />
          </div>
        </div>
      </div>

      {/* Mobile Fixed Booking Button */}
      <div
        className="mobile-booking-button"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e0e0e0",
          padding: "16px 20px",
          zIndex: 1000,
          display: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#222222",
              }}
            >
              ${price.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#717171",
              }}
            >
              per night
            </div>
          </div>
          <button
            onClick={() => setShowBookingModal(true)}
            style={{
              backgroundColor: "#007bff",
              color: "#ffffff",
              border: "none",
              borderRadius: "50px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Reserve
          </button>
        </div>
      </div>

      {/* Mobile Booking Modal */}
      {showBookingModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 2000,
            display: "flex",
            alignItems: "flex-end",
          }}
          onClick={() => setShowBookingModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              width: "100%",
              maxHeight: "90vh",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              padding: "24px",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#222222",
                }}
              >
                Review and continue
              </h2>
              <button
                onClick={() => setShowBookingModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#717171",
                }}
              >
                ×
              </button>
            </div>

            {/* Property Summary */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "24px",
                padding: "16px",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Image
                  src={
                    mainImage?.startsWith("http")
                      ? mainImage
                      : mainImage
                      ? `https://cpanel.roomfinder237.com/${mainImage}`
                      : "/assets/images/placeholder.jpg"
                  }
                  alt={propetydetails.title}
                  width={80}
                  height={80}
                  style={{
                    objectFit: "cover",
                  }}
                  unoptimized={true}
                />
              </div>
              <div style={{ flex: "1" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#222222",
                    marginBottom: "4px",
                  }}
                >
                  {propetydetails.title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: "#717171",
                  }}
                >
                  <span>★ {rating}</span>
                  <span>•</span>
                  <span>Guest favorite</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <BookingSection property={propetydetails} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailsOneArea;
