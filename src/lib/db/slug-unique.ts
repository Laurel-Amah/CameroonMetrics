import type { SupabaseClient } from "@supabase/supabase-js";
import { slugify, uniqueSlugSuffix } from "@/lib/slug";

export async function allocateUniqueSlug(
  supabase: SupabaseClient,
  preferredSlug: string,
): Promise<string> {
  let candidate = slugify(preferredSlug);
  for (let i = 0; i < 14; i++) {
    const { count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("slug", candidate);

    if (error) throw error;
    if (!count) return candidate;
    candidate = `${slugify(preferredSlug)}-${uniqueSlugSuffix()}`;
  }
  throw new Error("Could not allocate a unique slug");
}
