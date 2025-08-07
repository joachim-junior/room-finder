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
    if (!user) {
      toast.error("User information not available. Please log in again.");
      return;
    }
    if (wallet < price) {
      toast.error("Insufficient wallet balance. Please add funds.");
      return;
    }
    setLoading(true);
    // Generate a unique transaction_id
    const transaction_id = `txn_${Date.now()}_${user.id}`;
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
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          padding: "32px",
          maxWidth: 380,
          width: "100%",
          border: "1px solid #f0f0f0",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <h4
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#212529",
              marginBottom: "8px",
            }}
          >
            Book this Property
          </h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              fontSize: "14px",
              color: "#495057",
            }}
          >
            <span style={{ fontWeight: "600" }}>Price:</span>
            <span style={{ fontWeight: "700", fontSize: "16px" }}>
              {price?.toLocaleString()} XAF
            </span>
          </div>
        </div>

        {isAuthenticated && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              backgroundColor: "#e8f5e8",
              borderRadius: "12px",
              border: "1px solid #c8e6c9",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#4caf50",
                  borderRadius: "50%",
                }}
              ></div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#2e7d32",
                }}
              >
                Wallet Balance
              </span>
            </div>
            <span
              style={{ fontSize: "18px", fontWeight: "700", color: "#2e7d32" }}
            >
              {wallet?.toLocaleString()} XAF
            </span>
          </div>
        )}

        {!isAuthenticated ? (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#e3f2fd",
              borderRadius: "12px",
              border: "1px solid #bbdefb",
              textAlign: "center",
            }}
          >
            <span style={{ color: "#1976d2", fontSize: "14px" }}>
              You must{" "}
              <a
                href="/login"
                style={{
                  color: "#007bff",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Sign in
              </a>{" "}
              to book this property.
            </span>
          </div>
        ) : wallet < price ? (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fff3e0",
              borderRadius: "12px",
              border: "1px solid #ffe0b2",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <span style={{ color: "#f57c00", fontSize: "14px" }}>
                Insufficient wallet balance to book this property.
              </span>
            </div>
            <button
              style={{
                backgroundColor: "#007bff",
                color: "#ffffff",
                border: "none",
                borderRadius: "25px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                margin: "0 auto",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0056b3";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#007bff";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              onClick={() => router.push("/dashboard/wallet")}
            >
              <i className="bi bi-wallet" style={{ fontSize: "16px" }}></i>
              Add Funds
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                }}
              >
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "25px",
                  border: "2px solid #e9ecef",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#007bff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0,123,255,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                }}
              >
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "25px",
                  border: "2px solid #e9ecef",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#007bff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0,123,255,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                }}
              >
                Guests
              </label>
              <input
                type="number"
                min={1}
                max={property.plimit || 10}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "25px",
                  border: "2px solid #e9ecef",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  transition: "all 0.3s ease",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#007bff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0,123,255,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#007bff",
                color: "#ffffff",
                border: "none",
                borderRadius: "25px",
                padding: "16px 24px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#0056b3";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,123,255,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#007bff";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #ffffff",
                      borderTop: "2px solid transparent",
                      borderRadius: "20px",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  Booking...
                </>
              ) : (
                <>Book Now</>
              )}
            </button>
          </form>
        )}

        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookingSection;
