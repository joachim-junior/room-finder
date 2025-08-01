"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

import dashboardLogo from "@/assets/images/logo/logo_01.svg";
import dashboardIconActive_1 from "@/assets/images/dashboard/icon/icon_1_active.svg";
import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_1.svg";
import dashboardIconActive_2 from "@/assets/images/dashboard/icon/icon_2_active.svg";
import dashboardIcon_2 from "@/assets/images/dashboard/icon/icon_2.svg";
import dashboardIconActive_3 from "@/assets/images/dashboard/icon/icon_3_active.svg";
import dashboardIcon_3 from "@/assets/images/dashboard/icon/icon_3.svg";
import dashboardIconActive_4 from "@/assets/images/dashboard/icon/icon_4_active.svg";
import dashboardIcon_4 from "@/assets/images/dashboard/icon/icon_4.svg";
import dashboardIconActive_5 from "@/assets/images/dashboard/icon/icon_5_active.svg";
import dashboardIcon_5 from "@/assets/images/dashboard/icon/icon_5.svg";
import dashboardIconActive_6 from "@/assets/images/dashboard/icon/icon_6_active.svg";
import dashboardIcon_6 from "@/assets/images/dashboard/icon/icon_6.svg";
import dashboardIconActive_7 from "@/assets/images/dashboard/icon/icon_7_active.svg";
import dashboardIcon_7 from "@/assets/images/dashboard/icon/icon_7.svg";
import dashboardIconActive_8 from "@/assets/images/dashboard/icon/icon_8_active.svg";
import dashboardIcon_8 from "@/assets/images/dashboard/icon/icon_8.svg";
import dashboardIconActive_9 from "@/assets/images/dashboard/icon/icon_9_active.svg";
import dashboardIcon_9 from "@/assets/images/dashboard/icon/icon_9.svg";
import dashboardIconActive_10 from "@/assets/images/dashboard/icon/icon_10_active.svg";
import dashboardIcon_10 from "@/assets/images/dashboard/icon/icon_10.svg";
import dashboardIcon_11 from "@/assets/images/dashboard/icon/icon_41.svg";

