import Image from "next/image";
import Link from "next/link";

import titleShape from "@/assets/images/shape/title_shape_06.svg";
import Count from "@/components/common/Count";

interface ContentType {
  sub_title: string;
  desc_1: JSX.Element;
  title_1: string;
  title_2: string;
  desc_2: JSX.Element;
  desc_3: JSX.Element;
}

const feature_content: ContentType = {
  sub_title: "About us",
  desc_1: (
    <>
      RoomFinder is Cameroon&apos;s premier real estate platform, connecting
      property seekers with their dream homes since 2023.
    </>
  ),
  title_1: "Who we are?",
  title_2: "Our Mission",
  desc_2: (
    <>
      We are a dedicated team of real estate professionals committed to
      simplifying the property search process in Cameroon. Our platform bridges
      the gap between property owners and potential tenants/buyers, making real
      estate transactions seamless and transparent.
    </>
  ),
  desc_3: (
    <>
      To become the most trusted and comprehensive real estate platform in
      Cameroon, providing innovative solutions that empower individuals to find
      their perfect homes and make informed property decisions.
    </>
  ),
};

const { sub_title, desc_1, title_1, title_2, desc_2, desc_3 } = feature_content;

const BLockFeatureOne = () => {
  return (
    <div className="block-feature-two mt-150 xl-mt-100">
      <div className="container">
        <div className="row gx-xl-5">
          <div className="col-lg-6 wow fadeInLeft">
            <div className="me-xxl-4">
              <div className="title-one mb-60 lg-mb-40">
                <div className="upper-title">{sub_title}</div>
                <h3>
                  Find your{" "}
                  <span>
                    perfect
                    <Image src={titleShape} alt="" className="lazy-img" />
                  </span>{" "}
                  home.
                </h3>
                <p className="fs-22">{desc_1}</p>
              </div>
              <Link href="/contact" className="btn-two">
                Contact Us
              </Link>
              <div className="counter-wrapper border-top pt-40 md-pt-10 mt-65 md-mt-40">
                <div className="row">
                  <div className="col-xxl-6 col-sm-5">
                    <div className="counter-block-one mt-20">
                      <div className="main-count fw-500 color-dark">
                        <span className="counter">
                          <Count number={500} />
                        </span>
                        +
                      </div>
                      <span>Properties listed</span>
                    </div>
                  </div>
                  <div className="col-xxl-6 col-sm-7">
                    <div className="counter-block-one mt-20">
                      <div className="main-count fw-500 color-dark">
                        <span className="counter">
                          <Count number={1000} />
                        </span>
                        +
                      </div>
                      <span>Happy customers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 wow fadeInRight">
            <div className="block-two md-mt-40">
              <div className="bg-wrapper">
                <h5>{title_1}</h5>
                <p className="fs-22 lh-lg mt-20">{desc_2}</p>
                <h5 className="top-line">{title_2} </h5>
                <p className="fs-22 lh-lg mt-20">{desc_3}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BLockFeatureOne;
