"use client";

import { useState } from "react";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  likedByUser: boolean;
}

export default function LikeButton({ postId, initialCount, likedByUser }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(likedByUser);

  const handleLike = async () => {
    const res = await fetch(`/api/post/${postId}/like`, { method: "POST" });
    if (res.ok) {
      setLiked(!liked);
      setCount((prev) => (liked ? prev - 1 : prev + 1));
    } else {
      alert("You must be logged in to like this post.");
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`px-4 py-2 rounded mt-4 ${liked ? "bg-pink-600" : "bg-pink-500"} text-white`}
    >
      ❤️ {liked ? "Liked" : "Like"} ({count})
    </button>
  );
}
