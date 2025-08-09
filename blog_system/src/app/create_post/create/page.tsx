"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setImageUrl(data.secure_url);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl }),
    });
    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to create post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border w-full p-2"
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border w-full p-2"
          rows={5}
          required
        />
        <input
          type="text"
          placeholder="Category ID"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="border w-full p-2"
        />
        <input type="file" onChange={handleImageUpload} />
        {uploading && <p>Uploading...</p>}
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
        )}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={uploading}
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
