// src/components/UserMenu.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  if (!session) {
    return (
      <Link
        href="/login"
        className="border border-gray-400 rounded-full px-4 py-1 hover:bg-gray-100"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border border-gray-400 rounded-full px-4 py-1 hover:bg-gray-100"
      >
        ☰ Menu
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
          <p className="p-2 border-b">Hello, {session.user?.name}</p>
          <Link href="/create-post" className="block p-2 hover:bg-gray-100">
            Create Post
          </Link>
          <Link href="/profile" className="block p-2 hover:bg-gray-100">
            Profile
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full text-left p-2 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
