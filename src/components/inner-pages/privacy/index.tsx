import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import FancyBanner from "@/components/common/FancyBanner";

const PrivacyPolicy = () => {
  return (
    <>
      <BreadcrumbOne
        title="Privacy Policy"
        link="#"
        link_title="Pages"
        sub_title="Privacy"
        style={false}
      />
      <PrivacyPolicyContent />
      <FancyBanner style={false} />
    </>
  );
};

const PrivacyPolicyContent = () => {
  return (
    <div className="privacy-policy-section mt-130 xl-mt-100 mb-150 xl-mb-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="privacy-content">
              <h2 className="mb-4">Privacy Policy</h2>
              <p className="text-muted mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="mb-5">
                <h4>1. Introduction</h4>
                <p>
                  RoomFinder (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                  &ldquo;us&rdquo;) is committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, disclose,
                  and safeguard your information when you visit our website or
                  use our services.
                </p>
              </div>

              <div className="mb-5">
                <h4>2. Information We Collect</h4>
                <h5>2.1 Personal Information</h5>
                <p>
                  We may collect personal information that you provide directly
                  to us, including:
                </p>
                <ul>
                  <li>
                    Name and contact information (email address, phone number)
                  </li>
                  <li>Account credentials and profile information</li>
                  <li>Property preferences and search criteria</li>
                  <li>Communication preferences</li>
                  <li>
                    Payment information (processed securely through third-party
                    providers)
                  </li>
                </ul>

                <h5>2.2 Automatically Collected Information</h5>
                <p>
                  We automatically collect certain information when you use our
                  services:
                </p>
                <ul>
                  <li>
                    Device information (IP address, browser type, operating
                    system)
                  </li>
                  <li>
                    Usage data (pages visited, time spent, search queries)
                  </li>
                  <li>Location data (with your consent)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>3. How We Use Your Information</h4>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and payments</li>
                  <li>
                    Send you updates, newsletters, and marketing communications
                  </li>
                  <li>Improve our website and services</li>
                  <li>
                    Respond to your inquiries and provide customer support
                  </li>
                  <li>Comply with legal obligations</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>4. Information Sharing and Disclosure</h4>
                <p>
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except in
                  the following circumstances:
                </p>
                <ul>
                  <li>
                    <strong>Service Providers:</strong> We may share information
                    with trusted third-party service providers who assist us in
                    operating our website and providing services.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose
                    information if required by law or to protect our rights and
                    safety.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a
                    merger, acquisition, or sale of assets, your information may
                    be transferred.
                  </li>
                  <li>
                    <strong>Consent:</strong> We may share information with your
                    explicit consent.
                  </li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>5. Data Security</h4>
                <p>
                  We implement appropriate security measures to protect your
                  personal information:
                </p>
                <ul>
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data storage and transmission</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>6. Your Rights and Choices</h4>
                <p>
                  You have the following rights regarding your personal
                  information:
                </p>
                <ul>
                  <li>
                    <strong>Access:</strong> Request access to your personal
                    information
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of
                    inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal
                    information
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your data in
                    a portable format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing
                    communications
                  </li>
                  <li>
                    <strong>Cookies:</strong> Manage cookie preferences through
                    your browser settings
                  </li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>7. Cookies and Tracking Technologies</h4>
                <p>We use cookies and similar technologies to:</p>
                <ul>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Improve website functionality and performance</li>
                </ul>
                <p>
                  You can control cookie settings through your browser
                  preferences.
                </p>
              </div>

              <div className="mb-5">
                <h4>8. Third-Party Links</h4>
                <p>
                  Our website may contain links to third-party websites. We are
                  not responsible for the privacy practices of these external
                  sites. We encourage you to review their privacy policies.
                </p>
              </div>

              <div className="mb-5">
                <h4>9. Children&apos;s Privacy</h4>
                <p>
                  Our services are not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If you believe we have collected
                  information from a child under 13, please contact us
                  immediately.
                </p>
              </div>

              <div className="mb-5">
                <h4>10. International Data Transfers</h4>
                <p>
                  Your information may be transferred to and processed in
                  countries other than your own. We ensure appropriate
                  safeguards are in place to protect your information in
                  accordance with this Privacy Policy.
                </p>
              </div>

              <div className="mb-5">
                <h4>11. Changes to This Privacy Policy</h4>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by posting the new Privacy
                  Policy on this page and updating the &quot;Last updated&quot;
                  date.
                </p>
              </div>

              <div className="mb-5">
                <h4>12. Contact Us</h4>
                <p>
                  If you have any questions about this Privacy Policy or our
                  privacy practices, please contact us:
                </p>
                <ul>
                  <li>
                    <strong>Email:</strong> privacy@roomfinder237.com
                  </li>
                  <li>
                    <strong>Phone:</strong> +237 681-101-063
                  </li>
                  <li>
                    <strong>Address:</strong> Mile 2, Limbe, South West Region,
                    Cameroon, 00237
                  </li>
                </ul>
              </div>

              <div className="mt-5 pt-4 border-top">
                <p className="text-muted small">
                  This Privacy Policy is effective as of the date listed above
                  and applies to all users of RoomFinder services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
