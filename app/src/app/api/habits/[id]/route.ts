import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/habits/[id] - Get a specific habit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const habit = await prisma.habit.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        category: true,
        logs: {
          orderBy: {
            completedDate: "desc",
          },
        },
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error fetching habit:", error);
    return NextResponse.json(
      { error: "Failed to fetch habit" },
      { status: 500 }
    );
  }
}

// PUT /api/habits/[id] - Update a habit
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { userId, name, description, categoryId, color, isActive } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify habit exists and belongs to user
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // If categoryId is provided, verify it exists
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }
    }

    const habit = await prisma.habit.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(categoryId && { categoryId }),
        ...(color && { color }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error updating habit:", error);
    return NextResponse.json(
      { error: "Failed to update habit" },
      { status: 500 }
    );
  }
}

// DELETE /api/habits/[id] - Delete a habit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify habit exists and belongs to user
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!existingHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Delete the habit (this will cascade delete all logs due to schema)
    await prisma.habit.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return NextResponse.json(
      { error: "Failed to delete habit" },
      { status: 500 }
    );
  }
}
