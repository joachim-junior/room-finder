import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../logo.png";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
  );
}
