"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
  status: string;
  author: {
    name: string;
    email: string;
  };
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/post");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const updateStatus = async (postId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/post/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchPosts();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-t">
              <td className="border p-2">{post.title}</td>
              <td className="border p-2">{post.author.name || post.author.email}</td>
              <td className="border p-2">{post.status}</td>
              <td className="border p-2 space-x-2">
                {["DRAFT", "PUBLISHED", "ARCHIVED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(post.id, s)}
                    className={`px-2 py-1 rounded ${
                      post.status === s
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
