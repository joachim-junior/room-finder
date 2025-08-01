"use client";
import { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

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
}

const BookingsBody = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("active");

  // Fetch bookings from API
  const fetchBookings = async () => {
    if (!user) {
      toast.error("❌ Please log in to view your bookings");
      return;
    }

    setLoading(true);
    toast.info("🔄 Loading your bookings...");

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_my_book.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
            status: selectedStatus,
          }),
        }
      );

      const data = await response.json();
      console.log("Bookings response:", data);

      if (data.ResponseCode === "200" && data.Result === "true") {
        setBookings(data.statuswise || []);
        toast.success("✅ Bookings loaded successfully!");
      } else {
        toast.error(
          `❌ Failed to load bookings: ${data.ResponseMsg || "Unknown error"}`
        );
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("❌ An error occurred while loading your bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId: number) => {
    if (!user) return;

    const cancelReason = window.prompt(
      "Please provide a reason for cancellation:"
    );
    if (!cancelReason || cancelReason.trim() === "") {
      toast.error("❌ Cancellation reason is required");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_my_book_cancle.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
            book_id: bookingId,
            cancle_reason: cancelReason.trim(),
          }),
        }
      );

      const data = await response.json();
      console.log("Cancel booking response:", data);

      if (data.ResponseCode === "200" && data.Result === "true") {
        setBookings((prev) =>
          prev.filter((booking) => booking.book_id !== bookingId)
        );
        toast.success("✅ Booking cancelled successfully");
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

  // Handle status change
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  // Refresh bookings
  const handleRefresh = async () => {
    toast.info("🔄 Refreshing bookings...");
    await fetchBookings();
  };

  // Load data on component mount and when status changes
  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, selectedStatus]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <span className="badge bg-success">Confirmed</span>;
      case "pending":
        return <span className="badge bg-warning">Pending</span>;
      case "cancelled":
        return <span className="badge bg-danger">Cancelled</span>;
      case "completed":
        return <span className="badge bg-info">Completed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo title="My Bookings" />
        <h2 className="main-title d-block d-lg-none">My Bookings</h2>

        {/* Bookings Section */}
        <div className="bg-white card-box border-20 mb-30">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="dash-title-three mb-0">Property Bookings</h4>
            <div className="d-flex align-items-center">
              <div className="btn-group me-3" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${
                    selectedStatus === "active"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handleStatusChange("active")}
                >
                  Active
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    selectedStatus === "completed"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handleStatusChange("completed")}
                >
                  Completed
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${
                    selectedStatus === "cancelled"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handleStatusChange("cancelled")}
                >
                  Cancelled
                </button>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleRefresh}
                disabled={loading}
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
                    Refreshing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                  </>
                )}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-calendar-x fs-1 text-muted mb-3"></i>
              <h5 className="text-muted">No bookings found</h5>
              <p className="text-muted">
                You haven&apos;t made any property bookings yet.
              </p>
            </div>
          ) : (
            <div className="row">
              {bookings.map((booking) => (
                <div key={booking.book_id} className="col-lg-6 col-md-12 mb-4">
                  <div className="booking-card border rounded p-3 h-100">
                    <div className="d-flex align-items-start">
                      <div className="booking-image me-3">
                        <img
                          src={`https://cpanel.roomfinder237.com/${booking.prop_img}`}
                          alt={booking.prop_title}
                          className="rounded"
                          style={{
                            width: "80px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="booking-details flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">{booking.prop_title}</h6>
                          {getStatusBadge(booking.book_status)}
                        </div>
                        <div className="booking-info">
                          <p className="mb-1">
                            <i className="bi bi-currency-dollar me-2"></i>
                            <strong>Price:</strong>{" "}
                            {booking.prop_price.toLocaleString()} XAF
                          </p>
                          <p className="mb-1">
                            <i className="bi bi-calendar-range me-2"></i>
                            <strong>Duration:</strong> {booking.total_day} day
                            {booking.total_day !== 1 ? "s" : ""}
                          </p>
                          <p className="mb-1">
                            <i className="bi bi-star me-2"></i>
                            <strong>Rating:</strong> {booking.rate}/5
                          </p>
                          <p className="mb-2">
                            <i className="bi bi-hash me-2"></i>
                            <strong>Booking ID:</strong> #{booking.book_id}
                          </p>
                        </div>
                        {booking.book_status.toLowerCase() === "pending" && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => cancelBooking(booking.book_id)}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsBody;
