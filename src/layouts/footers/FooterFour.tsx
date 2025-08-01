import Image from "next/image";

import footerLogo from "@/assets/images/logo/logo_06.svg";
import footerShape from "@/assets/images/assets/ils_06.svg";
import Link from "next/link";
import footer_data from "@/data/home-data/FooterData";

const FooterFour = () => {
  return (
    <div className="footer-four position-relative z-1">
      <div className="container container-large">
        <div className="bg-wrapper position-relative z-1">
          <div className="row">
            <div className="col-xxl-3 col-lg-4 mb-60">
              <div className="footer-intro">
                <div className="logo mb-20">
                  <Link href="/">
                    <Image src={footerLogo} alt="" />
                  </Link>
                </div>
                <p className="mb-30 xs-mb-20">
                  <strong>Office Location:</strong>
                  <br />
                  Mile 2, Limbe.
                  <br />
                  South West Region, Cameroon, 00237
                </p>
                <h6 className="mb-15">CONTACT</h6>
                <div className="mb-2" style={{ fontSize: "1.1rem" }}>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:info@roomfinder237.com"
                    className="text-white"
                  >
                    info@roomfinder237.com
                  </a>
                </div>
                <div className="mb-2" style={{ fontSize: "1.1rem" }}>
                  <strong>Phone:</strong>{" "}
                  <a href="tel:+237681101063" className="text-white">
                    681-101-063
                  </a>
                </div>
                <div className="mb-2" style={{ fontSize: "1.1rem" }}>
                  <strong>Support:</strong>{" "}
                  <a
                    href="mailto:support@roomfinder237.com"
                    className="text-white"
                  >
                    support@roomfinder237.com
                  </a>
                </div>
                <ul className="style-none d-flex align-items-center social-icon">
                  <li>
                    <Link href="#">
                      <i className="fa-brands fa-facebook-f"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <i className="fa-brands fa-twitter"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
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
                  className={`col-sm-4 mb-30 ${item.widget_class}`}
                >
                  <div className={`footer-nav ${item.widget_class2}`}>
                    <h5 className="footer-title">{item.widget_title}</h5>
                    <ul className="footer-nav-link style-none">
                      {item.footer_link.map((li, i) => (
                        <li key={i}>
                          <Link href={li.link}>{li.link_title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="bottom-footer">
          <p className="m0 text-center fs-16">
            Copyright @2024 Roomfinder Inc.
          </p>
        </div>
      </div>
      <Image src={footerShape} alt="" className="lazy-img shapes shape_01" />
    </div>
  );
};

export default FooterFour;
