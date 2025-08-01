import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import FancyBanner from "@/components/common/FancyBanner";

const TermsConditions = () => {
  return (
    <>
      <BreadcrumbOne
        title="Terms & Conditions"
        link="#"
        link_title="Pages"
        sub_title="Terms"
        style={false}
      />
      <TermsConditionsContent />
      <FancyBanner style={false} />
    </>
  );
};

const TermsConditionsContent = () => {
  return (
    <div className="terms-conditions-section mt-130 xl-mt-100 mb-150 xl-mb-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="terms-content">
              <h2 className="mb-4">Terms and Conditions</h2>
              <p className="text-muted mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="mb-5">
                <h4>1. Acceptance of Terms</h4>
                <p>
                  By accessing and using RoomFinder (&ldquo;the Service&rdquo;),
                  you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              </div>

              <div className="mb-5">
                <h4>2. Description of Service</h4>
                <p>
                  RoomFinder is a real estate platform that connects property
                  owners, agents, and potential tenants/buyers in Cameroon. Our
                  services include:
                </p>
                <ul>
                  <li>Property listings and search functionality</li>
                  <li>User registration and account management</li>
                  <li>Property booking and reservation services</li>
                  <li>Communication tools between users</li>
                  <li>Payment processing for premium services</li>
                  <li>Wallet and transaction management</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>3. User Accounts and Registration</h4>
                <h5>3.1 Account Creation</h5>
                <p>
                  To access certain features of RoomFinder, you must create an
                  account. You agree to:
                </p>
                <ul>
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your account credentials secure</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                </ul>

                <h5>3.2 Account Responsibilities</h5>
                <p>You are responsible for:</p>
                <ul>
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>
                    Ensuring your account information is accurate and up-to-date
                  </li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>4. User Conduct and Prohibited Activities</h4>
                <p>You agree not to:</p>
                <ul>
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the Service</li>
                  <li>Use automated systems to access the Service</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>5. Property Listings and Content</h4>
                <h5>5.1 Listing Accuracy</h5>
                <p>Property owners and agents are responsible for:</p>
                <ul>
                  <li>
                    Providing accurate and up-to-date property information
                  </li>
                  <li>
                    Ensuring all property details are truthful and complete
                  </li>
                  <li>Maintaining current availability status</li>
                  <li>Providing clear and accurate pricing information</li>
                </ul>

                <h5>5.2 Content Guidelines</h5>
                <p>All content posted on RoomFinder must:</p>
                <ul>
                  <li>Be accurate and truthful</li>
                  <li>Comply with applicable laws</li>
                  <li>Not contain discriminatory language</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not contain offensive or inappropriate material</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>6. Payment and Financial Terms</h4>
                <h5>6.1 Payment Processing</h5>
                <p>
                  RoomFinder processes payments through secure third-party
                  providers. You agree to:
                </p>
                <ul>
                  <li>Provide accurate payment information</li>
                  <li>Authorize charges for services used</li>
                  <li>Pay all fees associated with your use of the Service</li>
                  <li>Accept responsibility for all payment-related issues</li>
                </ul>

                <h5>6.2 Wallet and Transactions</h5>
                <p>Our wallet system allows for:</p>
                <ul>
                  <li>Secure storage of funds for premium services</li>
                  <li>Transaction history and reporting</li>
                  <li>Refund processing according to our policies</li>
                  <li>Integration with mobile money services</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>7. Privacy and Data Protection</h4>
                <p>
                  Your privacy is important to us. Our collection and use of
                  personal information is governed by our Privacy Policy, which
                  is incorporated into these Terms and Conditions by reference.
                </p>
              </div>

              <div className="mb-5">
                <h4>8. Intellectual Property Rights</h4>
                <h5>8.1 Our Rights</h5>
                <p>RoomFinder retains all rights to:</p>
                <ul>
                  <li>The Service and its content</li>
                  <li>Our trademarks, logos, and branding</li>
                  <li>Software, technology, and proprietary systems</li>
                  <li>User-generated content (with proper attribution)</li>
                </ul>

                <h5>8.2 Your Rights</h5>
                <p>
                  You retain ownership of content you submit, but grant us a
                  license to:
                </p>
                <ul>
                  <li>Display and distribute your content on the Service</li>
                  <li>Use your content for promotional purposes</li>
                  <li>Modify content as necessary for display</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>9. Limitation of Liability</h4>
                <p>RoomFinder shall not be liable for:</p>
                <ul>
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Disputes between users</li>
                  <li>Property-related issues or disputes</li>
                  <li>Third-party service failures</li>
                  <li>Force majeure events</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>10. Dispute Resolution</h4>
                <h5>10.1 User Disputes</h5>
                <p>
                  We encourage users to resolve disputes amicably. RoomFinder
                  may assist in mediation but is not responsible for resolving
                  user disputes.
                </p>

                <h5>10.2 Governing Law</h5>
                <p>
                  These terms are governed by the laws of Cameroon. Any disputes
                  shall be resolved in the courts of Cameroon.
                </p>
              </div>

              <div className="mb-5">
                <h4>11. Termination</h4>
                <h5>11.1 Termination by You</h5>
                <p>
                  You may terminate your account at any time by contacting our
                  support team.
                </p>

                <h5>11.2 Termination by Us</h5>
                <p>We may terminate or suspend your account for:</p>
                <ul>
                  <li>Violation of these terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Extended periods of inactivity</li>
                  <li>Non-payment of fees</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>12. Changes to Terms</h4>
                <p>
                  We reserve the right to modify these terms at any time. We
                  will notify users of significant changes via email or through
                  the Service. Continued use of the Service after changes
                  constitutes acceptance of the new terms.
                </p>
              </div>

              <div className="mb-5">
                <h4>13. Contact Information</h4>
                <p>
                  For questions about these Terms and Conditions, please contact
                  us:
                </p>
                <ul>
                  <li>
                    <strong>Email:</strong> legal@roomfinder237.com
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
                  These Terms and Conditions are effective as of the date listed
                  above and apply to all users of RoomFinder services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
