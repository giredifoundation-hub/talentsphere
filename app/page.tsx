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

export default function Home() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadOpportunities() {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
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

      setOpportunities(formatted);
    }

    loadOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const term = search.toLowerCase();

    return (
      opportunity.title.toLowerCase().includes(term) ||
      opportunity.organization.toLowerCase().includes(term) ||
      opportunity.category.toLowerCase().includes(term) ||
      opportunity.location.toLowerCase().includes(term)
    );
  });

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center">
  <img
    src="/logo.jpeg"
    alt="TalentSphere - Job Opportunities"
    className="h-14 w-auto object-contain"
  />
</a>

          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="/" className="text-blue-700">
              Home
            </a>

            <a href="/jobs" className="hover:text-blue-700">
              Jobs
            </a>

            <a href="/grants" className="hover:text-blue-700">
              Grants
            </a>

            <a href="/scholarships" className="hover:text-blue-700">
              Scholarships
            </a>

            <a href="/fellowships" className="hover:text-blue-700">
              Fellowships
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-blue-700 px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold md:text-5xl">
            Discover Your Next Opportunity
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
            Find jobs, grants, scholarships, fellowships, internships,
            trainings and other opportunities from around the world.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-xl border-2 border-white bg-white px-5 py-4 text-gray-900 shadow-lg outline-none placeholder:text-gray-500 focus:border-gray-200"
            />

            <button
              type="button"
              className="rounded-lg bg-white px-7 py-4 font-semibold text-blue-700 hover:bg-gray-100"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-center text-3xl font-bold">
          Explore Opportunities
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Jobs */}
          <a
            href="/jobs"
            className="rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-4xl">💼</div>

            <h3 className="mt-4 text-xl font-bold">
              Jobs
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Find local and international jobs
            </p>
          </a>

          {/* Grants */}
          <a
            href="/grants"
            className="rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-4xl">💰</div>

            <h3 className="mt-4 text-xl font-bold">
              Grants
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Discover funding opportunities
            </p>
          </a>

          {/* Scholarships */}
          <a
            href="/scholarships"
            className="rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-4xl">🎓</div>

            <h3 className="mt-4 text-xl font-bold">
              Scholarships
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Find scholarships for education
            </p>
          </a>

          {/* Fellowships */}
          <a
            href="/fellowships"
            className="rounded-xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-4xl">🌍</div>

            <h3 className="mt-4 text-xl font-bold">
              Fellowships
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Explore fellowship opportunities
            </p>
          </a>
        </div>
      </section>

      {/* Latest Opportunities */}
      <section className="bg-gray-50 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Latest Opportunities
              </h2>

              <p className="mt-2 text-gray-600">
                Recently published opportunities
              </p>
            </div>

            <a
              href="/jobs"
              className="font-semibold text-blue-700 hover:underline"
            >
              View All →
            </a>
          </div>

          {filteredOpportunities.length === 0 ? (
            <div className="mt-8 rounded-xl border bg-white p-10 text-center">
              <div className="text-4xl">📢</div>

              <h3 className="mt-4 text-xl font-bold">
                No opportunities published yet
              </h3>

              <p className="mt-2 text-gray-600">
                New opportunities will appear here when they are published.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredOpportunities.map((opportunity) => (
                <a
                  key={opportunity.id}
                  href={`/opportunity/${opportunity.id}`}
                  className="block rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="text-sm font-semibold text-blue-700">
                    {opportunity.category}
                  </span>

                  <h3 className="mt-3 text-xl font-bold">
                    {opportunity.title}
                  </h3>

                  <p className="mt-2 font-medium text-gray-700">
                    {opportunity.organization}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>📍 {opportunity.location}</p>
                    <p>📅 Deadline: {opportunity.deadline}</p>
                  </div>

                  <span className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white">
                    View Opportunity →
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold">
            OPPORTUNITY SPHERE
          </h2>

          <p className="mt-2 text-gray-400">
            Connecting people with opportunities.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm text-gray-400">
            <a href="/about" className="hover:text-white">
              About Us
            </a>

            <a href="/contact" className="hover:text-white">
              Contact
            </a>

            <a href="/privacy" className="hover:text-white">
              Privacy Policy
            </a>

            <a href="/terms" className="hover:text-white">
              Terms & Conditions
            </a>

            <a href="/disclaimer" className="hover:text-white">
              Disclaimer
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            © 2026 OPPORTUNITY SPHERE. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}