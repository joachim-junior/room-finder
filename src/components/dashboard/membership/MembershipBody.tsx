"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface MembershipData {
  current_plan: string;
  expiry_date: string;
  features: string[];
}

const MembershipBody = () => {
  const { user } = useAuth();
  const [membershipData, setMembershipData] = useState<MembershipData>({
    current_plan: "Free",
    expiry_date: "",
    features: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembershipData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Mock data for now - replace with actual API call when available
        setMembershipData({
          current_plan: "Free",
          expiry_date: "N/A",
          features: ["Basic property listing", "Email support"],
        });
      } catch (error) {
        console.error("Error fetching membership data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipData();
  }, [user]);

  if (!user) {
    return (
      <div className="membership-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view your membership.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="membership-body">
      <div className="position-relative">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="bg-white border-20 p-4 mb-4">
                <h3 className="mb-4">Membership Details</h3>

                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">Current Plan</h5>
                          <h2 className="text-primary mb-3">
                            {membershipData.current_plan}
                          </h2>
                          <p className="text-muted">
                            Expires: {membershipData.expiry_date}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">Features</h5>
                          <ul className="list-unstyled">
                            {membershipData.features.map((feature, index) => (
                              <li key={index} className="mb-2">
                                <i className="fas fa-check text-success me-2"></i>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
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

export default MembershipBody;
