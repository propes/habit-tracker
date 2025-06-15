"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "@/components/auth/AuthButton";
import MobileNav from "@/components/layout/MobileNav";
import { useAuth } from "@/components/providers/SessionProvider";

export default function Header() {
  const { user, loading, isDemo } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-white shadow-sm">
      {isDemo && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-2 text-sm text-yellow-800">
              <span>🎭</span>
              <span className="font-medium">Demo Mode Active</span>
              <span>•</span>
              <span>Development Environment Only</span>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Mobile menu button */}
            {user && !loading && (
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            <Link href="/" className="text-2xl font-bold text-gray-900">
              HabitTracker
            </Link>

            {/* Desktop navigation - only show when user is authenticated */}
            {user && !loading && (
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/dashboard"
                  className={`transition-colors ${
                    pathname === "/dashboard"
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/habits"
                  className={`transition-colors ${
                    pathname === "/habits"
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Habits
                </Link>
                <Link
                  href="/analytics"
                  className={`transition-colors ${
                    pathname === "/analytics"
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Analytics
                </Link>
              </nav>
            )}

            {/* Show loading state while determining auth status */}
            {loading && (
              <div className="hidden md:flex space-x-6">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>
          <AuthButton />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  );
}
