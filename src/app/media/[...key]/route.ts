import { cfEnv } from "@/lib/cf";

// Serves product photos uploaded through the admin. Keys are unique, so responses can be cached forever.
export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  const { MEDIA } = await cfEnv();
  const { value, metadata } = await MEDIA.getWithMetadata<{ contentType?: string }>(key, "stream");
  if (!value) return new Response("Not found", { status: 404 });
  return new Response(value, {
    headers: {
      "Content-Type": metadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
