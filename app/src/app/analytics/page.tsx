"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/SessionProvider";
import { HabitChart } from "@/components/charts/HabitChart";
import { StreakChart } from "@/components/charts/StreakChart";
import { CompletionChart } from "@/components/charts/CompletionChart";
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
  logs: Array<{
    id: string;
    completedDate: string;
    completed: boolean;
  }>;
}

export default function Analytics() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<30 | 60 | 90>(30);

  useEffect(() => {
    if (user) {
      fetchHabitsWithLogs();
    }
  }, [user, timeRange]);

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

  const fetchHabitsWithLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch habits
      const habitsResponse = await fetch(`/api/habits?userId=${user.id}`);
      if (!habitsResponse.ok) {
        throw new Error("Failed to fetch habits");
      }
      const habitsData = await habitsResponse.json();

      // Fetch logs for each habit
      const habitsWithLogs = await Promise.all(
        habitsData.map(async (habit: Habit) => {
          const logsResponse = await fetch(
            `/api/habits/${habit.id}/logs?userId=${user.id}&days=${timeRange}`
          );
          if (logsResponse.ok) {
            const logs = await logsResponse.json();
            return { ...habit, logs };
          }
          return { ...habit, logs: [] };
        })
      );

      setHabits(habitsWithLogs);
      if (habitsWithLogs.length > 0 && !selectedHabit) {
        setSelectedHabit(habitsWithLogs[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedHabitData = habits.find((h) => h.id === selectedHabit);

  // Calculate overall statistics
  const totalHabits = habits.length;
  const averageCompletion =
    totalHabits > 0
      ? Math.round(
          habits.reduce((sum, h) => sum + h.completionRate, 0) / totalHabits
        )
      : 0;
  const totalStreakDays = habits.reduce((sum, h) => sum + h.currentStreak, 0);
  const bestStreak = Math.max(...habits.map((h) => h.currentStreak), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">
              Detailed insights into your habit progress
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(Number(e.target.value) as 30 | 60 | 90)
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Button
              onClick={() => router.push("/habits")}
              variant="outline"
              size="sm"
            >
              Manage Habits
            </Button>
          </div>
        </div>

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

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-lg">Loading analytics...</div>
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No habits to analyze
            </h3>
            <p className="text-gray-500 mb-6">
              Create some habits to see detailed analytics and insights.
            </p>
            <Button onClick={() => router.push("/habits/new")}>
              Create Your First Habit
            </Button>
          </div>
        ) : (
          <>
            {/* Overview Statistics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Total Habits
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {totalHabits}
                </p>
                <p className="text-sm text-gray-500 mt-1">Active habits</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Average Completion
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {averageCompletion}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Last {timeRange} days
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Total Streak Days
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {totalStreakDays}
                </p>
                <p className="text-sm text-gray-500 mt-1">Combined streaks</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Best Streak
                </h3>
                <p className="text-3xl font-bold text-orange-600">
                  {bestStreak}
                </p>
                <p className="text-sm text-gray-500 mt-1">Longest current</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <CompletionChart habits={habits} type="pie" />
              <CompletionChart habits={habits} type="bar" />
            </div>

            {/* Streak Chart */}
            <div className="mb-8">
              <StreakChart habits={habits} days={timeRange} />
            </div>

            {/* Individual Habit Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Individual Habit Analysis
                </h2>
                <select
                  value={selectedHabit || ""}
                  onChange={(e) => setSelectedHabit(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {habits.map((habit) => (
                    <option key={habit.id} value={habit.id}>
                      {habit.category.icon} {habit.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedHabitData && (
                <div className="space-y-6">
                  {/* Habit Overview */}
                  <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedHabitData.completionRate}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Completion Rate
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedHabitData.currentStreak}
                      </div>
                      <div className="text-sm text-gray-600">
                        Current Streak
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedHabitData.totalLogs}
                      </div>
                      <div className="text-sm text-gray-600">Total Logs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedHabitData.category.name}
                      </div>
                      <div className="text-sm text-gray-600">Category</div>
                    </div>
                  </div>

                  {/* Individual Habit Chart */}
                  <HabitChart
                    habitName={selectedHabitData.name}
                    color={selectedHabitData.color}
                    logs={selectedHabitData.logs}
                    days={timeRange}
                  />
                </div>
              )}
            </div>

            {/* Insights and Recommendations */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📈 Insights & Recommendations
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    🎯 Performance Insights
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {averageCompletion >= 80 && (
                      <li>• Excellent overall performance! Keep it up! 🌟</li>
                    )}
                    {averageCompletion >= 60 && averageCompletion < 80 && (
                      <li>• Good progress! Try to be more consistent. 💪</li>
                    )}
                    {averageCompletion < 60 && (
                      <li>
                        • Focus on building consistency with fewer habits. 🎯
                      </li>
                    )}
                    {bestStreak >= 7 && (
                      <li>• Great streak building! Momentum is key. 🔥</li>
                    )}
                    {habits.filter((h) => h.completionRate < 50).length > 0 && (
                      <li>
                        • Consider reviewing habits with low completion rates.
                        🔍
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    💡 Suggestions
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      • Set reminders for habits with low completion rates
                    </li>
                    <li>• Celebrate your streaks to maintain motivation</li>
                    <li>• Consider habit stacking for better consistency</li>
                    <li>• Review and adjust difficult habits if needed</li>
                    <li>• Track your progress weekly to stay motivated</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
