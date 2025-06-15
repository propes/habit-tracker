"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/SessionProvider";
import { Button } from "@/components/ui/Button";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, isDemo, signOut } = useAuth();
  const pathname = usePathname();

  // Close menu when route changes (but not on initial mount)
  useEffect(() => {
    // Only close if the menu is actually open
    if (isOpen) {
      onClose();
    }
  }, [pathname]); // Removed onClose from dependencies to prevent unnecessary re-runs

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!user) return null;

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/habits", label: "Habits", icon: "🎯" },
    { href: "/analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900"
            onClick={onClose}
          >
            HabitTracker
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-6">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={onClose}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info and Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-gray-50">
          <div className="space-y-4">
            {/* User Welcome Message */}
            <div className="flex items-center gap-2">
              {isDemo && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  🎭 Demo
                </span>
              )}
              <span className="text-sm text-gray-600">
                Welcome, {user.user_metadata?.full_name || user.email}
              </span>
            </div>

            {/* Sign Out Button */}
            <Button
              onClick={() => {
                signOut();
                onClose();
              }}
              variant="outline"
              className="w-full"
            >
              {isDemo ? "Exit Demo" : "Sign Out"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
