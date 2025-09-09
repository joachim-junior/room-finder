"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../logo.png";
import { useAuth } from "@/contexts/AuthContext";
import {
  Globe,
  Menu,
  Heart,
  User,
  Bell,
  Settings,
  LogOut,
  Home,
  Calendar,
  Star,
  MessageSquare,
  UserCheck,
} from "lucide-react";
import { Divider } from "@/components/ui";

export function Header() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Click outside handler for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={Logo}
              alt="Room Finder"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain shadow-sm"
              priority
            />
            <span className="font-bold text-xl text-gray-900">Room Finder</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/search"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              <span className="h-4 w-4">🏠</span>
              <span>Search</span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Link
              href="/host"
              className="hidden sm:block text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Become a host
            </Link>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Globe className="h-5 w-5 text-gray-700" />
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-700 font-medium text-sm">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </span>
                    </div>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl py-2 z-50"
                      style={{
                        border: "1px solid #DDDDDD",
                        boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                      }}
                    >
                      {/* User-specific Navigation */}
                      <div className="px-4 py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs">📊</span>
                          </div>
                          <span className="text-sm">Dashboard</span>
                        </Link>
                      </div>
                      <Divider />

                      {/* Account Settings and Help */}
                      <div className="px-4 py-2">
                        <Link
                          href="/help-center"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs">❓</span>
                          </div>
                          <span className="text-sm">Help Center</span>
                        </Link>
                        <Link
                          href="/support"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Contact Support</span>
                        </Link>
                        <Link
                          href="/blog"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs">📝</span>
                          </div>
                          <span className="text-sm">Blog</span>
                        </Link>
                      </div>

                      <Divider />

                      {/* Become a Host Section */}
                      <div className="px-4 py-2">
                        <Link
                          href="/host"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs">🏠</span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold">
                              Become a host
                            </div>
                            <div className="text-xs text-gray-500">
                              Start hosting and earn extra income
                            </div>
                          </div>
                        </Link>
                      </div>

                      <Divider />

                      {/* Log Out */}
                      <div className="px-4 py-2">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm">Log out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="hidden sm:flex items-center space-x-4">
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      style={{ boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)" }}
                    >
                      Sign up
                    </Link>
                  </div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors sm:hidden"
                  >
                    <Menu className="h-5 w-5 text-gray-700" />
                  </button>

                  {/* Mobile Menu for Logged Out Users */}
                  {showUserMenu && !user && (
                    <div
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl py-2 z-50"
                      style={{
                        border: "1px solid #DDDDDD",
                        boxShadow: "0 6px 20px 0 rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="px-4 py-2">
                        <Link
                          href="/help-center"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs">❓</span>
                          </div>
                          <span className="text-sm">Help Center</span>
                        </Link>
                        <Link
                          href="/support"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Contact Support</span>
                        </Link>
                        <Link
                          href="/blog"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs">📝</span>
                          </div>
                          <span className="text-sm">Blog</span>
                        </Link>
                      </div>

                      <Divider />

                      {/* Become a Host Section */}
                      <div className="px-4 py-2">
                        <Link
                          href="/host"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="h-4 w-4 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs">🏠</span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold">
                              Become a host
                            </div>
                            <div className="text-xs text-gray-500">
                              Start hosting and earn extra income
                            </div>
                          </div>
                        </Link>
                      </div>

                      <Divider />

                      {/* Login/Signup */}
                      <div className="px-4 py-2">
                        <Link
                          href="/login"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          <span className="text-sm">Log in</span>
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          <span className="text-sm">Sign up</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
