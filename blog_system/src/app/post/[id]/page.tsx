"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type CommentItem = {
  id: string;
  content: string;
  author?: { name?: string | null } | null;
};

type PostDetail = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  likes?: Array<unknown>;
  comments?: CommentItem[];
  views: number;
  author: {
    id: string;
    name: string;
  };
};

export default function SinglePostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const res = await fetch(`/api/post/${id}`);
      const data: PostDetail = await res.json();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!post) return <p className="text-center mt-10">Post not found</p>;

  const canEdit = session?.user?.id === post.author.id;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {post.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imageUrl} alt={post.title} className="w-full h-80 object-cover rounded" />
      )}
      <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
      <p className="text-gray-600 mt-2">{post.content}</p>

      {/* Views & Likes */}
      <div className="mt-4 flex justify-between items-center">
        <p className="font-semibold">Views: {post.views}</p>
        <p className="font-semibold">Likes: {post.likes?.length || 0}</p>
      </div>

      {/* Edit Button (only if user is author) */}
      {canEdit && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => router.push(`/post/${post.id}/edit`)}
        >
          Edit Post
        </button>
      )}

      {/* Comments */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">Comments</h2>
        {(post.comments?.length ?? 0) > 0 ? (
          post.comments!.map((c) => (
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
