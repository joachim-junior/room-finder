"use client";
import NavMenu from "./Menu/NavMenu";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import UseSticky from "@/hooks/UseSticky";
import HeaderSearchbar from "./Menu/HeaderSearchbar";

import logoPng from "@/assets/images/logo/logo.png";

const HeaderFour = () => {
  const { sticky } = UseSticky();
  const [isSearch, setIsSearch] = useState<boolean>(false);

  return (
    <>
      <header
        className={`theme-main-menu menu-overlay menu-style-six sticky-menu ${
          sticky ? "fixed" : ""
        }`}
      >
        <div className="inner-content gap-two">
          <div className="top-header position-relative">
            <div className="d-flex align-items-center">
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

              <div className="right-widget ms-auto me-3 me-lg-0 order-lg-3">
                <ul className="d-flex align-items-center style-none">
                  <li className="d-none d-md-inline-block me-4">
                    <Link
                      href="/dashboard/add-property"
                      className="btn-ten rounded-0"
                      target="_blank"
                    >
                      <span>Add Listing</span>{" "}
                      <i className="bi bi-arrow-up-right"></i>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="login-btn-two rounded-circle tran3s d-flex align-items-center justify-content-center"
                    >
                      <i className="fa-regular fa-lock"></i>
                    </Link>
                  </li>
                  <li>
                    <a
                      onClick={() => setIsSearch(true)}
                      style={{ cursor: "pointer" }}
                      className="search-btn-one rounded-circle tran3s d-flex align-items-center justify-content-center"
                    >
                      <i className="bi bi-search"></i>
                    </a>
                  </li>
                </ul>
              </div>

              <nav className="navbar navbar-expand-lg p0 ms-lg-5 order-lg-2">
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
                  className="collapse navbar-collapse ms-xl-5"
                  id="navbarNav"
                >
                  <NavMenu />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <HeaderSearchbar isSearch={isSearch} setIsSearch={setIsSearch} />
    </>
  );
};

export default HeaderFour;
