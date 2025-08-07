"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  mobile: string;
  password: string;
  ccode: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");

  const schema = yup
    .object({
      mobile: yup
        .string()
        .required("Phone number is required")
        .label("Phone Number"),
      password: yup.string().required("Password is required").label("Password"),
      ccode: yup
        .string()
        .required("Country code is required")
        .label("Country Code"),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const handlePhoneNumberChange = (value: string) => {
    // Remove any non-digit characters except +
    const cleaned = value.replace(/[^\d+]/g, "");
    setPhoneNumber(cleaned);
    // Set the full phone number with country code for the API
    setValue("mobile", cleaned);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

    // Send phone number without country code, keep country code separate
    const formData = {
      mobile: phoneNumber, // Just the phone number without country code
      password: data.password,
      ccode: "+237", // Always Cameroon
    };

    try {
      const res = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_login_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();
      if (result.Result === "true") {
        // Save user data to auth context
        const userData = {
          id: result.UserLogin?.id || result.UserId || result.user_id || "1",
          name:
            result.UserLogin?.name || result.UserName || result.name || "User",
          email:
            result.UserLogin?.email || result.UserEmail || result.email || "",
          mobile: result.UserLogin?.mobile || formData.mobile,
          ccode: result.UserLogin?.ccode || formData.ccode,
          wallet: result.UserLogin?.wallet || 0,
        };
        login(userData);
        toast.success("✅ Login successful!");
        reset();
        setPhoneNumber("");
        setTimeout(() => router.push("/dashboard/home"), 1000);
      } else {
        setError(
          result.ResponseMsg || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Set initial country code to Cameroon
  useEffect(() => {
    setValue("ccode", "+237");
  }, [setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "8px",
            padding: "10px 12px",
            marginBottom: "16px",
            color: "#721c24",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* Phone Number with Country Code */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            color: "#495057",
            marginBottom: "6px",
          }}
        >
          Phone Number
        </label>
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#ffffff",
            }}
          >
            {/* Country Code Display */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                fontSize: "13px",
                borderRight: "1px solid #e9ecef",
                minWidth: "70px",
                height: "42px",
              }}
            >
              <span style={{ marginRight: "6px", fontSize: "14px" }}>🇨🇲</span>
              <span style={{ fontSize: "13px" }}>+237</span>
            </div>

            {/* Phone Number Input */}
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneNumberChange(e.target.value)}
              placeholder="Enter phone number"
              disabled={loading}
              style={{
                flex: 1,
                height: "42px",
                border: "none",
                padding: "0 12px",
                fontSize: "13px",
                backgroundColor: "#ffffff",
                color: "#495057",
                outline: "none",
              }}
            />
          </div>
        </div>
        {errors.mobile && (
          <p
            style={{
              color: "#dc3545",
              fontSize: "11px",
              margin: "3px 0 0 0",
            }}
          >
            {errors.mobile.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "600",
            color: "#495057",
            marginBottom: "6px",
          }}
        >
          Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={isPasswordVisible ? "text" : "password"}
            {...register("password")}
            placeholder="Enter your password"
            disabled={loading}
            style={{
              width: "100%",
              height: "42px",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              padding: "0 40px 0 12px",
              fontSize: "13px",
              backgroundColor: "#ffffff",
              color: "#495057",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#007bff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e9ecef";
            }}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#6c757d",
              cursor: "pointer",
              padding: "3px",
            }}
          >
            <i
              className={`fas ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
              style={{ fontSize: "14px" }}
            ></i>
          </button>
        </div>
        {errors.password && (
          <p
            style={{
              color: "#dc3545",
              fontSize: "11px",
              margin: "3px 0 0 0",
            }}
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "13px",
            color: "#6c757d",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            disabled={loading}
            style={{
              marginRight: "6px",
              accentColor: "#007bff",
            }}
          />
          Remember me
        </label>
        <Link
          href="#"
          style={{
            color: "#007bff",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          height: "42px",
          backgroundColor: loading ? "#6c757d" : "#007bff",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = "#0056b3";
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = "#007bff";
          }
        }}
      >
        {loading ? (
          <span>
            <i className="fas fa-spinner fa-spin me-2"></i>
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
