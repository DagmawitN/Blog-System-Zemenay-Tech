"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type PostData = {
  title: string;
  content: string;
  imageUrl?: string | null;
  status: PostStatus;
};

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<PostData>({
    title: "",
    content: "",
    imageUrl: "",
    status: "DRAFT",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");

        const data = await res.json();
        setPost({
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl || "",
          status: data.status,
        });
      } catch (err) {
        setError("Error loading post data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  // Cloudinary upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset"); // Replace with your upload preset

    setUploading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dbv5nikjh/image/upload", // Replace YOUR_CLOUD_NAME
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setPost((prev) => ({ ...prev, imageUrl: data.secure_url }));
      } else {
        setError("Failed to upload image");
      }
    } catch (err) {
      setError("Image upload failed");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/post/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update post");
      }

      router.push(`/post/${id}`); // redirect back to post detail page after saving
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading post data...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={post.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="content" className="block font-semibold mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full border rounded px-3 py-2"
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="imageUpload" className="block font-semibold mb-1">
            Upload Image
          </label>
          <input
            id="imageUpload"
            name="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || saving}
            className="mb-2"
          />
          {uploading && <p>Uploading image...</p>}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Uploaded image"
              className="w-48 h-auto rounded"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
