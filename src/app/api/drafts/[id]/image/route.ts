import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await ctx.params;
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const type = file.type || "application/octet-stream";
    if (!ALLOWED.has(type)) {
      return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
    }

    const ext =
      type === "image/jpeg"
        ? "jpg"
        : type === "image/png"
          ? "png"
          : type === "image/webp"
            ? "webp"
            : "svg";

    const path = `${user.id}/${id}-${crypto.randomUUID()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());

    const { error: upError } = await supabase.storage
      .from("article-images")
      .upload(path, buf, {
        contentType: type,
        upsert: true,
      });

    if (upError) throw upError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("article-images").getPublicUrl(path);

    const { error: dbError } = await supabase
      .from("articles")
      .update({ image_src: publicUrl })
      .eq("id", id);

    if (dbError) throw dbError;

    return NextResponse.json({ imageSrc: publicUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
