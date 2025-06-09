"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface HabitFiltersProps {
  categories: Category[];
  onFilterChange: (filters: {
    search: string;
    category: string;
    completionRate: string;
    streak: string;
  }) => void;
  totalHabits: number;
  filteredCount: number;
}

export function HabitFilters({
  categories,
  onFilterChange,
  totalHabits,
  filteredCount,
}: HabitFiltersProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [completionRate, setCompletionRate] = useState("");
  const [streak, setStreak] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (
    newFilters: Partial<{
      search: string;
      category: string;
      completionRate: string;
      streak: string;
    }>
  ) => {
    const updatedFilters = {
      search: newFilters.search ?? search,
      category: newFilters.category ?? selectedCategory,
      completionRate: newFilters.completionRate ?? completionRate,
      streak: newFilters.streak ?? streak,
    };

    setSearch(updatedFilters.search);
    setSelectedCategory(updatedFilters.category);
    setCompletionRate(updatedFilters.completionRate);
    setStreak(updatedFilters.streak);

    onFilterChange(updatedFilters);
  };

  const clearAllFilters = () => {
    handleFilterChange({
      search: "",
      category: "",
      completionRate: "",
      streak: "",
    });
  };

  const hasActiveFilters =
    search || selectedCategory || completionRate || streak;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search and Filter Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search habits..."
                value={search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {filteredCount} of {totalHabits} habits
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {
                    [search, selectedCategory, completionRate, streak].filter(
                      Boolean
                    ).length
                  }
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t pt-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    handleFilterChange({ category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Completion Rate Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Rate
                </label>
                <select
                  value={completionRate}
                  onChange={(e) =>
                    handleFilterChange({ completionRate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Rate</option>
                  <option value="excellent">Excellent (80%+)</option>
                  <option value="good">Good (60-79%)</option>
                  <option value="needs-work">Needs Work (&lt;60%)</option>
                </select>
              </div>

              {/* Streak Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Streak
                </label>
                <select
                  value={streak}
                  onChange={(e) =>
                    handleFilterChange({ streak: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Streak</option>
                  <option value="hot">Hot Streak (7+ days)</option>
                  <option value="building">Building (3-6 days)</option>
                  <option value="starting">Starting (1-2 days)</option>
                  <option value="broken">Broken (0 days)</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear all filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {search && (
              <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                <span>Search: &quot;{search}&quot;</span>
                <button
                  onClick={() => handleFilterChange({ search: "" })}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {selectedCategory && (
              <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                <span>
                  Category:{" "}
                  {categories.find((c) => c.id === selectedCategory)?.icon}{" "}
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
                <button
                  onClick={() => handleFilterChange({ category: "" })}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {completionRate && (
              <div className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
                <span>
                  Rate:{" "}
                  {completionRate === "excellent"
                    ? "Excellent (80%+)"
                    : completionRate === "good"
                    ? "Good (60-79%)"
                    : "Needs Work (<60%)"}
                </span>
                <button
                  onClick={() => handleFilterChange({ completionRate: "" })}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {streak && (
              <div className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm">
                <span>
                  Streak:{" "}
                  {streak === "hot"
                    ? "Hot Streak (7+ days)"
                    : streak === "building"
                    ? "Building (3-6 days)"
                    : streak === "starting"
                    ? "Starting (1-2 days)"
                    : "Broken (0 days)"}
                </span>
                <button
                  onClick={() => handleFilterChange({ streak: "" })}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
