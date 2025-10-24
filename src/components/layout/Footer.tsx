import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../logo.png";
import { Download, MessageCircle, Shield, Car, FileText } from "lucide-react";

export function Footer() {
  return (
    <>
      {/* Features Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            className="bg-white border p-8"
            style={{ borderColor: "#e5e5e5" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* 24/7 Customer Support */}
              <div
                className="text-center p-6 border-r last:border-r-0"
                style={{ borderColor: "#e5e5e5" }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <MessageCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  24/7 customer support
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Get on the fast track with our 24/7 support while booking.
                  Contact us at our toll-free number{" "}
                  <span className="font-semibold">+237 681 101 063</span>.
                </p>
              </div>

              {/* Verified ID */}
              <div
                className="text-center p-6 border-r last:border-r-0"
                style={{ borderColor: "#e5e5e5" }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 relative">
                  <Car className="h-6 w-6 text-gray-600" />
                  <div className="absolute -top-1 -right-1">
                    <Shield className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Verified ID
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We aim to build a trusted community by giving you more info
                  when you&apos;re deciding whom to book and stay with.
                </p>
              </div>

              {/* Security Assurance */}
              <div
                className="text-center p-6 border-r last:border-r-0"
                style={{ borderColor: "#e5e5e5" }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 relative">
                  <FileText className="h-6 w-6 text-green-600" />
                  <div className="absolute -top-1 -right-1">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Security Assurance
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Property owners are protected against damages by ensuring
                  safety deposit funds collected from guests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src={Logo}
                  alt="Room Finder"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg object-contain"
                  priority
                />
                <span className="font-bold text-xl">Room Finder</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                Discover and book amazing rooms, apartments, and houses for your
                next trip. Find the perfect stay with Room Finder.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Search
                  </Link>
                </li>
                <li>
                  <Link
                    href="/host"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Become a Host
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help-center"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot Password
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Mobile App */}
            <div>
              <h3 className="font-semibold mb-4">Mobile App</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download our mobile app for the best experience
              </p>
              <div className="space-y-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.roomfinder237.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Google Play
                    </div>
                    <div className="text-xs text-gray-500">
                      Download for Android
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </a>

                <a
                  href="https://apps.apple.com/cm/app/room-finder-237/id6751291963?l=en-GB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      App Store
                    </div>
                    <div className="text-xs text-gray-500">
                      Download for iOS
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Room Finder. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
