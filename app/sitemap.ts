import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://talentsphere.name.ng";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/grants`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/scholarships`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/fellowships`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
    },
  ];
}