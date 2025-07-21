"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FiLogIn } from "react-icons/fi";

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (res?.error) setError(res.error);
    else if (res?.ok) window.location.href = "/";
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-gray-800">
        <FiLogIn /> Sign In
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 text-lg"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          placeholder="Password"
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 text-lg"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold text-lg flex items-center gap-2 justify-center"
          disabled={loading}
        >
          <FiLogIn /> {loading ? "Loading..." : "Sign In"}
        </button>
        <button
          type="button"
          className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded font-semibold text-lg flex items-center gap-2 justify-center"
          onClick={() => signIn("google")}
        >
          <FcGoogle /> Sign in with Google
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
      <div className="mt-4 text-center">
        <a href="/auth/signup" className="text-blue-500 hover:underline">Don&apos;t have an account? Sign Up</a>
      </div>
    </div>
  );
}
