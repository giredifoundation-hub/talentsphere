
"use client";
import { pdf } from "@react-pdf/renderer";
import TalentSpherePDF from "./TalentSpherePDF";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CVData = {
  profile: {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string | null;
    portfolio: string | null;
    target_job_title: string;
  };
  generation: {
    professional_summary: string;
    experience: {
      jobTitle: string;
      company: string;
      bullets: string[];
    }[];
    skills: string[];
    cover_letter: string;
  };
   workExperiences: {
    job_title: string | null;
    company: string | null;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    current: boolean;
    description: string | null;
  }[];

  referees: {
    full_name: string;
    position: string;
    organization: string;
    email: string;
    phone: string;
  }[];
  education: {
    qualification: string;
    institution: string;
    field_of_study: string;
    start_year: string;
    graduation_year: string;
  }[];
  certifications: {
    name: string;
    organization: string;
    date: string;
  }[];
  projects: {
    name: string;
    description: string;
    link: string;
  }[];
  languages: {
    language: string;
    level: string;
  }[];
};

export default function CVPreviewPage() {
  const [cv, setCv] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCV() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("Please log in to view your CV.");
        }

const paymentReference = sessionStorage.getItem(
  "pendingCvPaymentReference"
);

if (
  paymentReference &&
  !/^ts_cv_[0-9a-f-]{36}$/.test(paymentReference)
) {
  throw new Error("Invalid CV payment reference.");
}


const generationQuery = supabase
  .from("cv_generations")
  .select("*")
  .eq("user_id", user.id);

const { data: generation, error: genError } =
  paymentReference
    ? await generationQuery
        .eq("payment_reference", paymentReference)
        .maybeSingle()
    : await generationQuery
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();


        if (genError || !generation) {
          throw new Error("No generated CV was found.");
        }

        const profileId = generation.cv_profile_id;

        const [
  profileResult,
  educationResult,
  certificationResult,
  projectResult,
  languageResult,
  experienceResult,
  refereeResult,
] = await Promise.all([
          supabase
            .from("cv_profiles")
            .select("*")
            .eq("id", profileId)
            .eq("user_id", user.id)
            .single(),

          supabase
            .from("cv_education")
            .select("*")
            .eq("cv_profile_id", profileId),

          supabase
            .from("cv_certifications")
            .select("*")
            .eq("cv_profile_id", profileId),

          supabase
            .from("cv_projects")
            .select("*")
            .eq("cv_profile_id", profileId),

          supabase
            .from("cv_languages")
            .select("*")
            .eq("cv_profile_id", profileId),
       supabase
  .from("cv_experiences")
  .select("*")
  .eq("cv_profile_id", profileId),

supabase
  .from("cv_referees")
  .select("*")
  .eq("cv_profile_id", profileId)
  .order("created_at", { ascending: true }),
          ]);

        if (
          profileResult.error ||
          !profileResult.data ||
          educationResult.error ||
          certificationResult.error ||
          projectResult.error ||
          languageResult.error
          || experienceResult.error
|| refereeResult.error
        ) {
          throw new Error(
            "Could not load complete CV information."
          );
        }

        setCv({
          profile: profileResult.data,
          generation,
          education: educationResult.data || [],
          certifications: certificationResult.data || [],
          projects: projectResult.data || [],
          languages: languageResult.data || [],
          workExperiences: experienceResult.data || [],
referees: refereeResult.data || [],
        });
        if (
  paymentReference &&
  generation.payment_reference === paymentReference
) {
  sessionStorage.removeItem("pendingCvPaymentReference");
  sessionStorage.removeItem("pendingCvProfileId");
  sessionStorage.removeItem("pendingCvPaymentUrl");
  sessionStorage.removeItem("talentsphereCvPaymentDraft");

  console.log("Completed CV payment session cleared.");
}
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load your CV."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCV();
  }, []);

  if (loading) {
    return (
      <main className="p-10 text-center">
        Loading your professional CV...
      </main>
    );
  }

  if (error || !cv) {
    return (
      <main className="p-10 text-center text-red-600">
        {error || "CV not found."}
      </main>
    );
  }

  const { profile, generation } = cv;
