import Image from "next/image";

import footerLogo from "@/assets/images/logo/logo_06.svg";
import footerShape from "@/assets/images/assets/ils_06.svg";
import Link from "next/link";
import footer_data from "@/data/home-data/FooterData";

const FooterFour = () => {
  return (
    <div className="footer-four position-relative z-1">
      <div
        className="container-fluid"
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px" }}
      >
        <div className="bg-wrapper position-relative z-1">
          <div className="row" style={{ gap: "5px" }}>
            <div className="col-xxl-3 col-lg-4 mb-5">
              <div className="footer-intro">
                <div className="logo mb-4">
                  <Link href="/">
                    <Image src={footerLogo} alt="" />
                  </Link>
                </div>
                <p
                  className="mb-4 xs-mb-3"
                  style={{ fontSize: "1.1rem", color: "#495057" }}
                >
                  <strong style={{ color: "#212529" }}>Office Location:</strong>
                  <br />
                  Mile 2, Limbe.
                  <br />
                  South West Region, Cameroon, 00237
                </p>
                <h6
                  className="mb-2"
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    color: "#212529",
                  }}
                >
                  CONTACT
                </h6>
                <div
                  className="mb-1"
                  style={{ fontSize: "1rem", color: "#495057" }}
                >
                  <strong style={{ color: "#212529" }}>Phone:</strong>{" "}
                  <a
                    href="tel:+237681101063"
                    style={{ color: "#007bff", textDecoration: "none" }}
                  >
                    681-101-063
                  </a>
                </div>
                <div
                  className="mb-1"
                  style={{ fontSize: "1rem", color: "#495057" }}
                >
                  <strong style={{ color: "#212529" }}>Email:</strong>{" "}
                  <a
                    href="mailto:info@roomfinder237.com"
                    style={{ color: "#007bff", textDecoration: "none" }}
                  >
                    info@roomfinder237.com
                  </a>
                </div>
                <div
                  className="mb-1"
                  style={{ fontSize: "1rem", color: "#495057" }}
                >
                  <strong style={{ color: "#212529" }}>Support:</strong>{" "}
                  <a
                    href="mailto:support@roomfinder237.com"
                    style={{ color: "#007bff", textDecoration: "none" }}
                  >
                    support@roomfinder237.com
                  </a>
                </div>
                <ul
                  className="style-none d-flex align-items-center social-icon"
                  style={{ marginTop: "4px" }}
                >
                  <li>
                    <Link href="#" style={{ color: "#495057" }}>
                      <i className="fa-brands fa-facebook-f"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" style={{ color: "#495057" }}>
                      <i className="fa-brands fa-twitter"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="#" style={{ color: "#495057" }}>
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {footer_data
              .filter((items) => items.page === "home_5")
              .map((item) => (
                <div
                  key={item.id}
                  className={`col-sm-4 mb-4 ${item.widget_class}`}
                >
                  <div className={`footer-nav ${item.widget_class2}`}>
                    <h5
                      className="footer-title mb-2"
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#212529",
                      }}
                    >
                      {item.widget_title}
                    </h5>
                    <ul className="footer-nav-link style-none">
                      {item.footer_link.map((li, i) => (
                        <li
                          key={i}
                          className="mb-1"
                          style={{ fontSize: "1rem" }}
                        >
                          <Link
                            href={li.link}
                            style={{ color: "#495057", textDecoration: "none" }}
                          >
                            {li.link_title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="bottom-footer" style={{ marginTop: "8px" }}>
          <p className="m0 text-center fs-16" style={{ color: "#6c757d" }}>
            Copyright @2024 Roomfinder Inc.
          </p>
        </div>
      </div>
      <Image src={footerShape} alt="" className="lazy-img shapes shape_01" />
    </div>
  );
};

export default FooterFour;
