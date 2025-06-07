"use client";

import { useAuth } from "@/components/providers/SessionProvider";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import DemoButton from "@/components/auth/DemoButton";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome back, {user.user_metadata?.full_name || user.email}!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ready to continue building your habits?
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/habits">
              <Button variant="outline">Manage Habits</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Build Better Habits
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Track your daily habits, build streaks, and transform your life one
          day at a time.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Visualize your habit streaks and see your progress over time with
              beautiful charts.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Stay Motivated</h3>
            <p className="text-gray-600">
              Set daily goals and get reminders to help you stay consistent with
              your habits.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-lg font-semibold mb-2">Build Streaks</h3>
            <p className="text-gray-600">
              Challenge yourself to maintain long streaks and celebrate your
              achievements.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Sign in with Google to begin tracking your habits and building a
            better you.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3">
            Get Started - It&apos;s Free!
          </Button>
        </div>

        <DemoButton />
      </div>
    </div>
  );
}
