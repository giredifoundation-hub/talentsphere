"use client";
import Notification, {
  type NotificationType,
} from "@/components/Notification";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Experience = {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

type Education = {
  qualification: string;
  institution: string;
  fieldOfStudy: string;
  startYear: string;
  graduationYear: string;
};

type Certification = {
  name: string;
  organization: string;
  date: string;
};

type Project = {
  name: string;
  description: string;
  link: string;
};

type Language = {
  language: string;
  level: string;
};
type Referee = {
  fullName: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
};

type CVBuilderDraft = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  experiences: Experience[];
  education: Education[];
  skills: string;
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  jobTitle: string;
  jobDescription: string;
  jobApplicationLink: string;
  referees: Referee[];
  refereeMode: "request" | "provide";
};

const emptyReferee = (): Referee => ({
  fullName: "",
  position: "",
  organization: "",
  email: "",
  phone: "",
});
export default function CVBuilderPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
const [notification, setNotification] = useState<{
  message: string;
  type: NotificationType;
} | null>(null);

const showNotification = (
  message: string,
  type: NotificationType = "info"
) => {
  setNotification({ message, type });
};
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      qualification: "",
      institution: "",
      fieldOfStudy: "",
      startYear: "",
      graduationYear: "",
    },
  ]);

  const [skills, setSkills] = useState("");

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      name: "",
      organization: "",
      date: "",
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      name: "",
      description: "",
      link: "",
    },
  ]);

  const [languages, setLanguages] = useState<Language[]>([
    {
      language: "",
      level: "",
    },
  ]);

  const [jobTitle, setJobTitle] = useState("");
  const [availableJobRoles, setAvailableJobRoles] = useState<string[]>([]);
const [selectedJobRole, setSelectedJobRole] = useState("");
const [roleDescriptions, setRoleDescriptions] = useState<
  { role: string; description: string }[]
>([]);
  const [jobDescription, setJobDescription] = useState("");
const [jobApplicationLink, setJobApplicationLink] = useState("");
const [isReadingJob, setIsReadingJob] = useState(false);
const [showReplaceJobModal, setShowReplaceJobModal] = useState(false);
const [showReviewModal, setShowReviewModal] = useState(false);
const [cvProgress, setCvProgress] = useState<
  "idle" | "verifying" | "generating" | "preparing" | "error"
>("idle");
const reviewConfirmedRef = useRef(false);
const [refereeMode, setRefereeMode] = useState<
  "request" | "provide"
>("request");

const [referees, setReferees] = useState<Referee[]>([
  emptyReferee(),
  emptyReferee(),
]);

const saveCVPaymentDraft = () => {
  const draft: CVBuilderDraft = {
    fullName,
    email,
    phone,
    location,
    linkedin,
    portfolio,
    experiences,
    education,
    skills,
    certifications,
    projects,
    languages,
    jobTitle,
    jobDescription,
    jobApplicationLink,
    referees,
    refereeMode,
  };

  try {
    sessionStorage.setItem(
      "talentsphereCvPaymentDraft",
      JSON.stringify(draft)
    );

    return true;
  } catch {
    console.error("Unable to save CV payment draft.");
    return false;
  }
};

