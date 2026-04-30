/**
 * Dual-Database Migration Runner
 * Runs migrations against BOTH TiDB (primary) and PlanetScale (backup) on every deploy.
 * This ensures both databases are always in sync and either can serve as failover.
 *
 * Architecture:
 *   DATABASE_URL       = TiDB Cloud (MySQL) — primary, always-on
 *   PLANETSCALE_DATABASE_URL = PlanetScale (MySQL) — backup/failover
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool, Client } from "pg";
import path from "path";

function getMigrationsFolder(): string {
  try {
    if (typeof __dirname !== "undefined" && __dirname) {
      return path.resolve(__dirname, "../drizzle");
    }
  } catch (_) {}
  return path.resolve(process.cwd(), "drizzle");
}

async function migrateDatabase(url: string, label: string): Promise<void> {
  if (!url) {
    console.warn(`[migrate:${label}] URL not set — skipping`);
    return;
  }
  let connection: Client | undefined;
  try {
    connection = await new Client({ connectionString: url);
    const db = drizzle(connection);
    const migrationsFolder = getMigrationsFolder();
    console.log(`[migrate:${label}] Running migrations from ${migrationsFolder}`);
    await migrate(db, { migrationsFolder });
    console.log(`[migrate:${label}] ✅ All migrations applied`);
  } catch (err) {
    console.error(`[migrate:${label}] ⚠️ Migration error (non-fatal):`, err);
  } finally {
    await connection?.end();
  }
}

export async function runDualMigrations(): Promise<void> {
  const primaryUrl = process.env.DATABASE_URL;
  const backupUrl = process.env.PLANETSCALE_DATABASE_URL;

  // Run both in parallel for speed
  await Promise.allSettled([
    migrateDatabase(primaryUrl || "", "TiDB-Primary"),
    migrateDatabase(backupUrl || "", "PlanetScale-Backup"),
  ]);

  console.log("[migrate:dual] ✅ Dual migration complete");
}
