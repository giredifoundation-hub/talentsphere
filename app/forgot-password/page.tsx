"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Password reset email sent. Please check your email and follow the link."
    );

    setLoading(false);
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
            Forgot Password?
          </h1>

          <p className="mt-2 text-gray-600">
            Enter your email and we will send you a password reset link.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <form
          onSubmit={handleReset}
          className="mt-8 space-y-5"
        >
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            ← Back to Login
          </a>
        </div>

      </div>
    </main>
  );
}