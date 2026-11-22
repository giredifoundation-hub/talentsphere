"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  full_name: string | null;
  email: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile error:", error);
      }

      setProfile(
        data || {
          full_name: user.user_metadata?.full_name || "User",
          email: user.email || "",
        }
      );

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-bold text-blue-700"
          >
            TalentSphere
          </a>

          <button
            onClick={handleLogout}
            className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">

        <section>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile?.full_name || "User"} 👋
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome to your TalentSphere dashboard.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                AI CV & Cover Letter
              </h2>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                ₦1,000
              </span>
            </div>

            <p className="mt-4 text-gray-600">
              Create a professional CV and tailored cover letter
              based on a specific job opportunity.
            </p>

            <button
  onClick={() => router.push("/cv-builder")}
  className="mt-6 w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
>
  Create CV — ₦1,000
</button>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                CV Match Scanner
              </h2>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                ₦300
              </span>
            </div>

            <p className="mt-4 text-gray-600">
              Upload your CV and compare it with a job description
              to identify missing skills and important improvements.
            </p>

            <button
              disabled
              className="mt-6 w-full rounded-lg bg-green-700 px-5 py-3 font-semibold text-white opacity-50"
            >
              Coming Soon
            </button>
          </div>

        </section>

        <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Account Information
          </h2>

          <div className="mt-5 space-y-3 text-gray-700">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {profile?.full_name || "Not available"}
            </p>

            <p>
              <span className="font-semibold">Email:</span>{" "}
              {profile?.email || "Not available"}
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}