import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Latest Fellowship Opportunities",
  description: "Explore local and international fellowships, leadership programmes, research opportunities and professional development programmes.",

  alternates: {
    canonical: "https://www.talentsphere.name.ng/fellowships",
  },

  openGraph: {
    title: "Latest Fellowship Opportunities | TalentSphere",
    description: "Explore local and international fellowships, leadership programmes, research opportunities and professional development programmes.",
    url: "https://www.talentsphere.name.ng/fellowships",
    type: "website",
    siteName: "TalentSphere",
    locale: "en_NG",
  },

  twitter: {
    card: "summary",
    title: "Latest Fellowship Opportunities | TalentSphere",
    description: "Explore local and international fellowships, leadership programmes, research opportunities and professional development programmes.",
  },
};

export default function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
