"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AdminUser = {
  user_id: string;
  email: string;
  role: "super_admin" | "admin";
  created_at: string;
};

type AdminPostingStats = {
  user_id: string;
  email: string;
  role: "super_admin" | "admin";
  total_posts: number;
  jobs: number;
  scholarships: number;
  grants: number;
  fellowships: number;
  posts_today: number;
  posts_this_month: number;
};
export default function ManageAdminsPage() {
  const router = useRouter();

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [postingStats, setPostingStats] =
  useState<AdminPostingStats[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAdmins() {
    const { data, error } = await supabase.rpc(
      "list_admin_users"
    );

    if (error) {
      setError(error.message);
      return;
    }

    setAdmins(data || []);

const {
  data: stats,
  error: statsError,
} = await supabase.rpc("get_admin_posting_stats");

if (statsError) {
  setPostingStats([]);
  setError(
    "Unable to load admin posting statistics: " +
    statsError.message
  );
  return;
}

setPostingStats(stats || []);
  }

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase.rpc(
        "is_super_admin"
      );

      if (error || data !== true) {
        router.replace("/admin");
        return;
      }

      setAuthorized(true);
      await loadAdmins();
      setLoading(false);
    }

    void checkAccess();
  }, [router]);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();

    if (busy || !authorized || !email.trim()) return;

    setBusy(true);
    setMessage("");
    setError("");

    try {
      const { error } = await supabase.rpc(
        "add_admin_user",
        { p_email: email.trim() }
      );

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Admin access confirmed successfully.");
      setEmail("");
      await loadAdmins();
    } catch {
      setError("Unable to add admin. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function removeAdmin(admin: AdminUser) {
    if (busy || !authorized || admin.role !== "admin") return;

    const confirmed = window.confirm(
      `Remove admin access for ${admin.email}?`
    );

    if (!confirmed) return;

    setBusy(true);
    setMessage("");
    setError("");

    try {
      const { data, error } = await supabase.rpc(
        "remove_admin_user",
        { p_user_id: admin.user_id }
      );

      if (error) {
        setError(error.message);
        return;
      }

      if (data !== true) {
        setError("Admin access could not be removed.");
        await loadAdmins();
        return;
      }

      setMessage("Admin access removed successfully.");
      await loadAdmins();
    } catch {
      setError("Unable to remove admin. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !authorized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p>Checking access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        <button
          onClick={() => router.push("/admin")}
          className="mb-6 font-semibold text-blue-700"
        >
          &larr; Back to Admin Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Admins
          </h1>

          <p className="mt-2 text-gray-600">
            Add and manage TalentSphere administrators.
          </p>

          <span className="mt-3 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            Super Admin
          </span>
        </div>

        {message && (
          <div role="status" className="mb-6 rounded-lg bg-green-100 p-4 text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div role="alert" className="mb-6 rounded-lg bg-red-100 p-4 text-red-800">
            {error}
          </div>
        )}

        <section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-bold">
            Add New Admin
          </h2>

          <p className="mb-5 text-sm text-gray-600">
            The user must have a registered and verified
            TalentSphere account.
          </p>

          <form
            onSubmit={addAdmin}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter registered email address"
              className="flex-1 rounded-lg border px-4 py-3"
              disabled={busy}
            />

            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {busy ? "Please wait..." : "Add Admin"}
            </button>
          </form>
        </section>

<section className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold text-gray-900">
    Admin Performance
  </h2>

  <p className="mb-6 mt-2 text-sm text-gray-600">
    Monitor posting activities of each administrator.
  </p>

  <div className="space-y-5">
    {postingStats.map((admin) => (
      <div
        key={admin.user_id}
        className="rounded-xl border p-5"
      >
        <p className="break-all font-bold text-gray-900">
          {admin.email}
        </p>

        <p className="mb-4 text-sm text-gray-500">
          {admin.role === "super_admin"
            ? "Super Admin"
            : "Admin"}
        </p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Total Postings", admin.total_posts],
            ["Jobs", admin.jobs],
            ["Scholarships", admin.scholarships],
            ["Grants", admin.grants],
            ["Fellowships", admin.fellowships],
            ["Posts Today", admin.posts_today],
            ["This Month", admin.posts_this_month],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg bg-blue-50 p-4"
            >
              <p className="text-sm text-gray-600">
                {label}
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-700">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

  {postingStats.length === 0 && (
    <p className="text-sm text-gray-500">
      No admin posting statistics available.
    </p>
  )}
</section>
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">
            All Administrators ({admins.length})
          </h2>

          <div className="space-y-4">
            {admins.map((admin) => (
              <div
                key={admin.user_id}
                className="flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <p className="break-all font-semibold">
                    {admin.email}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Added:{" "}
                    {new Date(admin.created_at).toLocaleDateString()}
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                    {admin.role === "super_admin"
                      ? "Super Admin"
                      : "Admin"}
                  </span>
                </div>

                {admin.role === "admin" ? (
                  <button
                    disabled={busy}
                    onClick={() => removeAdmin(admin)}
                    className="rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Remove Access
                  </button>
                ) : (
                  <span className="text-sm font-semibold text-green-700">
                    Protected Account
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}