"use client";

import { useEffect, useState } from "react";
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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadJobs() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("category", "Jobs")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
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

      setJobs(formatted);
    }

    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
  const term = search.toLowerCase().trim();

  return (
    job.title.toLowerCase().includes(term) ||
    job.organization.toLowerCase().includes(term) ||
    job.location.toLowerCase().includes(term) ||
    job.category.toLowerCase().includes(term) ||
    job.description.toLowerCase().includes(term)
  );
});

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="text-2xl font-bold text-blue-700">
            TalentSphere
          </a>

          <a
            href="/"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-blue-700 px-6 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold md:text-5xl">
            Job Opportunities
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Discover the latest job opportunities and career openings from
            organizations and employers.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-3xl">
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border bg-white px-5 py-4 text-gray-900 outline-none focus:border-blue-300"
            />
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Latest Jobs</h2>

            <p className="mt-2 text-gray-600">
              Browse available job opportunities.
            </p>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-bold">
                No jobs found
              </h3>

              <p className="mt-2 text-gray-600">
                {search
                  ? "Try a different search term."
                  : "There are currently no job opportunities available."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Category */}
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {job.category}
                  </span>

                  {/* Title */}
                  <h3 className="mt-5 text-xl font-bold">
                    {job.title}
                  </h3>

                  {/* Organization */}
                  <p className="mt-2 font-semibold text-gray-700">
                    {job.organization}
                  </p>

                  {/* Location */}
                  <p className="mt-4 text-sm text-gray-600">
                    📍 {job.location}
                  </p>

                  {/* Deadline */}
                  <p className="mt-2 text-sm text-gray-600">
                    📅 Deadline: {job.deadline}
                  </p>

                  {/* Button */}
                  <div className="mt-6">
                    <a
                      href={`/opportunity/${job.id}`}
                      className="inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                    >
                      View Opportunity
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}