import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about TalentSphere, a career and opportunity platform connecting people with jobs, scholarships, grants, fellowships and AI career tools.",

  alternates: {
    canonical: "https://www.talentsphere.name.ng/about",
  },

  openGraph: {
    title: "About Us | TalentSphere",
    description: "Learn about TalentSphere, a career and opportunity platform connecting people with jobs, scholarships, grants, fellowships and AI career tools.",
    url: "https://www.talentsphere.name.ng/about",
    type: "website",
    siteName: "TalentSphere",
    locale: "en_NG",
  },

  twitter: {
    card: "summary",
    title: "About Us | TalentSphere",
    description: "Learn about TalentSphere, a career and opportunity platform connecting people with jobs, scholarships, grants, fellowships and AI career tools.",
  },
};

export default function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
