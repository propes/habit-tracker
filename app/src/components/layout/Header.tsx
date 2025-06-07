import Link from "next/link";
import AuthButton from "@/components/auth/AuthButton";

export default function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              HabitTracker
            </Link>
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
          </div>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
