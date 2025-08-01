"use client";
import { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import PropertyTableBody from "./PropertyTableBody";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const PropertyListBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);

  // Fetch user's properties
  const fetchUserProperties = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_property_list.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
          }),
        }
      );

      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        const propertiesList = data.proplist || [];

        // Sort properties based on selected option
        const sortedProperties = sortProperties(propertiesList, sortBy);

        setProperties(sortedProperties);
        setTotalProperties(propertiesList.length);
        setTotalPages(Math.ceil(propertiesList.length / 5)); // 5 properties per page
      } else {
        setProperties([]);
        if (data.ResponseCode === "200" && data.Result === "false") {
          // No properties found
          setTotalPages(0);
        } else {
          toast.error(data.ResponseMsg || "Failed to load properties");
        }
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("An error occurred while loading properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort properties based on criteria
  const sortProperties = (propertiesList: any[], sortBy: string) => {
    switch (sortBy) {
      case "newest":
        return propertiesList.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return propertiesList.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "price_low":
        return propertiesList.sort((a, b) => a.price - b.price);
      case "price_high":
        return propertiesList.sort((a, b) => b.price - a.price);
      case "best_seller":
        return propertiesList.sort(
          (a, b) => (b.view_count || 0) - (a.view_count || 0)
        );
      default:
        return propertiesList;
    }
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sortedProperties = sortProperties(properties, value);
    setProperties(sortedProperties);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Load data on component mount
  useEffect(() => {
    fetchUserProperties();
  }, [user]);

  // Calculate current properties for pagination
  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;
  const currentProperties = properties.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <DashboardHeaderTwo title="My Properties" />
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <DashboardHeaderTwo title="My Properties" />
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={fetchUserProperties}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <h2 className="main-title d-block d-lg-none">My Properties</h2>

        <div className="d-sm-flex align-items-center justify-content-between mb-25">
          <div className="fs-16">
            Showing{" "}
            <span className="color-dark fw-500">
              {properties.length > 0
                ? `${startIndex + 1}–${Math.min(endIndex, properties.length)}`
                : "0"}
            </span>{" "}
            of <span className="color-dark fw-500">{totalProperties}</span>{" "}
            results
          </div>
          <div className="d-flex ms-auto xs-mt-30">
            <div className="short-filter d-flex align-items-center ms-sm-auto">
              <div className="fs-16 me-2">Sort by:</div>
              <NiceSelect
                className="nice-select"
                options={[
                  { value: "newest", text: "Newest" },
                  { value: "oldest", text: "Oldest" },
                  { value: "price_low", text: "Price Low" },
                  { value: "price_high", text: "Price High" },
                  { value: "best_seller", text: "Best Seller" },
                ]}
                defaultCurrent={0}
                onChange={(e) => handleSortChange(e.target.value)}
                name="sort"
                placeholder=""
              />
            </div>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white card-box border-20 text-center py-5">
            <div className="empty-state">
              <i
                className="bi bi-house text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h4 className="mt-3">No Properties Found</h4>
              <p className="text-muted">
                You haven&apos;t added any properties yet.
              </p>
              <a
                href="/dashboard/add-property"
                className="btn btn-primary mt-3"
              >
                Add Property
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white card-box p0 border-20">
            <div className="table-responsive pt-25 pb-25 pe-4 ps-4">
              <table className="table property-list-table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Date</th>
                    <th scope="col">View</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <PropertyTableBody
                  properties={currentProperties}
                  onRefresh={fetchUserProperties}
                />
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <ul className="pagination-one d-flex align-items-center justify-content-center style-none pt-40">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={currentPage === i + 1 ? "selected" : ""}>
                <button
                  onClick={() => handlePageChange(i + 1)}
                  className="btn-link"
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                  }}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PropertyListBody;
