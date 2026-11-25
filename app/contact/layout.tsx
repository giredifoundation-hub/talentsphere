import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact TalentSphere for support, enquiries, partnerships and assistance with career opportunities and AI CV generation.",

  alternates: {
    canonical: "https://www.talentsphere.name.ng/contact",
  },

  openGraph: {
    title: "Contact Us | TalentSphere",
    description: "Contact TalentSphere for support, enquiries, partnerships and assistance with career opportunities and AI CV generation.",
    url: "https://www.talentsphere.name.ng/contact",
    type: "website",
    siteName: "TalentSphere",
    locale: "en_NG",
  },

  twitter: {
    card: "summary",
    title: "Contact Us | TalentSphere",
    description: "Contact TalentSphere for support, enquiries, partnerships and assistance with career opportunities and AI CV generation.",
  },
};

export default function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
