import type { ArticlePreview } from "@/types/article";

export type SectorId =
  | "banking"
  | "energy"
  | "agriculture"
  | "tech"
  | "trade"
  | "policy"
  | "real-estate"
  | "entrepreneurship"
  | "markets";

export type SectorDefinition = {
  id: SectorId;
  label: string;
  blurb: string;
  matches: (a: ArticlePreview) => boolean;
};

export const SECTOR_DEFINITIONS: SectorDefinition[] = [
  {
    id: "policy",
    label: "Policy",
    blurb: "Regulation, public finance, and rules that shape how business is done.",
    matches: (a) => a.category === "Policy",
  },
  {
    id: "entrepreneurship",
    label: "Entrepreneurship",
    blurb: "Startups, SMEs, youth enterprise, and how operators grow in Cameroon.",
    matches: (a) => a.category === "Entrepreneurship",
  },
  {
    id: "real-estate",
    label: "Real estate",
    blurb: "Housing, commercial property, land, and construction economics.",
    matches: (a) => a.category === "Real Estate",
  },
  {
    id: "banking",
    label: "Banking",
    blurb: "Credit, payments, mobile money, and how businesses access finance.",
    matches: (a) => a.category === "Banking",
  },
  {
    id: "agriculture",
    label: "Agriculture",
    blurb: "Farmgate prices, exports, logistics, and agribusiness opportunities.",
    matches: (a) =>
      a.category === "Agriculture" ||
      /\b(cocoa|crop|farm|harvest|agricultural)\b/i.test(
        `${a.title} ${a.preview}`,
      ),
  },
  {
    id: "trade",
    label: "Trade",
    blurb: "Imports, exports, ports, and cross-border commerce.",
    matches: (a) => a.category === "Trade",
  },
  {
    id: "energy",
    label: "Energy",
    blurb: "Power, fuel, and energy costs that hit every operator's bottom line.",
    matches: (a) => a.category === "Energy",
  },
  {
    id: "tech",
    label: "Tech",
    blurb: "Digital tools, fintech, and platforms changing how business runs.",
    matches: (a) => a.category === "Tech",
  },
  {
    id: "markets",
    label: "Markets",
    blurb: "FX, commodities, and macro signals that affect costs and planning.",
    matches: (a) => a.category === "Markets",
  },
];

export function articlesForSector(
  sector: SectorDefinition,
  articles: ArticlePreview[],
): ArticlePreview[] {
  return articles.filter((a) => sector.matches(a));
}
