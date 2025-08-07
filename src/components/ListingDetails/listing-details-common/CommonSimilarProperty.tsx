"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const CommonSimilarProperty = ({
  currentPropertyId,
}: {
  currentPropertyId: number | string;
}) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const [favLoading, setFavLoading] = useState<{ [key: string]: boolean }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
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
        if (
          data.Result === "true" &&
          data.HomeData &&
          Array.isArray(data.HomeData.Featured_Property)
        ) {
          setProperties(
            data.HomeData.Featured_Property.filter(
              (item: any) => String(item.id) !== String(currentPropertyId)
            ).slice(0, 6) // Show max 6 similar properties
          );
        } else {
          setProperties([]);
          setError("No similar properties found.");
        }
      } catch (err) {
        setError("Failed to fetch similar properties.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [currentPropertyId]);

  // Fetch favorites on mount if authenticated
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !user.id) return;
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
        // ignore
      }
    };
    fetchFavorites();
  }, [user]);

  const handleFavorite = async (
    propertyId: string | number,
    propertyType: string | number = 1
  ) => {
    if (!user || !user.id) {
      toast.error("You must be logged in to favorite a property.");
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
            property_type: propertyType,
          }),
        }
      );
      const data = await res.json();
      if (data.Result === "true") {
        setFavorites((prev) => ({ ...prev, [propertyId]: !prev[propertyId] }));
        toast.success(data.ResponseMsg || "Favorite updated!");
      } else {
        toast.error(data.ResponseMsg || "Failed to update favorite.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setFavLoading((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.log(`Similar property image failed to load: ${target.src}`);
    setFailedImages((prev) => new Set(prev).add(target.src));
    target.src =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
  };

  if (loading) {
    return (
      <div style={{ padding: "20px 0" }}>
        <div style={{ textAlign: "center", color: "#717171" }}>
          Loading similar properties...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px 0" }}>
        <div style={{ textAlign: "center", color: "#dc3545" }}>{error}</div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div style={{ padding: "20px 0" }}>
        <div style={{ textAlign: "center", color: "#717171" }}>
          No similar properties found.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "48px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/listing_details_01/${property.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.08)";
              }}
            >
              {/* Property Image */}
              <div style={{ position: "relative", height: "200px" }}>
                <img
                  src={
                    property.image &&
                    !failedImages.has(
                      `https://cpanel.roomfinder237.com/${property.image}`
                    )
                      ? `https://cpanel.roomfinder237.com/${property.image}`
                      : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=="
                  }
                  alt={property.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={handleImageError}
                />

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFavorite(property.id, property.property_type);
                  }}
                  disabled={favLoading[property.id]}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: favorites[property.id] ? "#007bff" : "#222222",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <i
                    className={`fas fa-heart ${
                      favorites[property.id] ? "fas" : "far"
                    }`}
                    style={{ fontSize: "14px" }}
                  ></i>
                </button>

                {/* Property Type Badge */}
                {property.buyorrent && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#ffffff",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "10px",
                      fontWeight: "500",
                      textTransform: "uppercase",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {property.buyorrent}
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div style={{ padding: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#222222",
                      margin: 0,
                      flex: 1,
                      lineHeight: "1.3",
                    }}
                  >
                    {property.title}
                  </h3>
                </div>

                <p
                  style={{
                    color: "#717171",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  {property.city || "Location not specified"}
                </p>

                {/* Property Features */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "12px",
                    fontSize: "14px",
                    color: "#717171",
                  }}
                >
                  {property.beds && <span>{property.beds} beds</span>}
                  {property.bathroom && (
                    <span>• {property.bathroom} baths</span>
                  )}
                  {property.sqrft && <span>• {property.sqrft} sq ft</span>}
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
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#222222",
                      }}
                    >
                      {Number(property.price).toLocaleString()} XAF
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#717171",
                        marginLeft: "4px",
                      }}
                    >
                      /{property.buyorrent === "rent" ? "month" : "total"}
                    </span>
                  </div>

                  {property.rate && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i
                        className="fas fa-star"
                        style={{ fontSize: "14px", color: "#ffc107" }}
                      ></i>
                      <span style={{ fontSize: "14px", color: "#717171" }}>
                        {property.rate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CommonSimilarProperty;
