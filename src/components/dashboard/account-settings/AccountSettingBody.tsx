"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

interface AccountSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  privacy_public: boolean;
}

const AccountSettingBody = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<AccountSettings>({
    email_notifications: true,
    sms_notifications: true,
    marketing_emails: false,
    privacy_public: true,
  });

  // Save settings
  const saveSettings = async () => {
    if (!user) {
      toast.error("❌ Please log in to save settings");
      return;
    }

    setLoading(true);
    toast.info("🔄 Saving settings...");

    try {
      const response = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_update_settings.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.id,
            ...settings,
          }),
        }
      );
      const data = await response.json();

      if (data.ResponseCode === "200" && data.Result === "true") {
        toast.success("✅ Settings saved successfully!");
      } else {
        toast.error(
          `❌ Failed to save settings: ${data.ResponseMsg || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("❌ An error occurred while saving settings");
    } finally {
      setLoading(false);
    }
  };

  // Handle setting change
  const handleSettingChange = (
    setting: keyof AccountSettings,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  if (!user) {
    return (
      <div className="dashboard-body">
        <div className="position-relative">
          <div className="bg-white border-20 p-4 text-center">
            <p>Please log in to view account settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <div className="container-fluid">
          {/* Account Settings Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0 fw-bold">Account Settings</h4>
            <button
              className="btn btn-primary btn-sm"
              onClick={saveSettings}
              disabled={loading}
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin me-2"></i>
              ) : (
                <i className="fas fa-save me-2"></i>
              )}
              Save Settings
            </button>
          </div>

          {/* Account Settings Content */}
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="bg-white border-20 p-4">
                <h5 className="mb-4 fw-bold">Notification Settings</h5>

                <div className="mb-4">
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emailNotifications"
                      checked={settings.email_notifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "email_notifications",
                          e.target.checked
                        )
                      }
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="emailNotifications"
                    >
                      Email Notifications
                    </label>
                    <small className="text-muted d-block">
                      Receive notifications about bookings, messages, and
                      account updates via email
                    </small>
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="smsNotifications"
                      checked={settings.sms_notifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "sms_notifications",
                          e.target.checked
                        )
                      }
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="smsNotifications"
                    >
                      SMS Notifications
                    </label>
                    <small className="text-muted d-block">
                      Receive important updates via SMS
                    </small>
                  </div>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="marketingEmails"
                      checked={settings.marketing_emails}
                      onChange={(e) =>
                        handleSettingChange(
                          "marketing_emails",
                          e.target.checked
                        )
                      }
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="marketingEmails"
                    >
                      Marketing Emails
                    </label>
                    <small className="text-muted d-block">
                      Receive promotional offers and updates about new features
                    </small>
                  </div>
                </div>

                <h5 className="mb-4 fw-bold">Privacy Settings</h5>

                <div className="mb-4">
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="privacyPublic"
                      checked={settings.privacy_public}
                      onChange={(e) =>
                        handleSettingChange("privacy_public", e.target.checked)
                      }
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="privacyPublic"
                    >
                      Public Profile
                    </label>
                    <small className="text-muted d-block">
                      Allow other users to view your profile information
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white border-20 p-4">
                <h5 className="mb-4 fw-bold">Account Actions</h5>

                <div className="d-grid gap-3">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => {
                      // Change password functionality
                      window.location.href =
                        "/dashboard/account-settings/password-change";
                    }}
                  >
                    <i className="fas fa-key me-2"></i>
                    Change Password
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      // Export data functionality
                      toast.info("Export data functionality");
                    }}
                  >
                    <i className="fas fa-download me-2"></i>
                    Export My Data
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      // Delete account functionality
                      if (
                        window.confirm(
                          "Are you sure you want to delete your account? This action cannot be undone."
                        )
                      ) {
                        toast.info("Delete account functionality");
                      }
                    }}
                  >
                    <i className="fas fa-trash me-2"></i>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingBody;
