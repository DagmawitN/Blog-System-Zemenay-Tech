"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SinglePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const res = await fetch(`/api/post/${id}`);
      const data = await res.json();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="w-full h-80 object-cover rounded" />
      )}
      <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
      <p className="text-gray-600 mt-2">{post.content}</p>

      {/* Like & Comments */}
      <div className="mt-4">
        <p className="font-semibold">
          Likes: {post.likes?.length || 0}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Comments</h2>
        {post.comments?.length > 0 ? (
          post.comments.map((c: any) => (
            <div key={c.id} className="border p-2 rounded mb-2">
              <p className="text-sm text-gray-700">
                <strong>{c.author?.name || "Anonymous"}:</strong> {c.content}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
}
