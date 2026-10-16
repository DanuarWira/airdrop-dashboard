import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://airdrop-viewer.vercel.app";
  const now = new Date();

  const routes = ["", "/tracker", "/daily", "/faucets", "/timeline", "/telegram"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
