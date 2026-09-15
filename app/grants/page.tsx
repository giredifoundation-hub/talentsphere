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

export default function GrantsPage() {
  const [grants, setGrants] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadGrants() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("category", "Grants")
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

      setGrants(formatted);
    }

    loadGrants();
  }, []);

  const filteredGrants = grants.filter((grant) => {
    const term = search.toLowerCase();

    return (
      grant.title.toLowerCase().includes(term) ||
      grant.organization.toLowerCase().includes(term) ||
      grant.location.toLowerCase().includes(term)
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
            Grant Opportunities
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Discover the latest grants and funding opportunities from
            organizations and institutions.
          </p>

          <div className="mt-8 max-w-3xl">
            <input
              type="text"
              placeholder="Search grants..."
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
            <h2 className="text-3xl font-bold">Latest Grants</h2>

            <p className="mt-2 text-gray-600">
              Browse available grant opportunities.
            </p>
          </div>

          {filteredGrants.length === 0 ? (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <h3 className="text-xl font-bold">
                No grants found
              </h3>

              <p className="mt-2 text-gray-600">
                {search
                  ? "Try a different search term."
                  : "There are currently no grant opportunities available."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGrants.map((grant) => (
                <div
                  key={grant.id}
                  className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {grant.category}
                  </span>

                  <h3 className="mt-5 text-xl font-bold">
                    {grant.title}
                  </h3>

                  <p className="mt-2 font-semibold text-gray-700">
                    {grant.organization}
                  </p>

                  <p className="mt-4 text-sm text-gray-600">
                    📍 {grant.location}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    📅 Deadline: {grant.deadline}
                  </p>

                  <div className="mt-6">
                    <a
                      href={`/opportunity/${grant.id}`}
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