"use client";

import { useState } from "react";

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void; // callback to refresh data
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const res = await fetch(`/api/post/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment }),
    });

    if (res.ok) {
      setComment("");
      onCommentAdded();
    } else {
      alert("Failed to add comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="border w-full p-2 rounded"
        rows={3}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Add Comment
      </button>
    </form>
  );
}
