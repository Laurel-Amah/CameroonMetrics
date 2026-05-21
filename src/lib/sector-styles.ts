import type { SectorId } from "@/data/sector-definitions";

export const sectorAccentClass: Record<
  SectorId,
  { chip: string; bar: string; kicker: string }
> = {
  banking: {
    chip:
      "border-sky-200/90 bg-sky-50 text-sky-950 ring-1 ring-sky-300/40 hover:border-sky-400 hover:bg-sky-100/90",
    bar: "border-l-sky-500",
    kicker: "text-sky-700",
  },
  energy: {
    chip:
      "border-amber-200/90 bg-amber-50 text-amber-950 ring-1 ring-amber-300/40 hover:border-amber-400 hover:bg-amber-100/90",
    bar: "border-l-amber-500",
    kicker: "text-amber-700",
  },
  agriculture: {
    chip:
      "border-emerald-200/90 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-300/40 hover:border-emerald-400 hover:bg-emerald-100/90",
    bar: "border-l-emerald-600",
    kicker: "text-emerald-700",
  },
  tech: {
    chip:
      "border-violet-200/90 bg-violet-50 text-violet-950 ring-1 ring-violet-300/40 hover:border-violet-400 hover:bg-violet-100/90",
    bar: "border-l-violet-500",
    kicker: "text-violet-700",
  },
  trade: {
    chip:
      "border-teal-200/90 bg-teal-50 text-teal-950 ring-1 ring-teal-300/40 hover:border-teal-400 hover:bg-teal-100/90",
    bar: "border-l-teal-600",
    kicker: "text-teal-700",
  },
  policy: {
    chip:
      "border-indigo-200/90 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-300/40 hover:border-indigo-400 hover:bg-indigo-100/90",
    bar: "border-l-indigo-500",
    kicker: "text-indigo-700",
  },
};
