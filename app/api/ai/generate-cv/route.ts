import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import { checkAiRateLimit } from "@/lib/ai-rate-limit";
import { getAuthenticatedUser } from "@/lib/auth-server";
import OpenAI from "openai";
export const maxDuration = 90;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000,
  maxRetries: 0,
});

type GeneratedCV = {
  professionalSummary: string;
  experience: {
    jobTitle: string;
    company: string;
    bullets: string[];
  }[];
  skills: string[];
  atsKeywords: string[];
  missingSkills: string[];
  coverLetter: string;
};

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Please log in before generating your CV.",
        },
        { status: 401 }
      );
    }

    const MAX_BODY_BYTES = 100_000;

const reader = request.body?.getReader();

if (!reader) {
  return Response.json(
    {
      success: false,
      error: "Request body is missing.",
    },
    { status: 400 }
  );
}

const chunks: Uint8Array[] = [];
let totalBytes = 0;

while (true) {
  const { done, value } = await reader.read();

  if (done) break;

  totalBytes += value.byteLength;

  if (totalBytes > MAX_BODY_BYTES) {
    await reader.cancel();

    return Response.json(
      {
        success: false,
        error: "CV information is too large. Please shorten your content.",
      },
      { status: 413 }
    );
  }

  chunks.push(value);
}

const rawBody = Buffer.concat(chunks).toString("utf8");

let body: Record<string, unknown>;

try {
  const parsed: unknown = JSON.parse(rawBody);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Invalid JSON object");
  }

  body = parsed as Record<string, unknown>;
} catch {
  return Response.json(
    {
      success: false,
      error: "Invalid JSON request body.",
    },
    { status: 400 }
  );
}

    const {
      fullName,
      email,
      phone,
      location,
      linkedin,
      portfolio,
      skills,
      targetJobTitle,
      jobDescription,
      experiences,
      education,
      certifications,
      projects,
      languages,
      paymentReference,
      cvProfileId,
    } = body;

if (
  typeof paymentReference !== "string" ||
  !/^ts_cv_[0-9a-f-]{36}$/.test(paymentReference)
) {
  return Response.json(
    {
      success: false,
      error: "A valid CV Builder payment reference is required.",
    },
    { status: 402 }
  );
}
if (
  typeof cvProfileId !== "string" ||
  !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    cvProfileId
  )
) {
  return Response.json(
    {
      success: false,
      error: "A valid CV profile ID is required.",
    },
    { status: 400 }
  );
}
    if (
  typeof fullName !== "string" ||
  !fullName.trim() ||
  typeof email !== "string" ||
  !email.trim() ||
  typeof targetJobTitle !== "string" ||
  !targetJobTitle.trim() ||
  typeof jobDescription !== "string" ||
  !jobDescription.trim()
) {
      return Response.json(
        {
          success: false,
          error: "Required CV information is missing.",
        },
        { status: 400 }
      );
    }

    if (
  fullName.length > 150 ||
  email.length > 254 ||
  targetJobTitle.length > 200 ||
  jobDescription.length > 20000
) {
      return Response.json(
        {
          success: false,
          error: "Invalid or excessively long job description.",
        },
        { status: 400 }
      );
    }
    const arrayFields = [
  "experiences",
  "education",
  "certifications",
  "projects",
  "languages",
] as const;

for (const field of arrayFields) {
  const value = body[field];

  if (value !== undefined && value !== null) {
    if (!Array.isArray(value) || value.length > 50) {
      return Response.json(
        {
          success: false,
          error: `Invalid ${field}. Maximum 50 entries allowed.`,
        },
        { status: 400 }
      );
    }
  }
}
if (
  skills !== undefined &&
  skills !== null &&
  (typeof skills !== "string" || skills.length > 5000)
) {
  return Response.json(
    {
      success: false,
      error: "Invalid skills. Maximum 5000 characters allowed.",
    },
    { status: 400 }
  );
}
const optionalTextFields = [
  "phone",
  "location",
  "linkedin",
  "portfolio",
] as const;

