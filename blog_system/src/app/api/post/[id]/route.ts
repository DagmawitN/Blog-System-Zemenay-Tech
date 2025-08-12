import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Increment views by 1
    await prisma.post.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });

    // Fetch the post including related data
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        likes: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/post/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, imageUrl,  status } = body;

  try {
    const { id } = await params;
    // Verify post exists & belongs to user
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.post.update({
  where: { id },
  data: {
    title,
    content,
    imageUrl,
    status,
    updatedAt: new Date(),
  },
});


    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/post/[id] error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

//  DELETE single post (only author can delete)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Verify post exists & belongs to user
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("DELETE /api/post/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
