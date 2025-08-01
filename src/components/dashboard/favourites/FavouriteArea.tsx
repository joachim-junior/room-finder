"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

import icon from "@/assets/images/icon/icon_46.svg";
import featureIcon_1 from "@/assets/images/icon/icon_04.svg";
import featureIcon_2 from "@/assets/images/icon/icon_05.svg";
import featureIcon_3 from "@/assets/images/icon/icon_06.svg";

interface FavouriteProperty {
  id: number;
  title: string;
  rate: number;
  city: string;
  buyorrent: string;
  plimit: number;
  property_type: number;
  image: string;
  price: number;
  IS_FAVOURITE: number;
  address?: string;
  beds?: number;
  bathroom?: number;
  sqrft?: number;
}

const FavouriteArea = () => {
  const { user } = useAuth();
  const [favouriteProperties, setFavouriteProperties] = useState<
    FavouriteProperty[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [removingFavourite, setRemovingFavourite] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 9;

  // Fetch favourite properties
  const fetchFavouriteProperties = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_favlist.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
            property_type: "0", // 0 for all property types
            country_id: "1", // Default country ID
          }),
        }
      );

      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        setFavouriteProperties(data.propetylist || []);
        setTotalPages(
          Math.ceil((data.propetylist || []).length / itemsPerPage)
        );
      } else {
        setFavouriteProperties([]);
        if (data.ResponseCode === "200" && data.Result === "false") {
          // No favourites found
          setTotalPages(0);
        } else {
          toast.error(
            data.ResponseMsg || "Failed to load favourite properties"
          );
        }
      }
    } catch (error) {
      console.error("Error fetching favourite properties:", error);
      toast.error("An error occurred while loading favourite properties");
      setFavouriteProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Remove property from favourites
  const handleRemoveFavourite = async (propertyId: number) => {
    if (!user) {
      toast.error("Please log in to manage favourites");
      return;
    }

    setRemovingFavourite(propertyId);
    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_fav.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
            pid: propertyId.toString(),
            property_type: "1", // Default property type
          }),
        }
      );

      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("Property removed from favourites!");
        // Remove from local state
        setFavouriteProperties((prev) =>
          prev.filter((prop) => prop.id !== propertyId)
        );
        setTotalPages(
          Math.ceil((favouriteProperties.length - 1) / itemsPerPage)
        );
      } else {
        toast.error(data.ResponseMsg || "Failed to remove from favourites");
      }
    } catch (error) {
      console.error("Error removing from favourites:", error);
      toast.error("An error occurred while removing from favourites");
    } finally {
      setRemovingFavourite(null);
    }
  };

  // Handle page change
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  // Load data on component mount
  useEffect(() => {
    fetchFavouriteProperties();
  }, [user]);

  // Add a function to refresh data that can be called from parent
  const refreshData = () => {
    fetchFavouriteProperties();
  };

  // Expose refresh function to parent component
  useEffect(() => {
    // @ts-ignore
    if (window.refreshFavourites) {
      // @ts-ignore
      window.refreshFavourites = refreshData;
    }
  }, []);

  // Calculate current items for pagination
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = favouriteProperties.slice(startIndex, endIndex);

  // Update total pages when properties change
  useEffect(() => {
    setTotalPages(Math.ceil(favouriteProperties.length / itemsPerPage));
  }, [favouriteProperties]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading favourite properties...</p>
      </div>
    );
  }

  if (favouriteProperties.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="empty-state">
          <i
            className="bi bi-heart text-muted"
            style={{ fontSize: "3rem" }}
          ></i>
          <h4 className="mt-3">No Favourite Properties</h4>
          <p className="text-muted">
            You haven&apos;t added any properties to your favourites yet.
          </p>
          <Link
            href="/listing_01"
            className="btn btn-primary mt-3"
            style={{
              backgroundColor: "var(--bs-primary)",
              color: "white",
              borderColor: "var(--bs-primary)",
            }}
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row gx-xxl-5">
        {currentItems.map((item: FavouriteProperty) => (
          <div
            key={item.id}
            className="col-lg-4 col-md-6 d-flex mb-50 wow fadeInUp"
          >
            <div className="listing-card-one border-25 h-100 w-100">
              <div className="img-gallery p-15">
                <div className="position-relative border-25 overflow-hidden">
                  <div className="tag border-25 bg-primary">
                    {item.buyorrent === "rent" ? "For Rent" : "For Sale"}
                  </div>
                  <button
                    className="fav-btn tran3s active"
                    onClick={() => handleRemoveFavourite(item.id)}
                    disabled={removingFavourite === item.id}
                    title="Remove from favourites"
                  >
                    {removingFavourite === item.id ? (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <i className="fa-solid fa-heart"></i>
                    )}
                  </button>
                  <div className="property-image">
                    <Link
                      href={`/listing_details_01/${item.id}`}
                      className="d-block"
                    >
                      <Image
                        src={
                          item.image
                            ? item.image.startsWith("http")
                              ? item.image
                              : `https://cpanel.roomfinder237.com/${item.image}`
                            : "/images/listing/listing_01.jpg"
                        }
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-100"
                        style={{ objectFit: "cover", height: "250px" }}
                        onError={(e) => {
                          // Fallback to default image if loading fails
                          const target = e.target as HTMLImageElement;
                          console.log(`Image failed to load: ${target.src}`);
                          target.src = "/images/listing/listing_01.jpg";
                        }}
                        onLoad={() => {
                          console.log(
                            `Image loaded successfully: ${item.image}`
                          );
                        }}
                        unoptimized={true}
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="property-info p-25">
                <Link
                  href={`/listing_details_01/${item.id}`}
                  className="title tran3s"
                >
                  {item.title}
                </Link>
                <div className="address">{item.city}</div>
                <ul className="style-none feature d-flex flex-wrap align-items-center justify-content-between">
                  <li className="d-flex align-items-center">
                    <Image
                      src={featureIcon_1}
                      alt=""
                      className="lazy-img icon me-2"
                    />
                    <span className="fs-16">{item.sqrft || "N/A"} sqft</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <Image
                      src={featureIcon_2}
                      alt=""
                      className="lazy-img icon me-2"
                    />
                    <span className="fs-16">{item.beds || "N/A"} bed</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <Image
                      src={featureIcon_3}
                      alt=""
                      className="lazy-img icon me-2"
                    />
                    <span className="fs-16">{item.bathroom || "N/A"} bath</span>
                  </li>
                </ul>
                <div className="pl-footer top-border d-flex align-items-center justify-content-between">
                  <strong className="price fw-500 color-dark">
                    {item.price.toLocaleString()} XAF
                    {item.buyorrent === "rent" && (
                      <>
                        / <sub>m</sub>
                      </>
                    )}
                  </strong>
                  <Link
                    href={`/listing_details_01/${item.id}`}
                    className="btn-four rounded-circle"
                  >
                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel={<Image src={icon} alt="" className="ms-2" />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPages}
          previousLabel={<Image src={icon} alt="" className="ms-2" />}
          renderOnZeroPageCount={null}
          className="pagination-one d-flex align-items-center style-none pt-20"
          activeClassName="active"
        />
      )}
    </>
  );
};

export default FavouriteArea;
