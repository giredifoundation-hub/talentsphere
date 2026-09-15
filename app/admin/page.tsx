"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Opportunity = {
  id: number;
  title: string;
  organization: string;
  category: string;
  location: string;
  deadline: string;
  description: string;
  requirements: string;
  applicationLink: string;
};

const emptyForm = {
  title: "",
  organization: "",
  category: "Jobs",
  location: "",
  deadline: "",
  description: "",
  requirements: "",
  applicationLink: "",
};

export default function AdminPage() {
  const router = useRouter();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // CHECK LOGIN
  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      await loadOpportunities();
      setLoading(false);
    }

    checkUser();
  }, [router]);

  // LOAD OPPORTUNITIES FROM SUPABASE
  async function loadOpportunities() {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Load opportunities error:", error);
      saveMessage("Error loading opportunities: " + error.message);
      return;
    }

    const formatted: Opportunity[] = (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      organization: item.organization,
      category: item.category,
      location: item.location,
      deadline: item.deadline,
      description: item.description,
      requirements: item.requirements,
      applicationLink: item.application_link,
    }));

    setOpportunities(formatted);
  }

  // HANDLE FORM INPUT
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // MESSAGE
  function saveMessage(text: string) {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  // ADD OR UPDATE OPPORTUNITY
  async function publishOpportunity(e: React.FormEvent) {
    e.preventDefault();

    // UPDATE EXISTING
    if (editingId !== null) {
      const { error } = await supabase
        .from("opportunities")
        .update({
          title: form.title,
          organization: form.organization,
          category: form.category,
          location: form.location,
          deadline: form.deadline,
          description: form.description,
          requirements: form.requirements,
          application_link: form.applicationLink,
        })
        .eq("id", editingId);

      if (error) {
        console.error("Update error:", error);
        saveMessage("Error updating opportunity: " + error.message);
        return;
      }

      setEditingId(null);
      setForm(emptyForm);

      await loadOpportunities();

      saveMessage("Opportunity updated successfully!");
      return;
    }

    // ADD NEW OPPORTUNITY
    const { error } = await supabase
      .from("opportunities")
      .insert({
        title: form.title,
        organization: form.organization,
        category: form.category,
        location: form.location,
        deadline: form.deadline,
        description: form.description,
        requirements: form.requirements,
        application_link: form.applicationLink,
      });

    if (error) {
      console.error("Insert error:", error);
      saveMessage("Error publishing opportunity: " + error.message);
      return;
    }

    setForm(emptyForm);

    // RELOAD DIRECTLY FROM DATABASE
    await loadOpportunities();

    saveMessage("Opportunity published successfully!");
  }

  // EDIT
  function editOpportunity(opportunity: Opportunity) {
    setEditingId(opportunity.id);

    setForm({
      title: opportunity.title,
      organization: opportunity.organization,
      category: opportunity.category,
      location: opportunity.location,
      deadline: opportunity.deadline,
      description: opportunity.description,
      requirements: opportunity.requirements,
      applicationLink: opportunity.applicationLink,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // CANCEL EDIT
  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  // DELETE
  async function deleteOpportunity(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      saveMessage("Error deleting opportunity: " + error.message);
      return;
    }

    // RELOAD FROM DATABASE
    await loadOpportunities();

    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }

    saveMessage("Opportunity deleted successfully!");
  }

  // LOGOUT
  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">
          Loading Admin Dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-blue-700 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              TalentSphere
            </h1>

            <p className="text-sm text-blue-100">
              Admin Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700"
            >
              View Website
            </a>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* DASHBOARD SUMMARY */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Published Opportunities
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {opportunities.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Website
            </p>

            <p className="mt-2 font-bold">
              TalentSphere
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Status
            </p>

            <p className="mt-2 font-bold text-green-600">
              Active
            </p>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 font-medium text-green-700">
            {message}
          </div>
        )}

        {/* FORM */}
        <section className="rounded-xl border bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {editingId !== null
                  ? "Edit Opportunity"
                  : "Add New Opportunity"}
              </h2>

              <p className="mt-2 text-gray-600">
                {editingId !== null
                  ? "Update the opportunity details below."
                  : "Publish a new opportunity to TalentSphere."}
              </p>
            </div>

            {editingId !== null && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={publishOpportunity}
            className="mt-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* TITLE */}
              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold">
                  Opportunity Title
                </label>

                <input
                  required
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Programme Officer"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              {/* ORGANIZATION */}
              <div>
                <label className="mb-2 block font-semibold">
                  Organization
                </label>

                <input
                  required
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="e.g. UNICEF"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block font-semibold">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option>Jobs</option>
                  <option>Grants</option>
                  <option>Scholarships</option>
                  <option>Fellowships</option>
                  <option>Internships</option>
                  <option>Training</option>
                  <option>Other Opportunities</option>
                </select>
              </div>

              {/* LOCATION */}
              <div>
                <label className="mb-2 block font-semibold">
                  Location
                </label>

                <input
                  required
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Nigeria / Remote"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              {/* DEADLINE */}
              <div>
                <label className="mb-2 block font-semibold">
                  Application Deadline
                </label>

                <input
                  required
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold">
                  Description
                </label>

                <textarea
                  required
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Write an original description..."
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              {/* REQUIREMENTS */}
              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold">
                  Requirements / Eligibility
                </label>

                <textarea
                  required
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Enter requirements and eligibility..."
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              {/* APPLICATION LINK */}
              <div className="md:col-span-2">
                <label className="mb-2 block font-semibold">
                  Official Application Link
                </label>

                <input
                  required
                  type="url"
                  name="applicationLink"
                  value={form.applicationLink}
                  onChange={handleChange}
                  placeholder="https://example.org/apply"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />

                <p className="mt-2 text-sm text-gray-500">
                  Use the official application website whenever possible.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-lg bg-blue-700 px-6 py-4 text-lg font-bold text-white hover:bg-blue-800"
            >
              {editingId !== null
                ? "Update Opportunity"
                : "Publish Opportunity"}
            </button>
          </form>
        </section>

        {/* PUBLISHED OPPORTUNITIES */}
        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Published Opportunities
            </h2>

            <p className="mt-2 text-gray-600">
              Manage opportunities currently published on TalentSphere.
            </p>
          </div>

          {opportunities.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center">
              <p className="text-gray-500">
                No opportunities have been published yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <article
                  key={opportunity.id}
                  className="rounded-xl border bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row">
                    <div>
                      <span className="text-sm font-semibold text-blue-700">
                        {opportunity.category}
                      </span>

                      <h3 className="mt-2 text-xl font-bold">
                        {opportunity.title}
                      </h3>

                      <p className="mt-1 text-gray-600">
                        {opportunity.organization}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>
                          📍 {opportunity.location}
                        </span>

                        <span>
                          📅 {opportunity.deadline}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          editOpportunity(opportunity)
                        }
                        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteOpportunity(opportunity.id)
                        }
                        className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}