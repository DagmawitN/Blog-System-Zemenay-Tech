import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma"; // Ensure named export in prisma.ts

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Server-side validation
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: "", // You can replace with default avatar
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong during signup" },
      { status: 500 }
    );
  }
}
