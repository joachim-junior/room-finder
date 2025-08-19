"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Property, Review } from "@/types";
import {
  Button,
  Input,
  Select,
  Modal,
  Divider,
  GoogleMap,
} from "@/components/ui";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";
import BookingSession from "@/components/BookingSession";
import {
  Star,
  Heart,
  Share2,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Tv,
  Utensils,
  Snowflake,
  Coffee,
  WashingMachine,
  Lock,
  Check,
  AlertTriangle,
  MessageCircle,
  Globe,
  Shield,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  X,
  Leaf,
  Flag,
  Calendar,
  Clock,
  Award,
  Phone,
  Mail,
  Camera,
  Grid3X3,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showHostDetails, setShowHostDetails] = useState(false);
  const [showBookingSession, setShowBookingSession] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: "",
  });

  // Set mounted to true after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadProperty = async () => {
      if (!params.id) return;

      console.log("Loading property with ID:", params.id);
      setLoading(true);
      try {
        // Load property details
        const propertyResponse = await apiClient.getProperty(
          params.id as string
        );

        console.log("Property response:", propertyResponse);

        if (propertyResponse) {
          setProperty(propertyResponse);
          console.log("Property loaded from backend:", propertyResponse.title);

          // Reset selectedImage if it exceeds the new images array length
          if (
            propertyResponse.images &&
            selectedImage >= propertyResponse.images.length
          ) {
            setSelectedImage(0);
          }
        }

        // Load reviews (if the API supports it)
        try {
          const reviewsResponse = await apiClient.getPropertyReviews(
            params.id as string,
            1,
            20
          );
          console.log("Reviews response:", reviewsResponse);
          if (reviewsResponse && reviewsResponse.data) {
            setReviews(reviewsResponse.data.data);
          }
        } catch (reviewsError) {
          console.log("Reviews not available:", reviewsError);
          // Set empty reviews if the endpoint doesn't exist yet
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to load property:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [params.id]);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleBookingClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setShowBookingSession(true);
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityIcons: { [key: string]: React.ReactNode } = {
      WiFi: <Wifi className="h-5 w-5" />,
      AC: <Snowflake className="h-5 w-5" />,
      Kitchen: <Utensils className="h-5 w-5" />,
      TV: <Tv className="h-5 w-5" />,
      Parking: <Car className="h-5 w-5" />,
      "Coffee Maker": <Coffee className="h-5 w-5" />,
      "Washing Machine": <WashingMachine className="h-5 w-5" />,
      "Hair Dryer": <div className="h-5 w-5">💨</div>,
      "Smoking Allowed": <div className="h-5 w-5">🚬</div>,
      "Carbon Monoxide Alarm": <AlertTriangle className="h-5 w-5" />,
      "Smoke Alarm": <AlertTriangle className="h-5 w-5" />,
      "Lock on Bedroom Door": <Lock className="h-5 w-5" />,
    };
    return (
      amenityIcons[amenity] || (
        <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      )
    );
  };

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    if (!property) return 0;
    const nights = calculateNights();
    return (property.price || 0) * nights;
  };

  const formatDate = (dateString: string) => {
    if (!mounted) {
      // Return a simple format during SSR to prevent hydration mismatch
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Property not found</h1>
            <Link href="/properties" className="text-blue-600 hover:underline">
              Back to properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image Gallery */}
      <div className="relative">
        {/* Main Image Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-4 gap-2 h-96">
            {/* Large main image */}
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden">
              {(property.images || [])[0] ? (
                <ImageWithPlaceholder
                  src={(property.images || [])[0]}
                  alt={property.title || "Property"}
                  fill
                  className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setShowAllPhotos(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 font-bold text-2xl">
                        🏠
                      </span>
                    </div>
                    <p className="text-lg text-blue-600 font-medium">
                      Property Image
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowAllPhotos(true)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                style={{ boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)" }}
              >
                <Camera className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* Smaller images */}
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="relative rounded-xl overflow-hidden">
                {(property.images || [])[index] ? (
                  <ImageWithPlaceholder
                    src={(property.images || [])[index]}
                    alt={`${property.title || "Property"} ${index + 1}`}
                    fill
                    className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setShowAllPhotos(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">+</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
          <div
            className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 flex items-center space-x-4 shadow-lg"
            style={{
              border: "1px solid #DDDDDD",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
            <Divider orientation="vertical" className="h-6" />
            <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Header Section */}
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {property.title || "Property Title"}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-lg">
                      {property.type || "Property"} in {property.city || "City"}
                      , {property.state || "State"}
                    </span>
                  </div>

                  {/* Property Stats */}
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {property.maxGuests || 1} guest
                        {(property.maxGuests || 1) !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bed className="h-4 w-4" />
                      <span>
                        {property.bedrooms || 0} bedroom
                        {(property.bedrooms || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bath className="h-4 w-4" />
                      <span>
                        {property.bathrooms || 0} bathroom
                        {(property.bathrooms || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Favorite Badge */}
              <div
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Guest favorite
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <Star className="h-4 w-4 fill-black text-black" />
                <span className="font-medium">
                  {property.averageRating ||
                    property.reviews?.averageRating ||
                    4.5}
                </span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-600">
                  {property._count?.reviews ||
                    property.reviews?.totalReviews ||
                    0}{" "}
                  Reviews
                </span>
              </div>
            </div>

            <Divider />

            {/* Host Information */}
            <div className="flex items-start space-x-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {property.host?.firstName?.charAt(0) || "H"}
                  {property.host?.lastName?.charAt(0) || "O"}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl font-semibold">
                    Stay with {property.host?.firstName || "Host"}
                  </span>
                  <div className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                    Superhost
                  </div>
                </div>
                <div className="text-gray-600 mb-4">
                  {property._count?.reviews ||
                    property.reviews?.totalReviews ||
                    0}{" "}
                  Reviews ·{" "}
                  {property.averageRating ||
                    property.reviews?.averageRating ||
                    4.5}{" "}
                  Rating · 9 Years hosting
                </div>
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Speaks English, French</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>
                      Lives in {property.city || "City"},{" "}
                      {property.state || "State"}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  Message host
                </Button>
              </div>
            </div>

            <Divider />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this place
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description ||
                  "This beautiful property offers a comfortable and modern stay with all the amenities you need for a perfect trip."}
              </p>
            </div>

            <Divider />

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What this place offers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(property.amenities || [])
                  .slice(
                    0,
                    showAmenities ? (property.amenities || []).length : 8
                  )
                  .map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
              </div>
              {(property.amenities || []).length > 8 && (
                <button
                  onClick={() => setShowAmenities(!showAmenities)}
                  className="mt-6 text-sm font-medium underline"
                >
                  {showAmenities ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            <Divider />

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {property._count?.reviews ||
                    property.reviews?.totalReviews ||
                    0}{" "}
                  reviews
                </h2>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-black text-black" />
                  <span className="font-medium">
                    {property.averageRating ||
                      property.reviews?.averageRating ||
                      4.5}
                  </span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-6"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="font-semibold text-gray-600">
                            {review.user?.firstName?.charAt(0) || "G"}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {review.user?.firstName || "Guest"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No reviews yet</p>
                </div>
              )}
            </div>

            <Divider />

            {/* Location */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Location
              </h2>
              {property.latitude && property.longitude ? (
                <GoogleMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  title={property.title}
                  className="w-full h-96 rounded-2xl mb-4"
                />
              ) : (
                <div className="bg-gray-100 rounded-2xl h-96 mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Map view coming soon</p>
                  </div>
                </div>
              )}
              <p className="text-gray-700">
                {property.address || "Address not available"}
              </p>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Booking Card */}
              <div
                className="bg-white rounded-3xl p-8 shadow-xl"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <div className="mb-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-bold">
                      {mounted
                        ? (property.price || 0).toLocaleString()
                        : (property.price || 0).toString()}{" "}
                      {property.currency || "XAF"}
                    </span>
                    <span className="text-gray-600">per night</span>
                  </div>
                  {calculateNights() > 0 && (
                    <div className="text-sm text-gray-600">
                      {mounted
                        ? calculateTotalPrice().toLocaleString()
                        : calculateTotalPrice().toString()}{" "}
                      {property.currency || "XAF"} for {calculateNights()} night
                      {calculateNights() !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {user ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          CHECK-IN
                        </label>
                        {mounted && (
                          <Input
                            type="date"
                            value={bookingData.checkIn}
                            onChange={(e) =>
                              setBookingData((prev) => ({
                                ...prev,
                                checkIn: e.target.value,
                              }))
                            }
                            className="text-sm"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          CHECKOUT
                        </label>
                        {mounted && (
                          <Input
                            type="date"
                            value={bookingData.checkOut}
                            onChange={(e) =>
                              setBookingData((prev) => ({
                                ...prev,
                                checkOut: e.target.value,
                              }))
                            }
                            className="text-sm"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        GUESTS
                      </label>
                      <Select
                        value={bookingData.guests.toString()}
                        onChange={(e) =>
                          setBookingData((prev) => ({
                            ...prev,
                            guests: parseInt(e.target.value),
                          }))
                        }
                        options={Array.from(
                          { length: property.maxGuests || 1 },
                          (_, i) => ({
                            value: (i + 1).toString(),
                            label: `${i + 1} guest${i !== 0 ? "s" : ""}`,
                          })
                        )}
                        className="text-sm"
                      />
                    </div>

                    <Button
                      onClick={handleBookingClick}
                      disabled={!bookingData.checkIn || !bookingData.checkOut}
                      className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-red-600 transition-all"
                    >
                      Reserve
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                      You won&apos;t be charged yet
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Please log in to book this property
                    </p>
                    <Link href="/login">
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl font-semibold text-lg">
                        Login to Book
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Report listing */}
              <div className="mt-6 text-center">
                <button className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  <Flag className="h-4 w-4" />
                  <span>Report this listing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      <Modal
        isOpen={showAllPhotos}
        onClose={() => setShowAllPhotos(false)}
        className="max-w-7xl"
      >
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">All photos</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative h-96 mb-6">
            {(property.images || [])[selectedImage] && (
              <ImageWithPlaceholder
                src={(property.images || [])[selectedImage]}
                alt={`${property.title || "Property"} ${selectedImage + 1}`}
                fill
                className="object-cover rounded-2xl"
              />
            )}

            {selectedImage > 0 && (
              <button
                onClick={() => setSelectedImage(selectedImage - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                style={{ boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)" }}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}

            {selectedImage < (property.images || []).length - 1 && (
              <button
                onClick={() => setSelectedImage(selectedImage + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                style={{ boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)" }}
              >
                <ArrowRight className="h-6 w-6" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-3">
            {(property.images || []).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`h-24 rounded-xl overflow-hidden transition-all ${
                  selectedImage === index
                    ? "ring-2 ring-black"
                    : "hover:opacity-80"
                }`}
              >
                <ImageWithPlaceholder
                  src={image}
                  alt={`${property.title || "Property"} ${index + 1}`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Booking Session Modal */}
      <BookingSession
        property={property}
        isOpen={showBookingSession}
        onClose={() => setShowBookingSession(false)}
        initialBookingData={bookingData}
      />
    </div>
  );
}
