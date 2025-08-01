"use client";
import Fancybox from "@/components/common/Fancybox";
import property_data from "@/data/home-data/PropertyData";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const setting = {
  dots: true,
  arrows: false,
  centerPadding: "0px",
  slidesToShow: 3,
  slidesToScroll: 2,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const CommonSimilarProperty = ({
  currentPropertyId,
}: {
  currentPropertyId: number | string;
}) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openShare, setOpenShare] = useState<number | null>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuth();
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
        if (
          data.Result === "true" &&
          data.HomeData &&
          Array.isArray(data.HomeData.Featured_Property)
        ) {
          setProperties(
            data.HomeData.Featured_Property.filter(
              (item: any) => String(item.id) !== String(currentPropertyId)
            )
          );
        } else {
          setProperties([]);
          setError("No similar properties found.");
        }
      } catch (err) {
        setError("Failed to fetch similar properties.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [currentPropertyId]);

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

  // Helper to copy link
  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const handleFavorite = async (
    propertyId: string | number,
    propertyType: string | number = 1
  ) => {
    if (!user || !user.id) {
      toast.error("You must be logged in to favorite a property.");
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
        toast.success(data.ResponseMsg || "Favorite updated!");
      } else {
        toast.error(data.ResponseMsg || "Failed to update favorite.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setFavLoading((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  return (
    <div className="similar-property">
      <h4 className="mb-40">Similar Homes You May Like</h4>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : (
        <div className="row">
          {properties.slice(0, 3).map((item, idx) => {
            const propertyUrl = `${window.location.origin}/listing_details_01/${item.id}`;
            return (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="listing-card-one shadow4 style-three border-30 mb-50">
                  <div className="img-gallery p-15">
                    <div className="position-relative border-20 overflow-hidden">
                      <div className="tag bg-white text-dark fw-500 border-20">
                        {item.buyorrent?.toUpperCase()}
                      </div>
                      <img
                        src={
                          item.image &&
                          typeof item.image === "string" &&
                          item.image.trim() !== ""
                            ? item.image.startsWith("http")
                              ? item.image
                              : `https://cpanel.roomfinder237.com/${item.image}`
                            : "/assets/images/media/no_image.jpg"
                        }
                        className="w-100 border-20"
                        alt={item.title}
                        style={{ maxHeight: 200, objectFit: "cover" }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("no_image.jpg")) {
                            target.src = "/assets/images/media/no_image.jpg";
                          }
                        }}
                      />
                      <Link
                        href={`/listing_details_01/${item.id}`}
                        className="btn-four inverse rounded-circle position-absolute"
                      >
                        <i className="bi bi-arrow-up-right"></i>
                      </Link>
                    </div>
                  </div>
                  <div
                    className="property-info pe-4 ps-4 position-relative"
                    style={{ overflow: "visible" }}
                  >
                    <Link
                      href={`/listing_details_01/${item.id}`}
                      className="title tran3s"
                    >
                      {item.title}
                    </Link>
                    <div className="address m0 pb-5">
                      {item.city || "Cameroon"}
                    </div>
                    <div className="pl-footer m0 d-flex align-items-center justify-content-between">
                      <strong className="price fw-500 color-dark">
                        {item.price?.toLocaleString()} XAF
                      </strong>
                      <ul className="style-none d-flex align-items-center action-btns justify-content-end m-0">
                        <li>
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
                        </li>
                        <li>
                          <button
                            type="button"
                            className="d-flex align-items-center justify-content-center tran3s rounded-circle border-0 bg-transparent"
                            style={{ padding: 0 }}
                            onClick={() => {
                              const propertyUrl = `${window.location.origin}/listing_details_01/${item.id}`;
                              navigator.clipboard.writeText(propertyUrl);
                              toast.success(
                                "Property link copied to clipboard!"
                              );
                            }}
                          >
                            <i
                              className="fa-sharp fa-regular fa-share-nodes"
                              style={{ fontSize: "0.95rem" }}
                            ></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommonSimilarProperty;
