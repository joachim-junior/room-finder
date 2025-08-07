"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface BookingData {
  book_id: number;
  prop_id: number;
  prop_img: string;
  prop_title: string;
  p_method_id: number;
  prop_price: number;
  total_day: number;
  rate: number;
  book_status: string;
  check_in?: string;
  check_out?: string;
  booking_date?: string;
  total_amount?: number;
}

const BookingsBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingData[]>([]);

  // Fetch bookings data
  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_my_book.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            status: "active",
          }),
        }
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        setBookings(data.statuswise || []);
      } else {
        toast.error(
          `❌ Failed to load bookings: ${data.ResponseMsg || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("❌ An error occurred while loading bookings");
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId: number) => {
    if (!user) {
      toast.error("❌ Please log in to cancel bookings");
      return;
    }

    const reason = window.prompt(
      "Please provide a reason for cancellation (optional):"
    );
    if (reason === null) {
      return; // User cancelled the prompt
    }

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_my_book_cancle.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            book_id: bookingId,
            cancle_reason: reason || "User cancelled booking",
          }),
        }
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("✅ Booking cancelled successfully!");
        fetchBookings(); // Refresh the list
      } else {
        toast.error(
          `❌ Failed to cancel booking: ${data.ResponseMsg || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("❌ An error occurred while cancelling the booking");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning";
      case "cancelled":
        return "badge bg-danger";
      case "completed":
        return "badge bg-info";
      default:
        return "badge bg-secondary";
    }
  };

  // Load bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view your bookings.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading spinner while fetching data
  if (loading) {
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
          <LoadingSpinner
            size="lg"
            color="#007bff"
            text="Loading bookings..."
          />
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
                  <span className="text-dark fw-bold">Bookings</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div>
              <h2 className="fw-bold text-dark mb-1">My Bookings</h2>
              <p className="text-muted mb-0">Manage your property bookings</p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div
            className="text-center py-5"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#f8f9fa",
                color: "#6c757d",
              }}
            >
              <i
                className="fas fa-calendar-times"
                style={{ fontSize: "32px" }}
              ></i>
            </div>
            <h5 className="text-muted mb-2">No bookings found</h5>
            <p className="text-muted mb-0">
              You haven't made any bookings yet. Start exploring properties!
            </p>
          </div>
        ) : (
          <div className="row">
            {bookings.map((booking) => (
              <div key={booking.book_id} className="col-lg-6 col-md-12 mb-4">
                <div
                  className="h-100"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e9ecef",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    padding: "24px",
                  }}
                >
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-dark mb-1">
                        {booking.prop_title}
                      </h6>
                      <span className={getStatusBadge(booking.book_status)}>
                        {booking.book_status}
                      </span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-primary">
                        {Number(booking.prop_price).toLocaleString()} XAF
                      </div>
                      <small className="text-muted">
                        {booking.total_day} day
                        {booking.total_day !== 1 ? "s" : ""}
                      </small>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <div
                        className="text-center p-3"
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <small className="text-muted d-block">
                          Property ID
                        </small>
                        <span className="fw-bold text-dark">
                          #{booking.prop_id}
                        </span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className="text-center p-3"
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <small className="text-muted d-block">Rating</small>
                        <span className="fw-bold text-dark">
                          {booking.rate}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm flex-fill"
                      onClick={() => {
                        toast.info(
                          "View booking details functionality coming soon!"
                        );
                      }}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #007bff",
                        color: "#007bff",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Details
                    </button>
                    {booking.book_status.toLowerCase() === "confirmed" && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => cancelBooking(booking.book_id)}
                        style={{
                          borderRadius: "8px",
                          border: "1px solid #dc3545",
                          color: "#dc3545",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsBody;
