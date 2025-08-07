"use client";
import NavMenu from "./Menu/NavMenu";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import UseSticky from "@/hooks/UseSticky";
import Offcanvas from "./Menu/Offcanvas";
import HeaderSearchbar from "./Menu/HeaderSearchbar";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import MenuData from "@/data/home-data/MenuData";

import logoPng from "@/assets/images/logo/logo.png";

const HeaderTwo = ({ style_1, style_2 }: any) => {
  const { sticky } = UseSticky();
  const [offCanvas, setOffCanvas] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const handleIconClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard/home");
    } else {
      router.push("/login");
    }
  };

  return (
    <>
      <div
        className={`theme-main-menu menu-overlay sticky-menu ${
          style_2
            ? "menu-style-four"
            : style_1
            ? "menu-style-three"
            : "menu-style-two"
        } ${sticky ? "fixed" : ""}`}
      >
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            {/* Logo Section */}
            <div className="logo" style={{ marginLeft: "120px" }}>
              <Link href="/">
                <Image
                  src="/assets/images/logo/logo.png"
                  alt="RoomFinder"
                  width={150}
                  height={50}
                  priority
                />
              </Link>
            </div>

            {/* Right Widget - Account Button Only */}
            <div
              className="right-widget d-flex align-items-center"
              style={{ marginRight: "120px" }}
            >
              {/* Desktop Authentication */}
              <div className="d-none d-lg-flex align-items-center">
                <button
                  onClick={handleIconClick}
                  className="btn btn-white rounded-pill"
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i className="fas fa-user" style={{ fontSize: "14px" }}></i>
                  <span>{isAuthenticated ? "Account" : "Login"}</span>
                </button>
              </div>

              {/* Mobile Authentication - Clickable Icon */}
              <div className="d-flex d-lg-none">
                <button
                  onClick={handleIconClick}
                  className="btn btn-white rounded-pill"
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <i className="fas fa-user" style={{ fontSize: "14px" }}></i>
                  <span>{isAuthenticated ? "Account" : "Login"}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <Offcanvas offCanvas={offCanvas} setOffCanvas={setOffCanvas} />
      <HeaderSearchbar isSearch={isSearch} setIsSearch={setIsSearch} />
    </>
  );
};

export default HeaderTwo;
