import type { ArticlePreview } from "@/types/article";

export type SectorId =
  | "banking"
  | "energy"
  | "agriculture"
  | "tech"
  | "trade"
  | "policy";

export type SectorDefinition = {
  id: SectorId;
  label: string;
  blurb: string;
  matches: (a: ArticlePreview) => boolean;
};

export const SECTOR_DEFINITIONS: SectorDefinition[] = [
  {
    id: "banking",
    label: "Banking",
    blurb: "Credit cycles, asset quality, and regional supervision.",
    matches: (a) => a.category === "Banking",
  },
  {
    id: "energy",
    label: "Energy",
    blurb: "Power purchase frameworks, fuel balance, and renewables.",
    matches: (a) => a.category === "Energy",
  },
  {
    id: "agriculture",
    label: "Agriculture",
    blurb: "Export crops, logistics to port, and farmgate economics.",
    matches: (a) =>
      a.id === "cmr-cocoa-export-2026" ||
      /\b(cocoa|crop|farm|harvest|agricultural)\b/i.test(
        `${a.title} ${a.preview}`,
      ),
  },
  {
    id: "tech",
    label: "Tech",
    blurb: "Digital payments, fintech distribution, and platform economics.",
    matches: (a) => a.category === "Tech",
  },
  {
    id: "trade",
    label: "Trade",
    blurb: "Port throughput, forward sales, and cross-border corridors.",
    matches: (a) => a.category === "Trade",
  },
  {
    id: "policy",
    label: "Policy",
    blurb: "Monetary union decisions, regulation, and public finance signals.",
    matches: (a) => a.category === "Policy",
  },
];

export function articlesForSector(
  sector: SectorDefinition,
  articles: ArticlePreview[],
): ArticlePreview[] {
  return articles.filter((a) => sector.matches(a));
}
