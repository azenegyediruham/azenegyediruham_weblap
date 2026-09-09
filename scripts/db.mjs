#!/usr/bin/env node
/**
 * Supabase adatbázis-műveletek a fejlesztői gépről (CI-ben NEM fut, nincs DB secret ott).
 *
 *   npm run db:push   -> migrationök alkalmazása a remote DB-re (supabase db push --db-url)
 *   npm run db:seed   -> supabase/seed.sql lefuttatása (psql-lel)
 *   npm run db:types  -> TypeScript típusok generálása src/lib/supabase/database.types.ts-be
 *
 * A kapcsolati stringet a .env.local SUPABASE_DB_URL változójából olvassa.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SUPABASE_CLI = "supabase@2.117.0";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const file = resolve(root, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

function run(cmd, args, opts = {}) {
  const isWin = process.platform === "win32";
  const result = spawnSync(isWin ? "cmd.exe" : cmd, isWin ? ["/c", cmd, ...args] : args, {
    stdio: opts.capture ? ["ignore", "pipe", "inherit"] : "inherit",
    cwd: root,
    env: process.env,
  });
  if (result.status !== 0) {
    const shown = args.filter((a) => !String(a).startsWith("postgres")).join(" ");
    console.error(`\nHIBA: ${cmd} ${shown} (exit ${result.status})`);
    process.exit(result.status ?? 1);
  }
  return result.stdout ? result.stdout.toString("utf8") : "";
}

function findPsql() {
  const candidates = [
    "psql",
    "C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe",
    "C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe",
    "C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe",
  ];
  for (const c of candidates) {
    const r = spawnSync(c, ["--version"], { stdio: "ignore" });
    if (r.status === 0) return c;
  }
  return null;
}

loadEnv();
const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error("Hiányzik a SUPABASE_DB_URL a .env.local fájlból.");
  process.exit(1);
}

const command = process.argv[2];
switch (command) {
  case "push": {
    console.log("> Migrationök alkalmazása (supabase db push)...");
    run("npx", ["-y", SUPABASE_CLI, "db", "push", "--db-url", dbUrl, ...process.argv.slice(3)]);
    break;
  }
  case "seed": {
    const psql = findPsql();
    if (!psql) {
      console.error(
        "Nem található psql. Telepítsd a PostgreSQL klienst, vagy futtasd a supabase/seed.sql-t a Supabase SQL Editorban.",
      );
      process.exit(1);
    }
    console.log("> Seed adatok betöltése (supabase/seed.sql)...");
    run(psql, [dbUrl, "-v", "ON_ERROR_STOP=1", "-f", resolve(root, "supabase/seed.sql")]);
    break;
  }
  case "types": {
    console.log("> TypeScript típusok generálása...");
    const out = run(
      "npx",
      ["-y", SUPABASE_CLI, "gen", "types", "typescript", "--db-url", dbUrl, "--schema", "public"],
      { capture: true },
    );
    const target = resolve(root, "src/lib/supabase/database.types.ts");
    writeFileSync(target, out.replace(/\r\n/g, "\n"));
    console.log(`OK: ${target}`);
    break;
  }
  default:
    console.error("Használat: node scripts/db.mjs <push|seed|types>");
    process.exit(1);
}