const downloadPDF = async (
  type: "cv" | "letter" | "both"
) => {
  try {
    const experiences = cv.generation.experience.map(
      (item, index) => {
        const saved = cv.workExperiences[index];

        return {
          jobTitle: item.jobTitle,
          company: item.company,
          bullets: item.bullets ?? [],
          location: saved?.location ?? null,
          startDate: saved?.start_date
            ? formatDate(saved.start_date)
            : null,
          endDate: saved?.end_date
            ? formatDate(saved.end_date)
            : null,
          current: saved?.current ?? false,
        };
      }
    );

    const pdfDocument = (
  <TalentSpherePDF
        type={type}
        fullName={cv.profile.full_name}
        email={cv.profile.email}
        phone={cv.profile.phone}
        location={cv.profile.location}
        linkedin={cv.profile.linkedin}
        portfolio={cv.profile.portfolio}
        jobTitle={cv.profile.target_job_title}
        professionalSummary={
          cv.generation.professional_summary
        }
        experiences={experiences}
        education={cv.education}
        certifications={cv.certifications}
        projects={cv.projects}
        languages={cv.languages}
        referees={cv.referees}
        skills={cv.generation.skills ?? []}
        coverLetter={cv.generation.cover_letter}
      />
    );

    const blob = await pdf(pdfDocument).toBlob();
    const url = URL.createObjectURL(blob);

    const filename =
      type === "cv"
        ? "TalentSphere-CV.pdf"
        : type === "letter"
          ? "TalentSphere-Cover-Letter.pdf"
          : "TalentSphere-CV-and-Cover-Letter.pdf";

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

       setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    console.error("PDF download failed:", error);
    alert("Unable to download PDF. Please try again.");
  }
};

const sectionTitle =
    "mb-3 border-b border-gray-400 pb-1 text-sm font-bold uppercase tracking-wider text-gray-900";

  const letterDate = new Date().toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
