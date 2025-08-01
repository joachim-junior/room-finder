"use client";
import { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Overview from "./Overview";
import ListingDetails from "./ListingDetails";
import Link from "next/link";
import SelectAmenities from "./SelectAmenities";
import AddressAndLocation from "../profile/AddressAndLocation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

interface PropertyFormData {
  title: string;
  description: string;
  category: string;
  listed_in: string;
  price: string;
  yearly_tax_rate: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  garages: number;
  garage_size: string;
  year_built: string;
  floors: number;
  address: string;
  country: string;
  city: string;
  zip_code: string;
  state: string;
  latitude: string;
  longitude: string;
  amenities: string[];
  images: File[];
  listing_description: string;
}

const AddPropertyBody = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editPropertyId = searchParams.get("edit");

  console.log("AddPropertyBody rendered, user:", user);

  const [loading, setLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    category: "",
    listed_in: "rent", // Default to rent
    price: "",
    yearly_tax_rate: "",
    size: "",
    bedrooms: 0,
    bathrooms: 0,
    kitchens: 0,
    garages: 0,
    garage_size: "",
    year_built: "",
    floors: 0,
    address: "",
    country: "1", // Default to first country
    city: "",
    zip_code: "",
    state: "",
    latitude: "4.0511", // Default coordinates
    longitude: "9.7679", // Default coordinates
    amenities: [],
    images: [],
    listing_description: "",
  });

  // Fetch property types on component mount
  useEffect(() => {
    fetchPropertyTypes();
    if (editPropertyId) {
      fetchPropertyDetails(editPropertyId);
    }
  }, [editPropertyId]);

  const fetchPropertyTypes = async () => {
    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_property_type.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();
      if (data.ResponseCode === "200" && data.Result === "true") {
        setPropertyTypes(data.typelist || []);
      }
    } catch (error) {
      console.error("Error fetching property types:", error);
    }
  };

  const fetchPropertyDetails = async (propertyId: string) => {
    if (!user) return;

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_property_details.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
            prop_id: propertyId,
          }),
        }
      );

      const data = await response.json();
      if (data.ResponseCode === "200" && data.Result === "true") {
        const property = data.property;
        setFormData({
          title: property.title || "",
          description: property.description || "",
          category: property.property_type?.toString() || "",
          listed_in: property.pbuysell || "rent",
          price: property.price?.toString() || "",
          yearly_tax_rate: property.yearly_tax_rate?.toString() || "",
          size: property.sqft?.toString() || "",
          bedrooms: property.beds || 0,
          bathrooms: property.bathroom || 0,
          kitchens: property.kitchens || 0,
          garages: property.garages || 0,
          garage_size: property.garage_size || "",
          year_built: property.year_built || "",
          floors: property.floors || 0,
          address: property.address || "",
          country: property.country_id?.toString() || "1",
          city: property.ccount || "",
          zip_code: property.zip_code || "",
          state: property.state || "",
          latitude: property.latitude || "4.0511",
          longitude: property.longtitude || "9.7679",
          amenities: property.facility ? property.facility.split(",") : [],
          images: [],
          listing_description: property.description || "",
        });
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      toast.error("Failed to load property details");
    }
  };

  const handleFormDataChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      console.log("Form submission started");
      console.log("Current form data:", formData);

      if (!user) {
        toast.error("Please log in to add a property");
        return;
      }

      // Validate required fields
      if (!formData.title.trim()) {
        toast.error("Property title is required");
        return;
      }

      if (!formData.description.trim()) {
        toast.error("Property description is required");
        return;
      }

      if (!formData.price.trim()) {
        toast.error("Property price is required");
        return;
      }

      if (!formData.address.trim()) {
        toast.error("Property address is required");
        return;
      }

      console.log("Validation passed, starting API call");
      setLoading(true);

      // Show initial loading toast
      toast.info("Submitting property... Please wait.");

      try {
        // Convert images to base64
        const imagePromises = formData.images.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        });

        const base64Images = await Promise.all(imagePromises);
        const firstImage = base64Images[0] || "";

        const requestData: any = {
          status: "1",
          title: formData.title,
          address: formData.address,
          description: formData.description,
          ccount: formData.city,
          facility: formData.amenities.join(","),
          ptype: formData.category,
          beds: formData.bedrooms.toString(),
          bathroom: formData.bathrooms.toString(),
          sqft: formData.size,
          rate: "4", // Default rating
          latitude: formData.latitude || "4.0511",
          longtitude: formData.longitude || "9.7679", // Note: API expects "longtitude" not "longitude"
          mobile: user.mobile,
          price: formData.price,
          plimit: "4", // Default limit
          country_id: formData.country || "1",
          pbuysell: formData.listed_in,
          uid: user.id.toString(),
          img: firstImage,
        };

        if (editPropertyId) {
          // Update existing property
          requestData.prop_id = editPropertyId;
          console.log("Updating property with data:", requestData);
          toast.info("Updating property...");

          const response = await fetch(
            "https://cpanel.roomfinder237.com/user_api/u_property_edit.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            }
          );

          const data = await response.json();
          console.log("Edit property response:", data);

          if (data.ResponseCode === "200" && data.Result === "true") {
            toast.success("✅ Property updated successfully!");
            toast.info("Redirecting to properties list...");
            setTimeout(() => {
              router.push("/dashboard/properties-list");
            }, 1500);
          } else {
            toast.error(
              `❌ Failed to update property: ${
                data.ResponseMsg || "Unknown error"
              }`
            );
          }
        } else {
          // Add new property
          console.log("Adding property with data:", requestData);
          toast.info("Adding new property...");

          const response = await fetch(
            "https://cpanel.roomfinder237.com/user_api/u_property_add.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            }
          );

          const data = await response.json();
          console.log("Add property response:", data);

          if (data.ResponseCode === "200" && data.Result === "true") {
            toast.success("✅ Property added successfully!");
            toast.info("Redirecting to properties list...");
            setTimeout(() => {
              router.push("/dashboard/properties-list");
            }, 1500);
          } else {
            toast.error(
              `❌ Failed to add property: ${
                data.ResponseMsg || "Unknown error"
              }`
            );
          }
        }
      } catch (error) {
        console.error("Error submitting property:", error);
        toast.error(
          "❌ An error occurred while submitting the property. Please try again."
        );
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("❌ An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo
          title={editPropertyId ? "Edit Property" : "Add New Property"}
        />
        <h2 className="main-title d-block d-lg-none">
          {editPropertyId ? "Edit Property" : "Add New Property"}
        </h2>

        <form onSubmit={handleSubmit}>
          <Overview
            formData={formData}
            onFormDataChange={handleFormDataChange}
            propertyTypes={propertyTypes}
          />
          <ListingDetails
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />

          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Photo & Video Attachment</h4>
            <div className="dash-input-wrapper mb-20">
              <label htmlFor="property-images">File Attachment*</label>

              {formData.images.map((file, index) => (
                <div
                  key={index}
                  className="attached-file d-flex align-items-center justify-content-between mb-15"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeImage(index)}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              ))}
            </div>
            <div className="dash-btn-one d-inline-block position-relative me-3">
              <i className="bi bi-plus"></i>
              Upload File
              <input
                type="file"
                id="property-images"
                name="property-images"
                multiple
                accept=".jpg,.jpeg,.png,.mp4"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
            </div>
            <small>Upload file .jpg, .png, .mp4</small>
          </div>

          <SelectAmenities
            selectedAmenities={formData.amenities}
            onAmenitiesChange={(amenities) =>
              handleFormDataChange("", "amenities", amenities)
            }
          />
          <AddressAndLocation
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />

          <div className="button-group d-inline-flex align-items-center mt-30">
            <button
              type="button"
              className="dash-btn-two tran3s me-3"
              disabled={loading}
              onClick={() => {
                console.log("Submit button clicked directly");
                handleSubmit(new Event("submit") as any);
              }}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  {editPropertyId ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  {editPropertyId ? "Update Property" : "Submit Property"}
                </>
              )}
            </button>
            <button
              type="button"
              className="dash-btn-two tran3s me-3"
              onClick={async () => {
                console.log("Test button clicked");
                if (!user) {
                  toast.error("No user found");
                  return;
                }
                try {
                  toast.info("Testing API connection...");
                  const testData = {
                    status: "1",
                    title: "Test Property",
                    address: "Test Address",
                    description: "Test Description",
                    ccount: "Test City",
                    facility: "",
                    ptype: "1",
                    beds: "1",
                    bathroom: "1",
                    sqft: "1000",
                    rate: "4",
                    latitude: "4.0511",
                    longtitude: "9.7679",
                    mobile: user.mobile,
                    price: "10000",
                    plimit: "4",
                    country_id: "1",
                    pbuysell: "rent",
                    uid: user.id.toString(),
                    img: "",
                  };
                  console.log("Sending test data:", testData);
                  const response = await fetch(
                    "https://cpanel.roomfinder237.com/user_api/u_property_add.php",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(testData),
                    }
                  );
                  const data = await response.json();
                  console.log("Test API response:", data);
                  if (data.ResponseCode === "200" && data.Result === "true") {
                    toast.success("✅ Test property added successfully!");
                  } else {
                    toast.error(
                      `❌ Test failed: ${data.ResponseMsg || "Unknown error"}`
                    );
                  }
                } catch (error) {
                  console.error("Test error:", error);
                  toast.error("❌ Test failed: Network error");
                }
              }}
            >
              Test API
            </button>
            <Link
              href="/dashboard/properties-list"
              className="dash-cancel-btn tran3s"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyBody;
