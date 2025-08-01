"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import BookingModal from "@/components/modals/BookingModal";
import { useAuth } from "@/contexts/AuthContext";
import propertyShape from "@/assets/images/shape/shape_17.svg";

interface ApiProperty {
  id: number;
  title: string;
  rate?: number;
  buyorrent?: string;
  plimit?: number;
  city?: string;
  image?: string;
  property_type?: number;
  price: number;
  IS_FAVOURITE?: number;
  beds?: number;
  bathroom?: number;
}

const Property = () => {
  const { isAuthenticated, user } = useAuth();
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    guesthouse: any;
  }>({
    isOpen: false,
    guesthouse: null,
  });
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favLoading, setFavLoading] = useState<{ [key: string]: boolean }>({});
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_home_data.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: "0",
              country_id: "1",
            }),
          }
        );
        const data = await res.json();
        console.log("API Response from u_home_data.php:", data);
        if (
          data.Result === "true" &&
          data.HomeData &&
          Array.isArray(data.HomeData.Featured_Property)
        ) {
          setProperties(data.HomeData.Featured_Property);
        } else {
          console.log("No data found or invalid response structure", data);
          setProperties([]);
          setError("No guesthouses found.");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch guesthouses.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [user?.id]);

  // Fetch favorites on mount if authenticated
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !user.id) return;
      try {
        const res = await fetch(
          "https://cpanel.roomfinder237.com/user_api/u_favlist.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: user.id,
              property_type: "0",
              country_id: "1",
            }),
          }
        );
        const data = await res.json();
        if (data.Result === "true" && Array.isArray(data.propetylist)) {
          const favMap: { [key: string]: boolean } = {};
          data.propetylist.forEach((item: any) => {
            favMap[item.id] = true;
          });
          setFavorites(favMap);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchFavorites();
  }, [user]);

  const handleFavorite = async (
    propertyId: string | number,
    propertyType: string | number = 1
  ) => {
    if (!user || !user.id) {
      alert("You must be logged in to favorite a property.");
      return;
    }
    setFavLoading((prev) => ({ ...prev, [propertyId]: true }));
    try {
      const res = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_fav.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            pid: propertyId,
            property_type: propertyType,
          }),
        }
      );
      const data = await res.json();
      if (data.Result === "true") {
        setFavorites((prev) => ({ ...prev, [propertyId]: !prev[propertyId] }));
        alert(data.ResponseMsg || "Favorite updated!");
      } else {
        alert(data.ResponseMsg || "Failed to update favorite.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setFavLoading((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  const handleBookNow = (guesthouse: any) => {
    setBookingModal({
      isOpen: true,
      guesthouse,
    });
  };

  const closeBookingModal = () => {
    setBookingModal({
      isOpen: false,
      guesthouse: null,
    });
  };

  return (
    <div className="xl-mt-120 property-listing-two position-relative z-1 mt-150 pb-150 xl-pb-120 lg-pb-80">
      <div className="container">
        <div className="position-relative">
          <div className="title-one mb-25 lg-mb-20 wow fadeInUp">
            <h2 className="font-garamond">Featured Guesthouses</h2>
            <p className="fs-22 mt-xs">
              Explore the best guesthouses and rooms for your stay in Cameroon.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">Loading guesthouses...</div>
          ) : error ? (
            <div className="text-center text-danger py-5">{error}</div>
          ) : (
            <div className="row gx-xxl-5">
              {properties.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="col-lg-4 col-md-6 d-flex mt-40 wow fadeInUp"
                >
                  <div className="listing-card-one style-two h-100 w-100 ">
                    <div className="img-gallery">
                      <div className="position-relative overflow-hidden">
                        <div className="tag fw-500">AVAILABLE</div>
                        <div className="carousel slide">
                          <div className="carousel-inner">
                            <div className="carousel-item active">
                              <Link href="#" className="d-block">
                                <Image
                                  src={
                                    item.image
                                      ? item.image.startsWith("http")
                                        ? item.image
                                        : `https://cpanel.roomfinder237.com/${item.image}`
                                      : "/assets/images/media/no_image.jpg"
                                  }
                                  className="w-100"
                                  alt={item.title}
                                  width={400}
                                  height={250}
                                  style={{
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    console.log(
                                      `Property image failed to load: ${target.src}`
                                    );
                                    if (!target.src.includes("no_image.jpg")) {
                                      target.src =
                                        "/assets/images/media/no_image.jpg";
                                    }
                                  }}
                                  onLoad={() => {
                                    console.log(
                                      `Property image loaded successfully: ${item.image}`
                                    );
                                  }}
                                  unoptimized={true}
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="property-info p-25">
                      <Link href="#" className="title tran3s">
                        {item.title}
                      </Link>
                      <div className="address">{item.city || "Cameroon"}</div>
                      <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between pb-5">
                        <li className="d-flex align-items-center">
                          <i className="bi bi-people me-2"></i>
                          <span className="fs-16">
                            {item.plimit || 4} guest
                          </span>
                        </li>
                        {item.beds && (
                          <li className="d-flex align-items-center">
                            <i className="bi bi-bed me-2"></i>
                            <span className="fs-16">
                              {item.beds} bed{item.beds > 1 ? "s" : ""}
                            </span>
                          </li>
                        )}
                        {item.bathroom && (
                          <li className="d-flex align-items-center">
                            <i className="bi bi-droplet me-2"></i>
                            <span className="fs-16">
                              {item.bathroom} bath{item.bathroom > 1 ? "s" : ""}
                            </span>
                          </li>
                        )}
                        <li className="d-flex align-items-center">
                          <i className="bi bi-star-fill me-2"></i>
                          <span className="fs-16">{item.rate || 4}★</span>
                        </li>
                      </ul>
                      <div className="pl-footer top-border d-flex align-items-center justify-content-between">
                        <strong className="price fw-500 color-dark">
                          {item.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          XAF
                        </strong>
                        <div className="d-flex gap-2">
                          <Link
                            href={`/listing_details_01/${item.id}`}
                            className="btn-four"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button
                            onClick={() => handleBookNow(item)}
                            className="btn-four"
                            title={
                              isAuthenticated ? "Book Now" : "Login to Book"
                            }
                          >
                            <i className="bi bi-calendar-check"></i>
                          </button>
                          <button
                            type="button"
                            className="d-flex align-items-center justify-content-center tran3s rounded-circle border-0 bg-transparent"
                            style={{ padding: 0 }}
                            disabled={favLoading[item.id]}
                            onClick={() =>
                              handleFavorite(item.id, item.property_type)
                            }
                          >
                            <i
                              className={
                                favorites[item.id]
                                  ? "fa-solid fa-bookmark"
                                  : "fa-light fa-bookmark"
                              }
                              style={{
                                fontSize: "0.95rem",
                                color: favorites[item.id]
                                  ? "#0072c6"
                                  : undefined,
                              }}
                            ></i>
                          </button>
                          <button
                            type="button"
                            className="d-flex align-items-center justify-content-center tran3s rounded-circle border-0 bg-transparent"
                            style={{ padding: 0 }}
                            onClick={() => {
                              const propertyUrl = `${window.location.origin}/listing_details_01/${item.id}`;
                              navigator.clipboard.writeText(propertyUrl);
                              alert("Property link copied to clipboard!");
                            }}
                          >
                            <i
                              className="fa-sharp fa-regular fa-share-nodes"
                              style={{ fontSize: "0.95rem" }}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="section-btn text-center md-mt-60">
            <Link href="/listing_05" className="btn-eight">
              <span>Explore All Guesthouses</span>{" "}
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>
        </div>
      </div>
      <Image src={propertyShape} alt="" className="lazy-img shapes shape_01" />

      {bookingModal.isOpen && (
        <BookingModal
          isOpen={bookingModal.isOpen}
          onClose={closeBookingModal}
          guesthouse={bookingModal.guesthouse}
        />
      )}
    </div>
  );
};

export default Property;
