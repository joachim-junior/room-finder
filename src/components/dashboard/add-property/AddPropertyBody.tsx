"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface PropertyForm {
  property_name: string;
  property_type: string;
  price: string;
  location: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  contact_phone: string;
  contact_email: string;
}

const AddPropertyBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<PropertyForm>({
    property_name: "",
    property_type: "",
    price: "",
    location: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    contact_phone: "",
    contact_email: "",
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("❌ Please log in to add a property");
      return;
    }

    // Validate required fields
    const requiredFields = [
      "property_name",
      "property_type",
      "price",
      "location",
      "description",
      "contact_phone",
      "contact_email",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof PropertyForm]) {
        toast.error(`❌ Please fill in ${field.replace("_", " ")}`);
        return;
      }
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_property_add.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            ...formData,
          }),
        }
      );

      const data = await response.json();

      if (data.Result === "true") {
        toast.success("✅ Property added successfully!");
        // Reset form
        setFormData({
          property_name: "",
          property_type: "",
          price: "",
          location: "",
          description: "",
          bedrooms: "",
          bathrooms: "",
          area: "",
          contact_phone: "",
          contact_email: "",
        });
      } else {
        toast.error(`❌ ${data.ResponseMsg || "Failed to add property"}`);
      }
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("❌ Failed to add property");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to add a property.</p>
          </div>
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
                  <span className="text-dark fw-bold">Add Property</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div>
              <h2 className="fw-bold text-dark mb-1">Add New Property</h2>
              <p className="text-muted mb-0">
                List your property for rent or sale
              </p>
            </div>
          </div>
        </div>

        {/* Property Form */}
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div
              className="p-5 rounded"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e9ecef",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Property Name */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-bold text-dark">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="property_name"
                      value={formData.property_name}
                      onChange={handleInputChange}
                      placeholder="Enter property name"
                      required
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>

                  {/* Property Type */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-bold text-dark">
                      Property Type *
                    </label>
                    <select
                      className="form-select"
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleInputChange}
                      required
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <option value="">Select property type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Studio">Studio</option>
                      <option value="Room">Room</option>
                      <option value="Office">Office</option>
                      <option value="Land">Land</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-bold text-dark">
                      Price (XAF) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      required
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>

                  {/* Location */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-bold text-dark">
                      Location *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter location"
                      required
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>

                  {/* Bedrooms */}
                  <div className="col-md-4 mb-4">
                    <label className="form-label fw-bold text-dark">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      placeholder="Number of bedrooms"
                      min="0"
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>

                  {/* Bathrooms */}
                  <div className="col-md-4 mb-4">
                    <label className="form-label fw-bold text-dark">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      placeholder="Number of bathrooms"
                      min="0"
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>

                  {/* Area */}
                  <div className="col-md-4 mb-4">
                    <label className="form-label fw-bold text-dark">
                      Area (sq ft)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="Property area"
                      min="0"
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>

                  {/* Contact Phone */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-bold text-dark">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleInputChange}
                      placeholder="Enter contact phone"
                      required
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>

                  {/* Contact Email */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-bold text-dark">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      placeholder="Enter contact email"
                      required
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>

                  {/* Description */}
                  <div className="col-12 mb-4">
                    <label className="form-label fw-bold text-dark">
                      Description *
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your property..."
                      rows={5}
                      required
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        backgroundColor: "#ffffff",
                        resize: "vertical",
                      }}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="col-12">
                    <div className="d-flex justify-content-between">
                      <Link
                        href="/dashboard/properties-list"
                        className="btn btn-outline-secondary"
                        style={{
                          padding: "12px 24px",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef",
                          backgroundColor: "#ffffff",
                          color: "#6c757d",
                        }}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Properties
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                        style={{
                          padding: "12px 24px",
                          borderRadius: "8px",
                          backgroundColor: "#007bff",
                          border: "none",
                        }}
                      >
                        {submitting ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Adding Property...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-plus me-2"></i>
                            Add Property
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyBody;
