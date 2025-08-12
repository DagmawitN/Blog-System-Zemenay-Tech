import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const postId = params.id;

  // Check if like already exists
  const existingLike = await prisma.like.findFirst({
    where: { postId, userId },
  });

  if (existingLike) {
    // Unlike
    await prisma.like.delete({ where: { id: existingLike.id } });
    return NextResponse.json({ message: "Unliked" });
  }

  // Like
  const like = await prisma.like.create({
    data: { postId, userId },
  });

  return NextResponse.json(like);
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params can be a Promise
) {
  const { id: postId } = await context.params; // 👈 await before using
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  // Count likes for the post
  const likesCount = await prisma.like.count({
    where: { postId },
  });

  // Check if the user liked this post
  let likedByUser = false;
  if (userId) {
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });
    likedByUser = !!existingLike;
  }

  return NextResponse.json({ likesCount, likedByUser });
}

