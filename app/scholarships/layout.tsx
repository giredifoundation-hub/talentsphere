import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Latest Scholarships for Nigerian and African Students",
  description: "Explore undergraduate, postgraduate, fully funded and international scholarship opportunities for Nigerian and African students.",

  alternates: {
    canonical: "https://www.talentsphere.name.ng/scholarships",
  },

  openGraph: {
    title: "Latest Scholarships for Nigerian and African Students | TalentSphere",
    description: "Explore undergraduate, postgraduate, fully funded and international scholarship opportunities for Nigerian and African students.",
    url: "https://www.talentsphere.name.ng/scholarships",
    type: "website",
    siteName: "TalentSphere",
    locale: "en_NG",
  },

  twitter: {
    card: "summary",
    title: "Latest Scholarships for Nigerian and African Students | TalentSphere",
    description: "Explore undergraduate, postgraduate, fully funded and international scholarship opportunities for Nigerian and African students.",
  },
};

export default function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
