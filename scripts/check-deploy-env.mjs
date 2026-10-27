// Run before `npm run deploy`. Shop pages are pre-rendered during the build, so the build
// must read the live D1 database (over Cloudflare's API), never local test data.
import { existsSync, readFileSync } from "node:fs";

const file = ".env.production.local";
const fromFile = existsSync(file)
  ? Object.fromEntries(
      readFileSync(file, "utf8")
        .split(/\r?\n/)
        .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
        .filter(Boolean)
        .map((m) => [m[1], m[2].replace(/^["']|["']$/g, "")]),
    )
  : {};

const required = ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN", "D1_DATABASE_ID"];
const missing = required.filter((k) => !process.env[k] && !fromFile[k]);

if (missing.length) {
  console.error(`\nCan't deploy yet: missing ${missing.join(", ")}.`);
  console.error(`Add them to ${file} (it is never committed). See README.md → Deploy.\n`);
  process.exit(1);
}
console.log("Deploy settings found. The build will read the live database.");
