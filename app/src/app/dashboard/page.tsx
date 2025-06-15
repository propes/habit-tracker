"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/SessionProvider";
import { CheckInButton } from "@/components/habits/CheckInButton";
import { Button } from "@/components/ui/Button";

interface Habit {
  id: string;
  name: string;
  description: string | null;
  color: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  currentStreak: number;
  completionRate: number;
  completedToday: boolean;
  totalLogs: number;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/");
    return null;
  }

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/habits?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setHabits(data);
      } else {
        setError("Failed to fetch habits");
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
      setError("Failed to fetch habits");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (response.ok) {
        await fetchHabits(); // Refresh habits to update stats
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to check in");
      }
    } catch (error) {
      console.error("Error checking in:", error);
      setError("Failed to check in");
    }
  };

  const handleUndoCheckIn = async (habitId: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `/api/habits/${habitId}/logs?userId=${user.id}&completedDate=${today}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchHabits(); // Refresh habits to update stats
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to undo check-in");
      }
    } catch (error) {
      console.error("Error undoing check-in:", error);
      setError("Failed to undo check-in");
    }
  };

  // Calculate dashboard statistics
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.completedToday).length;
  const averageStreak =
    totalHabits > 0
      ? Math.round(
          habits.reduce((sum, h) => sum + h.currentStreak, 0) / totalHabits
        )
      : 0;
  const averageCompletionRate =
    totalHabits > 0
      ? Math.round(
          habits.reduce((sum, h) => sum + h.completionRate, 0) / totalHabits
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Dashboard
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Habits
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalHabits}</p>
            <p className="text-sm text-gray-500 mt-1">
              {totalHabits === 0 ? "No habits created yet" : "Active habits"}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Completed Today
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {completedToday}/{totalHabits}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {totalHabits > 0
                ? `${Math.round(
                    (completedToday / totalHabits) * 100
                  )}% complete`
                : "No habits to complete"}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Average Streak
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {averageStreak}
            </p>
            <p className="text-sm text-gray-500 mt-1">Days in a row</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Weekly Rate
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {averageCompletionRate}%
            </p>
            <p className="text-sm text-gray-500 mt-1">This week average</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Today&apos;s Habits
            </h2>
            <Button
              onClick={() => router.push("/habits")}
              variant="outline"
              size="sm"
              className="self-start sm:self-auto"
            >
              View All Habits
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-lg">Loading habits...</div>
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No habits yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first habit to start building better routines.
              </p>
              <Button onClick={() => router.push("/habits/new")}>
                Create Your First Habit
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-0">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {habit.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <span>{habit.category.icon}</span>
                          <span className="hidden sm:inline">
                            {habit.category.name}
                          </span>
                        </span>
                        <span>🔥 {habit.currentStreak}</span>
                        <span className="hidden sm:inline">
                          📊 {habit.completionRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end sm:justify-start">
                    <CheckInButton
                      habitId={habit.id}
                      isCompleted={habit.completedToday}
                      onCheckIn={handleCheckIn}
                      onUndoCheckIn={handleUndoCheckIn}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {habits.length > 0 && (
          <div className="mt-8 bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🎉 Keep up the great work!
            </h3>
            <p className="text-gray-700">
              You&apos;ve completed {completedToday} out of {totalHabits} habits
              today.{" "}
              {completedToday === totalHabits
                ? "Perfect day! 🌟"
                : completedToday > totalHabits / 2
                ? "You're doing great! 💪"
                : "Keep going, you've got this! 🚀"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
