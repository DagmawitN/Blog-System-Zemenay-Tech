import PostCard from "@/components/PostCard";


export type PostListItem = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  likes?: Array<unknown>;
  comments?: Array<unknown>;
};

async function getPosts(): Promise<PostListItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/post`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Latest Posts</h1>
  
      </header>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                comments: post.comments as { id: string; content: string; authorName: string }[] | undefined,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
