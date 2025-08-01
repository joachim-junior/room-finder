"use client";
import inner_faq_data from "@/data/inner-data/FaqData";
import Link from "next/link";

const FaqArea = () => {
  return (
    <div className="faq-section-two mt-130 xl-mt-100 mb-150 xl-mb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 wow fadeInLeft">
            <div className="faq-sidebar">
              <div className="bg-wrapper">
                <ul className="style-none">
                  <li>
                    <Link href="#Selling">
                      1. <span>Selling Properties</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#Renting">
                      2. <span>Renting Properties</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#Buying">
                      3. <span>Buying Properties</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#Payments">
                      4. <span>Payments & Wallet</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#Terms">
                      5. <span>Terms & Conditions</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="#Account">
                      6. <span>Account & Profile</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="bg-wrapper text-center mt-35">
                <h4 className="mb-35">
                  Still Have <br />
                  Questions?
                </h4>
                <p className="mb-25">
                  Can't find the answer you're looking for? Our support team is
                  here to help.
                </p>
                <Link href="/contact" className="btn-five">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            {inner_faq_data.map((item) => (
              <div
                key={item.id}
                className="accordion-style-two no-bg p0 ms-xl-5"
              >
                <div
                  className={`accordion-title text-uppercase fw-500 ${
                    item.md_pt ? "md-pt-90" : "pt-90"
                  }`}
                  id={item.id_name}
                >
                  {item.title}
                </div>
                <div className="accordion p0" id={`accordion${item.id}`}>
                  {item.faq.map((faq: any, index: any) => (
                    <div
                      key={index}
                      className={`accordion-item ${
                        faq.showAnswer ? "active" : ""
                      }`}
                    >
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${
                            faq.id === 3 ? "" : "collapsed"
                          }`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${faq.id}`}
                          aria-expanded="true"
                          aria-controls={`collapse${faq.id}`}
                        >
                          {faq.question}
                        </button>
                      </h2>
                      <div
                        id={`collapse${faq.id}`}
                        className={`accordion-collapse collapse ${
                          faq.id === 3 ? "show" : ""
                        }`}
                        data-bs-parent={`#accordion${item.id}`}
                      >
                        <div className="accordion-body">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqArea;
