"use client";

import type { SourceDraft } from "@/lib/article-sources";
import { emptySourceDraft } from "@/lib/article-sources";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/25";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wide text-ink-subtle";

type Props = {
  sources: SourceDraft[];
  onChange: (sources: SourceDraft[]) => void;
  disabled?: boolean;
};

export function SourceFieldsEditor({ sources, onChange, disabled }: Props) {
  function updateAt(i: number, patch: Partial<SourceDraft>) {
    onChange(sources.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function addSource() {
    onChange([...sources, emptySourceDraft()]);
  }

  function removeAt(i: number) {
    onChange(
      sources.length <= 1 ? [emptySourceDraft()] : sources.filter((_, idx) => idx !== i),
    );
  }

  return (
    <div className="space-y-8">
      {sources.map((src, i) => (
        <fieldset
          key={i}
          className="space-y-4 rounded-xl border border-line bg-surface-soft/50 p-4 sm:p-5"
          disabled={disabled}
        >
          <legend className="flex w-full items-center justify-between gap-3 px-1">
            <span className="font-serif text-base font-semibold text-ink">
              Source {i + 1}
            </span>
            <button
              type="button"
              onClick={() => removeAt(i)}
              disabled={disabled || sources.length <= 1}
              className="rounded-lg border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink hover:bg-brand-soft/60 disabled:opacity-50"
            >
              Remove
            </button>
          </legend>

          <div>
            <label className={labelClass}>Source URL</label>
            <input
              type="url"
              value={src.url}
              onChange={(e) => updateAt(i, { url: e.target.value })}
              className={inputClass}
              placeholder="https://…"
            />
          </div>

          <div>
            <label className={labelClass}>Publication / outlet</label>
            <input
              value={src.name}
              onChange={(e) => updateAt(i, { name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Author</label>
            <input
              value={src.author}
              onChange={(e) => updateAt(i, { author: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Original publish date</label>
            <input
              type="date"
              value={
                src.publishedAt.length >= 10 ? src.publishedAt.slice(0, 10) : ""
              }
              onChange={(e) => updateAt(i, { publishedAt: e.target.value })}
              className={inputClass}
            />
          </div>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={addSource}
        disabled={disabled}
        className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-soft/60 disabled:opacity-60"
      >
        Add another source
      </button>
    </div>
  );
}
