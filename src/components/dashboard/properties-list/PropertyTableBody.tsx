import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

import icon_1 from "@/assets/images/dashboard/icon/icon_18.svg";
import icon_2 from "@/assets/images/dashboard/icon/icon_19.svg";
import icon_3 from "@/assets/images/dashboard/icon/icon_20.svg";
import icon_4 from "@/assets/images/dashboard/icon/icon_21.svg";

interface PropertyData {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  property_type: string;
  facilities: string[];
  owner_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  view_count?: number;
}

interface PropertyTableBodyProps {
  properties: PropertyData[];
  onRefresh: () => void;
}

const PropertyTableBody = ({
  properties,
  onRefresh,
}: PropertyTableBodyProps) => {
  const { user } = useAuth();
  const [deletingProperty, setDeletingProperty] = useState<number | null>(null);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle property deletion
  const handleDeleteProperty = async (propertyId: number) => {
    if (!user) {
      toast.error("Please log in to manage properties");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingProperty(propertyId);
    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_sale_prop.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
            prop_id: propertyId.toString(),
          }),
        }
      );

      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("Property deleted successfully!");
        onRefresh(); // Refresh the properties list
      } else {
        toast.error(data.ResponseMsg || "Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("An error occurred while deleting the property");
    } finally {
      setDeletingProperty(null);
    }
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "available":
        return "active";
      case "pending":
        return "pending";
      case "processing":
        return "processing";
      case "sold":
      case "rented":
        return "sold";
      default:
        return "pending";
    }
  };

  return (
    <tbody className="border-0">
      {properties.map((property) => (
        <tr key={property.id}>
          <td>
            <div className="d-lg-flex align-items-center position-relative">
              <div
                className="p-img bg-light rounded d-flex align-items-center justify-content-center"
                style={{ width: "80px", height: "60px" }}
              >
                <i className="bi bi-house text-muted"></i>
              </div>
              <div className="ps-lg-4 md-pt-10">
                <Link
                  href={`/listing_details_01/${property.id}`}
                  className="property-name tran3s color-dark fw-500 fs-20 stretched-link"
                >
                  {property.name}
                </Link>
                <div className="address">{property.location}</div>
                <strong className="price color-dark">
                  {Number(property.price).toLocaleString()} XAF
                </strong>
              </div>
            </div>
          </td>
          <td>{formatDate(property.created_at)}</td>
          <td>{property.view_count || 0}</td>
          <td>
            <div
              className={`property-status ${getStatusClass(property.status)}`}
            >
              {property.status}
            </div>
          </td>
          <td>
            <div className="action-dots float-end">
              <button
                className="action-btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span></span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link
                    className="dropdown-item"
                    href={`/listing_details_01/${property.id}`}
                  >
                    <Image src={icon_1} alt="" className="lazy-img" /> View
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    href={`/dashboard/add-property?edit=${property.id}`}
                  >
                    <Image src={icon_3} alt="" className="lazy-img" /> Edit
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDeleteProperty(property.id)}
                    disabled={deletingProperty === property.id}
                  >
                    {deletingProperty === property.id ? (
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <Image src={icon_4} alt="" className="lazy-img" />
                    )}
                    {deletingProperty === property.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default PropertyTableBody;
