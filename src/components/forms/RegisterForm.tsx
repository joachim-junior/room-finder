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
  name: string;
  email: string;
  password: string;
  mobile: string;
  ccode: string;
  refercode?: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");

  const schema = yup
    .object({
      name: yup.string().required("Name is required").label("Name"),
      email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email")
        .label("Email"),
      password: yup.string().required("Password is required").label("Password"),
      mobile: yup
        .string()
        .required("Phone number is required")
        .label("Phone Number"),
      ccode: yup
        .string()
        .required("Country code is required")
        .label("Country Code"),
      refercode: yup.string().optional().label("Refer Code"),
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
    setValue("mobile", cleaned);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

    // Send phone number without country code, keep country code separate
    const formData = {
      name: data.name,
      email: data.email,
      password: data.password,
      mobile: phoneNumber, // Just the phone number without country code
      ccode: "+237", // Always Cameroon
      refercode: data.refercode || "",
    };

    try {
      const res = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_reg_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await res.json();
      if (result.Result === "true") {
        // Auto-login after successful registration
        const userData = {
          id: result.UserLogin?.id || result.user_id || "1",
          name: data.name,
          email: data.email,
          mobile: formData.mobile,
          ccode: formData.ccode,
          wallet: result.UserLogin?.wallet || 0,
        };
        login(userData);
        toast.success("✅ Registration successful!");
        reset();
        setPhoneNumber("");
        setTimeout(() => router.push("/dashboard/home"), 1000);
      } else {
        setError(
          result.ResponseMsg ||
            "Registration failed. Please check your details."
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
            padding: "12px 16px",
            marginBottom: "24px",
            color: "#721c24",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* Name */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#495057",
            marginBottom: "6px", // Reduced margin
          }}
        >
          Full Name
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="Enter your full name"
          disabled={loading}
          style={{
            width: "100%",
            height: "44px", // Reduced height
            border: "1px solid #e9ecef",
            borderRadius: "8px",
            padding: "0 16px",
            fontSize: "14px",
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
        {errors.name && (
          <p
            style={{
              color: "#dc3545",
              fontSize: "12px",
              margin: "3px 0 0 0", // Reduced margin
            }}
          >
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#495057",
            marginBottom: "6px", // Reduced margin
          }}
        >
          Email Address
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="Enter your email address"
          disabled={loading}
          style={{
            width: "100%",
            height: "44px", // Reduced height
            border: "1px solid #e9ecef",
            borderRadius: "8px",
            padding: "0 16px",
            fontSize: "14px",
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
        {errors.email && (
          <p
            style={{
              color: "#dc3545",
              fontSize: "12px",
              margin: "3px 0 0 0", // Reduced margin
            }}
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone Number with Country Code */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#495057",
            marginBottom: "6px", // Reduced margin
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
                padding: "0 12px",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                fontSize: "14px",
                borderRight: "1px solid #e9ecef",
                minWidth: "80px",
                height: "44px", // Reduced height
              }}
            >
              <span style={{ marginRight: "8px", fontSize: "16px" }}>🇨🇲</span>
              <span style={{ fontSize: "14px" }}>+237</span>
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
                height: "44px", // Reduced height
                border: "none",
                padding: "0 16px",
                fontSize: "14px",
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
              fontSize: "12px",
              margin: "3px 0 0 0", // Reduced margin
            }}
          >
            {errors.mobile.message}
          </p>
        )}
      </div>

      {/* Refer Code (Optional) */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#495057",
            marginBottom: "6px", // Reduced margin
          }}
        >
          Refer Code (Optional)
        </label>
        <input
          type="text"
          {...register("refercode")}
          placeholder="Enter refer code if you have one"
          disabled={loading}
          style={{
            width: "100%",
            height: "44px", // Reduced height
            border: "1px solid #e9ecef",
            borderRadius: "8px",
            padding: "0 16px",
            fontSize: "14px",
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
        {errors.refercode && (
          <p
            style={{
              color: "#dc3545",
              fontSize: "12px",
              margin: "3px 0 0 0", // Reduced margin
            }}
          >
            {errors.refercode.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#495057",
            marginBottom: "6px", // Reduced margin
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
              height: "44px", // Reduced height
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              padding: "0 48px 0 16px",
              fontSize: "14px",
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
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#6c757d",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <i
              className={`fas ${isPasswordVisible ? "fa-eye-slash" : "fa-eye"}`}
              style={{ fontSize: "16px" }}
            ></i>
          </button>
        </div>
        {errors.password && (
          <p
            style={{
              color: "#dc3545",
              fontSize: "12px",
              margin: "3px 0 0 0", // Reduced margin
            }}
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "13px", // Reduced font size
            color: "#6c757d",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            disabled={loading}
            style={{
              marginRight: "8px",
              accentColor: "#007bff",
            }}
          />
          By hitting the &ldquo;Register&rdquo; button, you agree to the{" "}
          <Link
            href="/terms"
            style={{
              color: "#007bff",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Terms and Conditions
          </Link>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          height: "44px", // Reduced height
          backgroundColor: loading ? "#6c757d" : "#007bff",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
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
            Creating account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
