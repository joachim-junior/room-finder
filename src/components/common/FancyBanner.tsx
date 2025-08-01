"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import titleShape from "@/assets/images/shape/title_shape_06.svg";

const FancyBanner = ({ style }: any) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard/home");
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="fancy-banner-two position-relative z-1 pt-90 lg-pt-50 pb-90 lg-pb-50">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="title-one text-center text-lg-start md-mb-40 pe-xl-5">
              <h3 className="text-white m0">
                Start your{" "}
                <span>
                  Journey
                  {style ? (
                    ""
                  ) : (
                    <Image src={titleShape} alt="" className="lazy-img" />
                  )}
                </span>{" "}
                As a Retailer.
              </h3>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="form-wrapper me-auto ms-auto me-lg-0">
              <div className="text-center">
                <button
                  onClick={handleGetStarted}
                  className={`btn-one ${style ? "rounded-0" : ""}`}
                  style={{ padding: "15px 30px", fontSize: "16px" }}
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </button>
              </div>
              <div className="fs-16 mt-10 text-white text-center">
                {isAuthenticated ? (
                  "Welcome back! Access your dashboard."
                ) : (
                  <>
                    Already have an account? <Link href="/login">Sign in.</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyBanner;
