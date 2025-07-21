"use client";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-xl p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h2>
      <p className="mb-6 text-gray-700">Something went wrong during authentication. Please try again or contact support.</p>
      <Link href="/auth/signin" className="text-blue-500 hover:underline">Go back to Sign In</Link>
    </div>
  );
}
