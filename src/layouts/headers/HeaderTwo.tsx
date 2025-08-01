"use client";
import NavMenu from "./Menu/NavMenu";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import UseSticky from "@/hooks/UseSticky";
import Offcanvas from "./Menu/Offcanvas";
import HeaderSearchbar from "./Menu/HeaderSearchbar";
import { useAuth } from "@/contexts/AuthContext";

import logo_1 from "@/assets/images/logo/logo_02.svg";
import logo_2 from "@/assets/images/logo/logo_04.svg";
import logo_3 from "@/assets/images/logo/logo_06.svg";
import logoPng from "@/assets/images/logo/logo.png";

const HeaderTwo = ({ style_1, style_2 }: any) => {
  const { sticky } = UseSticky();
  const [offCanvas, setOffCanvas] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const { isAuthenticated, user, logout } = useAuth();

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
        <div className={`inner-content ${style_2 ? "gap-two" : "gap-one"}`}>
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

              <div className="right-widget order-lg-3">
                <ul className="d-flex align-items-center style-none">
                  {!style_2 ? (
                    <>
                      {isAuthenticated ? (
                        <>
                          <li className="d-flex align-items-center login-btn-one">
                            <i className="fa-regular fa-user"></i>
                            <span className="fw-500 tran3s me-2">
                              Welcome, {user?.name}
                            </span>
                          </li>
                          <li className="d-none d-md-inline-block ms-2 me-2">
                            <Link
                              href="/dashboard/home"
                              className={
                                style_1 ? "btn-ten" : "btn-two rounded-0"
                              }
                              style={{ padding: "8px 16px", fontSize: "14px" }}
                            >
                              <span>Dashboard</span>{" "}
                              <i className="fa-thin fa-arrow-up-right"></i>
                            </Link>
                          </li>
                          <li className="d-none d-md-inline-block ms-2 me-2">
                            <button
                              onClick={logout}
                              className={
                                style_1 ? "btn-ten" : "btn-two rounded-0"
                              }
                              style={{ padding: "8px 16px", fontSize: "14px" }}
                            >
                              <span>Logout</span>{" "}
                              <i className="fa-regular fa-sign-out"></i>
                            </button>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="d-flex align-items-center login-btn-one">
                            <i className="fa-regular fa-lock"></i>
                            <Link href="/login" className="fw-500 tran3s">
                              Login{" "}
                              <span className="d-none d-sm-inline-block">
                                {" "}
                                / Sign up
                              </span>
                            </Link>
                          </li>
                          <li className="d-none d-md-inline-block ms-3 ms-xl-4 me-xl-4">
                            <Link
                              href="/register"
                              className={
                                style_1 ? "btn-ten" : "btn-two rounded-0"
                              }
                            >
                              <span>Sign Up</span>{" "}
                              <i className="fa-thin fa-arrow-up-right"></i>
                            </Link>
                          </li>
                        </>
                      )}
                      <li className="d-none d-xl-block">
                        <button
                          onClick={() => setOffCanvas(true)}
                          style={{ cursor: "pointer" }}
                          className="sidenavbtn rounded-circle tran3s"
                          type="button"
                        >
                          <i className="fa-sharp fa-light fa-bars-filter"></i>
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="d-none d-md-flex align-items-center login-btn-one me-4 me-xxl-5">
                        <i className="fa-regular fa-phone-volume"></i>
                        <Link href="tel:+757-699-4478" className="tran3s">
                          +757 699-4478
                        </Link>
                      </li>
                      {isAuthenticated ? (
                        <>
                          <li>
                            <Link
                              href="/dashboard/home"
                              className="login-btn-two rounded-circle tran3s d-flex align-items-center justify-content-center"
                              title="Dashboard"
                            >
                              <i className="fa-regular fa-user"></i>
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={logout}
                              className="login-btn-two rounded-circle tran3s d-flex align-items-center justify-content-center"
                              title="Logout"
                            >
                              <i className="fa-regular fa-sign-out"></i>
                            </button>
                          </li>
                        </>
                      ) : (
                        <li>
                          <Link
                            href="/login"
                            className="login-btn-two rounded-circle tran3s d-flex align-items-center justify-content-center"
                          >
                            <i className="fa-regular fa-lock"></i>
                          </Link>
                        </li>
                      )}
                      <li>
                        <a
                          onClick={() => setIsSearch(true)}
                          style={{ cursor: "pointer" }}
                          className="search-btn-one rounded-circle tran3s d-flex align-items-center justify-content-center"
                        >
                          <i className="bi bi-search"></i>
                        </a>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <nav
                className="navbar navbar-expand-lg p0 order-lg-1"
                style={{ marginLeft: "-130px", marginRight: "250px" }}
              >
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
                <div
                  className={`collapse navbar-collapse justify-content-start ${
                    style_2 ? "ms-xl-5" : ""
                  }`}
                  id="navbarNav"
                >
                  <NavMenu />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <Offcanvas offCanvas={offCanvas} setOffCanvas={setOffCanvas} />
      <HeaderSearchbar isSearch={isSearch} setIsSearch={setIsSearch} />
    </>
  );
};

export default HeaderTwo;
