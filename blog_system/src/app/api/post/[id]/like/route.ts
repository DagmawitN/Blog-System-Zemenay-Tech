// src/app/api/post/[id]/like/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } } 
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const postId = params.id; 

  // Check if like already exists
  const existingLike = await prisma.like.findFirst({
    where: { postId, userId },
  });

  if (existingLike) {
    // Unlike
    await prisma.like.delete({ where: { id: existingLike.id } });
    return NextResponse.json({ liked: false });
  }

  // Like
  await prisma.like.create({
    data: { postId, userId },
  });

  return NextResponse.json({ liked: true });
}

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const postId = context.params.id;

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Count total likes for the post
    const likesCount = await prisma.like.count({
      where: { postId },
    });

    // Check if the current user liked the post
    let likedByUser = false;
    if (userId) {
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId },
      });
      likedByUser = !!existingLike;
    }

    return NextResponse.json({ likesCount, likedByUser });
  } catch (error) {
    console.error("GET /api/post/[id]/like error:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}