const DashboardHeaderOne = ({ isActive, setIsActive }: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out!");
    router.push("/");
  };

  return (
    <aside className={`dash-aside-navbar ${isActive ? "show" : ""}`}>
      <div className="position-relative d-flex flex-column h-100">
        <div className="logo d-md-block d-flex align-items-center justify-content-between plr bottom-line pb-30">
          <Link href="/dashboard/home">
            <Image src={dashboardLogo} alt="" />
          </Link>
          <button
            onClick={() => setIsActive(false)}
            className="close-btn d-block d-md-none"
          >
            <i className="fa-light fa-circle-xmark"></i>
          </button>
        </div>
        <nav className="dasboard-main-nav pt-30 pb-30 bottom-line flex-grow-1">
          <ul className="style-none">
            <li className="plr">
              <Link
                href="/dashboard/home"
                className={`d-flex w-100 align-items-center ${
                  pathname === "/dashboard/home" ? "active" : ""
                }`}
              >
                <Image
                  src={
                    pathname === "/dashboard/home"
                      ? dashboardIconActive_1
                      : dashboardIcon_1
                  }
                  alt=""
                />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="plr">
              <Link
                href="/dashboard/wallet"
                className={`d-flex w-100 align-items-center ${
                  pathname === "/dashboard/wallet" ? "active" : ""
                }`}
              >
                <Image
                  src={
                    pathname === "/dashboard/wallet"
                      ? dashboardIconActive_5
                      : dashboardIcon_5
                  }
                  alt=""
                />
                <span>Wallet</span>
              </Link>
            </li>
            <li className="plr">
              <Link
                href="/dashboard/message"
                className={`d-flex w-100 align-items-center ${
                  pathname === "/dashboard/message" ? "active" : ""
                }`}
              >
                <Image
                  src={
                    pathname === "/dashboard/message"
                      ? dashboardIconActive_2
                      : dashboardIcon_2
                  }
                  alt=""
                />
                <span>Enquiries</span>
              </Link>
            </li>
            <li className="plr">
              <Link
                href="/dashboard/bookings"
                className={`d-flex w-100 align-items-center ${
                  pathname === "/dashboard/bookings" ? "active" : ""
                }`}
              >
                <Image
                  src={
                    pathname === "/dashboard/bookings"
                      ? dashboardIconActive_3
                      : dashboardIcon_3
                  }
                  alt=""
                />
                <span>My Bookings</span>
              </Link>
            </li>
            <li className="plr">
              <Link
                href="/dashboard/referral"
                className={`d-flex w-100 align-items-center ${
                  pathname === "/dashboard/referral" ? "active" : ""
                }`}
              >
                <Image
                  src={
                    pathname === "/dashboard/referral"
                      ? dashboardIconActive_4
                      : dashboardIcon_4
                  }
                  alt=""
                />
                <span>Referral</span>
              </Link>
            </li>
            <li className="bottom-line pt-30 lg-pt-20 mb-40 lg-mb-30"></li>
            <li>
              <div className="nav-title">Listing</div>
            </li>
            <li className="plr">
              <Link
                href="/dashboard/properties-list"
                className={`d-flex w-100 align-items-center ${
                  pathname === "/dashboard/properties-list" ? "active" : ""
                }`}
              >
                <Image
                  src={
                    pathname === "/dashboard/properties-list"
                      ? dashboardIconActive_6
                      : dashboardIcon_6
                  }
                  alt=""
                />
                <span>My Properties</span>
              </Link>
            </li>
            <li className="plr">
              <Link
                href="/listing_01"
                className={`d-flex w-100 align-items-center ${
                  pathname === "/listing_01" ? "active" : ""
                }`}
              >
                <Image
                  src={
                    pathname === "/listing_01"
                      ? dashboardIconActive_9
                      : dashboardIcon_9
                  }
                  alt=""
                />
                <span>All Properties</span>
              </Link>
            </li>
            <li className="plr">
              <Link
                href="/dashboard/add-property"
                className={`d-flex w-100 align-items-center ${
                  pathname === "/dashboard/add-property" ? "active" : ""
                }`}
              >
                <Image
                  src={
                    pathname === "/dashboard/add-property"
                      ? dashboardIconActive_7
                      : dashboardIcon_7
                  }
                  alt=""
                />
                <span>Add New Property</span>
              </Link>
            </li>
            <li className="plr">
              <Link
                href="/dashboard/favourites"
                className={`d-flex w-100 align-items-center ${
                  pathname === "/dashboard/favourites" ? "active" : ""
                }`}
              >
                <Image
                  src={
                    pathname === "/dashboard/favourites"
                      ? dashboardIconActive_8
                      : dashboardIcon_8
                  }
                  alt=""
                />
                <span>Favourites</span>
              </Link>
            </li>
            <li className="plr">
              <Link
                href="/dashboard/review"
                className={`d-flex w-100 align-items-center ${
                  pathname === "/dashboard/review" ? "active" : ""
                }`}
              >
                <Image
                  src={
                    pathname === "/dashboard/review"
                      ? dashboardIconActive_10
                      : dashboardIcon_10
                  }
                  alt=""
                />
                <span>Reviews</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="bottom-line pt-30 lg-pt-20 mb-30 lg-mb-20"></div>

        <div
          className="plr mt-auto pb-30"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <button
            onClick={handleLogout}
            className="d-flex w-100 align-items-center logout-btn"
            style={{ background: "none", border: "none", width: "100%" }}
          >
            <div className="icon tran3s d-flex align-items-center justify-content-center rounded-circle">
              <Image src={dashboardIcon_11} alt="" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardHeaderOne;
