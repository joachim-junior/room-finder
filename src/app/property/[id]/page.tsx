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
  Label,
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
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageForm, setMessageForm] = useState({
    subject: "",
    message: "",
    priority: "NORMAL" as "LOW" | "NORMAL" | "HIGH" | "URGENT",
  });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !user) return;

    // Clear previous errors
    setMessageError(null);

    // Frontend validation
    if (messageForm.message.length < 10) {
      setMessageError("Message must be at least 10 characters long");
      return;
    }
    if (messageForm.message.length > 1000) {
      setMessageError("Message must be no more than 1000 characters long");
      return;
    }
    if (messageForm.subject.trim().length === 0) {
      setMessageError("Subject is required");
      return;
    }

    setSendingMessage(true);
    try {
      await apiClient.createEnquiry({
        propertyId: property.id,
        subject: messageForm.subject.trim(),
        message: messageForm.message.trim(),
        priority: messageForm.priority,
      });

      // Reset form and close modal
      setMessageForm({
        subject: "",
        message: "",
        priority: "NORMAL",
      });
      setMessageError(null);
      setShowMessageModal(false);

      // Show success message (you can implement a toast notification here)
      alert("Message sent successfully! The host will respond soon.");
    } catch (error: any) {
      console.error("Failed to send message:", error);

      // Handle specific API validation errors
      if (error?.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const messageError = validationErrors.find(
          (err: any) => err.path === "message"
        );
        if (messageError) {
          setMessageError(messageError.msg);
        } else {
          setMessageError(validationErrors[0]?.msg || "Validation failed");
        }
      } else if (error?.message) {
        setMessageError(error.message);
      } else {
        setMessageError("Failed to send message. Please try again.");
      }
    } finally {
      setSendingMessage(false);
    }
  };

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

  // Touch handlers for mobile slider
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const totalImages = property?.images?.length || 0;

    if (isLeftSwipe && selectedImage < totalImages - 1) {
      setSelectedImage(selectedImage + 1);
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const goToSlide = (index: number) => {
    setSelectedImage(index);
  };

  const nextSlide = () => {
    const totalImages = property?.images?.length || 0;
    if (selectedImage < totalImages - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const prevSlide = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
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

  const handleShare = () => {
    if (navigator.share && property) {
      navigator
        .share({
          title: property.title,
          text: `Check out this amazing property: ${property.title}`,
          url: window.location.href,
        })
        .catch((error: unknown) => {
          console.log("Error sharing:", error);
          // Fallback to copying URL to clipboard
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied to clipboard!");
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleFavorite = () => {
    // TODO: Implement favorite functionality with API
    console.log("Favorite clicked for property:", property?.id);
    alert("Favorite functionality coming soon!");
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
        {/* Mobile Slider */}
        <div className="sm:hidden">
          <div className="relative h-64 bg-gray-100">
            {/* Slider Container */}
            <div
              className="relative w-full h-full overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-out h-full"
                style={{ transform: `translateX(-${selectedImage * 100}%)` }}
              >
                {(property.images || []).map((image, index) => (
                  <div key={index} className="min-w-full h-full relative">
                    <ImageWithPlaceholder
                      src={image}
                      alt={`${property.title || "Property"} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {selectedImage > 0 && (
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
            )}

            {selectedImage < (property.images || []).length - 1 && (
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            )}

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {(property.images || []).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    selectedImage === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Show all photos button */}
            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg"
            >
              <Camera className="h-4 w-4 text-gray-700" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-sm font-medium">
                {selectedImage + 1} / {(property.images || []).length}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop/Tablet Grid */}
        <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-80 lg:h-96">
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
              <div
                key={index}
                className={`relative rounded-xl overflow-hidden ${
                  index > 2 ? "hidden lg:block" : ""
                }`}
              >
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
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 hidden sm:block">
          <div
            className="bg-white/95 backdrop-blur-md rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-4 shadow-lg"
            style={{
              border: "1px solid rgb(221, 221, 221)",
              boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">
                Share
              </span>
            </button>
            <Divider orientation="vertical" className="h-4 sm:h-6" />
            <button
              onClick={handleFavorite}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-0 pb-24 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="col-span-1 lg:col-span-2 space-y-8 lg:space-y-12">
            {/* Header Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
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
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600">
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

              {/* Property Type Badge */}
              <div
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6"
                style={{
                  border: "1px solid #DDDDDD",
                  boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                }}
              >
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {property?.type
                    ?.toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase()) || "Property"}
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
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    if (!user) {
                      router.push("/login");
                      return;
                    }
                    setShowMessageModal(true);
                    setMessageError(null);
                  }}
                >
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
                      style={{ border: "1px solid rgb(221, 221, 221)" }}
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
              <div className="space-y-4">
                <p className="text-gray-700 text-lg">
                  {property.address || "Address not available"}
                </p>
                {property.latitude && property.longitude ? (
                  <button
                    onClick={() => {
                      const googleMapsUrl = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
                      window.open(googleMapsUrl, "_blank");
                    }}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Open Map on Google</span>
                  </button>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      Location coordinates not available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1 order-first lg:order-last hidden sm:block">
            <div className="lg:sticky lg:top-8">
              {/* Booking Card */}
              <div
                className="bg-white rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl"
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
                  <div className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Message Host Modal */}
      <Modal
        isOpen={showMessageModal}
        onClose={() => {
          setShowMessageModal(false);
          setMessageError(null);
        }}
        title="Message Host"
        className="max-w-2xl"
      >
        <form onSubmit={handleSendMessage} className="space-y-6">
          {messageError && (
            <div
              className="bg-red-50 border border-red-200 rounded-lg p-3"
              style={{ border: "1px solid rgb(221, 221, 221)" }}
            >
              <p className="text-red-800 text-sm">{messageError}</p>
            </div>
          )}

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={messageForm.subject}
              onChange={(e) => {
                setMessageForm({ ...messageForm, subject: e.target.value });
                if (messageError) setMessageError(null);
              }}
              placeholder="What would you like to ask about?"
              required
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              value={messageForm.priority}
              onChange={(e) =>
                setMessageForm({
                  ...messageForm,
                  priority: e.target.value as
                    | "LOW"
                    | "NORMAL"
                    | "HIGH"
                    | "URGENT",
                })
              }
              options={[
                { value: "LOW", label: "Low" },
                { value: "NORMAL", label: "Normal" },
                { value: "HIGH", label: "High" },
                { value: "URGENT", label: "Urgent" },
              ]}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="message">Message</Label>
              <span
                className={`text-xs ${
                  messageForm.message.length < 10
                    ? "text-red-500"
                    : messageForm.message.length > 1000
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {messageForm.message.length}/1000 characters (minimum 10)
              </span>
            </div>
            <textarea
              id="message"
              value={messageForm.message}
              onChange={(e) => {
                setMessageForm({ ...messageForm, message: e.target.value });
                if (messageError) setMessageError(null);
              }}
              placeholder="Type your message here... (minimum 10 characters)"
              rows={5}
              className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              style={{
                border:
                  messageForm.message.length < 10 &&
                  messageForm.message.length > 0
                    ? "1px solid rgb(252, 165, 165)"
                    : messageForm.message.length > 1000
                    ? "1px solid rgb(252, 165, 165)"
                    : "1px solid rgb(221, 221, 221)",
              }}
              required
              minLength={10}
              maxLength={1000}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowMessageModal(false);
                setMessageError(null);
              }}
              disabled={sendingMessage}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={sendingMessage}>
              {sendingMessage ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Mobile Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white p-4 sm:hidden z-50"
        style={{
          borderTop: "1px solid rgb(221, 221, 221)",
          boxShadow: "0 -4px 12px 0 rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-50 transition-colors"
              style={{ border: "1px solid rgb(221, 221, 221)" }}
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleFavorite}
              className="p-2 rounded-full hover:bg-gray-50 transition-colors"
              style={{ border: "1px solid rgb(221, 221, 221)" }}
            >
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 text-right px-4">
            <div className="text-lg font-bold text-gray-900">
              {mounted
                ? (property?.price || 0).toLocaleString()
                : (property?.price || 0).toString()}{" "}
              {property?.currency || "XAF"}
            </div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
          <Button
            onClick={handleBookingClick}
            className="px-6 py-3 font-semibold"
          >
            Reserve
          </Button>
        </div>
      </div>
    </div>
  );
}
