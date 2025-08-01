"use client";
import NavMenu from "./Menu/NavMenu";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import UseSticky from "@/hooks/UseSticky";
import { useAuth } from "@/contexts/AuthContext";

import logoPng from "@/assets/images/logo/logo.png";

const HeaderOne = ({ style }: any) => {
  const { sticky } = UseSticky();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      <header
        className={`theme-main-menu menu-overlay menu-style-one sticky-menu ${
          sticky ? "fixed" : ""
        }`}
      >
        {!style && (
          <div className="alert-wrapper text-center">
            <p className="fs-16 m0 text-white">
              The{" "}
              <Link href="/listing_01" className="fw-500">
                flash sale
              </Link>{" "}
              go on. The offer will end in — <span>This Sunday</span>
            </p>
          </div>
        )}
        <div className="inner-content gap-one">
          <div className="top-header position-relative">
            <div className="d-flex align-items-center justify-content-between">
              <div className="logo order-lg-0">
                <Link href="/" className="d-flex align-items-center">
                  <Image
                    src={logoPng}
                    alt="Room Finder Logo"
                    width={120}
                    height={40}
                  />
                </Link>
              </div>
              <div className="right-widget ms-auto ms-lg-0 me-3 me-lg-0 order-lg-3">
                <ul className="d-flex align-items-center style-none">
                  {isAuthenticated ? (
                    <>
                      <li className="d-flex align-items-center">
                        <span className="me-2 text-white">
                          Welcome, {user?.name}
                        </span>
                        <Link href="/dashboard/home" className="btn-one me-2">
                          <i className="fa-regular fa-user"></i>{" "}
                          <span>Dashboard</span>
                        </Link>
                        <button onClick={logout} className="btn-two">
                          <i className="fa-regular fa-sign-out"></i>{" "}
                          <span>Logout</span>
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href="/login" className="btn-one">
                          <i className="fa-regular fa-lock"></i>{" "}
                          <span>Login</span>
                        </Link>
                      </li>
                      <li className="d-none d-md-inline-block ms-3">
                        <Link href="/register" className="btn-two">
                          <span>Sign Up</span>{" "}
                          <i className="fa-thin fa-arrow-up-right"></i>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <nav className="navbar navbar-expand-lg p0 order-lg-2">
                <button
                  className="navbar-toggler d-block d-lg-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <NavMenu />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderOne;
