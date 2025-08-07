"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const BottomNavigation = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div
      className="bottom-navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e9ecef",
        padding: "12px 0 8px 0",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 -1px 3px rgba(0, 0, 0, 0.1)",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      {/* Explore/Home */}
      <Link
        href="/"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "6px",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{
              color: isActive("/") ? "#007bff" : "#6c757d",
            }}
          >
            <circle
              cx="9"
              cy="9"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M14 14L18 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: "12px",
            fontWeight: isActive("/") ? "700" : "600",
            color: isActive("/") ? "#007bff" : "#6c757d",
          }}
        >
          Explore
        </span>
      </Link>

      {/* Favorites/Wishlists */}
      <Link
        href={user ? "/dashboard/favourites" : "/login"}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "6px",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{
              color: isActive("/dashboard/favourites") ? "#007bff" : "#6c757d",
            }}
          >
            <path
              d="M10 3.5C10 3.5 8.5 2 6.5 2C4.5 2 3 3.5 3 5.5C3 7.5 4.5 9 6.5 9C8.5 9 10 7.5 10 7.5C10 7.5 11.5 9 13.5 9C15.5 9 17 7.5 17 5.5C17 3.5 15.5 2 13.5 2C11.5 2 10 3.5 10 3.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: "12px",
            fontWeight: isActive("/dashboard/favourites") ? "700" : "600",
            color: isActive("/dashboard/favourites") ? "#007bff" : "#6c757d",
          }}
        >
          Wishlists
        </span>
      </Link>

      {/* Login/Profile */}
      <Link
        href={user ? "/dashboard/home" : "/login"}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.2s ease",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "6px",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{
              color:
                isActive("/login") || isActive("/dashboard/home")
                  ? "#007bff"
                  : "#6c757d",
            }}
          >
            <circle
              cx="10"
              cy="7"
              r="3"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M3 17C3 13 6 10 10 10C14 10 17 13 17 17"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: "12px",
            fontWeight:
              isActive("/login") || isActive("/dashboard/home") ? "700" : "600",
            color:
              isActive("/login") || isActive("/dashboard/home")
                ? "#007bff"
                : "#6c757d",
          }}
        >
          {user ? "Profile" : "Log in"}
        </span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
