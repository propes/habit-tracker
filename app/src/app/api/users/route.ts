import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/users - Create or update a user record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, name } = body;

    if (!id || !email) {
      return NextResponse.json(
        { error: "User ID and email are required" },
        { status: 400 }
      );
    }

    // Use upsert to create or update the user
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        name: name || null,
      },
      create: {
        id,
        email,
        name: name || null,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json(
      { error: "Failed to create/update user" },
      { status: 500 }
    );
  }
}
