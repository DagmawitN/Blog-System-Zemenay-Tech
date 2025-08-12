"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react"; // npm install lucide-react

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <Link href="/" className="text-lg font-bold">
        Blog Site
      </Link>

      {session ? (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 border rounded-full hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <Link
                href="/create_post"
                className="block px-4 py-2 hover:bg-gray-100 transition"
                onClick={() => setMenuOpen(false)}
              >
                Create Post
              </Link>
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100 transition"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex space-x-3">
          <Link
            href="/login"
            className="border border-gray-400 rounded-full px-5 py-2 hover:bg-gray-100 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="border border-gray-400 rounded-full px-5 py-2 hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
