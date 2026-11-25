import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Latest Jobs in Nigeria and Abroad",
  description: "Discover the latest job vacancies, graduate opportunities, internships and career opportunities in Nigeria and abroad on TalentSphere.",

  alternates: {
    canonical: "https://www.talentsphere.name.ng/jobs",
  },

  openGraph: {
    title: "Latest Jobs in Nigeria and Abroad | TalentSphere",
    description: "Discover the latest job vacancies, graduate opportunities, internships and career opportunities in Nigeria and abroad on TalentSphere.",
    url: "https://www.talentsphere.name.ng/jobs",
    type: "website",
    siteName: "TalentSphere",
    locale: "en_NG",
  },

  twitter: {
    card: "summary",
    title: "Latest Jobs in Nigeria and Abroad | TalentSphere",
    description: "Discover the latest job vacancies, graduate opportunities, internships and career opportunities in Nigeria and abroad on TalentSphere.",
  },
};

export default function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
