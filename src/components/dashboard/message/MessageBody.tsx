"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

interface EnquiryData {
  title: string;
  image: string;
  name: string;
  mobile: string;
  is_sell: number;
}

const MessageBody = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<EnquiryData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch enquiries from API
  const fetchEnquiries = async () => {
    if (!user) {
      toast.error("❌ Please log in to view enquiries");
      return;
    }

    setLoading(true);
    toast.info("🔄 Loading enquiries...");

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_my_enquiry.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.id.toString(),
          }),
        }
      );

      const data = await response.json();
      console.log("Enquiries response:", data);

      if (data.ResponseCode === "200" && data.Result === "true") {
        setEnquiries(data.EnquiryData || []);
        toast.success("✅ Enquiries loaded successfully!");
      } else {
        toast.error(
          `❌ Failed to load enquiries: ${data.ResponseMsg || "Unknown error"}`
        );
        setEnquiries([]);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error("❌ An error occurred while loading enquiries");
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh enquiries
  const handleRefresh = async () => {
    toast.info("🔄 Refreshing enquiries...");
    await fetchEnquiries();
  };

  // Load data on component mount
  useEffect(() => {
    if (user) {
      fetchEnquiries();
    }
  }, [user]);

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo title="My Enquiries" />
        <h2 className="main-title d-block d-lg-none">My Enquiries</h2>

        {/* Enquiries Section */}
        <div className="bg-white card-box border-20 mb-30">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="dash-title-three mb-0">Property Enquiries</h4>
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

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading enquiries...</p>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
              <h5 className="text-muted">No enquiries found</h5>
              <p className="text-muted">
                You have not made any property enquiries yet.
              </p>
            </div>
          ) : (
            <div className="row">
              {enquiries.map((enquiry, index) => (
                <div key={index} className="col-lg-6 col-md-12 mb-4">
                  <div className="enquiry-card border rounded p-3 h-100">
                    <div className="d-flex align-items-start">
                      <div className="enquiry-image me-3">
                        <Image
                          src={
                            enquiry.image
                              ? enquiry.image.startsWith("http")
                                ? enquiry.image
                                : `https://cpanel.roomfinder237.com/${enquiry.image}`
                              : "/images/placeholder.jpg"
                          }
                          alt={enquiry.title}
                          width={80}
                          height={60}
                          className="rounded"
                          style={{
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            console.log(`Image failed to load: ${target.src}`);
                            target.src = "/images/placeholder.jpg";
                          }}
                          onLoad={() => {
                            console.log(
                              `Image loaded successfully: ${enquiry.image}`
                            );
                          }}
                          unoptimized={true}
                        />
                      </div>
                      <div className="enquiry-details flex-grow-1">
                        <h6 className="mb-2">{enquiry.title}</h6>
                        <div className="enquiry-info">
                          <p className="mb-1">
                            <i className="bi bi-person me-2"></i>
                            <strong>Contact:</strong> {enquiry.name}
                          </p>
                          <p className="mb-1">
                            <i className="bi bi-telephone me-2"></i>
                            <strong>Phone:</strong> {enquiry.mobile}
                          </p>
                          <p className="mb-0">
                            <i className="bi bi-tag me-2"></i>
                            <strong>Type:</strong>{" "}
                            {enquiry.is_sell === 1 ? "For Sale" : "For Rent"}
                          </p>
                        </div>
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

export default MessageBody;
