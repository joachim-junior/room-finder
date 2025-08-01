import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CommonBanner = ({ propetydetails, style_3 }: any) => {
  const { isAuthenticated, user } = useAuth();
  const [favLoading, setFavLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch favorite state on mount if authenticated
  useEffect(() => {
    const fetchFavorite = async () => {
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
          setIsFavorite(
            !!data.propetylist.find(
              (item: any) => String(item.id) === String(propetydetails.id)
            )
          );
        }
      } catch (err) {
        // ignore
      }
    };
    fetchFavorite();
  }, [user, propetydetails.id]);

  const handleFavorite = async () => {
    if (!user || !user.id) {
      toast.error("You must be logged in to favorite a property.");
      return;
    }
    setFavLoading(true);
    try {
      const res = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_fav.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            pid: propetydetails.id,
            property_type: propetydetails.property_type || 1,
          }),
        }
      );
      const data = await res.json();
      if (data.Result === "true") {
        setIsFavorite((prev) => !prev);
        toast.success(data.ResponseMsg || "Favorite updated!");
      } else {
        toast.error(data.ResponseMsg || "Failed to update favorite.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setFavLoading(false);
    }
  };

  const handleShare = () => {
    const propertyUrl = `${window.location.origin}/listing_details_01/${propetydetails.id}`;
    navigator.clipboard.writeText(propertyUrl);
    toast.success("Property link copied to clipboard!");
  };

  return (
    <div className="row">
      <div className="col-lg-6">
        <h3 className="property-titlee">{propetydetails?.title || "-"}</h3>
        <div className="d-flex flex-wrap mt-10">
          <div
            className={`list-type text-uppercase mt-15 me-3 ${
              style_3 ? "bg-white text-dark fw-500" : "text-uppercase border-20"
            }`}
          >
            {propetydetails?.buyorrent?.toUpperCase() || "-"}
          </div>
          <div className="address mt-15">
            <i className="bi bi-geo-alt"></i> {propetydetails?.address || "-"}
          </div>
        </div>
      </div>
      <div className="col-lg-6 text-lg-end">
        <div className="d-inline-block md-mt-40">
          <div className="price color-dark fw-500">
            Price:{" "}
            {propetydetails?.price
              ? `${propetydetails.price.toLocaleString()} XAF`
              : "-"}
          </div>
          <ul className="style-none d-flex align-items-center action-btns justify-content-end mt-2">
            <li>
              <button
                type="button"
                className={`d-flex align-items-center justify-content-center tran3s rounded-circle border-0 bg-transparent`}
                style={{ padding: 0 }}
                disabled={favLoading}
                onClick={handleFavorite}
              >
                <i
                  className={
                    isFavorite ? "fa-solid fa-bookmark" : "fa-light fa-bookmark"
                  }
                  style={{
                    fontSize: "2rem",
                    color: isFavorite ? "#0072c6" : undefined,
                  }}
                ></i>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`d-flex align-items-center justify-content-center tran3s rounded-circle border-0 bg-transparent`}
                style={{ padding: 0 }}
                onClick={handleShare}
              >
                <i
                  className="fa-sharp fa-regular fa-share-nodes"
                  style={{ fontSize: "2rem" }}
                ></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommonBanner;
