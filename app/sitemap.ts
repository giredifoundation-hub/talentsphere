import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.talentsphere.name.ng";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/jobs` },
    { url: `${baseUrl}/grants` },
    { url: `${baseUrl}/scholarships` },
    { url: `${baseUrl}/fellowships` },
    { url: `${baseUrl}/cv-builder` },
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/terms` },
    { url: `${baseUrl}/disclaimer` },
  ];

  const opportunityPages: MetadataRoute.Sitemap = [];
  const pageSize = 500;
let offset = 0;

const today = new Date().toLocaleDateString("en-CA", {
  timeZone: "Africa/Lagos",
});

  while (true) {
    const { data, error } = await supabase
      .from("opportunities")
.select("id")
.gte("deadline", today)
.order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error("Sitemap error:", error.message);
      throw new Error("Unable to generate opportunity sitemap");
    }

    if (!data || data.length === 0) {
      break;
    }

    opportunityPages.push(
      ...data.map((opportunity) => ({
        url: `${baseUrl}/opportunity/${opportunity.id}`,
      }))
    );

    if (data.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  return [...staticPages, ...opportunityPages];
}