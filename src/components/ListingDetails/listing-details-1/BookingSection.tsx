import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const BookingSection = ({ property }: { property: any }) => {
  const { user, isAuthenticated, refreshUserProfile } = useAuth();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && refreshUserProfile) {
      refreshUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const price = Number(property.price) || 0;
  const wallet = Number(user?.wallet) || 0;
  console.log("BookingSection user:", user);
  const canBook = isAuthenticated && wallet >= price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("You must be logged in to book.");
      return;
    }
    if (wallet < price) {
      toast.error("Insufficient wallet balance. Please add funds.");
      return;
    }
    setLoading(true);
    // Generate a unique transaction_id
    const transaction_id = `txn_${Date.now()}_${user?.id || "guest"}`;
    try {
      const res = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_book.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prop_id: property.id,
            uid: user.id,
            check_in: checkIn,
            check_out: checkOut,
            subtotal: price,
            total: price, // No tax/coupon for now
            tax: 0,
            p_method_id: 1, // wallet
            book_for: "self",
            prop_price: price,
            total_day: 1, // You may want to calculate this from dates
            noguest: guests,
            add_note: "",
            transaction_id, // Pass generated transaction_id
            cou_amt: 0,
            wall_amt: price,
          }),
        }
      );
      const data = await res.json();
      if (data.Result === "true") {
        toast.success(data.ResponseMsg || "Booking successful!");
        console.log("Booking API response:", data);
        setCheckIn("");
        setCheckOut("");
        setGuests(1);
      } else {
        toast.error(data.ResponseMsg || "Booking failed.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        className="bg-white shadow4 border-20 p-30 mt-40"
        style={{ maxWidth: 350, width: "100%" }}
      >
        <h4 className="mb-20">Book this Property</h4>
        {isAuthenticated && (
          <div className="mb-3">
            <span className="fw-bold">Wallet Balance:</span>{" "}
            {wallet?.toLocaleString()} XAF
          </div>
        )}
        {!isAuthenticated ? (
          <div className="alert alert-info">
            <span>You must </span>
            <a
              href="/login"
              className="color-dark fw-500 text-decoration-underline"
            >
              Sign in
            </a>
            <span> to book this property.</span>
          </div>
        ) : wallet < price ? (
          <div className="alert alert-warning d-flex flex-column align-items-start">
            <span>Insufficient wallet balance to book this property.</span>
            <button
              className="btn mt-2"
              style={{
                background: "#0072c6",
                color: "#fff",
                border: "1.5px solid #0072c6",
                fontWeight: 600,
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
              onClick={() => router.push("/dashboard/wallet")}
            >
              <i className="bi bi-wallet me-2"></i> Add Funds
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Check-in</label>
              <input
                type="date"
                className="form-control"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Check-out</label>
              <input
                type="date"
                className="form-control"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Guests</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={property.plimit || 10}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                required
              />
            </div>
            <button
              type="submit"
              className="btn w-100"
              style={{
                background: "#fff",
                color: "#0072c6",
                border: "1.5px solid #0072c6",
                fontWeight: 600,
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#0072c6";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#fff";
                (e.currentTarget as HTMLButtonElement).style.color = "#0072c6";
              }}
              disabled={loading}
            >
              {loading ? "Booking..." : "Book & Pay"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingSection;
