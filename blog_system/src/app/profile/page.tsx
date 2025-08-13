"use client";

import { useState, useEffect } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type ProfileData = {
  name: string;
  email: string;
  posts: Post[];
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data: ProfileData = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-4">Loading profile...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!profile) return <div className="p-4">No profile found.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white text-black">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="text-gray-600">{profile.email}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">My Posts</h2>
        {profile.posts.length === 0 ? (
          <p className="text-gray-500">You haven’t created any posts yet.</p>
        ) : (
          <div className="space-y-4">
            {profile.posts.map((post) => (
              <div key={post.id} className="border p-4 rounded shadow-sm">
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-gray-700">{post.content.slice(0, 100)}...</p>
                <p className="text-gray-500 text-sm mt-1">
                  Created: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
