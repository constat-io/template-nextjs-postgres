// DoneMark's try mode (template 49): when the app is tried, a server error is kept for the strip and told
// to DoneMark with the try's own key — its words, method and path; never contents or values. Outside try
// mode (DONEMARK_TRY unset, as in any live deployment) this does nothing.
type Said = { at: string; kind: 'server'; method: string | null; path: string | null; words: string };
const kept = (): Said[] => ((globalThis as { __donemarkTryErrors?: Said[] }).__donemarkTryErrors ??= []);

export async function onRequestError(err: unknown, request: { method?: string; path?: string }): Promise<void> {
  if (process.env.DONEMARK_TRY !== '1') return;
  const words = (err instanceof Error ? err.message : String(err)).split('\n')[0]!.slice(0, 300);
  // The path only: a query or fragment can carry what somebody typed, or a reset link's token.
  const path = request.path ? request.path.split(/[?#]/)[0] || null : null;
  const said: Said = { at: new Date().toISOString(), kind: 'server', method: request.method ?? null, path, words };
  const list = kept();
  list.unshift(said);
  if (list.length > 20) list.length = 20;
  const key = process.env.DONEMARK_TRY_KEY;
  const base = process.env.DONEMARK_URL;
  if (key && base) {
    await fetch(`${base.replace(/\/$/, '')}/api/v1/tries/report-error`, {
      method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' }, body: JSON.stringify(said),
      // Next waits for this hook: the error page never waits on DoneMark longer than this.
      signal: AbortSignal.timeout(3000),
    }).catch(() => undefined);
  }
}
