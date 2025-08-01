import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import FancyBanner from "@/components/common/FancyBanner";

const CookiePolicy = () => {
  return (
    <>
      <BreadcrumbOne
        title="Cookie Policy"
        link="#"
        link_title="Pages"
        sub_title="Cookies"
        style={false}
      />
      <CookiePolicyContent />
      <FancyBanner style={false} />
    </>
  );
};

const CookiePolicyContent = () => {
  return (
    <div className="cookie-policy-section mt-130 xl-mt-100 mb-150 xl-mb-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="cookie-content">
              <h2 className="mb-4">Cookie Policy</h2>
              <p className="text-muted mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="mb-5">
                <h4>1. Introduction</h4>
                <p>
                  This Cookie Policy explains how RoomFinder ("we," "our," or
                  "us") uses cookies and similar technologies when you visit our
                  website or use our services. This policy should be read
                  alongside our Privacy Policy, which explains how we use your
                  personal information.
                </p>
              </div>

              <div className="mb-5">
                <h4>2. What Are Cookies?</h4>
                <p>
                  Cookies are small text files that are stored on your device
                  (computer, tablet, or mobile phone) when you visit a website.
                  They help websites remember information about your visit, such
                  as your preferred language and other settings, which can make
                  your next visit easier and the site more useful to you.
                </p>
              </div>

              <div className="mb-5">
                <h4>3. How We Use Cookies</h4>
                <p>RoomFinder uses cookies for several purposes:</p>

                <h5>3.1 Essential Cookies</h5>
                <p>
                  These cookies are necessary for the website to function
                  properly. They enable basic functions like page navigation,
                  access to secure areas, and form submissions. The website
                  cannot function properly without these cookies.
                </p>
                <ul>
                  <li>
                    <strong>Authentication cookies:</strong> Remember your login
                    status and session information
                  </li>
                  <li>
                    <strong>Security cookies:</strong> Help protect against
                    fraud and ensure secure transactions
                  </li>
                  <li>
                    <strong>Functionality cookies:</strong> Enable core website
                    features and user preferences
                  </li>
                </ul>

                <h5>3.2 Performance and Analytics Cookies</h5>
                <p>
                  These cookies help us understand how visitors interact with
                  our website by collecting and reporting information
                  anonymously.
                </p>
                <ul>
                  <li>
                    <strong>Google Analytics:</strong> Track website usage and
                    performance metrics
                  </li>
                  <li>
                    <strong>Page load times:</strong> Monitor website speed and
                    performance
                  </li>
                  <li>
                    <strong>Error tracking:</strong> Identify and fix technical
                    issues
                  </li>
                </ul>

                <h5>3.3 Functionality Cookies</h5>
                <p>
                  These cookies allow the website to remember choices you make
                  and provide enhanced, more personal features.
                </p>
                <ul>
                  <li>
                    <strong>Language preferences:</strong> Remember your
                    preferred language
                  </li>
                  <li>
                    <strong>Search preferences:</strong> Save your property
                    search criteria
                  </li>
                  <li>
                    <strong>User interface preferences:</strong> Remember your
                    display preferences
                  </li>
                </ul>

                <h5>3.4 Marketing and Advertising Cookies</h5>
                <p>
                  These cookies are used to track visitors across websites to
                  display relevant and engaging advertisements.
                </p>
                <ul>
                  <li>
                    <strong>Retargeting:</strong> Show relevant property
                    advertisements
                  </li>
                  <li>
                    <strong>Social media integration:</strong> Enable sharing on
                    social platforms
                  </li>
                  <li>
                    <strong>Partner tracking:</strong> Track referrals from
                    partner websites
                  </li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>4. Types of Cookies We Use</h4>

                <h5>4.1 Session Cookies</h5>
                <p>
                  These cookies are temporary and are deleted when you close
                  your browser. They help maintain your session while you browse
                  our website.
                </p>

                <h5>4.2 Persistent Cookies</h5>
                <p>
                  These cookies remain on your device for a set period or until
                  you delete them. They help us remember your preferences and
                  provide a personalized experience.
                </p>

                <h5>4.3 Third-Party Cookies</h5>
                <p>
                  Some cookies are placed by third-party services that appear on
                  our pages, such as:
                </p>
                <ul>
                  <li>
                    <strong>Google Analytics:</strong> Website analytics and
                    performance tracking
                  </li>
                  <li>
                    <strong>Facebook Pixel:</strong> Social media advertising
                    and tracking
                  </li>
                  <li>
                    <strong>Payment processors:</strong> Secure payment
                    processing
                  </li>
                  <li>
                    <strong>Social media plugins:</strong> Social sharing and
                    integration
                  </li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>5. Specific Cookies We Use</h4>

                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Cookie Name</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>session_id</td>
                        <td>Maintains your login session</td>
                        <td>Session</td>
                      </tr>
                      <tr>
                        <td>user_preferences</td>
                        <td>Stores your language and display preferences</td>
                        <td>1 year</td>
                      </tr>
                      <tr>
                        <td>search_history</td>
                        <td>Remembers your property search criteria</td>
                        <td>30 days</td>
                      </tr>
                      <tr>
                        <td>favorites</td>
                        <td>Stores your favorite properties</td>
                        <td>1 year</td>
                      </tr>
                      <tr>
                        <td>_ga</td>
                        <td>Google Analytics tracking</td>
                        <td>2 years</td>
                      </tr>
                      <tr>
                        <td>_fbp</td>
                        <td>Facebook advertising tracking</td>
                        <td>3 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mb-5">
                <h4>6. Managing Your Cookie Preferences</h4>

                <h5>6.1 Browser Settings</h5>
                <p>
                  You can control and manage cookies through your browser
                  settings:
                </p>
                <ul>
                  <li>
                    <strong>Chrome:</strong> Settings → Privacy and security →
                    Cookies and other site data
                  </li>
                  <li>
                    <strong>Firefox:</strong> Options → Privacy & Security →
                    Cookies and Site Data
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferences → Privacy → Manage
                    Website Data
                  </li>
                  <li>
                    <strong>Edge:</strong> Settings → Cookies and site
                    permissions → Cookies and stored data
                  </li>
                </ul>

                <h5>6.2 Cookie Consent</h5>
                <p>
                  When you first visit RoomFinder, you'll see a cookie consent
                  banner. You can:
                </p>
                <ul>
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize your cookie preferences</li>
                  <li>
                    Change your preferences at any time through our settings
                  </li>
                </ul>

                <h5>6.3 Opt-Out Options</h5>
                <p>You can opt out of certain types of cookies:</p>
                <ul>
                  <li>
                    <strong>Analytics:</strong> Use browser add-ons to block
                    Google Analytics
                  </li>
                  <li>
                    <strong>Advertising:</strong> Opt out through the Digital
                    Advertising Alliance
                  </li>
                  <li>
                    <strong>Social media:</strong> Adjust privacy settings on
                    social platforms
                  </li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>7. Impact of Disabling Cookies</h4>
                <p>
                  If you choose to disable cookies, some features of RoomFinder
                  may not function properly:
                </p>
                <ul>
                  <li>You may need to log in repeatedly</li>
                  <li>Your preferences won't be saved</li>
                  <li>Some website features may not work as expected</li>
                  <li>Property search history won't be remembered</li>
                  <li>Personalized content may not be available</li>
                </ul>
              </div>

              <div className="mb-5">
                <h4>8. Updates to This Policy</h4>
                <p>
                  We may update this Cookie Policy from time to time to reflect
                  changes in our practices or for other operational, legal, or
                  regulatory reasons. We will notify you of any material changes
                  by posting the new Cookie Policy on this page and updating the
                  "Last updated" date.
                </p>
              </div>

              <div className="mb-5">
                <h4>9. Contact Us</h4>
                <p>
                  If you have any questions about this Cookie Policy or our use
                  of cookies, please contact us:
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
                  This Cookie Policy is effective as of the date listed above
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

export default CookiePolicy;
