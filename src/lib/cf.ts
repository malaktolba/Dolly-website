import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function cfEnv() {
  return (await getCloudflareContext({ async: true })).env;
}

type Row = Record<string, unknown>;

/**
 * Read-only query that works both at runtime (D1 binding) and during `next build`.
 * When pages are pre-rendered on Cloudflare's build servers there is no local database,
 * so if build credentials are provided we read the live database over Cloudflare's API.
 */
export async function readRows<T = Row>(sql: string, ...params: unknown[]): Promise<T[]> {
  const { CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token, D1_DATABASE_ID: db } = process.env;
  if (process.env.NEXT_PHASE === "phase-production-build" && account && token && db) {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${db}/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql, params }),
    });
    const json = (await res.json()) as { success: boolean; errors?: unknown; result?: { results: T[] }[] };
    if (!json.success) throw new Error(`D1 API query failed: ${JSON.stringify(json.errors)}`);
    return json.result?.[0]?.results ?? [];
  }
  const { DB } = await cfEnv();
  try {
    return (await DB.prepare(sql).bind(...params).all<T>()).results;
  } catch (err) {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      throw new Error(
        "Building pages needs the product database. Locally run `npm run db:migrate:local`; " +
          "for a deploy set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN and D1_DATABASE_ID (see README).",
        { cause: err },
      );
    }
    throw err;
  }
}
