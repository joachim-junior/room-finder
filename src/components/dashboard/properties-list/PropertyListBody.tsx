"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Property {
  id: number;
  property_name: string;
  property_image: string;
  location: string;
  price: number;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  created_date: string;
  status: string;
}

const PropertyListBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [deletingProperty, setDeletingProperty] = useState<number | null>(null);

  // Fetch user properties
  const fetchProperties = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_my_properties.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.id }),
        }
      );
      const data = await response.json();

      if (data.Result === "true") {
        setProperties(data.properties || []);
      } else {
        toast.error("❌ Failed to load properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("❌ Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  // Delete property
  const deleteProperty = async (propertyId: number) => {
    if (!user) return;

    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      setDeletingProperty(propertyId);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_delete_property.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            property_id: propertyId,
          }),
        }
      );
      const data = await response.json();

      if (data.Result === "true") {
        toast.success("✅ Property deleted successfully");
        // Remove from local state
        setProperties((prev) =>
          prev.filter((property) => property.id !== propertyId)
        );
      } else {
        toast.error("❌ Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("❌ Failed to delete property");
    } finally {
      setDeletingProperty(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning";
      case "inactive":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  // Load properties on component mount
  useEffect(() => {
    fetchProperties();
  }, [user]);

  if (!user) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view your properties.</p>
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
            text="Loading properties..."
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
                  <span className="text-dark fw-bold">My Properties</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold text-dark mb-1">My Properties</h2>
                <p className="text-muted mb-0">Manage your listed properties</p>
              </div>
              <Link
                href="/dashboard/add-property"
                className="btn btn-primary"
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  borderRadius: "8px",
                }}
              >
                <i className="fas fa-plus me-2"></i>
                Add Property
              </Link>
            </div>
          </div>
        </div>

        {/* Properties List */}
        {properties.length === 0 ? (
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
                width: "80px",
                height: "80px",
                backgroundColor: "#f8f9fa",
                color: "#6c757d",
              }}
            >
              <i className="fas fa-home" style={{ fontSize: "32px" }}></i>
            </div>
            <h5 className="text-muted mb-2">No properties found</h5>
            <p className="text-muted mb-0">
              You haven&apos;t listed any properties yet.
            </p>
            <Link
              href="/dashboard/add-property"
              className="btn btn-primary mt-3"
            >
              <i className="fas fa-plus me-2"></i>
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="row">
            {properties.map((property) => (
              <div key={property.id} className="col-lg-6 col-md-12 mb-4">
                <div
                  className="h-100"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e9ecef",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    overflow: "hidden",
                  }}
                >
                  <div className="position-relative">
                    <img
                      src={
                        property.property_image ||
                        "/images/listing/listing-1.jpg"
                      }
                      alt={property.property_name}
                      className="w-100"
                      style={{
                        height: "200px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.src = "/images/listing/listing-1.jpg";
                      }}
                    />
                    <span
                      className="position-absolute"
                      style={{
                        top: "10px",
                        left: "10px",
                      }}
                    >
                      <span className={getStatusBadge(property.status)}>
                        {property.status}
                      </span>
                    </span>
                  </div>
                  <div className="p-3">
                    <h6 className="fw-bold text-dark mb-2">
                      {property.property_name}
                    </h6>
                    <p className="text-muted mb-2">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {property.location}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-bold text-primary">
                        {Number(property.price).toLocaleString()} XAF
                      </span>
                      <span className="badge bg-secondary">
                        {property.property_type}
                      </span>
                    </div>
                    {(property.bedrooms ||
                      property.bathrooms ||
                      property.area) && (
                      <div className="mb-3 d-flex gap-3">
                        {property.bedrooms && (
                          <small className="text-muted">
                            <i className="fas fa-bed me-1"></i>
                            {property.bedrooms} Beds
                          </small>
                        )}
                        {property.bathrooms && (
                          <small className="text-muted">
                            <i className="fas fa-bath me-1"></i>
                            {property.bathrooms} Baths
                          </small>
                        )}
                        {property.area && (
                          <small className="text-muted">
                            <i className="fas fa-ruler-combined me-1"></i>
                            {property.area} sq ft
                          </small>
                        )}
                      </div>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Listed: {formatDate(property.created_date)}
                      </small>
                      <div className="d-flex gap-2">
                        <Link
                          href={`/listing_details_01/${property.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="fas fa-eye me-1"></i>
                          View
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteProperty(property.id)}
                          disabled={deletingProperty === property.id}
                        >
                          {deletingProperty === property.id ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fas fa-trash me-1"></i>
                          )}
                          Delete
                        </button>
                      </div>
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

export default PropertyListBody;
