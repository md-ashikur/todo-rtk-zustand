"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiMenu, FiLogOut, FiUser, FiHome, FiUserPlus, FiLogIn, FiGrid } from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // Extend user type to include 'role'
  type UserWithRole = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };

  const user = session?.user as UserWithRole | undefined;
  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between w-full sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <FiHome /> TodoApp
        </Link>
      </div>
      <div className="md:hidden">
        <button onClick={() => setOpen(!open)} className="text-2xl text-blue-600">
          <FiMenu />
        </button>
      </div>
      <div className={`flex-col md:flex-row md:flex items-center gap-6 absolute md:static top-14 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all ${open ? "flex" : "hidden"}`}>
        <Link href="/" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 py-2 md:py-0">
          Home
        </Link>
        {!session && (
          <>
            <Link href="/auth/signin" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 py-2 md:py-0">
               Sign In
            </Link>
            <Link href="/auth/signup" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 py-2 md:py-0">
              Sign Up
            </Link>
          </>
        )}
        {session && (
          <>
            {isAdmin && (
              <Link href="/admin/dashboard" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 py-2 md:py-0">
                <FiGrid /> Dashboard
              </Link>
            )}
            <span className="flex items-center gap-1 text-gray-700 font-semibold py-2 md:py-0">
              <FiUser /> {user?.name || user?.email}
            </span>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-1 text-red-500 hover:text-red-700 py-2 md:py-0">
              <FiLogOut /> Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
