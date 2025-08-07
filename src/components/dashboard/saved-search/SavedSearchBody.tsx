"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SavedSearch {
  id: number;
  search_name: string;
  location: string;
  property_type: string;
  price_range: string;
  created_date: string;
}

const SavedSearchBody = () => {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedSearches = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Mock data for now - replace with actual API call when available
        setSavedSearches([
          {
            id: 1,
            search_name: "Downtown Apartments",
            location: "Downtown",
            property_type: "Apartment",
            price_range: "$500 - $1000",
            created_date: "2024-01-15",
          },
          {
            id: 2,
            search_name: "Studio Rentals",
            location: "City Center",
            property_type: "Studio",
            price_range: "$300 - $600",
            created_date: "2024-01-10",
          },
        ]);
      } catch (error) {
        console.error("Error fetching saved searches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSearches();
  }, [user]);

  if (!user) {
    return (
      <div className="saved-search-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view your saved searches.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-search-body">
      <div className="position-relative">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="bg-white border-20 p-4">
                <h3 className="mb-4">Saved Searches</h3>

                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : savedSearches.length === 0 ? (
                  <div className="text-center">
                    <p className="text-muted">No saved searches found.</p>
                  </div>
                ) : (
                  <div className="row">
                    {savedSearches.map((search) => (
                      <div key={search.id} className="col-md-6 col-lg-4 mb-3">
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body">
                            <h6 className="card-title">{search.search_name}</h6>
                            <p className="card-text text-muted mb-2">
                              <i className="fas fa-map-marker-alt me-2"></i>
                              {search.location}
                            </p>
                            <p className="card-text text-muted mb-2">
                              <i className="fas fa-home me-2"></i>
                              {search.property_type}
                            </p>
                            <p className="card-text text-muted mb-2">
                              <i className="fas fa-dollar-sign me-2"></i>
                              {search.price_range}
                            </p>
                            <p className="card-text text-muted small">
                              <i className="fas fa-calendar me-2"></i>
                              Saved on {search.created_date}
                            </p>
                          </div>
                          <div className="card-footer bg-transparent">
                            <button className="btn btn-sm btn-outline-primary me-2">
                              <i className="fas fa-search me-1"></i>
                              Search
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="fas fa-trash me-1"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedSearchBody;
