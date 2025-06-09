"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

interface StreakChartProps {
  habits: Array<{
    id: string;
    name: string;
    color: string;
    currentStreak: number;
    logs: Array<{
      completedDate: string;
      completed: boolean;
    }>;
  }>;
  days?: number;
}

export function StreakChart({ habits, days = 30 }: StreakChartProps) {
  // Generate streak data for each habit over time
  const generateStreakData = () => {
    const data = [];
    const today = startOfDay(new Date());

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, "yyyy-MM-dd");
      const displayDate = format(date, "MMM dd");

      const dayData: Record<string, string | number> = {
        date: dateString,
        displayDate,
      };

      // Calculate streak for each habit on this day
      habits.forEach((habit) => {
        const streakOnDay = calculateStreakOnDate(habit.logs, dateString);
        dayData[habit.name] = streakOnDay;
      });

      data.push(dayData);
    }

    return data;
  };

  const calculateStreakOnDate = (
    logs: Array<{ completedDate: string; completed: boolean }>,
    targetDate: string
  ) => {
    const sortedLogs = logs
      .filter((log) => log.completedDate <= targetDate)
      .sort((a, b) => b.completedDate.localeCompare(a.completedDate));

    let streak = 0;
    const targetDateObj = new Date(targetDate);

    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].completedDate);
      const expectedDate = subDays(targetDateObj, i);

      if (
        logDate.toDateString() === expectedDate.toDateString() &&
        sortedLogs[i].completed
      ) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const chartData = generateStreakData();
  const maxStreak = Math.max(...habits.map((habit) => habit.currentStreak), 0);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length && label) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">
            {format(new Date(label), "MMMM dd, yyyy")}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm">
              <span style={{ color: entry.color }}>●</span> {entry.dataKey}:{" "}
              <span className="font-medium">{entry.value} day streak</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Streak Progress
          </h3>
          <p className="text-sm text-gray-500">
            Daily streaks over the last {days} days
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{maxStreak}</div>
          <div className="text-sm text-gray-500">Best current streak</div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            {habits.map((habit, index) => (
              <Bar
                key={habit.id}
                dataKey={habit.name}
                fill={habit.color || colors[index % colors.length]}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {habits.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Current Streaks
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center space-x-2 text-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="truncate">{habit.name}</span>
                <span className="font-medium text-purple-600">
                  {habit.currentStreak}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
