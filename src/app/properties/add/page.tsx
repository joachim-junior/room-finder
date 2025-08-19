"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  Upload,
  MapPin,
  DollarSign,
  Users,
  Bed,
  Bath,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { Card, Input, Textarea, Select, Button } from "@/components/ui";

interface PropertyFormData {
  title: string;
  description: string;
  type:
    | "ROOM"
    | "STUDIO"
    | "APARTMENT"
    | "VILLA"
    | "SUITE"
    | "DORMITORY"
    | "COTTAGE"
    | "PENTHOUSE";
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  images: File[];
}

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    type: "APARTMENT",
    address: "",
    city: "",
    state: "",
    country: "Cameroon",
    zipCode: "",
    latitude: 0,
    longitude: 0,
    price: 0,
    currency: "XAF",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 1,
    amenities: [],
    images: [],
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [amenityInput, setAmenityInput] = useState("");

  const propertyTypes = [
    { value: "ROOM", label: "Single Room" },
    { value: "STUDIO", label: "Studio Apartment" },
    { value: "APARTMENT", label: "Full Apartment" },
    { value: "VILLA", label: "Villa or House" },
    { value: "SUITE", label: "Hotel-style Suite" },
    { value: "DORMITORY", label: "Shared Accommodation" },
    { value: "COTTAGE", label: "Small House" },
    { value: "PENTHOUSE", label: "Luxury Apartment" },
  ];

  const commonAmenities = [
    "WiFi",
    "Air Conditioning",
    "Kitchen",
    "Pool",
    "Beach Access",
    "Parking",
    "Gym",
    "Laundry",
    "TV",
    "Balcony",
    "Garden",
    "Security",
    "Elevator",
    "Pet Friendly",
  ];

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Property title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Property description is required";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }

    if (!formData.price || formData.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (!formData.bedrooms || formData.bedrooms < 1) {
      errors.bedrooms = "At least 1 bedroom is required";
    }

    if (!formData.bathrooms || formData.bathrooms < 1) {
      errors.bathrooms = "At least 1 bathroom is required";
    }

    if (!formData.maxGuests || formData.maxGuests < 1) {
      errors.maxGuests = "At least 1 guest is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof PropertyFormData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleAmenityAdd = () => {
    if (
      amenityInput.trim() &&
      !formData.amenities.includes(amenityInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    }
  };

  const handleAmenityRemove = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("🚀 Starting property creation process...");
      console.log("📝 Form data:", formData);

      // Validate form
      if (!validateForm()) {
        setLoading(false);
        setError("Please fix the validation errors before submitting.");
        return;
      }

      // First upload images if any
      let imageUrls: string[] = [];
      if (formData.images.length > 0) {
        console.log("📤 Uploading images...");
        try {
          const uploadResponse = await apiClient.uploadImages(formData.images);
          console.log("📤 Upload response:", uploadResponse);

          if (uploadResponse.success && uploadResponse.data) {
            imageUrls =
              uploadResponse.data.images || uploadResponse.data.urls || [];
            console.log("✅ Images uploaded successfully:", imageUrls);
          } else {
            console.warn("⚠️ Image upload response:", uploadResponse);
            // Continue without images if upload fails
          }
        } catch (uploadError) {
          console.error("❌ Image upload failed:", uploadError);
          // Continue without images if upload fails
        }
      }

      // Prepare property data
      const propertyData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        latitude: formData.latitude || 0,
        longitude: formData.longitude || 0,
        price: Number(formData.price),
        currency: formData.currency,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        maxGuests: Number(formData.maxGuests),
        amenities: formData.amenities,
        images: imageUrls,
      };

      console.log("🏠 Creating property with data:", propertyData);

      // Create property
      const response = await apiClient.createProperty(propertyData);
      console.log("🏠 Property creation response:", response);

      if (response.success) {
        console.log("✅ Property created successfully!");
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard?section=properties");
        }, 2000);
      } else {
        console.error("❌ Property creation failed:", response);
        setError(response.message || "Failed to create property");
      }
    } catch (err: any) {
      console.error("❌ Error creating property:", err);
      setError(err.message || "Failed to create property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard?section=properties");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="bg-white rounded-xl p-8 text-center max-w-md w-full mx-4"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Property Created Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            Your property has been added and is now available for bookings.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to properties page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mr-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Properties</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Property
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new property listing for guests to book
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div
            className="bg-white rounded-xl p-6"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Home className="h-5 w-5 mr-2 text-blue-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter property title"
                  required
                  error={!!validationErrors.title}
                />
                {validationErrors.title && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  options={propertyTypes}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your property, amenities, and what makes it special..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div
            className="bg-white rounded-xl p-6"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Street address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="City"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province *
                </label>
                <Input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="State or province"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <Input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Country"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code
                </label>
                <Input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="ZIP or postal code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <Input
                  type="number"
                  value={formData.latitude}
                  onChange={(e) =>
                    handleInputChange(
                      "latitude",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="e.g., 4.0095"
                  step="any"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <Input
                  type="number"
                  value={formData.longitude}
                  onChange={(e) =>
                    handleInputChange(
                      "longitude",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="e.g., 9.2085"
                  step="any"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div
            className="bg-white rounded-xl p-6"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-yellow-600" />
              Pricing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night *
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm">
                      {formData.currency}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <div
                  className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600"
                  style={{
                    border: "1px solid #DDDDDD",
                    boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                  }}
                >
                  XAF (Central African CFA franc)
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div
            className="bg-white rounded-xl p-6"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  Bedrooms *
                </label>
                <Input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) =>
                    handleInputChange("bedrooms", parseInt(e.target.value) || 1)
                  }
                  placeholder="1"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  Bathrooms *
                </label>
                <Input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    handleInputChange(
                      "bathrooms",
                      parseInt(e.target.value) || 1
                    )
                  }
                  placeholder="1"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Guests *
                </label>
                <Input
                  type="number"
                  value={formData.maxGuests}
                  onChange={(e) =>
                    handleInputChange(
                      "maxGuests",
                      parseInt(e.target.value) || 1
                    )
                  }
                  placeholder="1"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div
            className="bg-white rounded-xl p-6"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Amenities
            </h2>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {commonAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => {
                      if (!formData.amenities.includes(amenity)) {
                        handleInputChange("amenities", [
                          ...formData.amenities,
                          amenity,
                        ]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.amenities.includes(amenity)
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="Add custom amenity"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAmenityAdd();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAmenityAdd}
                  disabled={!amenityInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Add
                </Button>
              </div>

              {formData.amenities.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Amenities:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {amenity}
                        <button
                          type="button"
                          onClick={() => handleAmenityRemove(amenity)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div
            className="bg-white rounded-xl p-6"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-orange-600" />
              Property Images
            </h2>

            <div className="space-y-4">
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center"
                style={{
                  borderColor: "#DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload high-quality images of your property
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Choose Images
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="bg-red-50 border border-red-200 rounded-xl p-4"
              style={{
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating Property..." : "Create Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
