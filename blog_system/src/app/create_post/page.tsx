"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Upload to Cloudinary (multiple)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        uploadedUrls.push(data.secure_url);
      }
    }

    setImageUrls((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrls }), // send array of images
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

        <input type="file" multiple onChange={handleImageUpload} />
        {uploading && <p>Uploading...</p>}

        {imageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx + 1}`}
                className="w-full h-32 object-cover rounded"
              />
            ))}
          </div>
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
