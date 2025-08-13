import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, imageUrls, status } = body;

  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return NextResponse.json({ error: "No images provided" }, { status: 400 });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrls, // save all uploaded URLs
        authorId: session.user.id,
        status: status || "PUBLISHED",
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("POST /api/post error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
// Get all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/post error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
