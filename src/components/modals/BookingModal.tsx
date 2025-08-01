"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";

interface BookingFormData {
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  guesthouse: {
    id: number;
    title: string;
    address: string;
    price?: number;
  };
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  guesthouse,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const schema = yup
    .object({
      checkIn: yup.string().required().label("Check-in Date"),
      checkOut: yup
        .string()
        .required()
        .label("Check-out Date")
        .test(
          "check-out-after-check-in",
          "Check-out date must be after check-in date",
          function (value) {
            const { checkIn } = this.parent;
            if (!checkIn || !value) return true;
            return new Date(value) > new Date(checkIn);
          }
        ),
      guests: yup.number().required().min(1).max(10).label("Number of Guests"),
      specialRequests: yup.string().optional().label("Special Requests"),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: BookingFormData) => {
    if (!isAuthenticated) {
      toast.error("Please login to book this guesthouse");
      return;
    }

    setLoading(true);
    try {
      // Calculate dates and total days
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);
      const totalDays = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calculate pricing (example pricing)
      const pricePerNight = 15000; // 15,000 XAF per night
      const subtotal = pricePerNight * totalDays;
      const tax = subtotal * 0.19; // 19% tax
      const total = subtotal + tax;

      const bookingData = {
        prop_id: guesthouse.id.toString(),
        uid: user?.id,
        check_in: data.checkIn,
        check_out: data.checkOut,
        subtotal: subtotal.toString(),
        total: total.toString(),
        tax: tax.toString(),
        p_method_id: "1", // Default payment method
        book_for: "self",
        prop_price: pricePerNight.toString(),
        total_day: totalDays.toString(),
        noguest: data.guests.toString(),
        add_note: data.specialRequests || "",
        transaction_id: `TXN${Date.now()}${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        cou_amt: "0",
        wall_amt: "0", // No wallet usage for now
      };

      const res = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_book.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        }
      );

      const result = await res.json();

      if (result.Result === "true") {
        toast.success("Booking confirmed successfully!");
        reset();
        onClose();
      } else {
        toast.error(
          result.ResponseMsg ||
            "Failed to submit booking request. Please try again."
        );
      }
    } catch (error) {
      toast.error("Failed to submit booking request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1040,
        }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{
          display: "block",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1050,
          overflow: "auto",
        }}
        id="bookingModal"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ margin: "1.75rem auto" }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              borderRadius: "0.375rem",
              boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              className="modal-header"
              style={{
                borderBottom: "1px solid #dee2e6",
                padding: "1rem 1.5rem",
              }}
            >
              <h5
                className="modal-title"
                style={{ margin: 0, fontWeight: 600 }}
              >
                Book Guesthouse
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: 0,
                  width: "auto",
                  height: "auto",
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body" style={{ padding: "1.5rem" }}>
              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <div className="mb-3">
                    <i
                      className="bi bi-lock-circle"
                      style={{ fontSize: "3rem", color: "#6c757d" }}
                    ></i>
                  </div>
                  <h5
                    style={{
                      color: "#333",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                    }}
                  >
                    Login Required
                  </h5>
                  <p style={{ color: "#6c757d", marginBottom: "1.5rem" }}>
                    You need to create an account or login to book this
                    guesthouse.
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                    <button
                      onClick={() => {
                        onClose();
                        window.location.href = "/login";
                      }}
                      className="btn btn-primary"
                      style={{
                        backgroundColor: "#007bff",
                        borderColor: "#007bff",
                        color: "#fff",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        window.location.href = "/register";
                      }}
                      className="btn btn-outline-primary"
                      style={{
                        backgroundColor: "transparent",
                        borderColor: "#007bff",
                        color: "#007bff",
                        padding: "0.5rem 1rem",
                        borderRadius: "0.375rem",
                        border: "1px solid #007bff",
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "inline-block",
                      }}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="guesthouse-info mb-4 p-3 bg-light rounded">
                    <h6 className="mb-2">{guesthouse.title}</h6>
                    <p className="text-muted mb-1">{guesthouse.address}</p>
                    <p className="mb-0 fw-bold">15,000 XAF/night</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Check-in Date *</label>
                        <input
                          type="date"
                          {...register("checkIn")}
                          className="form-control"
                          min={new Date().toISOString().split("T")[0]}
                        />
                        {errors.checkIn && (
                          <p className="form_error">{errors.checkIn.message}</p>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Check-out Date *</label>
                        <input
                          type="date"
                          {...register("checkOut")}
                          className="form-control"
                          min={new Date().toISOString().split("T")[0]}
                        />
                        {errors.checkOut && (
                          <p className="form_error">
                            {errors.checkOut.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Number of Guests *</label>
                      <select {...register("guests")} className="form-select">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                      {errors.guests && (
                        <p className="form_error">{errors.guests.message}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Special Requests</label>
                      <textarea
                        {...register("specialRequests")}
                        className="form-control"
                        rows={3}
                        placeholder="Any special requests or requirements..."
                      ></textarea>
                      {errors.specialRequests && (
                        <p className="form_error">
                          {errors.specialRequests.message}
                        </p>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary flex-fill"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Book Now"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingModal;
