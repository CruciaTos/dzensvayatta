import type { MetadataRoute } from "next";
import { BASE_URL, ROUTES } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
