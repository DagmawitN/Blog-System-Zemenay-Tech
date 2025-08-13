"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "" });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        if (res.ok && data.secure_url) uploadedUrls.push(data.secure_url);
      } catch (err) {
        console.error("Upload error:", err);
        alert(`Failed to upload ${file.name}`);
      }
    }

    setImageUrls((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrls.length) return alert("Upload at least one image");

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrls }),
      });

      if (res.ok) router.push("/");
      else {
        const data = await res.json();
        console.error("Failed to create post:", data);
        alert("Failed to create post");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-3 w-full rounded-full focus:outline-none focus:ring-2 focus:ring-black"
          required
        />

        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          rows={6}
          required
        />

        <div className="flex gap-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-gray-200 text-black px-6 py-2 rounded-full hover:bg-gray-300 transition"
          >
            Choose Images
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />

          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
          >
            Add More Images
          </label>
        </div>

        {uploading && <p className="text-gray-700">Uploading...</p>}

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx + 1}`}
                className="w-full h-32 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
