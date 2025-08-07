"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

const ProfileBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Fetch profile data
  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_getdata.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.id }),
        }
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        setProfileData({
          name: data.name || user.name || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          address: data.address || "",
          avatar: data.avatar || "",
        });
      } else {
        toast.error(
          `❌ Failed to load profile: ${data.ResponseMsg || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("❌ An error occurred while loading profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit field
  const handleEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_update_profile.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            field: editingField,
            value: editValue,
          }),
        }
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("✅ Profile updated successfully!");
        setProfileData((prev) => ({
          ...prev,
          [editingField]: editValue,
        }));
        setShowEditModal(false);
        setEditingField("");
        setEditValue("");
      } else {
        toast.error(
          `❌ Failed to update profile: ${data.ResponseMsg || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("❌ An error occurred while updating profile");
    }
  };

  // Get field display name
  const getFieldDisplayName = (field: string) => {
    switch (field) {
      case "name":
        return "Name";
      case "email":
        return "Email";
      case "phone":
        return "Phone Number";
      default:
        return field;
    }
  };

  // Get field input type
  const getFieldInputType = (field: string) => {
    switch (field) {
      case "email":
        return "email";
      case "phone":
        return "tel";
      default:
        return "text";
    }
  };

  // Handle change password
  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  // Handle save password change
  const handleSavePasswordChange = async () => {
    if (!user) return;

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("❌ Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("❌ New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("❌ New password must be at least 6 characters long");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_forget_password.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: user.mobile,
            password: passwordData.newPassword,
            ccode: user.ccode,
          }),
        }
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("✅ Password changed successfully!");
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(
          `❌ Failed to change password: ${data.ResponseMsg || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("❌ An error occurred while changing password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Handle password input change
  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Load profile on component mount
  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleDeleteAccount = async () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteAccount = async () => {
    if (!user) return;

    try {
      setDeletingAccount(true);

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/acc_delete.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.id }),
        }
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("✅ Account deleted successfully!");
        setShowDeleteModal(false);
        // Redirect to login page or home page after successful deletion
        window.location.href = "/login";
      } else {
        toast.error(
          `❌ Failed to delete account: ${data.ResponseMsg || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("❌ An error occurred while deleting account");
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
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
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="container-fluid" style={{ maxWidth: "600px" }}>
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
                  <span className="text-dark fw-bold">Profile</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div>
              <h2 className="fw-bold text-dark mb-1">My Profile</h2>
              <p className="text-muted mb-0">Manage your account information</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="row">
          <div className="col-12">
            <div
              className="p-4"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e9ecef",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h4 className="fw-bold text-dark mb-4">Account</h4>

              {/* Account Information List */}
              <div className="list-group list-group-flush">
                {/* Name */}
                <div
                  className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom"
                  style={{ borderColor: "#e9ecef" }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        fontSize: "16px",
                      }}
                    >
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark">Name</div>
                      <div className="text-muted small">{profileData.name}</div>
                    </div>
                  </div>
                  <button
                    className="btn btn-link p-0"
                    onClick={() => handleEditField("name", profileData.name)}
                    style={{ color: "#007bff" }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>

                {/* Email */}
                <div
                  className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom"
                  style={{ borderColor: "#e9ecef" }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        fontSize: "16px",
                      }}
                    >
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark">Email</div>
                      <div className="text-muted small">
                        {profileData.email}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-link p-0"
                    onClick={() => handleEditField("email", profileData.email)}
                    style={{ color: "#007bff" }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>

                {/* Phone Number */}
                <div
                  className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom"
                  style={{ borderColor: "#e9ecef" }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        fontSize: "16px",
                      }}
                    >
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark">Phone number</div>
                      <div className="text-muted small">
                        {profileData.phone}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-link p-0"
                    onClick={() => handleEditField("phone", profileData.phone)}
                    style={{ color: "#007bff" }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>

                {/* Change Password */}
                <div
                  className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom"
                  style={{ borderColor: "#e9ecef" }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        fontSize: "16px",
                      }}
                    >
                      <i className="fas fa-lock"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-dark">Change Password</div>
                      <div className="text-muted small">
                        Update your account password
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-link p-0"
                    onClick={handleChangePassword}
                    style={{ color: "#007bff" }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>

                {/* Delete Account */}
                <div className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        fontSize: "16px",
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </div>
                    <div>
                      <div className="fw-bold text-danger">Delete account</div>
                      <div className="text-muted small">
                        Permanently delete your account
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-link p-0"
                    onClick={handleDeleteAccount}
                    style={{ color: "#dc3545" }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Edit {getFieldDisplayName(editingField)}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingField("");
                    setEditValue("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">
                    {getFieldDisplayName(editingField)}
                  </label>
                  <input
                    type={getFieldInputType(editingField)}
                    className="form-control"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingField("");
                    setEditValue("");
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #6c757d",
                    backgroundColor: "#6c757d",
                    color: "#ffffff",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: "#007bff",
                    border: "none",
                    color: "#ffffff",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Change Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordInputChange(
                        "currentPassword",
                        e.target.value
                      )
                    }
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordInputChange("newPassword", e.target.value)
                    }
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordInputChange(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    style={{
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #6c757d",
                    backgroundColor: "#6c757d",
                    color: "#ffffff",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSavePasswordChange}
                  disabled={changingPassword}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: "#007bff",
                    border: "none",
                    color: "#ffffff",
                  }}
                >
                  {changingPassword ? (
                    <span>Changing...</span>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1px solid #6c757d",
                    backgroundColor: "#6c757d",
                    color: "#ffffff",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDeleteAccount}
                  disabled={deletingAccount}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    backgroundColor: "#dc3545",
                    border: "none",
                    color: "#ffffff",
                  }}
                >
                  {deletingAccount ? (
                    <span>Deleting...</span>
                  ) : (
                    <span>Delete Account</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBody;
