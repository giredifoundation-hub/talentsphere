"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(
      "Account created successfully. Please check your email if email verification is required."
    );

    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">

        <div className="text-center">
          <a
            href="/"
            className="text-3xl font-bold text-blue-700"
          >
            TalentSphere
          </a>

          <h1 className="mt-6 text-2xl font-bold">
            Create Your Account
          </h1>

          <p className="mt-2 text-gray-600">
            Create an account to use TalentSphere AI services.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSignup}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-2 block font-semibold">
              Full Name
            </label>

            <input
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Email
            </label>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Password
            </label>

            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-blue-700 hover:underline"
          >
            Sign In
          </a>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            ← Back to Website
          </a>
        </div>

      </div>
    </main>
  );
}