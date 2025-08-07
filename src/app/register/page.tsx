import RegisterForm from "@/components/forms/RegisterForm";
import Link from "next/link";
import Image from "next/image";
import HeaderTwo from "@/layouts/headers/HeaderTwo";
import FooterFour from "@/layouts/footers/FooterFour";
import BottomNavigation from "@/components/common/BottomNavigation";
import "@/styles/homepage-responsive.css";

export const metadata = {
  title: "Register - Roomfinder",
};

export default function RegisterPage() {
  return (
    <>
      <HeaderTwo />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa", // Light gray background
          padding: "16px", // Reduced padding
          marginTop: "100px", // Add margin to prevent header overlap
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff", // White card background
            borderRadius: "16px", // More rounded corners
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)", // Enhanced shadow
            padding: "32px", // Reduced padding from 40px
            maxWidth: "480px", // Wider card
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "16px", // Reduced gap from 24px
          }}
        >
          <div
            style={{
              fontSize: "1.8rem", // Reduced font size
              fontWeight: "700",
              textAlign: "center",
              color: "#343a40", // Darker text
              marginBottom: "4px", // Reduced margin from 6px
            }}
          >
            Sign Up
          </div>
          <div
            style={{
              color: "#6c757d", // Muted gray subtitle
              fontSize: "1rem", // Reduced font size
              textAlign: "center",
              marginBottom: "16px", // Reduced margin
            }}
          >
            Create your account to get started
          </div>
          <RegisterForm />
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e9ecef", // Lighter divider
              margin: "16px 0 12px 0", // Reduced margin
            }}
          />
          <div
            style={{
              textAlign: "center",
              fontSize: "14px", // Reduced font size
              color: "#495057", // Darker text
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#007bff", // Primary blue link
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <FooterFour />
      <BottomNavigation />
    </>
  );
}
