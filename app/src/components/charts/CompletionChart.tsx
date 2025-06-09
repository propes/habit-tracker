"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface CompletionChartProps {
  habits: Array<{
    id: string;
    name: string;
    color: string;
    completionRate: number;
    totalLogs: number;
    currentStreak: number;
    category: {
      name: string;
      icon: string;
    };
  }>;
  type?: "pie" | "bar";
}

export function CompletionChart({
  habits,
  type = "pie",
}: CompletionChartProps) {
  // Prepare data for charts
  const chartData = habits.map((habit) => ({
    name: habit.name,
    completionRate: habit.completionRate,
    totalLogs: habit.totalLogs,
    color: habit.color,
    category: habit.category.name,
    icon: habit.category.icon,
  }));

  // Calculate overall statistics
  const totalHabits = habits.length;
  const averageCompletion =
    totalHabits > 0
      ? Math.round(
          habits.reduce((sum, h) => sum + h.completionRate, 0) / totalHabits
        )
      : 0;

  const excellentHabits = habits.filter((h) => h.completionRate >= 80).length;
  const goodHabits = habits.filter(
    (h) => h.completionRate >= 60 && h.completionRate < 80
  ).length;
  const needsWorkHabits = habits.filter((h) => h.completionRate < 60).length;

  // Data for performance distribution pie chart
  const performanceData = [
    {
      name: "Excellent (80%+)",
      value: excellentHabits,
      color: "#10B981",
    },
    {
      name: "Good (60-79%)",
      value: goodHabits,
      color: "#F59E0B",
    },
    {
      name: "Needs Work (<60%)",
      value: needsWorkHabits,
      color: "#EF4444",
    },
  ].filter((item) => item.value > 0);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: {
        name: string;
        completionRate: number;
        totalLogs: number;
        category: string;
        icon: string;
      };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      if (type === "pie") {
        return (
          <div className="bg-white p-3 border rounded-lg shadow-lg">
            <p className="font-medium">{data.name}</p>
            <p className="text-sm">
              {data.value} habit{data.value !== 1 ? "s" : ""}
            </p>
          </div>
        );
      } else {
        return (
          <div className="bg-white p-3 border rounded-lg shadow-lg">
            <p className="font-medium">{data.payload.name}</p>
            <p className="text-sm">
              Completion Rate:{" "}
              <span className="font-medium">{data.value}%</span>
            </p>
            <p className="text-sm">
              Total Logs:{" "}
              <span className="font-medium">{data.payload.totalLogs}</span>
            </p>
            <p className="text-sm">
              Category:{" "}
              <span className="font-medium">
                {data.payload.icon} {data.payload.category}
              </span>
            </p>
          </div>
        );
      }
    }
    return null;
  };

  if (type === "pie") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Performance Distribution
            </h3>
            <p className="text-sm text-gray-500">
              How your habits are performing
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {averageCompletion}%
            </div>
            <div className="text-sm text-gray-500">Average completion</div>
          </div>
        </div>

        {performanceData.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
              {performanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500">No habits to analyze yet</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Habit Completion Rates
          </h3>
          <p className="text-sm text-gray-500">Individual habit performance</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {averageCompletion}%
          </div>
          <div className="text-sm text-gray-500">Average completion</div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completionRate" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500">No habits to analyze yet</p>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Performance Summary
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {excellentHabits}
              </div>
              <div className="text-xs text-green-600">Excellent (80%+)</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">
                {goodHabits}
              </div>
              <div className="text-xs text-yellow-600">Good (60-79%)</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {needsWorkHabits}
              </div>
              <div className="text-xs text-red-600">Needs Work (&lt;60%)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
