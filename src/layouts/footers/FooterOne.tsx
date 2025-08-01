import Image from "next/image";
import Link from "next/link";
import footer_data from "@/data/home-data/FooterData";

import footerLogo_1 from "@/assets/images/logo/logo_01.svg";
import footerLogo_2 from "@/assets/images/logo/logo_03.svg";
import footerShape_1 from "@/assets/images/shape/shape_32.svg";
import footerShape_2 from "@/assets/images/shape/shape_33.svg";

const icon_1: string[] = ["facebook", "twitter", "instagram"];

const FooterOne = ({ style }: any) => {
  return (
    <div className={`footer-one ${style ? "dark-bg" : ""}`}>
      <div className="position-relative z-1">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-4">
              <div
                className={`footer-intro ${
                  style ? "position-relative z-1" : ""
                }`}
              >
                <div className="bg-wrapper">
                  <div className="logo mb-20">
                    <Link href="/">
                      <Image src={style ? footerLogo_2 : footerLogo_1} alt="" />
                    </Link>
                  </div>
                  <p className="mb-60 lg-mb-40 md-mb-20">
                    <strong>Office Location:</strong>
                    <br />
                    Mile 2, Limbe.
                    <br />
                    South West Region, Cameroon, 00237
                  </p>
                  <h6>CONTACT</h6>
                  <div
                    className={`mb-2 ${style ? "text-white" : ""}`}
                    style={{ fontSize: style ? "1.1rem" : "1.1rem" }}
                  >
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:info@roomfinder237.com"
                      className={style ? "text-white" : ""}
                    >
                      info@roomfinder237.com
                    </a>
                  </div>
                  <div
                    className={`mb-2 ${style ? "text-white" : ""}`}
                    style={{ fontSize: style ? "1.1rem" : "1.1rem" }}
                  >
                    <strong>Phone:</strong>{" "}
                    <a
                      href="tel:+237681101063"
                      className={style ? "text-white" : ""}
                    >
                      681-101-063
                    </a>
                  </div>
                  <div
                    className={`mb-2 ${style ? "text-white" : ""}`}
                    style={{ fontSize: style ? "1.1rem" : "1.1rem" }}
                  >
                    <strong>Support:</strong>{" "}
                    <a
                      href="mailto:support@roomfinder237.com"
                      className={style ? "text-white" : ""}
                    >
                      support@roomfinder237.com
                    </a>
                  </div>
                  <ul className="style-none d-flex align-items-center social-icon">
                    {icon_1.map((icon, i) => (
                      <li key={i}>
                        <Link href="#">
                          <i
                            className={`fa-brands fa${
                              style ? "" : "-square"
                            }-${icon}`}
                          ></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {style && (
                  <Image
                    src={footerShape_1}
                    alt=""
                    className="lazy-img shapes shape_01"
                  />
                )}
              </div>
            </div>

            <div className="col-lg-8">
              <div className={`d-flex flex-wrap ${style ? "h-100" : ""}`}>
                {footer_data
                  .filter((items) => items.page === "home_1")
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`footer-nav mt-100 lg-mt-80 ${item.widget_class}`}
                    >
                      <h5
                        className={`footer-title ${style ? "text-white" : ""}`}
                      >
                        {item.widget_title}
                      </h5>
                      <ul className="footer-nav-link style-none">
                        {item.footer_link.map((li, i) => (
                          <li key={i}>
                            <Link href={li.link}>{li.link_title}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        {style && (
          <Image
            src={footerShape_2}
            alt=""
            className="lazy-img shapes shape_02"
          />
        )}
      </div>
    </div>
  );
};

export default FooterOne;