for (const field of optionalTextFields) {
  const value = body[field];

  if (value !== undefined && value !== null) {
    if (typeof value !== "string" || value.length > 500) {
      return Response.json(
        {
          success: false,
          error: `Invalid ${field}. Maximum 500 characters allowed.`,
        },
        { status: 400 }
      );
    }
  }
}
if (Array.isArray(experiences)) {
  const experienceTextFields = [
    "jobTitle",
    "company",
    "location",
    "startDate",
    "endDate",
    "description",
  ] as const;

  for (const experience of experiences) {
    if (
      !experience ||
      typeof experience !== "object" ||
      Array.isArray(experience)
    ) {
      return Response.json(
        {
          success: false,
          error: "Invalid work experience entry.",
        },
        { status: 400 }
      );
    }

    for (const field of experienceTextFields) {
      if (
        typeof experience[field] !== "string" ||
        experience[field].length > 5000
      ) {
        return Response.json(
          {
            success: false,
            error: `Invalid experience ${field}.`,
          },
          { status: 400 }
        );
      }
    }

    if (typeof experience.current !== "boolean") {
      return Response.json(
        {
          success: false,
          error: "Invalid experience current status.",
        },
        { status: 400 }
      );
    }
  }
}
if (Array.isArray(education)) {
  const educationTextFields = [
    "qualification",
    "institution",
    "fieldOfStudy",
    "startYear",
    "graduationYear",
  ] as const;

  for (const entry of education) {
    if (
      !entry ||
      typeof entry !== "object" ||
      Array.isArray(entry)
    ) {
      return Response.json(
        {
          success: false,
          error: "Invalid education entry.",
        },
        { status: 400 }
      );
    }

    for (const field of educationTextFields) {
      if (
        typeof entry[field] !== "string" ||
        entry[field].length > 500
      ) {
        return Response.json(
          {
            success: false,
            error: `Invalid education ${field}.`,
          },
          { status: 400 }
        );
      }
    }
  }
}
if (Array.isArray(certifications)) {
  const certificationTextFields = [
    "name",
    "organization",
    "date",
  ] as const;

  for (const entry of certifications) {
    if (
      !entry ||
      typeof entry !== "object" ||
      Array.isArray(entry)
    ) {
      return Response.json(
        {
          success: false,
          error: "Invalid certification entry.",
        },
        { status: 400 }
      );
    }

    for (const field of certificationTextFields) {
      if (
        typeof entry[field] !== "string" ||
        entry[field].length > 500
      ) {
        return Response.json(
          {
            success: false,
            error: `Invalid certification ${field}.`,
          },
          { status: 400 }
        );
      }
    }
  }
}
if (Array.isArray(projects)) {
  const projectTextFields = [
    "name",
    "description",
    "link",
  ] as const;

  for (const entry of projects) {
    if (
      !entry ||
      typeof entry !== "object" ||
      Array.isArray(entry)
    ) {
      return Response.json(
        {
          success: false,
          error: "Invalid project entry.",
        },
        { status: 400 }
      );
    }

    for (const field of projectTextFields) {
      if (
        typeof entry[field] !== "string" ||
        entry[field].length > 5000
      ) {
        return Response.json(
          {
            success: false,
            error: `Invalid project ${field}.`,
          },
          { status: 400 }
        );
      }
    }
  }
}
if (Array.isArray(languages)) {
  const languageTextFields = [
    "language",
    "level",
  ] as const;

  for (const entry of languages) {
    if (
      !entry ||
      typeof entry !== "object" ||
      Array.isArray(entry)
    ) {
      return Response.json(
        {
          success: false,
          error: "Invalid language entry.",
        },
        { status: 400 }
      );
    }

    for (const field of languageTextFields) {
      if (
        typeof entry[field] !== "string" ||
        entry[field].length > 200
      ) {
        return Response.json(
          {
            success: false,
            error: `Invalid language ${field}.`,
          },
          { status: 400 }
        );
      }
    }
  }
}
const authorization = request.headers.get("authorization")!;
const accessToken = authorization.slice(7).trim();

const allowed = await checkAiRateLimit(accessToken);

if (!allowed) {
  return Response.json(
    {
      success: false,
      error:
        "AI generation limit reached or temporarily unavailable. Please try again later.",
    },
    { status: 429 }
  );
}

const supabaseAdmin = createSupabaseAdminClient();
const reservationId = crypto.randomUUID();