useEffect(() => {
  const savedDraft = sessionStorage.getItem(
    "talentsphereCvPaymentDraft"
  );

  if (!savedDraft) return;

  try {
    const draft = JSON.parse(savedDraft) as CVBuilderDraft;

    if (
      !draft ||
      typeof draft !== "object" ||
      typeof draft.fullName !== "string" ||
      typeof draft.email !== "string" ||
      !Array.isArray(draft.experiences) ||
      !Array.isArray(draft.education)
    ) {
      return;
    }

    setFullName(draft.fullName);
    setEmail(draft.email);
    setPhone(draft.phone);
    setLocation(draft.location);
    setLinkedin(draft.linkedin);
    setPortfolio(draft.portfolio);
    setExperiences(draft.experiences);
    setEducation(draft.education);
    setSkills(draft.skills);
    setCertifications(draft.certifications);
    setProjects(draft.projects);
    setLanguages(draft.languages);
    setJobTitle(draft.jobTitle);
    setJobDescription(draft.jobDescription);
    setJobApplicationLink(draft.jobApplicationLink);
    setReferees(draft.referees);
    setRefereeMode(draft.refereeMode);
  } catch {
    console.error("Unable to restore CV payment draft.");
  }
}, []);
useEffect(() => {
  const params = new URLSearchParams(window.location.search);

const returnedReference =
  params.get("reference") ||
  params.get("trxref");

  if (!returnedReference) return;

  if (!/^ts_cv_[0-9a-f-]{36}$/.test(returnedReference)) {
    console.error("Invalid Paystack return reference.");
    return;
  }

  const pendingReference = sessionStorage.getItem(
    "pendingCvPaymentReference"
  );

  if (pendingReference !== returnedReference) {
    console.error("Paystack return reference does not match.");
    return;
  }
const processingKey = `talentsphereProcessing_${returnedReference}`;

if (sessionStorage.getItem(processingKey) === "true") {
  return;
}

sessionStorage.setItem(processingKey, "true");
 const verifyReturnedPayment = async () => {
  setCvProgress("verifying");

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

   if (sessionError || !session) {
  console.error("Please log in to verify your payment.");

  showNotification(
    "Your login session has expired. Please log in again to check your payment. Do not pay again.",
    "error"
  );

  setCvProgress("error");
  return;
}
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token ?? ""}`,
      },
      body: JSON.stringify({
        reference: returnedReference,
      }),
    });

    const result = await response.json();

  if (response.status === 409) {
  const recoveryResponse = await fetch("/api/payments/recover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    },
    body: JSON.stringify({
      reference: returnedReference,
    }),
  });

  const recoveryResult = await recoveryResponse.json();

  if (
    recoveryResponse.ok &&
    recoveryResult.success === true &&
    recoveryResult.recovered === true
  ) {
    sessionStorage.removeItem("pendingCvPaymentUrl");
    router.replace("/cv-preview");
    return;
  }

  console.error(
  "Payment could not be verified or recovered.",
  recoveryResult.error || result.error
);

setCvProgress("error");
return;
}

if (!response.ok || result.verified !== true) {
  if (result.paymentStatus === "pending") {
  showNotification(
    "Your payment is not yet confirmed. You can use 'Resume Existing Payment' to continue the same checkout, or 'Check Existing Payment Status' to check again. Do not start a new payment while this one is unresolved."
  );
  } else if (result.paymentStatus === "failed") {
    showNotification(
      "Paystack reports that this payment failed. No CV generation has started. Please contact support if you were debited."
    );
    } else if (result.paymentStatus === "abandoned") {
  showNotification(
    "Your payment was abandoned. No CV generation has started. You can click 'Review My Information' again to retry payment."
  );
  } else {
    showNotification(
      "We could not confirm your payment. Please do not pay again until your payment status has been checked."
    );
  }

 console.error(
  "Payment verification failed:",
  result.error || "Payment has not been confirmed."
);
setCvProgress("error");
return;
}

   const recoveryResponse = await fetch("/api/payments/recover", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token ?? ""}`,
  },
  body: JSON.stringify({
    reference: returnedReference,
  }),
});

const recoveryResult = await recoveryResponse.json();

if (!recoveryResponse.ok || recoveryResult.success !== true) {
  console.error(
    "Unable to check existing CV generation:",
    recoveryResult.error || "Recovery check failed."
  );

  showNotification(
  "We could not check your existing CV payment. " +
  "Please do not pay again. Contact TalentSphere support."
);
setCvProgress("error");
return;
}

if (recoveryResult.paymentStatus === "processing") {
 showNotification(
  "Your payment is confirmed, but CV generation may still be processing. " +
  "Please wait and check again. Do not pay again."
);
setCvProgress("error");
return;
}

if (
  recoveryResult.recovered !== true &&
  recoveryResult.canRetry !== true
) {
 showNotification(
  "Your payment is not ready for CV generation. " +
  "Please check its status or contact TalentSphere support. Do not pay again."
);
setCvProgress("error");
return;
}

if (recoveryResult.recovered === true) {
  sessionStorage.removeItem("pendingCvPaymentUrl");
  router.replace("/cv-preview");
  return;
}

const savedProfileId = sessionStorage.getItem(
  "pendingCvProfileId"
);

const savedDraft = sessionStorage.getItem(
  "talentsphereCvPaymentDraft"
);

if (
  !savedProfileId ||
  !/^[0-9a-f-]{36}$/i.test(savedProfileId) ||
  !savedDraft
) {
  console.error(
    "CV draft or profile ID is missing. Payment recovery requires assistance."
  );

  showNotification(
  "Your payment information has been found, but your CV details are missing from this browser. Please contact TalentSphere support with your payment reference. Do not pay again. Reference: " +
    returnedReference
);

setCvProgress("error");
return;
}

const draft = JSON.parse(savedDraft) as CVBuilderDraft;
setCvProgress("generating");
const aiResponse = await fetch("/api/ai/generate-cv", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  },
  body: JSON.stringify({
    cvProfileId: savedProfileId,
    paymentReference: returnedReference,
    fullName: draft.fullName.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    location: draft.location.trim(),
    linkedin: draft.linkedin.trim() || null,
    portfolio: draft.portfolio.trim() || null,
    skills: draft.skills.trim() || null,
    targetJobTitle: draft.jobTitle.trim(),
    jobDescription: draft.jobDescription.trim(),
    experiences: draft.experiences,
    education: draft.education,
    certifications: draft.certifications,
    projects: draft.projects,
    languages: draft.languages,
  }),
});

const aiResult = await aiResponse.json();
if (!aiResponse.ok || aiResult.success !== true) {
  console.error(
    "CV generation failed:",
    aiResult.error || "Unknown error"
  );

  showNotification(
    "Your payment has been verified, but CV preparation is not complete. " +
    "Please click 'Check Existing Payment Status' to check for your CV " +
    "or retry generation using the same payment. Do not pay again.",
    "error"
  );

  setCvProgress("error");
  return;
}
sessionStorage.removeItem("pendingCvPaymentUrl");
setCvProgress("preparing");
router.replace("/cv-preview");
} catch (error) {
  console.error("Unable to verify returned payment:", error);
  setCvProgress("error");
} finally {
  sessionStorage.removeItem(processingKey);
}
};

