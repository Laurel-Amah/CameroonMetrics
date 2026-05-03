"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArticleCredits } from "@/components/article/ArticleCredits";
import { ARTICLE_CATEGORIES } from "@/lib/ai/article-schema";
import type { DraftEditorInitial } from "@/lib/db/draft-editor-state";
import type { ArticleSource } from "@/types/article";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/25";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wide text-ink-subtle";

type Props = {
  initial: DraftEditorInitial;
};

export function DraftEditorForm({ initial }: Props) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial.slug);
  const [title, setTitle] = useState(initial.title);
  const [category, setCategory] = useState(initial.category);
  const [preview, setPreview] = useState(initial.preview);
  const [imageSrc, setImageSrc] = useState(initial.imageSrc);
  const [whatHappened, setWhatHappened] = useState(initial.whatHappened);
  const [whyItMatters, setWhyItMatters] = useState(initial.whyItMatters);
  const [investorInsight, setInvestorInsight] = useState(initial.investorInsight);
  const [sourceUrl, setSourceUrl] = useState(initial.sourceUrl);
  const [sourceName, setSourceName] = useState(initial.sourceName);
  const [sourceAuthor, setSourceAuthor] = useState(initial.sourceAuthor);
  const [sourcePublishedAt, setSourcePublishedAt] = useState(
    initial.sourcePublishedAt,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const previewSource: ArticleSource = useMemo(
    () => ({
      url: sourceUrl || undefined,
      name: sourceName || undefined,
      author: sourceAuthor || undefined,
      publishedAt: sourcePublishedAt || undefined,
    }),
    [sourceUrl, sourceName, sourceAuthor, sourcePublishedAt],
  );

  const id = initial.internalId;
  const canRegenerate = Boolean(initial.originalInput?.trim());

  function buildPatch() {
    return {
      slug,
      title,
      category,
      preview,
      imageSrc,
      whatHappened,
      whyItMatters,
      investorInsight,
      source: {
        url: sourceUrl,
        name: sourceName,
        author: sourceAuthor,
        publishedAt: sourcePublishedAt,
      },
    };
  }

  async function save() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/drafts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPatch()),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? "Save failed");
        return;
      }
      setMessage("Saved");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function applySuggestedImage() {
    if (!initial.suggestedImageUrl) return;
    setImageSrc(initial.suggestedImageUrl);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/drafts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...buildPatch(),
          imageSrc: initial.suggestedImageUrl,
        }),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? "Could not apply image");
        return;
      }
      setMessage("Hero image set from page preview");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onUploadFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch(`/api/drafts/${id}/image`, {
        method: "POST",
        body: fd,
      });
      const body = (await res.json()) as { imageSrc?: string; error?: string };
      if (!res.ok) {
        setError(body.error ?? "Upload failed");
        return;
      }
      if (body.imageSrc) setImageSrc(body.imageSrc);
      setMessage("Image uploaded");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function regenerate() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/drafts/${id}/regenerate`, { method: "POST" });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? "Regenerate failed");
        return;
      }
      setMessage("Regenerated from stored input");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const patchRes = await fetch(`/api/drafts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPatch()),
      });
      const patchBody = (await patchRes.json()) as { error?: string };
      if (!patchRes.ok) {
        setError(patchBody.error ?? "Save before publish failed");
        return;
      }

      const res = await fetch(`/api/drafts/${id}/publish`, { method: "POST" });
      const body = (await res.json()) as { slug?: string | null; error?: string };
      if (!res.ok) {
        setError(body.error ?? "Publish failed");
        return;
      }
      const pubSlug = body.slug ?? slug;
      window.location.href = `/article/${pubSlug}`;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-muted disabled:opacity-60"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={() => void regenerate()}
          disabled={busy || !canRegenerate}
          title={
            canRegenerate
              ? "Re-run AI on the original URL or pasted text"
              : "Only available for drafts created from a link or pasted text"
          }
          className="rounded-lg border border-line bg-surface/95 px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-soft/60 disabled:opacity-60"
        >
          Regenerate from source
        </button>
        {initial.status !== "published" ? (
          <button
            type="button"
            onClick={() => void publish()}
            disabled={busy}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-60"
          >
            Publish
          </button>
        ) : (
          <a
            href={`/article/${slug}`}
            className="inline-flex items-center rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-soft/60"
          >
            View live article
          </a>
        )}
      </div>

      {message ? (
        <p className="text-sm font-medium text-emerald-800" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <section className="space-y-5 rounded-2xl border border-line bg-surface/95 p-6 shadow-panel sm:p-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Story</h2>
        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug (public URL)
          </label>
          <input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={`${inputClass} font-mono text-xs sm:text-sm`}
          />
        </div>
        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className={inputClass}
          >
            {ARTICLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="preview" className={labelClass}>
            Preview dek
          </label>
          <textarea
            id="preview"
            rows={3}
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-line bg-surface/95 p-6 shadow-panel sm:p-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Body</h2>
        <div>
          <label htmlFor="wh" className={labelClass}>
            What happened
          </label>
          <textarea
            id="wh"
            rows={8}
            value={whatHappened}
            onChange={(e) => setWhatHappened(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="wim" className={labelClass}>
            Market impact
          </label>
          <textarea
            id="wim"
            rows={8}
            value={whyItMatters}
            onChange={(e) => setWhyItMatters(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="inv" className={labelClass}>
            Strategic insight
          </label>
          <textarea
            id="inv"
            rows={8}
            value={investorInsight}
            onChange={(e) => setInvestorInsight(e.target.value)}
            className={inputClass}
          />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-line bg-surface/95 p-6 shadow-panel sm:p-8">
        <h2 className="font-serif text-lg font-semibold text-ink">Hero image</h2>
        <p className="text-sm text-ink-muted">
          Page preview images are best-effort only. Upload a rights-cleared file
          for production, or apply the suggested URL if you trust the host.
        </p>
        {imageSrc ? (
          <div className="relative aspect-[16/9] max-w-xl overflow-hidden rounded-xl border border-line bg-surface-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <p className="text-sm text-ink-muted">No hero image yet.</p>
        )}
        <div className="flex flex-wrap gap-3">
          {initial.suggestedImageUrl ? (
            <button
              type="button"
              onClick={() => void applySuggestedImage()}
              disabled={busy}
              className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-soft/60 disabled:opacity-60"
            >
              Use suggested page image
            </button>
          ) : null}
          <label className="inline-flex cursor-pointer items-center rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-soft/60">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onUploadFile(f);
                e.target.value = "";
              }}
            />
            Upload image
          </label>
        </div>
        <div>
          <label htmlFor="imageSrc" className={labelClass}>
            Image URL (optional override)
          </label>
          <input
            id="imageSrc"
            value={imageSrc}
            onChange={(e) => setImageSrc(e.target.value)}
            className={`${inputClass} font-mono text-xs sm:text-sm`}
            placeholder="/images/articles/… or https://…"
          />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-line bg-surface/95 p-6 shadow-panel sm:p-8">
        <h2 className="font-serif text-lg font-semibold text-ink">
          Source and credits
        </h2>
        <p className="text-sm text-ink-muted">
          These fields render on the public article page. Fill them even when the
          story started from pasted text so readers always see attribution.
        </p>
        <div>
          <label htmlFor="srcUrl" className={labelClass}>
            Source URL
          </label>
          <input
            id="srcUrl"
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className={inputClass}
            placeholder="https://…"
          />
        </div>
        <div>
          <label htmlFor="srcName" className={labelClass}>
            Publication / outlet name
          </label>
          <input
            id="srcName"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="srcAuthor" className={labelClass}>
            Author byline
          </label>
          <input
            id="srcAuthor"
            value={sourceAuthor}
            onChange={(e) => setSourceAuthor(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="srcPub" className={labelClass}>
            Original publish date
          </label>
          <input
            id="srcPub"
            type="date"
            value={
              sourcePublishedAt.length >= 10
                ? sourcePublishedAt.slice(0, 10)
                : ""
            }
            onChange={(e) => setSourcePublishedAt(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="rounded-xl border border-dashed border-brand/25 bg-brand-soft/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-subtle">
            Live credits preview
          </p>
          <div className="mt-4">
            <ArticleCredits source={previewSource} />
          </div>
        </div>
      </section>
    </div>
  );
}
