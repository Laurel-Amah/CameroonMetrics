import type { Article, ArticlePreview } from "@/types/article";

/** Full catalogue used for local fallback and `npm run generate:seed`. */
export const editorialSeedArticles: Article[] = [
  {
    id: "cmr-cocoa-export-2026",
    title: "Cameroon cocoa exporters report stronger forward orders into Q2",
    category: "Trade",
    publishedAt: "2026-04-09",
    imageSrc: "/images/articles/trade-cocoa.svg",
    preview:
      "Major cooperatives cite improved logistics corridors and renewed European buyer interest after last season’s quality concerns.",
    whatHappened:
      "Leading cooperatives in the Centre and South regions have booked materially higher forward sales for the April–June window than at the same point last year. Exporters attribute the pickup to steadier inland haulage, fewer border delays on the Douala corridor, and renewed sampling activity from large European processors after a cautious 2025 crop cycle. Forward premiums for main-crop grades have firmed modestly, though spot differentials remain volatile week to week.",
    whyItMatters:
      "Cocoa remains a core current-account line for Cameroon. Stronger forward cover smooths FX inflows into the harvest season and supports farmer price floors agreed through umbrella cooperatives. For CEMAC neighbours watching regional trade flows, Cameroon’s export rhythm is often a bellwether for logistics capacity and customs predictability across the Gulf of Guinea route.",
    investorInsight:
      "Watch forward-to-spot spreads and weekly port-line data out of Douala; sustained backwardation with rising forward bookings would support exporters’ working-capital needs and could ease pressure on local bank trade-finance lines. A renewed slide in European grind estimates would undercut the current optimism and could widen quality discounts again within two to three weeks.",
  },
  {
    id: "ceeac-harmonization",
    title: "CEMAC pushes timeline for regional digital payments interoperability",
    category: "Policy",
    publishedAt: "2026-04-08",
    imageSrc: "/images/articles/policy-digital.svg",
    preview:
      "Central bankers signaled a phased rollout beginning with large-value settlement, with retail wallets to follow in late 2026.",
    whatHappened:
      "The CEMAC Monetary Union committee endorsed a revised interoperability roadmap that prioritises wholesale settlement rails first, followed by retail wallet interoperability and common technical standards for QR and account-to-account transfers. Pilot corridors are expected to link Cameroon and Gabon in the initial phase, with other member states joining once certification milestones are met. Officials stressed that capital controls and reporting requirements would remain unchanged during the pilot.",
    whyItMatters:
      "Fragmented retail payments have long raised transaction costs for cross-border SMEs and delayed reconciliation for banks operating in multiple CEMAC jurisdictions. A credible interoperability path could reduce friction for trade finance, payroll, and remittance corridors, and would align regional policy with broader continental digitisation goals—if implementation timelines hold.",
    investorInsight:
      "Bank investors should track regulatory circulars on interchange caps and settlement windows; any slip in the wholesale phase would likely push retail milestones into 2027. Fintech and telco exposures benefit from clearer standards, but revenue per transaction may compress as interoperability increases competition on the last mile.",
  },
  {
    id: "douala-port-throughput",
    title: "Douala port container throughput edges up as congestion fees take effect",
    category: "Markets",
    publishedAt: "2026-04-07",
    imageSrc: "/images/articles/markets-port.svg",
    preview:
      "Terminal operators say dwell times improved modestly, though shippers still flag unpredictable customs windows.",
    whatHappened:
      "Container moves through Douala Autonomous Port rose slightly year-on-year in March as new dwell-time surcharges and revised stacking rules took effect. Terminal operators report average dwell down on the main box berths, while bulk segments were flat. Several freight forwarders noted that customs release times remain uneven across commodity codes, masking gains on the pure terminal side.",
    whyItMatters:
      "Port throughput is a real-time proxy for import demand, industrial input availability, and export competitiveness. When dwell times fall without a collapse in volumes, it usually signals better coordination between terminal, customs, and trucking—or pricing that clears backlog. For inflation watchers, sustained import fluidity can dampen pipeline price pressure on consumer goods.",
    investorInsight:
      "Pair monthly TEU counts with inventory-to-sales ratios for listed retailers and FMCG names exposed to European and Asian import lanes. If dwell charges simply push boxes into off-dock depots, headline port metrics could improve while inland logistics costs rise—monitor bonded warehouse utilisation as a cross-check.",
  },
  {
    id: "solar-ppa-yaounde",
    title: "Independent power group signs 50 MW solar PPA with industrial buyers near Yaoundé",
    category: "Energy",
    publishedAt: "2026-04-05",
    imageSrc: "/images/articles/energy-solar.svg",
    preview:
      "The offtake structure blends corporate consumers with a utility carve-out, a template being watched across the sub-region.",
    whatHappened:
      "A consortium of independent developers signed a 50 MW power purchase framework with a mix of industrial offtakers and a carve-out for the national utility, structured as a phased energisation through 2027. Tariffs escalate gently with CPI, and the agreement includes curtailment clauses tied to grid stability. Financing is anchored by development lenders with partial risk coverage on currency convertibility.",
    whyItMatters:
      "Blended corporate–utility PPAs are still uncommon in Central Africa; a bankable template could unlock similar projects in peer markets where single-offtaker risk has stalled renewables. For Cameroon, incremental firm capacity supports grid diversification goals and may ease peak-load pressure on hydro-heavy systems during dry spells.",
    investorInsight:
      "IPPs and regional utilities: focus on offtaker credit quality and curtailment risk disclosures. Bondholders should stress-test tariff indexation against CFA peg assumptions. If commissioning slips, watch for knock-on effects on construction import timelines through Douala.",
  },
  {
    id: "bank-npl-trend",
    title: "Listed banks: asset quality stabilizes as provisioning normalizes",
    category: "Banking",
    publishedAt: "2026-04-03",
    imageSrc: "/images/articles/banking.svg",
    preview:
      "Analysts note slower credit growth but cleaner balance sheets, with SME books under closer supervisory scrutiny.",
    whatHappened:
      "Listed lenders in Douala and Yaoundé reported broadly stable NPL ratios in Q1 guidance notes, with provisioning charges trending toward pre-shock norms. Management commentary highlighted selective tightening in SME and trade-finance underwriting, offset by modest recovery in collateral-backed retail mortgages. Loan growth guidance for the year was trimmed slightly, reflecting higher risk weights on cross-border exposures.",
    whyItMatters:
      "When provisioning normalises while coverage ratios hold, banks can redeploy capital toward core lending and fee businesses—supporting ROE recovery if funding costs stay anchored. Supervisory emphasis on SME books matters because that segment drives employment and has been a historical source of asset-quality surprises in the region.",
    investorInsight:
      "Equity investors should compare cost-of-risk trends with loan growth by segment; divergence may signal future NPL pressure. For AT1 and subordinated debt holders, watch regulatory updates on capital conservation buffers and any sector-wide restructuring guidance from the regional supervisor.",
  },
  {
    id: "fintech-remittance",
    title: "Remittance fintech expands agent network into secondary cities",
    category: "Tech",
    publishedAt: "2026-04-01",
    imageSrc: "/images/articles/tech-fintech.svg",
    preview:
      "Partnerships with corner shops aim to cut cash-out friction while competing with informal channels on fees.",
    whatHappened:
      "A regional remittance platform expanded signed agent locations into secondary cities across the West and Littoral regions, using a revenue-share model with neighbourhood retailers. The rollout bundles cash-out, bill pay, and small-value transfers behind a single agent terminal. Management cited lower customer acquisition costs versus standalone branches and faster KYC refresh cycles tied to national ID verification APIs.",
    whyItMatters:
      "Formal remittance capture supports FX transparency and improves household resilience when informal channels face liquidity shocks. Agent density in secondary cities is often the binding constraint on digital adoption; improving coverage can accelerate the shift away from cash-heavy payout models.",
    investorInsight:
      "Track agent churn, float requirements, and fraud-loss ratios quarter on quarter. Telco partnerships and wallet interoperability (see regional policy coverage) could compress take rates but expand volume—modelling gross profit per active user matters more than headline transaction growth.",
  },
];

export function getArticleById(id: string): Article | undefined {
  return editorialSeedArticles.find((a) => a.id === id);
}

export const mockArticles: ArticlePreview[] = editorialSeedArticles.map((a) => ({
  id: a.id,
  title: a.title,
  category: a.category,
  publishedAt: a.publishedAt,
  preview: a.preview,
  imageSrc: a.imageSrc,
}));

export function getAllArticleIds(): string[] {
  return editorialSeedArticles.map((a) => a.id);
}
