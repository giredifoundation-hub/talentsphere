import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Opportunity = {
  id: number;
  title: string;
  organization: string;
  category: string;
  location: string;
  deadline: string;
  description: string;
  requirements: string;
  application_link: string;
};

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: opportunity, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !opportunity) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold">
            Opportunity Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            This opportunity may have been removed or is no longer available.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white"
          >
            ← Back to Homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-700"
          >
            TalentSphere
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            ← Back to Opportunities
          </Link>
        </div>
      </header>

      {/* Opportunity */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-10">

            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {opportunity.category}
            </span>

            <h1 className="mt-6 text-3xl font-bold md:text-4xl">
              {opportunity.title}
            </h1>

            <p className="mt-3 text-xl font-semibold text-gray-700">
              {opportunity.organization}
            </p>

            <div className="mt-6 grid gap-4 border-y py-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="mt-1 font-semibold">
                  📍 {opportunity.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="mt-1 font-semibold">
                  📅 {opportunity.deadline}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold">
                Description
              </h2>

              <div className="mt-4 whitespace-pre-line leading-7 text-gray-700">
                {opportunity.description}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold">
                Requirements / Eligibility
              </h2>

              <div className="mt-4 whitespace-pre-line leading-7 text-gray-700">
                {opportunity.requirements}
              </div>
            </div>

            <div className="mt-10 border-t pt-8">
              <a
                href={opportunity.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-blue-700 px-6 py-4 text-center text-lg font-bold text-white hover:bg-blue-800"
              >
                Apply on Official Website →
              </a>

              <p className="mt-3 text-center text-sm text-gray-500">
                TalentSphere does not collect application fees.
                Always verify information on the official organization website.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}