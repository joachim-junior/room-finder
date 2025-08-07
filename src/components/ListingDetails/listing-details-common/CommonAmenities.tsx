import { useState } from "react";

const CommonAmenities = ({ facility }: { facility: any[] }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Show first 6 amenities by default
  const initialAmenitiesCount = 6;
  const displayedAmenities = showAllAmenities
    ? facility
    : facility?.slice(0, initialAmenitiesCount) || [];

  const hasMoreAmenities = facility && facility.length > initialAmenitiesCount;

  // Get amenity icon based on title
  const getAmenityIcon = (title: string) => {
    const titleLower = title.toLowerCase();

    if (titleLower.includes("wifi") || titleLower.includes("internet"))
      return "fas fa-wifi";
    if (titleLower.includes("kitchen")) return "fas fa-utensils";
    if (titleLower.includes("parking")) return "fas fa-car";
    if (titleLower.includes("gym") || titleLower.includes("fitness"))
      return "fas fa-dumbbell";
    if (titleLower.includes("pool") || titleLower.includes("swimming"))
      return "fas fa-swimming-pool";
    if (titleLower.includes("ac") || titleLower.includes("air conditioning"))
      return "fas fa-snowflake";
    if (titleLower.includes("tv") || titleLower.includes("television"))
      return "fas fa-tv";
    if (titleLower.includes("washer") || titleLower.includes("laundry"))
      return "fas fa-tshirt";
    if (titleLower.includes("dryer")) return "fas fa-wind";
    if (titleLower.includes("heating")) return "fas fa-thermometer-half";
    if (titleLower.includes("workspace") || titleLower.includes("desk"))
      return "fas fa-laptop";
    if (titleLower.includes("balcony") || titleLower.includes("terrace"))
      return "fas fa-door-open";
    if (titleLower.includes("elevator")) return "fas fa-arrow-up";
    if (titleLower.includes("security") || titleLower.includes("camera"))
      return "fas fa-shield-alt";
    if (titleLower.includes("smoke") || titleLower.includes("alarm"))
      return "fas fa-exclamation-triangle";
    if (titleLower.includes("carbon") || titleLower.includes("monoxide"))
      return "fas fa-exclamation-circle";
    if (titleLower.includes("hair") || titleLower.includes("dryer"))
      return "fas fa-cut";
    if (titleLower.includes("cleaning") || titleLower.includes("products"))
      return "fas fa-spray-can";
    if (titleLower.includes("bidet")) return "fas fa-toilet";
    if (titleLower.includes("hot water") || titleLower.includes("shower"))
      return "fas fa-shower";
    if (titleLower.includes("hangers") || titleLower.includes("clothes"))
      return "fas fa-hanger";
    if (titleLower.includes("linens") || titleLower.includes("bedding"))
      return "fas fa-bed";
    if (titleLower.includes("pillows") || titleLower.includes("blankets"))
      return "fas fa-pillow";
    if (
      titleLower.includes("city") ||
      titleLower.includes("skyline") ||
      titleLower.includes("view")
    )
      return "fas fa-building";
    if (titleLower.includes("bathroom")) return "fas fa-bath";
    if (titleLower.includes("bedroom")) return "fas fa-bed";

    // Default icon
    return "fas fa-check";
  };

  return (
    <>
      <h4 className="mb-20">What this place offers</h4>
      {facility && facility.length > 0 ? (
        <div>
          {/* Amenities Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {displayedAmenities.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 0",
                }}
              >
                <i
                  className={getAmenityIcon(item.title)}
                  style={{
                    fontSize: "16px",
                    color: "#222222",
                    width: "20px",
                    textAlign: "center",
                  }}
                ></i>
                <span style={{ fontSize: "14px", color: "#222222" }}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          {/* Show All Amenities Button */}
          {hasMoreAmenities && (
            <button
              onClick={() => setShowAllAmenities(!showAllAmenities)}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #e0e0e0",
                borderRadius: "50px",
                padding: "12px 20px",
                fontSize: "14px",
                color: "#222222",
                cursor: "pointer",
                fontWeight: "500",
                marginTop: "8px",
              }}
            >
              {showAllAmenities
                ? "Show less"
                : `Show all ${facility.length} amenities`}
            </button>
          )}
        </div>
      ) : (
        <p className="fs-20 lh-lg pb-25">No amenities listed.</p>
      )}
    </>
  );
};

export default CommonAmenities;
