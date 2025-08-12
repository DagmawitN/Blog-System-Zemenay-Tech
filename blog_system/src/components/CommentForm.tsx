"use client";

import { useState } from "react";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentAdded: (comment: CommentType) => void; // accept new comment/reply
}

export type CommentType = {
  id: string;
  content: string;
  authorName: string;
  replies?: CommentType[];
  parent?: { id: string };
};

export default function CommentForm({ postId, parentId, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const res = await fetch(`/api/post/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: comment, parentId }),
    });

    if (res.ok) {
      const newComment: CommentType = await res.json();
      setComment("");
      onCommentAdded(newComment);
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
