"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Home,
  Upload,
  MapPin,
  DollarSign,
  Users,
  Bed,
  Bath,
  Loader2,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { Card, Input, Textarea, Select, Button } from "@/components/ui";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";

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
  existingImages: string[];
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyNotFound, setPropertyNotFound] = useState(false);

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
    existingImages: [],
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showValidation, setShowValidation] = useState(false);
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

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.getProperty(propertyId);
        console.log("Property fetch response:", response);

        // Handle different response formats
        let property;
        if (response && typeof response === "object") {
          if ("success" in response && response.success && response.data) {
            // ApiResponse format
            property = response.data.property || response.data;
          } else if ("id" in response) {
            // Direct property object
            property = response;
          } else {
            throw new Error("Invalid response format");
          }
        } else {
          throw new Error("No response received");
        }

        console.log("Property data:", property);

        if (property && property.id && property.id !== "fallback") {
          // Clear any existing validation errors when data loads successfully
          setValidationErrors({});
          setShowValidation(false);
          setError(null);
          setFormData({
            title: property.title || "",
            description: property.description || "",
            type: property.type || "APARTMENT",
            address: property.address || "",
            city: property.city || "",
            state: property.state || "",
            country: property.country || "Cameroon",
            zipCode: property.zipCode || "",
            latitude: property.latitude || 0,
            longitude: property.longitude || 0,
            price: property.price || 0,
            currency: property.currency || "XAF",
            bedrooms: property.bedrooms || 1,
            bathrooms: property.bathrooms || 1,
            maxGuests: property.maxGuests || 1,
            amenities: property.amenities || [],
            images: [],
            existingImages: property.images || [],
          });
        } else {
          setPropertyNotFound(true);
          setError("Property not found");
        }
      } catch (err: any) {
        console.error("Error fetching property:", err);
        setPropertyNotFound(true);
        setError(err.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      errors.title = "Property title is required";
    } else if (formData.title.trim().length < 5) {
      errors.title = "Property title must be at least 5 characters long";
    } else if (formData.title.trim().length > 100) {
      errors.title = "Property title must be less than 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Property description is required";
    } else if (formData.description.trim().length < 20) {
      errors.description =
        "Property description must be at least 20 characters long";
    } else if (formData.description.trim().length > 1000) {
      errors.description =
        "Property description must be less than 1000 characters";
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters long";
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = "City is required";
    } else if (formData.city.trim().length < 2) {
      errors.city = "City must be at least 2 characters long";
    }

    // State validation
    if (!formData.state.trim()) {
      errors.state = "State/Province is required";
    } else if (formData.state.trim().length < 2) {
      errors.state = "State/Province must be at least 2 characters long";
    }

    // Country validation
    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }

    // Price validation
    if (!formData.price || formData.price <= 0) {
      errors.price = "Price must be greater than 0";
    } else if (formData.price > 1000000) {
      errors.price = "Price cannot exceed 1,000,000 XAF";
    }

    // Bedrooms validation
    if (!formData.bedrooms || formData.bedrooms < 1) {
      errors.bedrooms = "At least 1 bedroom is required";
    } else if (formData.bedrooms > 20) {
      errors.bedrooms = "Number of bedrooms cannot exceed 20";
    }

    // Bathrooms validation
    if (!formData.bathrooms || formData.bathrooms < 1) {
      errors.bathrooms = "At least 1 bathroom is required";
    } else if (formData.bathrooms > 20) {
      errors.bathrooms = "Number of bathrooms cannot exceed 20";
    }

    // Max guests validation
    if (!formData.maxGuests || formData.maxGuests < 1) {
      errors.maxGuests = "At least 1 guest is required";
    } else if (formData.maxGuests > 50) {
      errors.maxGuests = "Maximum guests cannot exceed 50";
    }

    // Latitude validation (only if not 0, as 0 might be a default value)
    if (
      formData.latitude !== 0 &&
      (formData.latitude < -90 || formData.latitude > 90)
    ) {
      errors.latitude = "Latitude must be between -90 and 90 degrees";
    }

    // Longitude validation (only if not 0, as 0 might be a default value)
    if (
      formData.longitude !== 0 &&
      (formData.longitude < -180 || formData.longitude > 180)
    ) {
      errors.longitude = "Longitude must be between -180 and 180 degrees";
    }

    // Amenities validation (only if user has removed all amenities)
    if (formData.amenities.length === 0) {
      errors.amenities = "At least one amenity is required";
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

  const handleRemoveExistingImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img !== imageUrl),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      console.log("🚀 Starting property update process...");
      console.log("📝 Form data:", formData);

      // Show validation and validate form
      setShowValidation(true);
      if (!validateForm()) {
        setSaving(false);
        const errorCount = Object.keys(validationErrors).length;
        setError(
          `Please fix the ${errorCount} validation error${
            errorCount > 1 ? "s" : ""
          } before submitting.`
        );
        return;
      }

      // Upload new images if any
      let newImageUrls: string[] = [];
      if (formData.images.length > 0) {
        console.log("📤 Uploading new images...");
        try {
          const uploadResponse = await apiClient.uploadImages(formData.images);
          console.log("📤 Upload response:", uploadResponse);

          if (uploadResponse.success && uploadResponse.data) {
            newImageUrls =
              uploadResponse.data.images || uploadResponse.data.urls || [];
            console.log("✅ New images uploaded successfully:", newImageUrls);
          } else {
            console.warn("⚠️ Image upload response:", uploadResponse);
          }
        } catch (uploadError) {
          console.error("❌ Image upload failed:", uploadError);
        }
      }

      // Combine existing and new images
      const allImages = [...formData.existingImages, ...newImageUrls];

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
        images: allImages,
      };

      console.log("🏠 Updating property with data:", propertyData);

      // Update property
      const response = await apiClient.updateProperty(propertyId, propertyData);
      console.log("🏠 Property update response:", response);

      if (response.success) {
        console.log("✅ Property updated successfully!");
        // Redirect immediately after successful update
        router.push("/dashboard?section=properties");
        return;
      } else {
        console.error("❌ Property update failed:", response);
        setError(response.message || "Failed to update property");
      }
    } catch (err: any) {
      console.error("❌ Error updating property:", err);
      setError(err.message || "Failed to update property. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard?section=properties");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (propertyNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div
          className="bg-white rounded-xl p-8 text-center max-w-md w-full mx-4"
          style={{
            border: "1px solid #DDDDDD",
            boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
          }}
        >
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Properties
          </button>
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
            <p className="text-gray-600 mt-1">
              Update your property details and information
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
                  error={showValidation && !!validationErrors.title}
                />
                {showValidation && validationErrors.title && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <svg
                      className="h-4 w-4 mr-1 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
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
                  error={!!validationErrors.description}
                />
                {validationErrors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.description}
                  </p>
                )}
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
                  error={!!validationErrors.address}
                />
                {validationErrors.address && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.address}
                  </p>
                )}
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
                  error={!!validationErrors.city}
                />
                {validationErrors.city && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.city}
                  </p>
                )}
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
                  error={!!validationErrors.state}
                />
                {validationErrors.state && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.state}
                  </p>
                )}
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
                  error={!!validationErrors.country}
                />
                {validationErrors.country && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.country}
                  </p>
                )}
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
                    error={!!validationErrors.price}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm">
                      {formData.currency}
                    </span>
                  </div>
                </div>
                {validationErrors.price && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.price}
                  </p>
                )}
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
                  error={!!validationErrors.bedrooms}
                />
                {validationErrors.bedrooms && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.bedrooms}
                  </p>
                )}
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
                  error={!!validationErrors.bathrooms}
                />
                {validationErrors.bathrooms && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.bathrooms}
                  </p>
                )}
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
                  error={!!validationErrors.maxGuests}
                />
                {validationErrors.maxGuests && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.maxGuests}
                  </p>
                )}
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
              {/* Existing Images */}
              {formData.existingImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Current Images:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {formData.existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <ImageWithPlaceholder
                          src={
                            imageUrl.startsWith("http")
                              ? imageUrl
                              : `https://api.roomfinder237.com/${imageUrl}`
                          }
                          alt={`Property image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(imageUrl)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center"
                style={{
                  borderColor: "#DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload additional images for your property
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

              {/* New Images Preview */}
              {formData.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    New Images to Upload:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
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
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="bg-red-50 rounded-xl p-4"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Errors Summary */}
          {showValidation && Object.keys(validationErrors).length > 0 && (
            <div
              className="bg-yellow-50 rounded-xl p-4"
              style={{
                border: "1px solid #DDDDDD",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Please fix the following errors:
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(validationErrors).map(
                        ([field, message]) => (
                          <li key={field}>
                            <strong>
                              {field.charAt(0).toUpperCase() + field.slice(1)}:
                            </strong>{" "}
                            {message}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
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
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Updating Property..." : "Update Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
