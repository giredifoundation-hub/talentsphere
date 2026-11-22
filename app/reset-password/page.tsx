"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "This password reset link is invalid or has expired. Please request a new one."
        );
      }

      setChecking(false);
    }

    checkSession();
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(
      "Your password has been updated successfully. You can now sign in."
    );

    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <div className="text-center">
          <p className="text-gray-600">
            Checking reset link...
          </p>
        </div>
      </main>
    );
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
            Reset Password
          </h1>

          <p className="mt-2 text-gray-600">
            Enter your new password below.
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

        {!success && !error && (
          <form
            onSubmit={handleReset}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="mb-2 block font-semibold">
                New Password
              </label>

              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Confirm New Password
              </label>

              <input
                required
                type="password"
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter password again"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

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