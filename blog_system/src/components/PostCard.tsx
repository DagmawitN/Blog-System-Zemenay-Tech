"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import CommentForm, { CommentType } from "@/components/CommentForm";
import type { PostListItem } from "@/app/page";
import LikeButton from "@/components/LikeButton";

type PostCardProps = {
  post: PostListItem & {
    likesCount?: number;
    likedByUser?: boolean;
    comments?: CommentType[];
  };
};

export default function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentType[]>(post.comments || []);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleAddComment = (newComment: CommentType) => {
    if (newComment.parent) {
      // It's a reply
      setComments((prev) =>
        prev.map((c) =>
          c.id === newComment.parent!.id
            ? { ...c, replies: [...(c.replies || []), newComment] }
            : c
        )
      );
    } else {
      // New top-level comment
      setComments((prev) => [newComment, ...prev]);
    }
  };

  return (
    <div className="border p-4 rounded shadow-sm">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover rounded"
        />
      )}
      <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
      <p className="text-gray-600">{post.content.slice(0, 100)}...</p>

      <div className="flex justify-between items-center mt-2">
        <LikeButton
          postId={post.id}
          initialCount={post.likesCount || 0}
          likedByUser={post.likedByUser || false}
        />

        <Link
          href={`/post/${post.id}`}
          className="text-blue-500 hover:underline"
        >
          Read more →
        </Link>
      </div>

      <div className="mt-4">
        {session?.user && (
          <CommentForm postId={post.id} onCommentAdded={handleAddComment} />
        )}

        <div className="mt-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-t pt-2">
              <p className="text-sm">
                <strong>{comment.authorName}:</strong> {comment.content}
              </p>
              <button
                className="text-blue-500 text-xs mt-1"
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
              >
                Reply
              </button>

              {replyingTo === comment.id && session?.user && (
                <div className="mt-2 ml-4">
                  <CommentForm
                    postId={post.id}
                    parentId={comment.id}
                    onCommentAdded={(reply) => {
                      setComments((prev) =>
                        prev.map((c) =>
                          c.id === comment.id
                            ? { ...c, replies: [...(c.replies || []), reply] }
                            : c
                        )
                      );
                      setReplyingTo(null);
                    }}
                  />
                </div>
              )}

              {comment.replies?.length ? (
                <div className="ml-4 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <p key={reply.id} className="text-xs text-gray-700">
                      <strong>{reply.authorName}:</strong> {reply.content}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
