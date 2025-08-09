interface Comment {
  id: string;
  content: string;
  author?: {
    name?: string;
  };
}

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) return <p>No comments yet.</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Comments</h2>
      {comments.map((c) => (
        <div key={c.id} className="border p-2 rounded mb-2">
          <p className="text-sm text-gray-700">
            <strong>{c.author?.name || "Anonymous"}:</strong> {c.content}
          </p>
        </div>
      ))}
    </div>
  );
}
