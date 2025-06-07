"use client";

import { useAuth } from "@/components/providers/SessionProvider";
import { redirect } from "next/navigation";

export default function Habits() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Add New Habit
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No habits created yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start building better routines by creating your first habit.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors">
              Create Your First Habit
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💡 Tips for Creating Great Habits
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Start small - aim for 1-2 minutes per day</li>
            <li>• Be specific about when and where you&apos;ll do it</li>
            <li>• Stack new habits onto existing routines</li>
            <li>• Focus on consistency over perfection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
