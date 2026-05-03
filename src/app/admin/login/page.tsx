import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { createSupabaseServerClientNullable } from "@/lib/supabase/server";

export default async function AdminLoginPage() {
  const supabase = await createSupabaseServerClientNullable();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/admin/drafts");
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface/95 p-6 shadow-panel sm:p-8">
      <h1 className="font-serif text-2xl font-semibold text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Editor access only. Use the email and password provisioned in Supabase
        Auth.
      </p>
      <LoginForm />
    </div>
  );
}
