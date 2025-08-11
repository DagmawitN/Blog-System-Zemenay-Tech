"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PostForm from "@/components/PostForm";

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="max-w-2xl mx-auto mt-10">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <PostForm onPostCreated={() => router.push("/")} />
    </div>
  );
}