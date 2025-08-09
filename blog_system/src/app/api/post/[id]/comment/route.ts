import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        postId: params.id,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to comment" }, { status: 500 });
  }
}
