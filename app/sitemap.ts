import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://talentsphere.name.ng",
      lastModified: new Date(),
    },
    {
      url: "https://talentsphere.name.ng/jobs",
      lastModified: new Date(),
    },
    {
      url: "https://talentsphere.name.ng/grants",
      lastModified: new Date(),
    },
    {
      url: "https://talentsphere.name.ng/scholarships",
      lastModified: new Date(),
    },
    {
      url: "https://talentsphere.name.ng/fellowships",
      lastModified: new Date(),
    },
    {
      url: "https://talentsphere.name.ng/about",
      lastModified: new Date(),
    },
    {
      url: "https://talentsphere.name.ng/contact",
      lastModified: new Date(),
    },
    {
      url: "https://talentsphere.name.ng/privacy",
      lastModified: new Date(),
    },
    {
      url: "https://talentsphere.name.ng/terms",
      lastModified: new Date(),
    },
    {
      url: "https://talentsphere.name.ng/disclaimer",
      lastModified: new Date(),
    },
  ];
}