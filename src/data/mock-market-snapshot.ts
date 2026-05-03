export type MacroCard = {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  trend?: "up" | "down" | "flat";
};

export type QuoteRow = {
  pair: string;
  bid: string;
  ask: string;
  changePct: string;
  note: string;
};

export type CommodityRow = {
  name: string;
  unit: string;
  last: string;
  session: string;
};

export const mockMarketOverview: MacroCard[] = [
  {
    id: "inflation",
    label: "Inflation",
    value: "4.6%",
    sublabel: "Y/Y headline (mock) · CEMAC basket proxy",
    trend: "flat",
  },
  {
    id: "policy-rate",
    label: "Interest rate",
    value: "4.50%",
    sublabel: "Policy benchmark (mock) · hold scenario",
    trend: "flat",
  },
  {
    id: "gdp",
    label: "GDP growth",
    value: "+3.1%",
    sublabel: "Real annualised (mock) · desk estimate",
    trend: "up",
  },
];

export const mockCurrencyQuotes: QuoteRow[] = [
  {
    pair: "XAF / USD",
    bid: "618.42",
    ask: "618.58",
    changePct: "+0.04%",
    note: "Mock fixing · indicative only",
  },
  {
    pair: "XAF / EUR",
    bid: "655.96",
    ask: "656.00",
    changePct: "0.00%",
    note: "Peg band · mock snapshot",
  },
];

export const mockCommodities: CommodityRow[] = [
  {
    name: "Cocoa",
    unit: "USD / mt",
    last: "3,842",
    session: "+0.7% · mock",
  },
  {
    name: "Oil",
    unit: "USD / bbl",
    last: "81.20",
    session: "−0.3% · mock",
  },
];
