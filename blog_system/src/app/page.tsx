// app/page.tsx (Server Component)
import PostCard from "@/components/PostCard";
import UserMenu from "@/components/UserMenu"; // client component

async function getPosts() {
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
        <UserMenu />
      </header>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post: any) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
