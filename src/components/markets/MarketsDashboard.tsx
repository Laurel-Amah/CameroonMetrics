import type { QuoteRow } from "@/types/markets";

function changeClass(changePct: string): string {
  if (changePct.startsWith("+")) return "text-emerald-700";
  if (changePct.startsWith("-")) return "text-rose-700";
  return "text-ink-muted";
}

function QuotesTable({ rows }: { rows: QuoteRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface/90 shadow-card ring-1 ring-teal-500/10">
      <div
        className="h-0.5 bg-gradient-to-r from-brand/50 via-teal-500/60 to-indigo-400/40"
        aria-hidden
      />
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-brand-soft/40 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            <th className="px-4 py-3 sm:px-5">Pair</th>
            <th className="px-4 py-3 sm:px-5">Bid</th>
            <th className="px-4 py-3 sm:px-5">Ask</th>
            <th className="px-4 py-3 sm:px-5">Chg</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.pair}
              className={`border-b border-line/80 last:border-0 transition-colors hover:bg-teal-500/[0.04] ${
                i % 2 === 1 ? "bg-surface-soft/30" : ""
              }`}
            >
              <td className="px-4 py-3.5 font-semibold text-brand sm:px-5">
                {r.pair}
              </td>
              <td className="px-4 py-3.5 tabular-nums text-ink-muted sm:px-5">
                {r.bid}
              </td>
              <td className="px-4 py-3.5 tabular-nums text-ink-muted sm:px-5">
                {r.ask}
              </td>
              <td
                className={`px-4 py-3.5 tabular-nums font-semibold sm:px-5 ${changeClass(r.changePct)}`}
              >
                {r.changePct}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export type FxMeta = {
  rateDate: string;
  fetchedAt: string;
  baseCurrency: string;
};

type Props = {
  currencies: QuoteRow[];
  meta: FxMeta | null;
};

export function MarketsDashboard({ currencies, meta }: Props) {
  if (!meta || currencies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface/60 px-6 py-12 text-center">
        <p className="font-serif text-lg font-semibold text-ink">
          FX data not available
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
          Rates are not available yet. Check back after the next daily update.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="fx-heading"
      className="rounded-2xl border border-line bg-surface/80 p-5 shadow-card ring-1 ring-teal-500/10 sm:p-7"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="fx-heading"
          className="font-serif text-xl font-semibold tracking-tight text-ink sm:text-2xl"
        >
          <span className="text-teal-700">Currencies</span>
        </h2>
        <p className="text-sm text-ink-muted">
          As of{" "}
          <time dateTime={meta.rateDate}>{meta.rateDate}</time>
        </p>
      </div>
      <QuotesTable rows={currencies} />
      <p className="mt-4 text-xs text-ink-subtle">
        Indicative only · Data via{" "}
        <a
          href="https://exchangerate.host/"
          className="underline decoration-line underline-offset-2 hover:text-ink-muted"
          rel="noopener noreferrer"
          target="_blank"
        >
          exchangerate.host
        </a>
      </p>
    </section>
  );
}
