"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface Enquiry {
  id: number;
  property_title: string;
  property_image: string;
  customer_name: string;
  customer_mobile: string;
  enquiry_date: string;
  status: string;
  message: string;
  response?: string;
}

const MessageBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  // Fetch enquiries
  const fetchEnquiries = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_my_enquiry.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.id }),
        }
      );
      const data = await response.json();

      if (data.Result === "true") {
        setEnquiries(data.enquiries || []);
      } else {
        toast.error("❌ Failed to load enquiries");
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error("❌ Failed to load enquiries");
    } finally {
      setLoading(false);
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
      case "pending":
        return "badge bg-warning";
      case "responded":
        return "badge bg-success";
      case "closed":
        return "badge bg-secondary";
      default:
        return "badge bg-info";
    }
  };

  // Load enquiries on component mount
  useEffect(() => {
    fetchEnquiries();
  }, [user]);

  if (!user) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view your enquiries.</p>
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
            text="Loading enquiries..."
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
                  <span className="text-dark fw-bold">Enquiries</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div>
              <h2 className="fw-bold text-dark mb-1">My Enquiries</h2>
              <p className="text-muted mb-0">
                Your property enquiries and responses
              </p>
            </div>
          </div>
        </div>

        {/* Enquiries List */}
        {enquiries.length === 0 ? (
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
              <i className="fas fa-envelope" style={{ fontSize: "32px" }}></i>
            </div>
            <h5 className="text-muted mb-2">No enquiries found</h5>
            <p className="text-muted mb-0">
              You haven&apos;t made any enquiries yet. Start exploring
              properties!
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {enquiries.map((enquiry) => (
              <div key={enquiry.id} className="col-lg-6 col-md-12">
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
                  <div className="d-flex align-items-start mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#007bff",
                        color: "white",
                      }}
                    >
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-dark mb-1">
                        {enquiry.property_title}
                      </h6>
                      <p className="text-muted mb-0">
                        {enquiry.customer_name} • {enquiry.customer_mobile}
                      </p>
                    </div>
                    <span className={getStatusBadge(enquiry.status)}>
                      {enquiry.status}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-muted mb-2">
                      <strong>Your Message:</strong>
                    </p>
                    <p className="mb-0">{enquiry.message}</p>
                  </div>
                  {enquiry.response && (
                    <div className="mb-3">
                      <p className="text-muted mb-2">
                        <strong>Response:</strong>
                      </p>
                      <p className="mb-0">{enquiry.response}</p>
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {formatDate(enquiry.enquiry_date)}
                    </small>
                    <Link
                      href={`/listing_details_01/${enquiry.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Property
                    </Link>
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

export default MessageBody;
