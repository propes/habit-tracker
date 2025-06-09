"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

interface HabitChartProps {
  habitName: string;
  color: string;
  logs: Array<{
    completedDate: string;
    completed: boolean;
  }>;
  days?: number;
}

export function HabitChart({
  habitName,
  color,
  logs,
  days = 30,
}: HabitChartProps) {
  // Generate data for the last N days
  const generateChartData = () => {
    const data = [];
    const today = startOfDay(new Date());

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, "yyyy-MM-dd");
      const log = logs.find((log) => log.completedDate === dateString);

      data.push({
        date: dateString,
        displayDate: format(date, "MMM dd"),
        completed: log?.completed ? 1 : 0,
        streak: 0, // Will be calculated below
      });
    }

    // Calculate running streak
    let currentStreak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].completed) {
        currentStreak++;
        data[i].streak = currentStreak;
      } else {
        currentStreak = 0;
        data[i].streak = 0;
      }
    }

    return data;
  };

  const chartData = generateChartData();
  const completionRate =
    chartData.length > 0
      ? Math.round(
          (chartData.filter((d) => d.completed).length / chartData.length) * 100
        )
      : 0;

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: { date: string; completed: number; streak: number };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">
            {format(new Date(data.date), "MMMM dd, yyyy")}
          </p>
          <p className="text-sm">
            Status:{" "}
            <span
              className={
                data.completed ? "text-green-600 font-medium" : "text-gray-500"
              }
            >
              {data.completed ? "✅ Completed" : "⭕ Not completed"}
            </span>
          </p>
          {data.streak > 0 && (
            <p className="text-sm">
              Streak:{" "}
              <span className="text-purple-600 font-medium">
                {data.streak} days
              </span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{habitName}</h3>
          <p className="text-sm text-gray-500">Last {days} days</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color }}>
            {completionRate}%
          </div>
          <div className="text-sm text-gray-500">Completion rate</div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => (value === 1 ? "Done" : "Skip")}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="stepAfter"
              dataKey="completed"
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>
          Completed: {chartData.filter((d) => d.completed).length} days
        </span>
        <span>
          Current streak: {Math.max(...chartData.map((d) => d.streak), 0)} days
        </span>
      </div>
    </div>
  );
}
