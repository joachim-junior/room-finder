"use client";
import { useState } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import FavouriteArea from "./FavouriteArea";
import { toast } from "react-toastify";

const FavouriteBody = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Trigger refresh in the FavouriteArea component
    // @ts-ignore
    if (window.refreshFavourites) {
      // @ts-ignore
      window.refreshFavourites();
    }
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Favourites refreshed!");
    }, 1000);
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <DashboardHeaderTwo title="Favourites" />
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        <FavouriteArea />
      </div>
    </div>
  );
};

export default FavouriteBody;
