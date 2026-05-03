import { redirect } from "next/navigation";
import { createSupabaseServerClientNullable } from "@/lib/supabase/server";

export default async function AdminDraftsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClientNullable();
  if (!supabase) {
    return <>{children}</>;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
