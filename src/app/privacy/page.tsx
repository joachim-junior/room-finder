"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
                Privacy Policy
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
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Room Finder ("we," "our," or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our platform
              and services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2.1 Personal Information
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect the following personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Name, email address, and phone number</li>
              <li>Payment information (processed securely by third parties)</li>
              <li>Profile information and preferences</li>
              <li>Communication records with hosts/guests</li>
              <li>Government-issued ID (for host verification)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2.2 Property Information
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              For hosts, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Property details, photos, and descriptions</li>
              <li>Location and address information</li>
              <li>Pricing and availability data</li>
              <li>Property ownership or rental documentation</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              2.3 Usage Information
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Device information and IP addresses</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and time spent</li>
              <li>Search queries and booking history</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Provide and improve our services</li>
              <li>Process bookings and payments</li>
              <li>Verify user identities and prevent fraud</li>
              <li>Communicate with you about your account</li>
              <li>Send marketing communications (with consent)</li>
              <li>Analyze usage patterns and trends</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Information Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>
                <strong>Hosts/Guests:</strong> To facilitate bookings and
                communication
              </li>
              <li>
                <strong>Payment Processors:</strong> To process payments
                securely
              </li>
              <li>
                <strong>Service Providers:</strong> For hosting, analytics, and
                customer support
              </li>
              <li>
                <strong>Legal Authorities:</strong> When required by law or to
                protect rights
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate security measures to protect your
              information, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Encryption of sensitive data</li>
              <li>Secure payment processing</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use cookies and similar technologies to enhance your
              experience. For detailed information, please see our{" "}
              <Link href="/cookies" className="text-blue-600 hover:underline">
                Cookies Policy
              </Link>
              .
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              7. Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Withdraw consent for marketing</li>
              <li>Export your data</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              8. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We retain your information for as long as necessary to provide our
              services and comply with legal obligations. Account information is
              retained until you delete your account or request deletion.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              9. International Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              for such transfers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              10. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our services are not intended for children under 18. We do not
              knowingly collect personal information from children under 18.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              11. Third-Party Links
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our platform may contain links to third-party websites. We are not
              responsible for the privacy practices of these websites.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              12. Marketing Communications
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may send you marketing communications if you consent. You can
              opt-out at any time by clicking the unsubscribe link or contacting
              us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              13. Changes to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by email or through our
              platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              14. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our data
              practices, please contact us:
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
                By using Room Finder, you consent to the collection and use of
                your information as described in this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
