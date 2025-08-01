import React from "react";

const ContactArea = () => {
  return (
    <div
      className="contact-area-wrapper"
      style={{ background: "#f8fafc", minHeight: "60vh", padding: "48px 0" }}
    >
      <div className="container d-flex flex-column align-items-center justify-content-center">
        <h1
          style={{
            fontWeight: 700,
            fontSize: "2.5rem",
            marginBottom: 32,
            marginTop: 140,
            letterSpacing: "-1px",
            color: "#00345c",
          }}
        >
          Contact Us
        </h1>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            padding: "32px 28px",
            maxWidth: 480,
            width: "100%",
            margin: "0 auto 32px auto",
          }}
        >
          <p style={{ color: "#334155", marginBottom: 24 }}>
            In case you have any requests, feel free to contact us anytime and
            we shall reply within 1-3 business days.
          </p>
          <div style={{ marginBottom: 18 }}>
            <strong style={{ color: "#00345c" }}>
              For Business-related enquiries:
            </strong>
            <br />
            <span style={{ color: "#0a4d78" }}>
              Phone:{" "}
              <a
                href="tel:+237681101063"
                style={{ color: "#0072c6", textDecoration: "underline" }}
              >
                681-101-063
              </a>
            </span>
            <br />
            <span style={{ color: "#0a4d78" }}>
              Email:{" "}
              <a
                href="mailto:info@roomfinder237.com"
                style={{ color: "#0072c6", textDecoration: "underline" }}
              >
                info@roomfinder237.com
              </a>
            </span>
          </div>
          <div style={{ marginBottom: 18 }}>
            <strong style={{ color: "#00345c" }}>
              For all complaints and suggestions:
            </strong>
            <br />
            <span style={{ color: "#0a4d78" }}>
              Email:{" "}
              <a
                href="mailto:support@roomfinder237.com"
                style={{ color: "#0072c6", textDecoration: "underline" }}
              >
                support@roomfinder237.com
              </a>
            </span>
          </div>
          <div>
            <strong style={{ color: "#00345c" }}>Office Location:</strong>
            <br />
            <span style={{ color: "#0a4d78" }}>Mile 2, Limbe.</span>
            <br />
            <span style={{ color: "#0a4d78" }}>
              South West Region, Cameroon, 00237
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactArea;
