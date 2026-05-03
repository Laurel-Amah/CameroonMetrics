import { NewDraftForm } from "@/components/admin/NewDraftForm";

export default function AdminNewDraftPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
          New draft
        </h1>
        <p className="mt-2 max-w-xl text-sm text-ink-muted">
          Generate from a URL or pasted text when the AI API is available, or
          choose <span className="font-medium text-ink">Write manually</span>{" "}
          (or use the fallback after a failed extract) to compose and publish
          without any external API.
        </p>
      </div>
      <NewDraftForm />
    </div>
  );
}
