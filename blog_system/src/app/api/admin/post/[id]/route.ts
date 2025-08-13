// src/app/api/admin/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params.id; 
  const { status } = await req.json();

  if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("PUT /api/admin/post/[id] error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
