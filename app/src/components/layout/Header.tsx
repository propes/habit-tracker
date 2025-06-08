"use client";

import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton";
import { useAuth } from "@/components/providers/SessionProvider";

export default function Header() {
  const { user, loading, isDemo } = useAuth();

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
            <Link href="/" className="text-2xl font-bold text-gray-900">
              HabitTracker
            </Link>

            {/* Only show navigation when user is authenticated */}
            {user && !loading && (
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/habits"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Habits
                </Link>
                <Link
                  href="/analytics"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
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
    </header>
  );
}
