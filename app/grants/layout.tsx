import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Grants and Funding Opportunities",
  description: "Discover grants, business funding, research funding and financial support opportunities in Nigeria, Africa and beyond.",

  alternates: {
    canonical: "https://www.talentsphere.name.ng/grants",
  },

  openGraph: {
    title: "Grants and Funding Opportunities | TalentSphere",
    description: "Discover grants, business funding, research funding and financial support opportunities in Nigeria, Africa and beyond.",
    url: "https://www.talentsphere.name.ng/grants",
    type: "website",
    siteName: "TalentSphere",
    locale: "en_NG",
  },

  twitter: {
    card: "summary",
    title: "Grants and Funding Opportunities | TalentSphere",
    description: "Discover grants, business funding, research funding and financial support opportunities in Nigeria, Africa and beyond.",
  },
};

export default function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
