import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/habits - Get all habits for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      include: {
        category: true,
        logs: {
          where: {
            completedDate: {
              gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
          orderBy: {
            completedDate: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate streaks and completion rates for each habit
    const habitsWithStats = habits.map((habit) => {
      const logs = habit.logs;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate current streak
      let currentStreak = 0;
      const checkDate = new Date(today);

      while (true) {
        const dateStr = checkDate.toISOString().split("T")[0];
        const logExists = logs.some(
          (log) => log.completedDate.toISOString().split("T")[0] === dateStr
        );

        if (logExists) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate completion rate for last 7 days
      const last7Days: string[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split("T")[0]);
      }

      const completedInLast7Days = logs.filter((log) =>
        last7Days.includes(log.completedDate.toISOString().split("T")[0])
      ).length;

      const completionRate = Math.round((completedInLast7Days / 7) * 100);

      // Check if completed today
      const todayStr = today.toISOString().split("T")[0];
      const completedToday = logs.some(
        (log) => log.completedDate.toISOString().split("T")[0] === todayStr
      );

      return {
        ...habit,
        currentStreak,
        completionRate,
        completedToday,
        totalLogs: logs.length,
      };
    });

    return NextResponse.json(habitsWithStats);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

// POST /api/habits - Create a new habit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, description, categoryId, color } = body;

    if (!userId || !name || !categoryId) {
      return NextResponse.json(
        { error: "User ID, name, and category are required" },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        description,
        categoryId,
        color: color || category.color,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}