const formatDate = (date: string | null) => {
  if (!date) return "";

  const parsed = new Date(`${date.slice(0, 7)}-01T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
};
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-[850px] space-y-8">

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold">
            TalentSphere AI Documents
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Review your CV and cover letter carefully
            before submitting them to an employer.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
  <button
    type="button"
    onClick={() => void downloadPDF("cv")}
    className="rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
  >
    Download CV Only
  </button>

  <button
    type="button"
    onClick={() => void downloadPDF("letter")}
    className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
  >
    Download Cover Letter Only
  </button>

  <button
    type="button"
    onClick={() => void downloadPDF("both")}
    className="rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800"
  >
    Download CV + Cover Letter
  </button>
</div>
        </div>

       {/* PROFESSIONAL CV */}
<article
  id="talentsphere-cv"
  className="bg-white px-7 py-10 shadow-md sm:px-12 sm:py-14"
>

          <header className="border-b-2 border-gray-900 pb-5 text-center">
            <h2 className="text-3xl font-bold uppercase tracking-wide">
              {profile.full_name}
            </h2>

            <p className="mt-2 text-base font-semibold">
              {profile.target_job_title}
            </p>

            <p className="mt-3 text-sm leading-6">
              {[
                profile.location,
                profile.phone,
                profile.email,
              ]
                .filter(Boolean)
                .join(" | ")}
            </p>

            {profile.linkedin && (
              <p className="break-all text-sm">
                {profile.linkedin}
              </p>
            )}

            {profile.portfolio && (
              <p className="break-all text-sm">
                {profile.portfolio}
              </p>
            )}
          </header>

          <section className="mt-7">
            <h3 className={sectionTitle}>
              Professional Summary
            </h3>

            <p className="text-sm leading-7">
              {generation.professional_summary}
            </p>
          </section>

          {generation.experience?.length > 0 && (
            <section className="mt-7">
              <h3 className={sectionTitle}>
                Professional Experience
              </h3>

              <div className="space-y-5">
                {generation.experience.map((item, index) => (
                  <div key={index}>
                    <h4 className="font-bold">
                      {item.jobTitle}
                    </h4>

                    <p className="text-sm font-medium">
                      {item.company}
                    </p>
{(() => {
  const saved = cv.workExperiences[index];

  if (!saved) return null;

  const period = [
    formatDate(saved.start_date),
    saved.current
      ? "Present"
      : formatDate(saved.end_date),
  ]
    .filter(Boolean)
    .join(" – ");

  return (
    <div className="mt-1 text-xs text-gray-600">
      {saved.location && <p>{saved.location}</p>}
      {period && <p>{period}</p>}
    </div>
  );
})()}
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                      {item.bullets?.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cv.education.length > 0 && (
            <section className="mt-7">
              <h3 className={sectionTitle}>
                Education
              </h3>

              <div className="space-y-4">
                {cv.education.map((item, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">
                      {item.qualification}
                    </h4>

                    <p className="text-sm">
                      {item.institution}
                    </p>

                    {item.field_of_study && (
                      <p className="text-sm">
                        {item.field_of_study}
                      </p>
                    )}

                    <p className="text-xs text-gray-600">
                      {[
                        item.start_year,
                        item.graduation_year,
                      ]
                        .filter(Boolean)
                        .join(" – ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {generation.skills?.length > 0 && (
            <section className="mt-7">
              <h3 className={sectionTitle}>
                Core Skills
              </h3>

              <ul className="grid list-disc gap-x-6 gap-y-2 pl-5 text-sm sm:grid-cols-2">
                {generation.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {cv.certifications.length > 0 && (
            <section className="mt-7">
              <h3 className={sectionTitle}>
                Certifications
              </h3>

              {cv.certifications.map((item, index) => (
                <div key={index} className="mb-3 text-sm">
                  <p className="font-semibold">
                    {item.name}
                  </p>
                  <p>
                    {[item.organization, item.date]
                      .filter(Boolean)
                      .join(" | ")}
                  </p>
                </div>
              ))}
            </section>
          )}

          {cv.projects.length > 0 && (
            <section className="mt-7">
              <h3 className={sectionTitle}>
                Projects
              </h3>

              {cv.projects.map((item, index) => (
                <div key={index} className="mb-4 text-sm">
                  <h4 className="font-semibold">
                    {item.name}
                  </h4>

                  <p className="mt-1 leading-6">
                    {item.description}
                  </p>

                  {item.link && (
                    <p className="mt-1 break-all text-blue-700">
                      {item.link}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

          {cv.languages.length > 0 && (
            <section className="mt-7">
              <h3 className={sectionTitle}>
                Languages
              </h3>

              <ul className="list-disc pl-5 text-sm">
                {cv.languages.map((item, index) => (
                  <li key={index}>
                    {item.language}
                    {item.level ? ` — ${item.level}` : ""}
                  </li>
                ))}
              </ul>
                </section>
)}
              <section className="mt-7">
  <h3 className={sectionTitle}>
    References
  </h3>

  {cv.referees.length === 0 ? (
    <p className="text-sm">
      Available upon Request
    </p>
  ) : (
    <div className="grid gap-5 sm:grid-cols-2">
      {cv.referees.map((referee, index) => (
        <div key={index} className="text-sm leading-6">
          <p className="font-bold">
            {referee.full_name}
          </p>
          <p>{referee.position}</p>
          <p>{referee.organization}</p>
          <p>{referee.email}</p>
          <p>{referee.phone}</p>
        </div>
      ))}
    </div>
  )}
</section>
        </article>


{/* COVER LETTER */}
<article
  id="talentsphere-cover-letter"
  className="bg-white px-7 py-10 text-gray-900 shadow-md sm:px-12 sm:py-14"
>

  <h2 className="mb-10 border-b pb-3 text-xl font-bold">
    Professional Cover Letter
  </h2>

  {/* SENDER ADDRESS - RIGHT */}
  <div className="flex justify-end">
    <div className="max-w-[65%] text-left text-sm leading-7">
      <p className="font-bold">
        {profile.full_name}
      </p>
      <p>{profile.location}</p>
      <p>{profile.phone}</p>
      <p>{profile.email}</p>
      <p className="mt-3">{letterDate}</p>
    </div>
  </div>

  {/* RECEIVER ADDRESS - LEFT */}
  <div className="mt-10 text-sm leading-7">
    <p className="font-semibold">
      The Hiring Manager
    </p>
    <p>Recruitment Department</p>
  </div>

  {/* SALUTATION */}
  <p className="mt-8 text-sm">
    Dear Hiring Manager,
  </p>

  {/* SUBJECT */}
  <h3 className="mt-7 text-center text-sm font-bold uppercase underline">
    Application for the Position of{" "}
    {profile.target_job_title}
  </h3>

  {/* AI GENERATED LETTER BODY */}
  <div className="mt-8 whitespace-pre-line text-justify text-sm leading-8">
    {generation.cover_letter
  ?.replace(
    /\n\s*(Yours sincerely|Yours faithfully|Sincerely|Best regards|Kind regards|Regards)[\s\S]*$/i,
    ""
  )
  .trim()}
  </div>

  {/* CLOSING */}
  <div className="mt-10 text-sm leading-7">
    <p>Yours faithfully,</p>
    <p className="mt-5 font-bold">
      {profile.full_name}
    </p>
  </div>

</article>

      </div>
    </main>
  );
}
