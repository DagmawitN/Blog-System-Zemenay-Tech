import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Create comment or reply
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, content, parentId } = await req.json();

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },  // <--- connect relation here
        ...(parentId ? { parent: { connect: { id: parentId } } } : {}),

        author: { connect: { id: session.user.id } },
      },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("POST /api/comment error:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

// Get comments for a post (with replies)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // top-level only
      },
      include: {
        author: true,
        replies: {
          include: {
            author: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET /api/comment error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}
