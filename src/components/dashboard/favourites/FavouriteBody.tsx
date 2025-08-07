"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface FavouriteProperty {
  id: number;
  title: string;
  rate: number;
  city: string;
  buyorrent: string;
  plimit: number;
  property_type: number;
  image: string;
  price: number;
  IS_FAVOURITE: number;
}

const FavouriteBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [favouriteProperties, setFavouriteProperties] = useState<
    FavouriteProperty[]
  >([]);
  const [removingFavourite, setRemovingFavourite] = useState<number | null>(
    null
  );
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Utility function to handle image URLs
  const getImageUrl = (imagePath: string) => {
    if (!imagePath || imagePath.trim() === "") {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // If it's a relative path, prepend the base URL
    if (imagePath.startsWith("/")) {
      return imagePath;
    }

    // For API paths, construct the full URL
    return `https://cpanel.roomfinder237.com/${imagePath}`;
  };

  // Utility function to handle image errors
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    imageUrl: string
  ) => {
    const target = e.target as HTMLImageElement;
    console.warn(`Image failed to load: ${imageUrl}`);

    // Track failed image
    setFailedImages((prev) => new Set(prev).add(imageUrl));

    // Prevent further retries by setting a data attribute
    target.setAttribute("data-failed", "true");

    // Fallback to default image
    target.src = "/images/listing/listing-1.jpg";
  };

  // Utility function to get final image URL with fallback
  const getFinalImageUrl = (property: FavouriteProperty) => {
    const originalUrl = getImageUrl(property.image);

    // If this image has failed before, use fallback immediately
    if (failedImages.has(originalUrl)) {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
    }

    // Check if URL is obviously broken
    if (
      !originalUrl ||
      originalUrl === "undefined" ||
      originalUrl === "null" ||
      originalUrl.includes("undefined")
    ) {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
    }

    return originalUrl;
  };

  // Custom Image component to prevent infinite loops
  const SafeImage = ({ property }: { property: FavouriteProperty }) => {
    const [imgSrc, setImgSrc] = useState(getFinalImageUrl(property));
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        setImgSrc(
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=="
        );
        setFailedImages((prev) =>
          new Set(prev).add(getImageUrl(property.image))
        );
      }
    };

    return (
      <img
        src={imgSrc}
        alt={property.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        onError={handleError}
      />
    );
  };

  // Utility function to validate image URL
  const isValidImageUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Fetch favourite properties
  const fetchFavouriteProperties = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_favlist.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            property_type: "0", // 0 for all property types
            country_id: "1", // Default country ID
          }),
        }
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        setFavouriteProperties(data.propetylist || []);
      } else {
        toast.error(
          `❌ Failed to load favourite properties: ${
            data.ResponseMsg || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error fetching favourite properties:", error);
      toast.error("❌ An error occurred while loading favourite properties");
    } finally {
      setLoading(false);
    }
  };

  // Remove from favourites
  const removeFromFavourites = async (propertyId: number) => {
    if (!user) return;

    try {
      setRemovingFavourite(propertyId);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_fav.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            pid: propertyId,
            property_type: "1", // Default property type
          }),
        }
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("✅ Property removed from favourites");
        // Remove from local state
        setFavouriteProperties((prev) =>
          prev.filter((property) => property.id !== propertyId)
        );
      } else {
        toast.error(
          `❌ Failed to remove from favourites: ${
            data.ResponseMsg || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error removing from favourites:", error);
      toast.error("❌ An error occurred while removing from favourites");
    } finally {
      setRemovingFavourite(null);
    }
  };

  // Load favourite properties on component mount
  useEffect(() => {
    fetchFavouriteProperties();
  }, [user]);

  if (!user) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view your favourite properties.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div
        className="dashboard-body"
        style={{
          marginTop: "100px",
          padding: "20px 0",
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="container-fluid">
          <LoadingSpinner
            size="lg"
            color="#007bff"
            text="Loading favourite properties..."
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="dashboard-body"
      style={{
        marginTop: "100px",
        padding: "20px 0",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="container-fluid">
        {/* Breadcrumb Navigation */}
        <div className="row mb-3">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/dashboard/home" className="text-decoration-none">
                    <i className="fas fa-arrow-left me-2"></i>
                    <span className="text-muted">Back to Dashboard</span>
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <span className="text-dark fw-bold">Favourites</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div>
              <h2 className="fw-bold text-dark mb-1">My Favourites</h2>
              <p className="text-muted mb-0">Your saved properties</p>
            </div>
          </div>
        </div>

        {/* Favourites List */}
        {favouriteProperties.length === 0 ? (
          <div
            className="text-center py-5"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#f8f9fa",
                color: "#6c757d",
              }}
            >
              <i className="fas fa-heart" style={{ fontSize: "24px" }}></i>
            </div>
            <h6 className="text-muted mb-2">No Favourite Properties</h6>
            <p className="text-muted mb-0">
              Start exploring properties and add them to your favourites
            </p>
          </div>
        ) : (
          <div className="row">
            {favouriteProperties.map((property) => (
              <div key={property.id} className="col-lg-6 col-md-12 mb-4">
                <div
                  className="h-100"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e9ecef",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.08)";
                  }}
                >
                  {/* Image Container */}
                  <div className="position-relative">
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "220px",
                        overflow: "hidden",
                      }}
                    >
                      <SafeImage property={property} />
                    </div>

                    {/* Remove Button */}
                    <button
                      className="btn position-absolute"
                      onClick={() => removeFromFavourites(property.id)}
                      disabled={removingFavourite === property.id}
                      style={{
                        top: "12px",
                        right: "12px",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid #e9ecef",
                        color: "#dc3545",
                        fontSize: "14px",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {removingFavourite === property.id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-times"></i>
                      )}
                    </button>

                    {/* Price Badge */}
                    <div
                      className="position-absolute"
                      style={{
                        bottom: "12px",
                        left: "12px",
                        backgroundColor: "rgba(255,255,255,0.95)",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        border: "1px solid #e9ecef",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <span
                        className="fw-bold text-primary"
                        style={{ fontSize: "14px" }}
                      >
                        {Number(property.price).toLocaleString()} XAF
                      </span>
                    </div>

                    {/* Property Type Badge */}
                    <div
                      className="position-absolute"
                      style={{
                        bottom: "12px",
                        right: "12px",
                        backgroundColor: "rgba(0,123,255,0.9)",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {property.buyorrent}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h6
                      className="fw-bold text-dark mb-2"
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {property.title}
                    </h6>

                    {/* Location */}
                    <div className="d-flex align-items-center mb-3">
                      <i
                        className="fas fa-map-marker-alt me-2"
                        style={{ color: "#6c757d", fontSize: "14px" }}
                      ></i>
                      <span className="text-muted" style={{ fontSize: "14px" }}>
                        {property.city}
                      </span>
                    </div>

                    {/* Property Details */}
                    <div className="row mb-3">
                      <div className="col-4">
                        <div className="text-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                            style={{
                              width: "32px",
                              height: "32px",
                              backgroundColor: "#f8f9fa",
                              color: "#6c757d",
                            }}
                          >
                            <i
                              className="fas fa-bed"
                              style={{ fontSize: "12px" }}
                            ></i>
                          </div>
                          <small className="text-muted d-block">Beds</small>
                          <span
                            className="fw-bold text-dark"
                            style={{ fontSize: "12px" }}
                          >
                            {property.plimit || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                            style={{
                              width: "32px",
                              height: "32px",
                              backgroundColor: "#f8f9fa",
                              color: "#6c757d",
                            }}
                          >
                            <i
                              className="fas fa-bath"
                              style={{ fontSize: "12px" }}
                            ></i>
                          </div>
                          <small className="text-muted d-block">Baths</small>
                          <span
                            className="fw-bold text-dark"
                            style={{ fontSize: "12px" }}
                          >
                            {property.property_type || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
                            style={{
                              width: "32px",
                              height: "32px",
                              backgroundColor: "#f8f9fa",
                              color: "#6c757d",
                            }}
                          >
                            <i
                              className="fas fa-star"
                              style={{ fontSize: "12px" }}
                            ></i>
                          </div>
                          <small className="text-muted d-block">Rating</small>
                          <span
                            className="fw-bold text-dark"
                            style={{ fontSize: "12px" }}
                          >
                            {property.rate > 0 ? `${property.rate}/5` : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="d-flex justify-content-between align-items-center">
                      <Link
                        href={`/listing_details_01/${property.id}`}
                        className="btn btn-primary flex-fill me-2"
                        style={{
                          borderRadius: "12px",
                          padding: "10px 16px",
                          fontSize: "14px",
                          fontWeight: "600",
                          border: "none",
                          backgroundColor: "#007bff",
                          color: "#ffffff",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#0056b3";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#007bff";
                        }}
                      >
                        <i className="fas fa-eye me-2"></i>
                        View Property
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouriteBody;
