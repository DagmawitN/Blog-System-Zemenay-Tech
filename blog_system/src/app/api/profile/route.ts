import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path matches the actual location and filename of authOptions (e.g., authOptions.ts or authOptions.js)
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      }
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
