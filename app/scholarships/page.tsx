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

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadScholarships() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("category", "Scholarships")
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

      setScholarships(formatted);
    }

    loadScholarships();
  }, []);

  const filteredScholarships = scholarships.filter((scholarship) => {
    const term = search.toLowerCase();

    return (
      scholarship.title.toLowerCase().includes(term) ||
      scholarship.organization.toLowerCase().includes(term) ||
      scholarship.location.toLowerCase().includes(term)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
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

      <section className="bg-blue-700 px-6 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold md:text-5xl">
            Scholarship Opportunities
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Discover scholarships and education funding opportunities from
            universities, organizations, and institutions.
          </p>

          <div className="mt-8 max-w-3xl">
            <input
              type="text"
              placeholder="Search scholarships..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border bg-white px-5 py-4 text-gray-900 outline-none focus:border-blue-300"
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">
              Latest Scholarships
            </h2>

            <p className="mt-2 text-gray-600">
              Browse available scholarship opportunities.
            </p>
          </div>

          {filteredScholarships.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-bold">
                No scholarships found
              </h3>

              <p className="mt-2 text-gray-600">
                {search
                  ? "Try a different search term."
                  : "There are currently no scholarship opportunities available."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {scholarship.category}
                  </span>

                  <h3 className="mt-5 text-xl font-bold">
                    {scholarship.title}
                  </h3>

                  <p className="mt-2 font-semibold text-gray-700">
                    {scholarship.organization}
                  </p>

                  <p className="mt-4 text-sm text-gray-600">
                    📍 {scholarship.location}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    📅 Deadline: {scholarship.deadline}
                  </p>

                  <div className="mt-6">
                    <a
                      href={`/opportunity/${scholarship.id}`}
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

      <footer className="bg-gray-900 px-6 py-10 text-center text-gray-400">
        <p>© 2026 TalentSphere. All rights reserved.</p>
      </footer>
    </main>
  );
}