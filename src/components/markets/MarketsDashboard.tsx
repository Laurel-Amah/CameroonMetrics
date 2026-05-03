import type {
  CommodityRow,
  MacroCard,
  QuoteRow,
} from "@/data/mock-market-snapshot";

function TrendGlyph({ trend }: { trend?: MacroCard["trend"] }) {
  if (trend === "up") return <span className="text-brand">▲</span>;
  if (trend === "down") return <span className="text-rose-600">▼</span>;
  return <span className="text-ink-subtle">■</span>;
}

function MacroGrid({ cards }: { cards: MacroCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.id}
          className="rounded-xl border border-line bg-surface/90 p-5 shadow-card ring-1 ring-brand/5"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
              {c.label}
            </p>
            <span className="text-xs" aria-hidden>
              <TrendGlyph trend={c.trend} />
            </span>
          </div>
          <p className="mt-4 font-serif text-3xl font-semibold tabular-nums tracking-tight text-ink">
            {c.value}
          </p>
          <p className="mt-2 text-sm leading-snug text-ink-muted">{c.sublabel}</p>
        </div>
      ))}
    </div>
  );
}

function QuotesTable({ rows }: { rows: QuoteRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface/90 shadow-card ring-1 ring-brand/5">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            <th className="px-4 py-3 sm:px-5">Pair</th>
            <th className="px-4 py-3 sm:px-5">Bid</th>
            <th className="px-4 py-3 sm:px-5">Ask</th>
            <th className="px-4 py-3 sm:px-5">Chg</th>
            <th className="hidden px-4 py-3 sm:table-cell sm:px-5">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.pair}
              className="border-b border-line/80 last:border-0 hover:bg-surface-soft/80"
            >
              <td className="px-4 py-3.5 font-semibold text-ink sm:px-5">
                {r.pair}
              </td>
              <td className="px-4 py-3.5 tabular-nums text-ink-muted sm:px-5">
                {r.bid}
              </td>
              <td className="px-4 py-3.5 tabular-nums text-ink-muted sm:px-5">
                {r.ask}
              </td>
              <td className="px-4 py-3.5 tabular-nums font-medium text-ink sm:px-5">
                {r.changePct}
              </td>
              <td className="hidden px-4 py-3.5 text-ink-subtle sm:table-cell sm:px-5">
                {r.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CommodityList({ rows }: { rows: CommodityRow[] }) {
  return (
    <ul className="divide-y divide-line rounded-xl border border-line bg-surface/90 shadow-card ring-1 ring-brand/5">
      {rows.map((r) => (
        <li
          key={r.name}
          className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        >
          <div>
            <p className="font-semibold text-ink">{r.name}</p>
            <p className="text-xs text-ink-subtle">{r.unit}</p>
          </div>
          <div className="flex items-baseline gap-4 sm:text-right">
            <p className="font-serif text-xl font-semibold tabular-nums text-ink">
              {r.last}
            </p>
            <p className="text-xs font-medium text-ink-muted">{r.session}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

type Props = {
  overview: MacroCard[];
  currencies: QuoteRow[];
  commodities: CommodityRow[];
};

export function MarketsDashboard({
  overview,
  currencies,
  commodities,
}: Props) {
  return (
    <div className="space-y-12 sm:space-y-14">
      <section aria-labelledby="overview-heading">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="overview-heading"
            className="font-serif text-xl font-semibold tracking-tight text-ink sm:text-2xl"
          >
            Market overview
          </h2>
          <p className="max-w-lg text-sm text-ink-muted">
            Mock snapshot for layout—no live feed or execution.
          </p>
        </div>
        <MacroGrid cards={overview} />
      </section>

      <section aria-labelledby="fx-heading">
        <h2
          id="fx-heading"
          className="mb-5 font-serif text-xl font-semibold tracking-tight text-ink sm:text-2xl"
        >
          Currencies
        </h2>
        <QuotesTable rows={currencies} />
      </section>

      <section aria-labelledby="com-heading">
        <h2
          id="com-heading"
          className="mb-5 font-serif text-xl font-semibold tracking-tight text-ink sm:text-2xl"
        >
          Commodities
        </h2>
        <CommodityList rows={commodities} />
      </section>
    </div>
  );
}
