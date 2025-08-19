"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
                Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              By accessing and using Room Finder (&ldquo;the Platform&rdquo;),
              you accept and agree to be bound by the terms and provision of
              this agreement. Additionally, when using this Platform&apos;s
              particular services, you shall be subject to any posted guidelines
              or rules applicable to such services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Room Finder is a platform that connects property owners (hosts)
              with travelers (guests) seeking accommodation in Cameroon. The
              Platform facilitates the booking of rooms, apartments, villas, and
              other properties for short-term stays.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. User Accounts
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of the Platform, you must create an
              account. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>
                Maintaining the confidentiality of your account credentials
              </li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Updating your information as necessary</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Host Responsibilities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a host, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Provide accurate property descriptions and photos</li>
              <li>Maintain your property in safe and habitable condition</li>
              <li>Honor confirmed bookings</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Provide necessary amenities as advertised</li>
              <li>Respond to guest inquiries in a timely manner</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Guest Responsibilities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a guest, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Provide accurate booking information</li>
              <li>Respect the property and house rules</li>
              <li>Pay all fees and charges in full</li>
              <li>Leave the property in good condition</li>
              <li>Communicate any issues promptly</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. Booking and Payment
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              All bookings are subject to availability and confirmation. Payment
              is processed through secure third-party payment processors. Room
              Finder charges service fees on bookings, which are clearly
              displayed before confirmation.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              7. Cancellation Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Cancellation policies vary by property and are clearly stated in
              each listing. Guests may cancel according to the host&apos;s
              policy, and hosts may cancel under certain circumstances with
              appropriate notice.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              8. Prohibited Activities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
              <li>Use the Platform for any illegal purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Submit false or misleading information</li>
              <li>Attempt to gain unauthorized access to the Platform</li>
              <li>Interfere with the Platform&apos;s operation</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              9. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Platform and its content are protected by copyright,
              trademark, and other intellectual property laws. You may not
              reproduce, distribute, or create derivative works without
              permission.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              10. Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your privacy is important to us. Please review our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and protect your information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              11. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Room Finder acts as an intermediary between hosts and guests. We
              are not responsible for the quality, safety, or legality of
              properties listed on the Platform. Our liability is limited to the
              amount of service fees paid.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              12. Dispute Resolution
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Any disputes arising from the use of the Platform will be resolved
              through negotiation, mediation, or legal proceedings as
              appropriate. We encourage users to resolve disputes amicably.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              13. Modifications to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting. Your continued use of
              the Platform constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              14. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may terminate or suspend your account at any time for violation
              of these terms or for any other reason. You may also terminate
              your account at any time.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              15. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              These terms are governed by the laws of Cameroon. Any disputes
              shall be subject to the jurisdiction of courts in Cameroon.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              16. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Email: legal@roomfinder237.com
              <br />
              Address: Adamu Street, New Town Limbe
              <br />
              Phone: +237 681 101 063
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                By using Room Finder, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
