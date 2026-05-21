"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type InputMode = "url" | "text" | "manual";

export function NewDraftForm() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("url");
  const [urls, setUrls] = useState<string[]>([""]);
  const [texts, setTexts] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showManualFallback, setShowManualFallback] = useState(false);

  useEffect(() => {
    setShowManualFallback(false);
    setError(null);
  }, [mode]);

  function updateUrlAt(i: number, v: string) {
    setUrls((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  }

  function addUrl() {
    setUrls((prev) => [...prev, ""]);
  }

  function removeUrl(i: number) {
    setUrls((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  function updateTextAt(i: number, v: string) {
    setTexts((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  }

  function addText() {
    setTexts((prev) => [...prev, ""]);
  }

  function removeText(i: number) {
    setTexts((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  async function createManualDraft() {
    setLoading(true);
    setError(null);
    setShowManualFallback(false);
    try {
      const res = await fetch("/api/drafts/manual", { method: "POST" });
      const body = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) {
        setError(body.error ?? "Could not create a blank draft");
        return;
      }
      if (!body.id) {
        setError("No draft id returned");
        return;
      }
      router.push(`/admin/drafts/${body.id}`);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "manual") {
      await createManualDraft();
      return;
    }

    setLoading(true);
    setError(null);
    setShowManualFallback(false);
    try {
      const trimmedUrls = urls.map((u) => u.trim()).filter(Boolean);
      const trimmedTexts = texts.map((t) => t.trim()).filter(Boolean);
      const payload =
        mode === "url"
          ? trimmedUrls.length <= 1
            ? { url: trimmedUrls[0] ?? "" }
            : { urls: trimmedUrls }
          : trimmedTexts.length <= 1
            ? { text: trimmedTexts[0] ?? "" }
            : { texts: trimmedTexts };

      const res = await fetch("/api/drafts/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Request failed");
        setShowManualFallback(true);
        return;
      }
      if (!data.id) {
        setError("No draft id returned");
        return;
      }
      router.push(`/admin/drafts/${data.id}`);
    } finally {
      setLoading(false);
    }
  }

  const modeTabs = (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setMode("url")}
        className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
          mode === "url"
            ? "bg-brand text-white"
            : "border border-line bg-surface-soft text-ink-muted"
        }`}
      >
        From URL
      </button>
      <button
        type="button"
        onClick={() => setMode("text")}
        className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
          mode === "text"
            ? "bg-brand text-white"
            : "border border-line bg-surface-soft text-ink-muted"
        }`}
      >
        Pasted text
      </button>
      <button
        type="button"
        onClick={() => setMode("manual")}
        className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
          mode === "manual"
            ? "bg-brand text-white"
            : "border border-line bg-surface-soft text-ink-muted"
        }`}
      >
        Write manually
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-line bg-surface/95 p-6 shadow-panel sm:p-8"
      >
        {modeTabs}

        {mode === "manual" ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-ink-muted">
              Create an empty draft and fill in every field yourself—no AI or
              external API required. Use Save draft and Publish when ready.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-muted disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create blank draft"}
            </button>
          </div>
        ) : (
          <>
            {mode === "url" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                    Source URLs
                  </label>
                  <button
                    type="button"
                    onClick={addUrl}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-brand-soft/60"
                  >
                    Add another source
                  </button>
                </div>

                <div className="space-y-3">
                  {urls.map((u, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        id={i === 0 ? "src-url" : undefined}
                        type="url"
                        required={i === 0}
                        placeholder="https://…"
                        value={u}
                        onChange={(e) => updateUrlAt(i, e.target.value)}
                        className="w-full rounded-lg border border-line bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/25"
                      />
                      <button
                        type="button"
                        onClick={() => removeUrl(i)}
                        disabled={urls.length <= 1}
                        className="rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-brand-soft/60 disabled:opacity-50"
                        title="Remove this source"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                    Source texts
                  </label>
                  <button
                    type="button"
                    onClick={addText}
                    className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-brand-soft/60"
                  >
                    Add another source
                  </button>
                </div>

                <div className="space-y-3">
                  {texts.map((t, i) => (
                    <div key={i} className="space-y-2">
                      <textarea
                        id={i === 0 ? "src-text" : undefined}
                        required={i === 0}
                        rows={10}
                        value={t}
                        onChange={(e) => updateTextAt(i, e.target.value)}
                        className="w-full rounded-lg border border-line bg-surface-soft px-3 py-2 text-sm text-ink outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/25"
                        placeholder="Paste the full article text here…"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeText(i)}
                          disabled={texts.length <= 1}
                          className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-brand-soft/60 disabled:opacity-50"
                          title="Remove this source"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            {showManualFallback ? (
              <div
                className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm"
                role="status"
              >
                <p className="font-medium text-ink">
                  AI extraction failed or the API is unavailable. You can still
                  publish by writing the article yourself.
                </p>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void createManualDraft()}
                  className="mt-3 rounded-lg border border-brand/40 bg-surface px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft/50 disabled:opacity-60"
                >
                  Create blank draft instead
                </button>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-muted disabled:opacity-60"
            >
              {loading ? "Generating draft…" : "Generate draft"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
