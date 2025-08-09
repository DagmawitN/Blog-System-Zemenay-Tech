"use client";

import { useState } from "react";

interface PostFormProps {
  onPostCreated?: () => void;
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, imageUrl, categoryId }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      setImageUrl("");
      setCategoryId("");
      onPostCreated?.();
    } else {
      alert("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        className="border p-2 w-full rounded"
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        className="border p-2 w-full rounded"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category ID"
        className="border p-2 w-full rounded"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Publish Post
      </button>
    </form>
  );
}
