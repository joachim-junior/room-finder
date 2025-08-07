import LoginForm from "@/components/forms/LoginForm";
import Link from "next/link";
import Image from "next/image";
import HeaderTwo from "@/layouts/headers/HeaderTwo";
import FooterFour from "@/layouts/footers/FooterFour";
import BottomNavigation from "@/components/common/BottomNavigation";
import "@/styles/homepage-responsive.css";

export const metadata = {
  title: "Login - Roomfinder",
};

export default function LoginPage() {
  return (
    <>
      <HeaderTwo />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          padding: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            padding: "32px",
            maxWidth: "400px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              textAlign: "center",
              color: "#343a40",
              marginBottom: "4px",
            }}
          >
            Sign In
          </div>
          <div
            style={{
              color: "#6c757d",
              fontSize: "1rem",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Welcome back to your dashboard
          </div>
          <LoginForm />
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e9ecef",
              margin: "16px 0 12px 0",
            }}
          />
          <div
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#495057",
            }}
          >
            New to Roomfinder?{" "}
            <Link
              href="/register"
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
      <FooterFour />
      <BottomNavigation />
    </>
  );
}