void verifyReturnedPayment();
}, []);
const handleCheckCvPaymentStatus = () => {
  const pendingReference = sessionStorage.getItem(
    "pendingCvPaymentReference"
  );

  if (!pendingReference) {
    showNotification("No existing CV payment was found.");
    return;
  }

  if (!/^ts_cv_[0-9a-f-]{36}$/.test(pendingReference)) {
    showNotification("Invalid payment reference. Please contact TalentSphere support.");
    return;
  }

  window.location.assign(
    `/cv-builder?reference=${encodeURIComponent(pendingReference)}`
  );
};
const handleResumeCvPayment = () => {
  const pendingReference = sessionStorage.getItem(
    "pendingCvPaymentReference"
  );

  const pendingUrl = sessionStorage.getItem(
    "pendingCvPaymentUrl"
  );

  if (!pendingReference) {
    showNotification("No pending CV payment was found.");
    return;
  }

  if (!pendingUrl) {
    showNotification(
      "Your payment checkout link is unavailable. Please contact TalentSphere support before paying again."
    );
    return;
  }

  try {
    const checkoutUrl = new URL(pendingUrl);

    if (
      checkoutUrl.protocol !== "https:" ||
      checkoutUrl.hostname !== "checkout.paystack.com"
    ) {
      throw new Error("Invalid checkout URL");
    }

    window.location.assign(checkoutUrl.href);
  } catch {
    showNotification(
      "Your saved payment link is invalid. Please contact TalentSphere support. Do not pay again."
    );
  }
};
const skipJobReplaceConfirmationRef = useRef(false);
const handleReadJobLink = async () => {
  if (!jobApplicationLink.trim()) {
    showNotification("Please paste a job application link first.");
    return;
  }
if (jobDescription.trim() && !skipJobReplaceConfirmationRef.current) {
  setShowReplaceJobModal(true);
  return;
}

skipJobReplaceConfirmationRef.current = false;
  setIsReadingJob(true);

  try {
    const {
  data: { session },
  error: sessionError,
} = await supabase.auth.getSession();

if (sessionError || !session?.access_token) {
  throw new Error(
    "Please log in before reading a job description."
  );
}
    const response = await fetch("/api/jobs/extract", {
      method: "POST",
      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${session.access_token}`,
},
      body: JSON.stringify({
        url: jobApplicationLink.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Could not read the job description."
      );
    }

    setJobDescription(data.jobDescription);
setAvailableJobRoles(
  Array.isArray(data.roles)
    ? data.roles.filter(
        (role: unknown): role is string =>
          typeof role === "string"
      )
    : []
);
setRoleDescriptions(
  Array.isArray(data.roleDescriptions)
    ? data.roleDescriptions.filter(
        (item: unknown): item is {
          role: string;
          description: string;
        } =>
          typeof item === "object" &&
          item !== null &&
          "role" in item &&
          "description" in item &&
          typeof item.role === "string" &&
          typeof item.description === "string"
      )
    : []
);
setSelectedJobRole("");
    showNotification("Job description loaded successfully!");
  } catch (error) {
    showNotification(
      error instanceof Error
        ? error.message
        : "Something went wrong while reading the job link."
    );
  } finally {
    setIsReadingJob(false);
  }
};
function updateReferee(
  index: number,
  field: keyof Referee,
  value: string
) {
  setReferees((items) =>
    items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
  );
}

function addReferee() {
  setReferees((items) =>
    items.length < 3
      ? [...items, emptyReferee()]
      : items
  );
}

function removeReferee(index: number) {
  setReferees((items) =>
    items.length > 2
      ? items.filter((_, i) => i !== index)
      : items
  );
}
  function updateExperience(
    index: number,
    field: keyof Experience,
    value: string | boolean
  ) {
    setExperiences((items) =>
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addExperience() {
    setExperiences((items) => [
      ...items,
      {
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  }

  function removeExperience(index: number) {
    setExperiences((items) => items.filter((_, i) => i !== index));
  }

  function updateEducation(
    index: number,
    field: keyof Education,
    value: string
  ) {
    setEducation((items) =>
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addEducation() {
    setEducation((items) => [
      ...items,
      {
        qualification: "",
        institution: "",
        fieldOfStudy: "",
        startYear: "",
        graduationYear: "",
      },
    ]);
  }

  function removeEducation(index: number) {
    setEducation((items) => items.filter((_, i) => i !== index));
  }

  function updateCertification(
    index: number,
    field: keyof Certification,
    value: string
  ) {
    setCertifications((items) =>
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addCertification() {
    setCertifications((items) => [
      ...items,
      {
        name: "",
        organization: "",
        date: "",
      },
    ]);
  }

  function removeCertification(index: number) {
    setCertifications((items) => items.filter((_, i) => i !== index));
  }

  function updateProject(
    index: number,
    field: keyof Project,
    value: string
  ) {
    setProjects((items) =>
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addProject() {
    setProjects((items) => [
      ...items,
      {
        name: "",
        description: "",
        link: "",
      },
    ]);
  }

  function removeProject(index: number) {
    setProjects((items) => items.filter((_, i) => i !== index));
  }

  function updateLanguage(
    index: number,
    field: keyof Language,
    value: string
  ) {
    setLanguages((items) =>
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addLanguage() {
    setLanguages((items) => [
      ...items,
      {
        language: "",
        level: "",
      },
    ]);
  }

  function removeLanguage(index: number) {
    setLanguages((items) => items.filter((_, i) => i !== index));
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  if (!reviewConfirmedRef.current) {
  setShowReviewModal(true);
  return;
}

reviewConfirmedRef.current = false;
setShowReviewModal(false);
if (refereeMode === "provide") {
  if (referees.length < 2 || referees.length > 3) {
    showNotification("Please provide 2 or 3 referees.");
    return;
  }

  const incompleteReferee = referees.some(
    (item) =>
      !item.fullName.trim() ||
      !item.position.trim() ||
      !item.organization.trim() ||
      !item.email.trim() ||
      !item.phone.trim()
  );

  if (incompleteReferee) {
    showNotification("Please complete all referee details.");
    return;
  }
}
  if (!fullName.trim() || !email.trim()) {
    showNotification("Please provide your full name and email.");
    return;
  }

  if (!phone.trim() || !location.trim()) {
    showNotification("Please provide your phone number and location.");
    return;
  }

  if (!jobTitle.trim() || !jobDescription.trim()) {
    showNotification("Please provide the job title and job description.");
    return;
  }
if (availableJobRoles.length > 1 && !selectedJobRole) {
  showNotification(
    "Please select the job role you are applying for before generating your CV."
  );
  return;
}
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    showNotification("Please log in before creating your CV.");
    router.push("/login");
    return;
  }
const pendingReference = sessionStorage.getItem(
  "pendingCvPaymentReference"
);

if (pendingReference) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    showNotification("Please log in to check your existing payment.");
    return;
  }

  try {
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ reference: pendingReference }),
    });

    const result = await response.json();

   if (
  response.status === 400 &&
  (result.paymentStatus === "abandoned" ||
    result.paymentStatus === "failed")
) {
      sessionStorage.removeItem("pendingCvPaymentReference");
      sessionStorage.removeItem("pendingCvPaymentUrl");

      showNotification(
  "Your previous payment was not completed. You can try again."
);
    } else {
      showNotification(
        "Your previous payment may still be active or successful. Please check its status before paying again."
      );
      return;
    }
  } catch {
    showNotification(
      "Unable to check your previous payment. Please try again later."
    );
    return;
  }
}
  const { data, error } = await supabase
    .from("cv_profiles")
    .insert({
      user_id: user.id,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      linkedin: linkedin.trim() || null,
      portfolio: portfolio.trim() || null,
      skills: skills.trim() || null,
      target_job_title: jobTitle.trim(),
      job_description: jobDescription.trim(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("CV profile insert error:", error);
    showNotification(`Could not save your CV information: ${error.message}`);
    return;
  }

  console.log("CV profile created:", data.id);

const experienceRows = experiences
  .filter(
    (experience) =>
      experience.jobTitle.trim() ||
      experience.company.trim() ||
      experience.location.trim() ||
      experience.startDate ||
      experience.endDate ||
      experience.description.trim()
  )
  .map((experience) => ({
    cv_profile_id: data.id,
    job_title: experience.jobTitle.trim() || null,
    company: experience.company.trim() || null,
    location: experience.location.trim() || null,
    start_date: experience.startDate
      ? `${experience.startDate}-01`
      : null,
    end_date:
      experience.current || !experience.endDate
        ? null
        : `${experience.endDate}-01`,
    current: experience.current,
    description: experience.description.trim() || null,
  }));

if (experienceRows.length > 0) {
  const { error: experienceError } = await supabase
    .from("cv_experiences")
    .insert(experienceRows);

  if (experienceError) {
    console.error(
      "CV experience insert error:",
      experienceError
    );

    showNotification(
      `CV profile was saved, but work experience could not be saved: ${experienceError.message}`
    );

    return;
  }
}

const educationRows = education
  .filter(
    (item) =>
      item.qualification.trim() ||
      item.institution.trim() ||
      item.fieldOfStudy.trim() ||
      item.startYear.trim() ||
      item.graduationYear.trim()
  )
  .map((item) => ({
    cv_profile_id: data.id,
    qualification: item.qualification.trim() || null,
    institution: item.institution.trim() || null,
    field_of_study: item.fieldOfStudy.trim() || null,
    start_year: item.startYear.trim() || null,
    graduation_year: item.graduationYear.trim() || null,
  }));

if (educationRows.length > 0) {
  const { error: educationError } = await supabase
    .from("cv_education")
    .insert(educationRows);

  if (educationError) {
    console.error(
      "CV education insert error:",
      educationError
    );

    showNotification(
      `CV profile was saved, but education could not be saved: ${educationError.message}`
    );

    return;
  }
}
const certificationRows = certifications
  .filter(
    (item) =>
      item.name.trim() ||
      item.organization.trim() ||
      item.date
  )
  .map((item) => ({
    cv_profile_id: data.id,
    name: item.name.trim() || null,
    organization: item.organization.trim() || null,
    date: item.date ? `${item.date}-01` : null,
  }));

if (certificationRows.length > 0) {
  const { error: certificationError } = await supabase
    .from("cv_certifications")
    .insert(certificationRows);

  if (certificationError) {
    console.error(
      "CV certification insert error:",
      certificationError
    );

    showNotification(
      `CV profile was saved, but certifications could not be saved: ${certificationError.message}`
    );

    return;
  }
}
const projectRows = projects
  .filter(
    (item) =>
      item.name.trim() ||
      item.description.trim() ||
      item.link.trim()
  )
  .map((item) => ({
    cv_profile_id: data.id,
    name: item.name.trim() || null,
    description: item.description.trim() || null,
    link: item.link.trim() || null,
  }));

if (projectRows.length > 0) {
  const { error: projectError } = await supabase
    .from("cv_projects")
    .insert(projectRows);

  if (projectError) {
    console.error(
      "CV project insert error:",
      projectError
    );

    showNotification(
      `CV profile was saved, but projects could not be saved: ${projectError.message}`
    );

    return;
  }
}
const languageRows = languages
  .filter((item) => item.language.trim() || item.level)
  .map((item) => ({
    cv_profile_id: data.id,
    language: item.language.trim() || null,
    level: item.level || null,
  }));

if (languageRows.length > 0) {
  const { error: languageError } = await supabase
    .from("cv_languages")
    .insert(languageRows);

  if (languageError) {
    console.error(
      "CV language insert error:",
      languageError
    );

    showNotification(
      `CV profile was saved, but languages could not be saved: ${languageError.message}`
    );

    return;
  }
}

if (refereeMode === "provide") {
  const refereeRows = referees.map((item) => ({
    cv_profile_id: data.id,
    full_name: item.fullName.trim(),
    position: item.position.trim(),
    organization: item.organization.trim(),
    email: item.email.trim(),
    phone: item.phone.trim(),
  }));

  const { error: refereeError } = await supabase
    .from("cv_referees")
    .insert(refereeRows);

  if (refereeError) {
    console.error("Referee insert error:", refereeError);

    showNotification(
      `CV information was saved, but referees could not be saved: ${refereeError.message}`
    );

    return;
  }
}
const {
  data: { session },
  error: sessionError,
} = await supabase.auth.getSession();

if (sessionError || !session?.access_token) {
  showNotification("Please log in before generating your CV.");
  return;
}
if (!saveCVPaymentDraft()) {
  showNotification(
    "Unable to save your CV draft. Payment has not been started. Please try again."
  );
  return;
}
const existingPaymentReference = sessionStorage.getItem(
  "pendingCvPaymentReference"
);

if (existingPaymentReference) {
  showNotification(
    "An existing payment needs to be checked before starting another. Please use Check Existing Payment Status."
  );
  return;
}
const paymentResponse = await fetch("/api/payments/initialize", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${session.access_token}`,
  },
});

const paymentResult = await paymentResponse.json();

if (
  !paymentResponse.ok ||
  paymentResult.success !== true ||
  typeof paymentResult.authorizationUrl !== "string" ||
  typeof paymentResult.reference !== "string"
) {
console.error("Payment initialization failed:", {
  status: paymentResponse.status,
  result: paymentResult,
});

showNotification(
  paymentResult.error ||
  paymentResult.message ||
  "Unable to prepare CV Builder payment. Please try again."
);
  return;
}

if (!/^ts_cv_[0-9a-f-]{36}$/.test(paymentResult.reference)) {
  showNotification("Invalid payment reference. Please try again.");
  return;
}

let checkoutUrl: URL;

try {
  checkoutUrl = new URL(paymentResult.authorizationUrl);
} catch {
  showNotification("Invalid payment checkout URL.");
  return;
}

if (
  checkoutUrl.protocol !== "https:" ||
  checkoutUrl.hostname !== "checkout.paystack.com"
) {
  showNotification("Untrusted payment checkout URL.");
  return;
}
sessionStorage.setItem(
  "pendingCvProfileId",
  data.id
);

sessionStorage.setItem(
  "pendingCvPaymentReference",
  paymentResult.reference
);

sessionStorage.setItem(
  "pendingCvPaymentUrl",
  paymentResult.authorizationUrl
);
if (paymentResult.success === true) {
  window.location.assign(checkoutUrl.href);
  return;
}

if (!session || !data) {
  return;
}

return;

const aiResponse = await fetch("/api/ai/generate-cv", {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${session?.access_token ?? ""}`,
},
  body: JSON.stringify({
    cvProfileId: data?.id ?? "",
    paymentReference: paymentResult.reference,
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    location: location.trim(),
    linkedin: linkedin.trim() || null,
    portfolio: portfolio.trim() || null,
    skills: skills.trim() || null,
    targetJobTitle: jobTitle.trim(),
    jobDescription: jobDescription.trim(),
    experiences,
    education,
    certifications,
    projects,
    languages,
  }),
});

const aiResult = await aiResponse.json();

if (!aiResponse.ok || !aiResult.success) {
  console.error("AI CV preparation error:", aiResult);
  showNotification("Your CV was saved, but AI preparation could not be completed.");
  return;
}

console.log("AI CV preparation:", aiResult);

sessionStorage.setItem(
  "generatedCV",
  JSON.stringify(aiResult.data)
);

showNotification(
  "Your CV has been prepared successfully."
);

router.push("/cv-preview");
}
  return (
    <main className="min-h-screen bg-gray-100">
{notification && (
  <Notification
    message={notification.message}
    type={notification.type}
    onClose={() => setNotification(null)}
  />
)}
{cvProgress !== "idle" && (
  <div
    role="status"
    aria-live="polite"
    className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
  >
    <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
      {cvProgress !== "error" ? (
        <>
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Preparing Your Professional CV
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            Please keep this page open while we prepare your documents.
          </p>

          <div className="mt-8 space-y-5 text-left">
            {[
              {
                key: "verifying",
                label: "Verifying Your Payment",
              },
              {
                key: "generating",
                label: "Generating Your Professional CV",
              },
              {
                key: "preparing",
                label: "Preparing Your CV Preview",
              },
            ].map((step, index) => {
              const stages = [
                "verifying",
                "generating",
                "preparing",
              ];

              const currentIndex = stages.indexOf(cvProgress);
              const completed = index < currentIndex;
              const active = index === currentIndex;

              return (
                <div
                  key={step.key}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      completed
                        ? "bg-green-100 text-green-700"
                        : active
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {completed ? "âœ“" : index + 1}
                  </div>

                  <span
                    className={`text-sm ${
                      active
                        ? "font-semibold text-blue-700"
                        : completed
                          ? "text-green-700"
                          : "text-gray-400"
                    }`}
                  >
                    {step.label}
                    {active ? "â€¦" : ""}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-xs text-gray-500">
            Please do not refresh or close this page.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-slate-900">
            We Couldn't Complete Your CV
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            If you have already paid, do not pay again.
            You can check your existing payment status.
          </p>

          <button
            type="button"
            onClick={() => {
              setCvProgress("idle");
              handleCheckCvPaymentStatus();
            }}
            className="mt-6 w-full rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Check Existing Payment Status
          </button>
        </>
      )}
    </div>
  </div>
)}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-2xl font-bold text-blue-700"
          >
            TalentSphere
          </a>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            â† Dashboard
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-xl border bg-white p-6 shadow-sm md:p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              AI CV & Cover Letter
            </h1>

            <p className="mt-3 text-gray-600">
              Provide your information and the job details.
              TalentSphere will use them to create a tailored CV
              and cover letter.
            </p>

            <div className="mt-5 inline-block rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-700">
              Service Fee: {"\u20A6"}1,000
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-10"
          >
            {/* PERSONAL INFORMATION */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                1. Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Enter your basic contact information.
              </p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold">
                    Full Name *
                  </label>

                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Email *
                  </label>

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Phone Number *
                  </label>

                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 08012345678"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Location *
                  </label>

                  <input
                    required
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Abuja, Nigeria"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    LinkedIn URL
                  </label>

                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Portfolio / Website
                  </label>

                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </section>

            {/* WORK EXPERIENCE */}
            <section>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    2. Work Experience
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Add your previous and current jobs.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addExperience}
                  className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
                >
                  + Add Experience
                </button>
              </div>

              <div className="mt-5 space-y-6">
                {experiences.map((experience, index) => (
                  <div
                    key={index}
                    className="rounded-xl border bg-gray-50 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold">
                        Experience {index + 1}
                      </h3>

                      {experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-sm font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-semibold">
                          Job Title
                        </label>

                        <input
                          type="text"
                          value={experience.jobTitle}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "jobTitle",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Project Manager"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Company
                        </label>

                        <input
                          type="text"
                          value={experience.company}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "company",
                              e.target.value
                            )
                          }
                          placeholder="Company name"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Location
                        </label>

                        <input
                          type="text"
                          value={experience.location}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "location",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Kano, Nigeria"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Start Date
                        </label>

                        <input
                          type="month"
                          value={experience.startDate}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          End Date
                        </label>

                        <input
                          type="month"
                          value={experience.endDate}
                          disabled={experience.current}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600 disabled:bg-gray-200"
                        />
                      </div>
                    </div>

                    <label className="mt-5 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={experience.current}
                        onChange={(e) =>
                          updateExperience(
                            index,
                            "current",
                            e.target.checked
                          )
                        }
                      />

                      <span className="text-sm font-medium">
                        I currently work here
                      </span>
                    </label>

                                       <div className="mt-5">
                      <label className="mb-2 block font-semibold">
                        What did you do in this job?
                      </label>

                      <p className="mb-2 text-sm text-gray-500">
                        Write what you actually did in simple words. Don&apos;t
                        worry about professional wording â€” AI will turn it into
                        an ATS-friendly CV.
                      </p>

                      <textarea
                        value={experience.description}
                        onChange={(e) =>
                          updateExperience(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Example: I handled customers, prepared reports, managed social media, and supported the sales team."
                        rows={6}
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>


            {/* EDUCATION */}
            <section>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    3. Education
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Add your academic qualifications.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addEducation}
                  className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
                >
                  + Add Education
                </button>
              </div>

              <div className="mt-5 space-y-6">
                {education.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border bg-gray-50 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold">
                        Education {index + 1}
                      </h3>

                      {education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="text-sm font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-semibold">
                          Qualification
                        </label>

                        <input
                          type="text"
                          value={item.qualification}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "qualification",
                              e.target.value
                            )
                          }
                          placeholder="e.g. B.Sc."
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Institution
                        </label>

                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                          placeholder="University / Institution"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Field of Study
                        </label>

                        <input
                          type="text"
                          value={item.fieldOfStudy}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "fieldOfStudy",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Computer Science"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Start Year
                        </label>

                        <input
                          type="text"
                          value={item.startYear}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "startYear",
                              e.target.value
                            )
                          }
                          placeholder="e.g. 2018"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Graduation Year
                        </label>

                        <input
                          type="text"
                          value={item.graduationYear}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "graduationYear",
                              e.target.value
                            )
                          }
                          placeholder="e.g. 2022"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SKILLS */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                4. Skills
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                List your professional and technical skills,
                separated by commas.
              </p>

              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Project Management, Microsoft Excel, Leadership, Communication"
                rows={5}
                className="mt-5 w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
              />
            </section>

            {/* CERTIFICATIONS */}
            <section>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    5. Certifications
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Add professional certifications if you have any.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addCertification}
                  className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
                >
                  + Add Certification
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {certifications.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border bg-gray-50 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold">
                        Certification {index + 1}
                      </h3>

                      {certifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeCertification(index)
                          }
                          className="text-sm font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-semibold">
                          Certification Name
                        </label>

                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateCertification(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="e.g. PMP"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Issuing Organization
                        </label>

                        <input
                          type="text"
                          value={item.organization}
                          onChange={(e) =>
                            updateCertification(
                              index,
                              "organization",
                              e.target.value
                            )
                          }
                          placeholder="e.g. PMI"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Date
                        </label>

                        <input
                          type="month"
                          value={item.date}
                          onChange={(e) =>
                            updateCertification(
                              index,
                              "date",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PROJECTS */}
            <section>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    6. Projects
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Add important projects you have worked on.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addProject}
                  className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
                >
                  + Add Project
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {projects.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border bg-gray-50 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold">
                        Project {index + 1}
                      </h3>

                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-sm font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block font-semibold">
                          Project Name
                        </label>

                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateProject(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Project name"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Project Description
                        </label>

                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            updateProject(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe the project and your contribution..."
                          rows={5}
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Project Link
                        </label>

                        <input
                          type="url"
                          value={item.link}
                          onChange={(e) =>
                            updateProject(
                              index,
                              "link",
                              e.target.value
                            )
                          }
                          placeholder="https://..."
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* LANGUAGES */}
            <section>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    7. Languages
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Add languages you can communicate in.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addLanguage}
                  className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
                >
                  + Add Language
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {languages.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border bg-gray-50 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold">
                        Language {index + 1}
                      </h3>

                      {languages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLanguage(index)}
                          className="text-sm font-semibold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-semibold">
                          Language
                        </label>

                        <input
                          type="text"
                          value={item.language}
                          onChange={(e) =>
                            updateLanguage(
                              index,
                              "language",
                              e.target.value
                            )
                          }
                          placeholder="e.g. English"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block font-semibold">
                          Proficiency Level
                        </label>

                        <select
                          value={item.level}
                          onChange={(e) =>
                            updateLanguage(
                              index,
                              "level",
                              e.target.value
                            )
                          }
                          className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-blue-600"
                        >
                          <option value="">
                            Select level
                          </option>
                          <option value="Basic">Basic</option>
                          <option value="Intermediate">
                            Intermediate
                          </option>
                          <option value="Fluent">Fluent</option>
                          <option value="Native">Native</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

{/* REFEREES */}
<section>
  <h2 className="text-2xl font-bold text-gray-900">
    8. References / Referees
  </h2>

  <p className="mt-2 text-sm text-gray-600">
    Choose whether to provide referee details or
    make them available upon request.
  </p>

  <div className="mt-5 space-y-4">
    <label className="flex items-center gap-3">
      <input
        type="radio"
        name="refereeMode"
        checked={refereeMode === "request"}
        onChange={() => setRefereeMode("request")}
      />
      <span>Available upon Request</span>
    </label>

    <label className="flex items-center gap-3">
      <input
        type="radio"
        name="refereeMode"
        checked={refereeMode === "provide"}
        onChange={() => setRefereeMode("provide")}
      />
      <span>Provide Referee Details (2â€“3)</span>
    </label>
  </div>

  {refereeMode === "provide" && (
    <div className="mt-6 space-y-5">
      {referees.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border bg-gray-50 p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">
              Referee {index + 1}
            </h3>

            {referees.length > 2 && (
              <button
                type="button"
                onClick={() => removeReferee(index)}
                className="text-sm font-semibold text-red-600"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ["fullName", "Full Name"],
                ["position", "Position / Job Title"],
                ["organization", "Organization"],
                ["email", "Email"],
                ["phone", "Phone Number"],
              ] as const
            ).map(([field, label]) => (
              <div key={field}>
                <label className="mb-2 block font-semibold">
                  {label} *
                </label>

                <input
                  required
                  type={
                    field === "email"
                      ? "email"
                      : field === "phone"
                        ? "tel"
                        : "text"
                  }
                  value={item[field]}
                  onChange={(e) =>
                    updateReferee(
                      index,
                      field,
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {referees.length < 3 && (
        <button
          type="button"
          onClick={addReferee}
          className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
        >
          + Add Third Referee
        </button>
      )}

      <p className="text-sm text-gray-600">
        Please obtain permission from your referees
        before sharing their contact information.
      </p>
    </div>
  )}
</section>

            {/* JOB INFORMATION */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900">
                9. Target Job
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                This information tells the AI what job your CV
                should be tailored for.
              </p>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block font-semibold">
                    Job Title *
                  </label>

                  <input
                    required
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Project Manager"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold">
                    Job Description *
                  </label>
<div className="mb-4">
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Job Application Link (Optional)
  </label>

  <input
    type="url"
    value={jobApplicationLink}
    onChange={(e) => setJobApplicationLink(e.target.value)}
    placeholder="https://example.com/jobs/job-title"
    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
  />

  <p className="mt-2 text-xs text-gray-500">
    Paste the job advertisement link here.
    If you do not have a link, enter the job description below.
  </p>
  <button
  type="button"
  onClick={handleReadJobLink}
  disabled={isReadingJob || !jobApplicationLink.trim()}
  className="mt-3 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
>
  {isReadingJob ? "Reading Job Description..." : "Read Job Description"}
</button>
</div>
                  <textarea
                    required
                    value={jobDescription}
                    onChange={(e) =>
                      setJobDescription(e.target.value)
                    }
                    placeholder="Paste the complete job description here..."
                    rows={12}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </section>

            {/* FINAL NOTICE */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h3 className="font-bold text-blue-900">
                What happens next?
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                After you submit your information, TalentSphere
                will review your details against the target job.
                Payment and AI-powered CV and cover letter
                generation will be connected in the next step.
              </p>
              {availableJobRoles.length > 1 && (
  <div className="mt-4">
    <label className="mb-2 block font-semibold text-gray-800">
      Select the Job Role You Are Applying For
    </label>

    <select
      value={selectedJobRole}
     onChange={(e) => {
  const role = e.target.value;

  setSelectedJobRole(role);
  setJobTitle(role);

  const selectedDescription = roleDescriptions.find(
    (item) => item.role === role
  );

  setJobDescription(
    selectedDescription?.description || ""
  );
}}
      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
    >
      <option value="">Choose a job role</option>

      {availableJobRoles.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  </div>
)}
            </div>

            <button

              type="submit"
              className="w-full rounded-lg bg-blue-700 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-800"
            >
              Review My Information {"\u2014"} {"\u20A6"}1,000
            </button>
            <button
  type="button"
  onClick={handleResumeCvPayment}
  className="mt-3 w-full rounded-lg border border-blue-700 px-6 py-4 text-lg font-semibold text-blue-700 hover:bg-blue-50"
>
  Resume Existing Payment
</button>
<button
  type="button"
  onClick={handleCheckCvPaymentStatus}
  className="mt-3 w-full rounded-lg border border-green-700 px-6 py-4 text-lg font-semibold text-green-700 hover:bg-green-50"
>
  Check Existing Payment Status
</button>
          </form>
        </div>
      </div>

{showReviewModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    role="presentation"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-7 w-7 text-green-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5 2a8 8 0 11-16 0 8 8 0 0116 0z"
          />
        </svg>
      </div>

      <h2
        id="review-modal-title"
        className="text-2xl font-bold text-gray-900"
      >
        Review Your Information
      </h2>

      <p className="mt-3 text-gray-600">
        Before proceeding to payment, please confirm
        that your CV information is correct.
      </p>

      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-800">
          Please check:
        </p>

        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li>âœ“ Your full name and contact details</li>
          <li>âœ“ Your education and qualifications</li>
          <li>âœ“ Your work experience and skills</li>
          <li>âœ“ Your target job title and description</li>
        </ul>
      </div>

      <p className="mt-5 text-sm text-gray-600">
        Your CV Builder fee is{" "}
        <span className="font-bold text-green-700">
          {"\u20A6"}1,000
        </span>
        . You will be redirected to secure Paystack
        checkout after confirmation.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setShowReviewModal(false)}
          className="flex-1 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Go Back & Edit
        </button>

        <button
          type="button"
          onClick={() => {
            reviewConfirmedRef.current = true;
            setShowReviewModal(false);

            const form = document.querySelector(
              "form"
            );

            form?.requestSubmit();
          }}
          className="flex-1 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  </div>
)}

{showReplaceJobModal && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="replace-job-title"
      className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-700">
        !
      </div>

      <h2
        id="replace-job-title"
        className="text-xl font-bold text-gray-900"
      >
        Replace Job Description?
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        Reading this job application link may replace your
        existing job description.
      </p>

      <p className="mt-2 text-sm text-gray-600">
        Your current description will remain unchanged
        unless the new job information is loaded successfully.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setShowReplaceJobModal(false)}
          className="flex-1 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={isReadingJob}
          onClick={() => {
            setShowReplaceJobModal(false);
            skipJobReplaceConfirmationRef.current = true;
            void handleReadJobLink();
          }}
          className="flex-1 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
        >
          Replace & Continue
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}
