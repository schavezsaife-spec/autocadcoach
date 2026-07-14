import { createFileRoute } from "@tanstack/react-router";
import { lessons, projects } from "@/lib/coach-data";

const BASE_URL = "https://autocadcoach.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/lessons", changefreq: "weekly", priority: "0.8" },
          { path: "/projects", changefreq: "weekly", priority: "0.8" },
          { path: "/chat", changefreq: "weekly", priority: "0.6" },
          { path: "/certification", changefreq: "monthly", priority: "0.9" },
          ...lessons.map((l) => ({
            path: `/lessons/${l.id}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...projects.map((p) => ({
            path: `/projects/${p.id}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
        ];

        const today = new Date().toISOString().split("T")[0];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            `    <lastmod>${today}</lastmod>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});