const { data: paymentReserved, error: reservationError } =
  await supabaseAdmin.rpc("reserve_cv_payment", {
    p_user_id: user.id,
    p_reference: paymentReference,
    p_reservation_id: reservationId,
  });

if (reservationError) {
  console.error("CV payment reservation failed:", {
    code: reservationError.code,
  });

  return Response.json(
    {
      success: false,
      error: "Unable to confirm payment. Please try again.",
    },
    { status: 503 }
  );
}

if (paymentReserved !== true) {
  return Response.json(
    {
      success: false,
      error:
        "A verified, unused CV Builder payment is required.",
    },
    { status: 402 }
  );
}
let paymentCompletionStarted = false;

try {
    const candidateData = {
      fullName,
      email,
      phone,
      location,
      linkedin,
      portfolio,
      skills,
      targetJobTitle,
      experiences: Array.isArray(experiences)
        ? experiences
        : [],
      education: Array.isArray(education)
        ? education
        : [],
      certifications: Array.isArray(certifications)
        ? certifications
        : [],
      projects: Array.isArray(projects)
        ? projects
        : [],
      languages: Array.isArray(languages)
        ? languages
        : [],
    };

    const response = await openai.responses.create({
      model: "gpt-6-luna",
      store: false,
      max_output_tokens: 4500,
text: {
  format: {
    type: "json_schema",
    name: "talentsphere_generated_cv",
    strict: true,
    schema: {
      type: "object",
      properties: {
        professionalSummary: {
          type: "string",
        },
        experience: {
          type: "array",
          items: {
            type: "object",
            properties: {
              jobTitle: { type: "string" },
              company: { type: "string" },
              bullets: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "jobTitle",
              "company",
              "bullets",
            ],
            additionalProperties: false,
          },
        },
        skills: {
          type: "array",
          items: { type: "string" },
        },
        atsKeywords: {
          type: "array",
          items: { type: "string" },
        },
        missingSkills: {
          type: "array",
          items: { type: "string" },
        },
        coverLetter: {
          type: "string",
        },
      },
      required: [
        "professionalSummary",
        "experience",
        "skills",
        "atsKeywords",
        "missingSkills",
        "coverLetter",
      ],
      additionalProperties: false,
    },
  },
},
      input: [
        {
          role: "system",
          content: `
You are an expert professional CV writer,
ATS recruitment specialist and career consultant.

Your task is to create a professional,
modern, ATS-friendly CV and tailored cover letter.

IMPORTANT RULES:

1. Use only information supplied by the candidate.
2. Never invent employment history, qualifications,
   certifications, achievements or skills.
3. Improve the candidate's writing professionally.
4. Match the CV to the target job description.
5. Use relevant ATS keywords naturally.
6. Identify skills required by the job that are
   not demonstrated in the candidate's information.
7. Do not claim that missing skills are possessed
   by the candidate.
8. Make the professional summary specific to the role.
9. Write strong, concise experience bullet points.
10. Write a persuasive, professional cover letter body
    consisting of 3 to 4 well-written paragraphs.

    The coverLetter field must contain ONLY the body
    paragraphs.

    Do NOT include:
    - Sender name or address
    - Recipient name or address
    - Date
    - Subject line
    - Dear Hiring Manager or any salutation
    - Yours faithfully, Yours sincerely or signature

    These elements will be added separately by the
    TalentSphere document layout.

    Tailor the letter to the target job description.
    Never invent employer details or candidate achievements.
11. Use clear, professional English.

Return ONLY valid JSON using this exact structure:

{
  "professionalSummary": "Professional summary",
  "experience": [
    {
      "jobTitle": "Job title",
      "company": "Company",
      "bullets": [
        "Achievement or responsibility"
      ]
    }
  ],
  "skills": [
    "Skill 1"
  ],
  "atsKeywords": [
    "Keyword 1"
  ],
  "missingSkills": [
    "Skill the candidate should consider developing"
  ],
  "coverLetter": "Complete tailored cover letter"
}

If no experience is supplied, return an empty
experience array.

Do not add Markdown fences or explanations.
          `,
        },
        {
          role: "user",
          content: `
TARGET JOB DESCRIPTION:

${jobDescription}

CANDIDATE INFORMATION:

${JSON.stringify(candidateData, null, 2)}

Create the tailored CV and cover letter now.
          `,
        },
      ],
    });
if (response.status !== "completed") {
  throw new Error("AI response was not completed.");
}
    const output = response.output_text;

    if (!output) {
      throw new Error("AI returned an empty response.");
    }

    const generatedCV = JSON.parse(output) as GeneratedCV;

    if (
      typeof generatedCV.professionalSummary !== "string" ||
      !Array.isArray(generatedCV.experience) ||
      !Array.isArray(generatedCV.skills) ||
      !Array.isArray(generatedCV.atsKeywords) ||
      !Array.isArray(generatedCV.missingSkills) ||
      typeof generatedCV.coverLetter !== "string"
    ) {
      throw new Error("AI returned an invalid CV structure.");
    }
    const aiStringArrays = [
  generatedCV.skills,
  generatedCV.atsKeywords,
  generatedCV.missingSkills,
];

for (const items of aiStringArrays) {
  if (
    items.length > 100 ||
    items.some(
      (item) =>
        typeof item !== "string" ||
        item.length > 500
    )
  ) {
    throw new Error("AI returned invalid list data.");
  }
}
if (generatedCV.experience.length > 50) {
  throw new Error("AI returned too many experience entries.");
}

for (const entry of generatedCV.experience) {
  if (
    !entry ||
    typeof entry !== "object" ||
    Array.isArray(entry) ||
    typeof entry.jobTitle !== "string" ||
    entry.jobTitle.length > 500 ||
    typeof entry.company !== "string" ||
    entry.company.length > 500 ||
    !Array.isArray(entry.bullets) ||
    entry.bullets.length > 30 ||
    entry.bullets.some(
      (bullet) =>
        typeof bullet !== "string" ||
        bullet.length > 2000
    )
  ) {
    throw new Error("AI returned invalid experience data.");
  }
}
if (
  generatedCV.professionalSummary.length > 10000 ||
  generatedCV.coverLetter.length > 20000
) {
  throw new Error("AI returned excessively long CV text.");
}
   paymentCompletionStarted = true;

const { data: savedGenerationId, error: completionError } =
  await supabaseAdmin.rpc(
    "save_generated_cv_and_complete_payment",
    {
      p_user_id: user.id,
      p_cv_profile_id: cvProfileId,
      p_reference: paymentReference,
      p_reservation_id: reservationId,
      p_professional_summary: generatedCV.professionalSummary,
      p_experience: generatedCV.experience,
      p_skills: generatedCV.skills,
      p_ats_keywords: generatedCV.atsKeywords,
      p_missing_skills: generatedCV.missingSkills,
      p_cover_letter: generatedCV.coverLetter,
    }
  );


if (completionError || !savedGenerationId) {
  console.error("CV payment completion failed:", {
    code: completionError?.code ?? "NOT_COMPLETED",
  });

  return Response.json(
    {
      success: false,
      error:
        "Your CV was generated, but payment finalization could not be confirmed. Please contact support before retrying.",
    },
    { status: 503 }
  );
}

return Response.json({
  success: true,
  message: "AI CV generated successfully.",
  data: generatedCV,
});

} catch (generationError) {
  if (!paymentCompletionStarted) {
    try {
      const { data: released, error: releaseError } =
        await supabaseAdmin.rpc("release_cv_payment", {
          p_user_id: user.id,
          p_reference: paymentReference,
          p_reservation_id: reservationId,
        });

      if (releaseError || released !== true) {
        console.error("CV payment release failed:", {
          code: releaseError?.code ?? "NOT_RELEASED",
        });
      }
    } catch {
      console.error("CV payment release request failed.");
    }
  }

  console.error("CV generation processing failed:", {
    errorType:
      generationError instanceof Error
        ? generationError.name
        : "UnknownError",
  });

  return Response.json(
    {
      success: false,
      error: paymentCompletionStarted
        ? "Payment finalization is uncertain. Please contact support before retrying."
        : "CV generation failed. Your payment may be available for retry. Please contact support if retry is blocked.",
    },
    { status: 503 }
  );
}


  } catch (error) {
    console.error("AI CV generation failed", {
  errorType:
    error instanceof Error ? error.name : "UnknownError",
});

    return Response.json(
      {
        success: false,
        error:
          "Unable to generate your CV. Please try again.",
      },
      { status: 500 }
    );
  }
}
