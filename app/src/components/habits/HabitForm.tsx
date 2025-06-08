"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface HabitFormProps {
  onSubmit: (habitData: {
    name: string;
    description: string;
    categoryId: string;
    color: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    name: string;
    description: string;
    categoryId: string;
    color: string;
  };
  isLoading?: boolean;
}

export function HabitForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: HabitFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId || "",
    color: initialData?.color || "#3B82F6",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);

        // Set default category if none selected
        if (!formData.categoryId && data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: data[0].id,
            color: data[0].color,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    setFormData((prev) => ({
      ...prev,
      categoryId,
      color: category?.color || prev.color,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Habit name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Habit name must be at least 2 characters";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
        categoryId: formData.categoryId,
        color: formData.color,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Habit Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="e.g., Drink 8 glasses of water"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add any notes or details about this habit..."
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Category *
        </label>
        <select
          id="category"
          value={formData.categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.categoryId ? "border-red-500" : "border-gray-300"
          }`}
          disabled={isLoading}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="color"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Color
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            id="color"
            value={formData.color}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, color: e.target.value }))
            }
            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            disabled={isLoading}
          />
          <span className="text-sm text-gray-600">
            Choose a color for your habit
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : initialData
            ? "Update Habit"
            : "Create Habit"}
        </Button>
      </div>
    </form>
  );
}
