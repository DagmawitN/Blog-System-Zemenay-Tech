// src/components/PostCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostListItem } from "@/app/page";

type PostCardProps = {
  post: PostListItem & {
    _count?: { likes?: number; comments?: number };
    likesCount?: number;
  };
};

export default function PostCard({ post }: PostCardProps) {
  const initialLikes =
    (post._count?.likes ??
      (Array.isArray(post.likes) ? post.likes.length : undefined) ??
      post.likesCount ??
      0) as number;

  const [likes, setLikes] = useState<number>(initialLikes);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/post/${post.id}/like`, { method: "POST" });
      if (res.ok) {
        setLikes((prev: number) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to like post", error);
    }
  };

  return (
    <div className="border p-4 rounded shadow-sm">
      {post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover rounded"
        />
      )}
      <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
      <p className="text-gray-600">{post.content.slice(0, 100)}...</p>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={handleLike}
          className="text-red-500 font-semibold hover:underline"
        >
          ❤️ Like ({likes})
        </button>
        <Link href={`/post/${post.id}`} className="text-blue-500 hover:underline">
          Read more →
        </Link>
      </div>
    </div>
  );
}
