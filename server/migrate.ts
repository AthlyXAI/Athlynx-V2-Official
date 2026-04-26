/**
 * run-migrations.ts
 *
 * Applies any pending Drizzle migrations against the PlanetScale database.
 * Called once at server startup (from entry.ts) so migrations run in the
 * Vercel serverless runtime where DATABASE_URL is available — NOT during
 * the build step where it is not.
 *
 * Safe to call on every cold-start: drizzle migrate is idempotent and tracks
 * applied migrations in the __drizzle_migrations table.
 */

import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runMigrations(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[migrate] DATABASE_URL not set — skipping migrations");
    return;
  }

  let connection: mysql.Connection | undefined;
  try {
    connection = await mysql.createConnection(url);
    const db = drizzle(connection);

    // Migrations folder is relative to the compiled output location.
    // In Vercel CJS build the compiled api/index.js is at repo root /api/,
    // so we resolve the drizzle folder relative to the project root.
    const migrationsFolder = path.resolve(__dirname, "../drizzle");

    console.log("[migrate] Running pending migrations from", migrationsFolder);
    await migrate(db, { migrationsFolder });
    console.log("[migrate] ✅ All migrations applied");
  } catch (err) {
    // Log but do NOT crash the server — the app can still serve requests
    // even if the migration step fails (tables may already exist).
    console.error("[migrate] ⚠️  Migration error (non-fatal):", err);
  } finally {
    await connection?.end();
  }
}
