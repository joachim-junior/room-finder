"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cookies Policy
              </h1>
              <p className="text-gray-600 mt-1">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Cookies are small text files that are placed on your device when
              you visit our website. They help us provide you with a better
              experience by remembering your preferences, analyzing how you use
              our site, and personalizing content.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. How We Use Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies for the following purposes:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2.1 Essential Cookies
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies are necessary for the website to function properly.
              They enable basic functions like page navigation, access to secure
              areas, and form submissions.
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Authentication and security</li>
              <li>Session management</li>
              <li>Shopping cart functionality</li>
              <li>Load balancing</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2.2 Functional Cookies
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies enhance your experience by remembering your
              preferences and choices.
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Language preferences</li>
              <li>Currency settings</li>
              <li>Search history</li>
              <li>User interface customization</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2.3 Analytics Cookies
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies help us understand how visitors interact with our
              website by collecting and reporting information anonymously.
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Page views and time spent</li>
              <li>Traffic sources</li>
              <li>User behavior patterns</li>
              <li>Performance monitoring</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2.4 Marketing Cookies
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies are used to track visitors across websites to
              display relevant advertisements.
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Retargeting campaigns</li>
              <li>Social media integration</li>
              <li>Advertising effectiveness</li>
              <li>Cross-site tracking</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. Types of Cookies We Use
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              3.1 Session Cookies
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              These cookies are temporary and are deleted when you close your
              browser. They help maintain your session while you browse our
              website.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              3.2 Persistent Cookies
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              These cookies remain on your device for a set period or until you
              delete them. They remember your preferences for future visits.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              3.3 Third-Party Cookies
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies are set by third-party services that we use, such
              as:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Google Analytics for website analytics</li>
              <li>Payment processors for secure transactions</li>
              <li>Social media platforms for sharing features</li>
              <li>Advertising networks for targeted ads</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Specific Cookies We Use
            </h2>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">
                      Cookie Name
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">
                      Purpose
                    </th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      session_id
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      Maintains user session
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      Session
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      user_preferences
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      Stores user preferences
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      1 year
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      _ga
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      Google Analytics tracking
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      2 years
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      _fbp
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      Facebook pixel tracking
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-gray-700">
                      3 months
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Managing Cookies
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              5.1 Browser Settings
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can control and manage cookies through your browser settings:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>
                <strong>Chrome:</strong> Settings → Privacy and security →
                Cookies and other site data
              </li>
              <li>
                <strong>Firefox:</strong> Options → Privacy & Security → Cookies
                and Site Data
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Manage Website
                Data
              </li>
              <li>
                <strong>Edge:</strong> Settings → Cookies and site permissions →
                Cookies and site data
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              5.2 Cookie Consent
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you first visit our website, you&apos;ll see a cookie consent
              banner. You can:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your preferences</li>
              <li>Change your settings later</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. Impact of Disabling Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you disable cookies, some features of our website may not work
              properly:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>You may need to log in repeatedly</li>
              <li>Some preferences may not be saved</li>
              <li>Analytics data may be incomplete</li>
              <li>Personalization features may be limited</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              7. Updates to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Cookies Policy from time to time. We will
              notify you of any material changes by updating the &ldquo;Last
              updated&rdquo; date at the top of this page.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              8. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Email: privacy@roomfinder237.com
              <br />
              Address: Adamu Street, New Town Limbe
              <br />
              Phone: +237 681 101 063
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                By continuing to use our website, you consent to our use of
                cookies as described in this policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
