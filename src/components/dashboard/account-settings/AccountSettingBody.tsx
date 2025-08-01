"use client";
import { useState, useEffect } from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  lname: string;
  email: string;
  mobile: string;
}

interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const AccountSettingBody = () => {
  const { user, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    lname: "",
    email: "",
    mobile: "",
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name?.split(" ")[0] || "",
        lname: user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to update your profile");
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("First name is required");
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        uid: user.id.toString(),
        name: `${formData.name} ${formData.lname}`.trim(),
      };

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_profile_edit.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("Profile updated successfully!");
        // Refresh user profile to get updated data
        await refreshUserProfile();
      } else {
        toast.error(data.ResponseMsg || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to change your password");
      return;
    }

    // Validate password fields
    if (!passwordData.current_password.trim()) {
      toast.error("Current password is required");
      return;
    }

    if (!passwordData.new_password.trim()) {
      toast.error("New password is required");
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      const requestData = {
        uid: user.id.toString(),
        password: passwordData.current_password,
        new_password: passwordData.new_password,
      };

      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_profile_edit.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("Password changed successfully!");
        // Clear password fields
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        toast.error(data.ResponseMsg || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing your password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error("Please log in to delete your account");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/acc_delete.php",
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

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("Account deleted successfully!");
        // Redirect to home page or logout
        window.location.href = "/";
      } else {
        toast.error(data.ResponseMsg || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An error occurred while deleting your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeaderTwo title="Account Settings" />
        <h2 className="main-title d-block d-lg-none">Account Settings</h2>

        {/* Profile Information Section */}
        <div className="bg-white card-box border-20 mb-30">
          <h4 className="dash-title-three">Profile Information</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-6">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="name">First Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="lname">Last Name</label>
                  <input
                    type="text"
                    id="lname"
                    name="lname"
                    value={formData.lname}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled
                  />
                  <small className="text-muted">Email cannot be changed</small>
                </div>
              </div>
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="mobile">Phone Number</label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    disabled
                  />
                  <small className="text-muted">
                    Phone number cannot be changed
                  </small>
                </div>
              </div>
            </div>

            <div className="button-group d-inline-flex align-items-center mt-30">
              <button
                type="submit"
                className="dash-btn-two tran3s me-3"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="dash-cancel-btn tran3s"
                onClick={() => window.location.reload()}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-white card-box border-20 mb-30">
          <h4 className="dash-title-three">Change Password</h4>
          <form onSubmit={handlePasswordSubmit}>
            <div className="row">
              <div className="col-12">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="current_password">Current Password *</label>
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="new_password">New Password *</label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    required
                  />
                  <small className="text-muted">
                    Password must be at least 6 characters long
                  </small>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="dash-input-wrapper mb-20">
                  <label htmlFor="confirm_password">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="button-group d-inline-flex align-items-center mt-30">
              <button
                type="submit"
                className="dash-btn-two tran3s me-3"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                className="dash-cancel-btn tran3s"
                onClick={() =>
                  setPasswordData({
                    current_password: "",
                    new_password: "",
                    confirm_password: "",
                  })
                }
                disabled={passwordLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three text-danger">Danger Zone</h4>
          <p className="text-muted mb-20">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingBody;
