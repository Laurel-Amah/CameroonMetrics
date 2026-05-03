import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function createServerClientWithCookies() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Parameters<typeof cookieStore.set>[2];
        }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component without mutable cookies — ignore
        }
      },
    },
  });
}

export async function createSupabaseServerClientNullable() {
  return createServerClientWithCookies();
}

export async function createSupabaseServerClient() {
  const client = await createServerClientWithCookies();
  if (!client) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return client;
}

/** Anon client for build-time / public reads (no cookies). */
export function createSupabaseAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
}
