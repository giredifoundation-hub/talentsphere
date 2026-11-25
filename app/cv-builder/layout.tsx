import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AI ATS-Friendly CV and Cover Letter Builder",
  description: "Create professional ATS-friendly CVs and tailored cover letters with TalentSphere AI CV Builder for just NGN 500 per generation.",

  alternates: {
    canonical: "https://www.talentsphere.name.ng/cv-builder",
  },

  openGraph: {
    title: "AI ATS-Friendly CV and Cover Letter Builder | TalentSphere",
    description: "Create professional ATS-friendly CVs and tailored cover letters with TalentSphere AI CV Builder for just NGN 500 per generation.",
    url: "https://www.talentsphere.name.ng/cv-builder",
    type: "website",
    siteName: "TalentSphere",
    locale: "en_NG",
  },

  twitter: {
    card: "summary",
    title: "AI ATS-Friendly CV and Cover Letter Builder | TalentSphere",
    description: "Create professional ATS-friendly CVs and tailored cover letters with TalentSphere AI CV Builder for just NGN 500 per generation.",
  },
};

export default function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
