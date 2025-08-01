"use client";
import { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import NiceSelect from "@/ui/NiceSelect";
import UserReview from "./UserReview";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const ReviewBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Fetch user's reviews from bookings
  const fetchUserReviews = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // First, get user's bookings
      const bookingsResponse = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_my_book.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
            status: "all", // Get all bookings
          }),
        }
      );

      const bookingsData = await bookingsResponse.json();

      if (
        bookingsData.ResponseCode === "200" &&
        bookingsData.Result === "true"
      ) {
        const bookings = bookingsData.statuswise || [];

        // Fetch review details for each booking
        const reviewsWithDetails = await Promise.all(
          bookings.map(async (booking: any) => {
            try {
              const reviewResponse = await fetch(
                "https://cpanel.roomfinder237.com/user_api/my_book_details.php",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    book_id: booking.book_id.toString(),
                    uid: user.id.toString(),
                  }),
                }
              );

              const reviewData = await reviewResponse.json();

              if (
                reviewData.ResponseCode === "200" &&
                reviewData.Result === "true"
              ) {
                const details = reviewData.bookdetails;
                return {
                  id: booking.book_id,
                  property_title: booking.prop_title,
                  property_image: booking.prop_img,
                  booking_date: booking.book_date,
                  check_in: details.check_in,
                  check_out: details.check_out,
                  total_rate: details.total_rate || 0,
                  rate_text: details.rate_text || "",
                  is_rated: details.is_rate === 1,
                  book_status: details.book_status,
                  property_price: details.prop_price,
                  total_amount: details.total,
                  customer_name: details.customer_name || user.name,
                  customer_mobile: details.customer_mobile || user.mobile,
                };
              }
              return null;
            } catch (error) {
              console.error("Error fetching review details:", error);
              return null;
            }
          })
        );

        // Filter out null values and reviews that have been rated
        const validReviews = reviewsWithDetails.filter(
          (review) => review && review.is_rated
        );

        // Sort reviews based on selected option
        const sortedReviews = sortReviews(validReviews, sortBy);

        setReviews(sortedReviews);
        setTotalReviews(validReviews.length);
        setTotalPages(Math.ceil(validReviews.length / 5)); // 5 reviews per page
      } else {
        toast.error(bookingsData.ResponseMsg || "Failed to load reviews");
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("An error occurred while loading reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort reviews based on criteria
  const sortReviews = (reviews: any[], sortBy: string) => {
    switch (sortBy) {
      case "newest":
        return reviews.sort(
          (a, b) =>
            new Date(b.booking_date).getTime() -
            new Date(a.booking_date).getTime()
        );
      case "oldest":
        return reviews.sort(
          (a, b) =>
            new Date(a.booking_date).getTime() -
            new Date(b.booking_date).getTime()
        );
      case "rating_high":
        return reviews.sort((a, b) => b.total_rate - a.total_rate);
      case "rating_low":
        return reviews.sort((a, b) => a.total_rate - b.total_rate);
      default:
        return reviews;
    }
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sortedReviews = sortReviews(reviews, value);
    setReviews(sortedReviews);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Load data on component mount
  useEffect(() => {
    fetchUserReviews();
  }, [user]);

  // Calculate current reviews for pagination
  const startIndex = (currentPage - 1) * 5;
  const endIndex = startIndex + 5;
  const currentReviews = reviews.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <DashboardHeaderTwo title="Reviews" />
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <DashboardHeaderTwo title="Reviews" />
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={fetchUserReviews}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <h2 className="main-title d-block d-lg-none">Reviews</h2>

        <div className="d-sm-flex align-items-center justify-content-between mb-25">
          <div className="fs-16">
            Showing{" "}
            <span className="color-dark fw-500">
              {reviews.length > 0
                ? `${startIndex + 1}–${Math.min(endIndex, reviews.length)}`
                : "0"}
            </span>{" "}
            of <span className="color-dark fw-500">{totalReviews}</span> results
          </div>
          <div className="d-flex ms-auto xs-mt-30">
            <div className="short-filter d-flex align-items-center ms-sm-auto">
              <div className="fs-16 me-2">Sort by:</div>
              <NiceSelect
                className="nice-select"
                options={[
                  { value: "newest", text: "Newest" },
                  { value: "oldest", text: "Oldest" },
                  { value: "rating_high", text: "Rating High" },
                  { value: "rating_low", text: "Rating Low" },
                ]}
                defaultCurrent={0}
                onChange={(e) => handleSortChange(e.target.value)}
                name="sort"
                placeholder=""
              />
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white card-box border-20 text-center py-5">
            <div className="empty-state">
              <i
                className="bi bi-star text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h4 className="mt-3">No Reviews Found</h4>
              <p className="text-muted">
                You haven&apos;t written any reviews yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white card-box pt-0 border-20">
            <div className="theme-details-one">
              <div className="review-panel-one">
                <div className="position-relative z-1">
                  <div className="review-wrapper">
                    <UserReview reviews={currentReviews} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <ul className="pagination-one d-flex align-items-center style-none pt-40">
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={currentPage === i + 1 ? "selected" : ""}>
                <button
                  onClick={() => handlePageChange(i + 1)}
                  className="btn-link"
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                  }}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReviewBody;
