import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://www.talentsphere.name.ng"
  ),

  title: {
    default:
      "TalentSphere | Jobs, Scholarships, Grants & AI CV Builder",
    template: "%s | TalentSphere",
  },

  description:
    "Discover the latest jobs, scholarships, grants, fellowships and career opportunities in Nigeria and beyond. Create professional ATS-friendly CVs and cover letters with TalentSphere AI CV Builder.",

  applicationName: "TalentSphere",

  authors: [{ name: "TalentSphere" }],

  creator: "TalentSphere",

  publisher: "TalentSphere",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "TalentSphere",
    title:
      "TalentSphere | Jobs, Scholarships, Grants & AI CV Builder",
    description:
      "Discover career opportunities, scholarships, grants and fellowships. Build professional ATS-friendly CVs and cover letters with TalentSphere.",
  },

  twitter: {
    card: "summary",
    title:
      "TalentSphere | Jobs, Scholarships, Grants & AI CV Builder",
    description:
      "Discover opportunities and create professional ATS-friendly CVs with TalentSphere.",
  },

  category: "Career and Education",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-8606975760334704"
        />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8606975760334704"
          crossOrigin="anonymous"
        />
      </head>

      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}