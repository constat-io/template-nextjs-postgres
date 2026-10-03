// GET /api/v1/version: which commit this running app was built from. Constat asks your live
// address this after a release, and calls the release live only when the answer is its commit.
// The deploy step Constat writes for your host passes the commit in; Render sets its own.
// It also names the database it talks to by a fingerprint — a hash of its host, port and name,
// nothing that opens it — so Constat can warn when a preview copy talks to the live database.
import { createHash } from 'node:crypto';

export const dynamic = 'force-dynamic';

function databaseFingerprint(): string | null {
  const address = process.env.DATABASE_URL;
  if (!address) return null;
  try {
    const u = new URL(address);
    return createHash('sha256').update(`${u.hostname}:${u.port}${u.pathname}`).digest('hex').slice(0, 12);
  } catch {
    return null;
  }
}

export function GET(): Response {
  // An empty value is no commit (the start file passes CONSTAT_COMMIT through, empty when unknown).
  const commit = process.env.NEXT_PUBLIC_CONSTAT_COMMIT
    || process.env.CONSTAT_COMMIT
    || process.env.RENDER_GIT_COMMIT
    || process.env.VERCEL_GIT_COMMIT_SHA
    || null;
  return Response.json({ commit, database: databaseFingerprint() });
}
