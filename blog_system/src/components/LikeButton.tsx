"use client";

import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialCount?: number;
  likedByUser?: boolean;
}

export default function LikeButton({ postId, initialCount = 0, likedByUser = false }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(likedByUser);
  const [loading, setLoading] = useState(false);

  // Fetch latest likes on mount
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/post/${postId}/like`);
        if (res.ok) {
          const data = await res.json();
          setCount(data.likesCount);
          setLiked(data.isLiked);
        }
      } catch (error) {
        console.error("Failed to fetch like data:", error);
      }
    };
    fetchLikes();
  }, [postId]);

  const handleLike = async () => {
  setLoading(true);
  try {
    const res = await fetch(`/api/post/${postId}/like`, { method: "POST" });
    if (res.ok) {
      setLiked((prevLiked) => {
        setCount((prevCount) => prevLiked ? prevCount - 1 : prevCount + 1);
        return !prevLiked;
      });
    } else {
      alert("You must be logged in to like this post.");
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  } finally {
    setLoading(false);
  }
};


  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded mt-4 ${
        liked ? "bg-blue-600" : "bg-blue-500"
      } text-white disabled:opacity-50`}
    >
      <ThumbsUp
        size={18}
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
      />
      <span>{count}</span>
    </button>
  );
}
