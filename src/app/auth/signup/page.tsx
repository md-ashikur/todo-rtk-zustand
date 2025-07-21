"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FiUserPlus } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";


interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SignUpFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password })
    });
    const result = await res.json();
    setLoading(false);
    if (!res.ok) setError(result.error || "Sign-up failed");
    else {
      setSuccess("Account created! You can now sign in.");
      reset();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center text-gray-800">
        <FiUserPlus /> Sign Up
      </h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          placeholder="Name"
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 text-lg"
        />
        {errors.name?.message && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 text-lg"
        />
        {errors.email?.message && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        <input
          type="password"
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
          placeholder="Password"
          className="border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 text-lg"
        />
        {errors.password?.message && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold text-lg flex items-center gap-2 justify-center"
          disabled={loading}
        >
          <FiUserPlus /> {loading ? "Loading..." : "Sign Up"}
        </button>
        <button
          type="button"
          className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded font-semibold text-lg flex items-center gap-2 justify-center"
          onClick={() => signIn("google")}
        >
          <FcGoogle /> Sign up with Google
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      </form>
      <div className="mt-4 text-center">
        <a href="/auth/signin" className="text-blue-500 hover:underline">Already have an account? Sign In</a>
      </div>



   <div className="text-green-600 text-sm mt-2">
       <LoginLink>Sign in</LoginLink>

<RegisterLink>Sign up</RegisterLink>
   </div>

    </div>
  );
}
