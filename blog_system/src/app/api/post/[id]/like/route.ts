import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  const postId = params.id;

  const existingLike = await prisma.like.findFirst({
    where: { userId, postId },
  });

  if (existingLike) {
    // Unlike
    await prisma.like.delete({ where: { id: existingLike.id } });
    return NextResponse.json({ liked: false });
  } else {
    // Like
    await prisma.like.create({ data: { userId, postId } });
    return NextResponse.json({ liked: true });
  }
}
