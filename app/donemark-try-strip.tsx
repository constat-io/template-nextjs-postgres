'use client';
// DoneMark's try strip (template 49): in try mode only, what the app said — the server's errors and the
// browser's — in words at the bottom of every page, told to DoneMark with the try's own key: words, time,
// method and path; never page contents or what anybody typed.
import { useEffect, useState } from 'react';

type Said = { at: string; kind: 'server' | 'browser'; method: string | null; path: string | null; words: string };

/** The try's key and DoneMark's address: from the server on a machine, from the address's fragment in the cloud. */
function theTry(keyFromServer: string | null, baseFromServer: string | null): { key: string | null; base: string | null } {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  let key = keyFromServer || hash.get('donemark');
  let base = baseFromServer || hash.get('at');
  try {
    key = key || sessionStorage.getItem('donemark-try-key');
    base = base || sessionStorage.getItem('donemark-try-at');
    if (key) sessionStorage.setItem('donemark-try-key', key);
    if (base) sessionStorage.setItem('donemark-try-at', base);
  } catch { /* a browser that keeps nothing still shows the strip */ }
  return { key, base };
}

/** A page erroring in a loop is shown, but told to DoneMark at most this often. */
const TELLS_PER_MINUTE = 20;

const line = (s: Said) => `${new Date(s.at).toLocaleTimeString()} · ${s.method ? `${s.method} ` : ''}${s.path ?? ''} · ${s.words}`;

export function DonemarkTryStrip({ keyFromServer, baseFromServer }: { keyFromServer: string | null; baseFromServer: string | null }) {
  const [said, setSaid] = useState<Said[]>([]);
  const [open, setOpen] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const { key, base } = theTry(keyFromServer, baseFromServer);
    const keep = (s: Said) => setSaid((all) => [s, ...all.filter((x) => !(x.at === s.at && x.words === s.words))].slice(0, 20));
    // Told once, across reloads of this tab; the same words again within five seconds are not told again;
    // and never more than TELLS_PER_MINUTE a minute.
    let told: string[] = [];
    try { told = JSON.parse(sessionStorage.getItem('donemark-try-told') || '[]'); } catch { /* none kept */ }
    const lastSaid = new Map<string, number>();
    let minute: number[] = [];
    const tell = (s: Said) => {
      if (!key || !base) return;
      const id = `${s.kind}|${s.at}|${s.words}`;
      const now = Date.now();
      if (told.includes(id) || now - (lastSaid.get(s.words) ?? 0) < 5000) return;
      minute = minute.filter((t) => now - t < 60_000);
      if (minute.length >= TELLS_PER_MINUTE) return;
      minute.push(now);
      lastSaid.set(s.words, now);
      told = [id, ...told].slice(0, 50);
      try { sessionStorage.setItem('donemark-try-told', JSON.stringify(told)); } catch { /* told this time only */ }
      void fetch(`${base.replace(/\/$/, '')}/api/v1/tries/report-error`, {
        method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' }, body: JSON.stringify(s),
      }).catch(() => undefined);
    };
    const browser = (words: string, method: string | null = null, path: string | null = window.location.pathname) => {
      const s: Said = { at: new Date().toISOString(), kind: 'browser', method, path, words: words.slice(0, 300) };
      keep(s);
      tell(s);
    };
    const onError = (e: ErrorEvent) => browser(e.message || 'A script on this page stopped.');
    const onRejection = (e: PromiseRejectionEvent) => browser(e.reason instanceof Error ? e.reason.message : String(e.reason));
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    // An answer of 500 and above to the page's own requests — a form that "did nothing" — is said too.
    const original = window.fetch.bind(window);
    const wrapper = async (input: RequestInfo | URL, init?: RequestInit) => {
      const answer = await original(input, init);
      if (answer.status >= 500) {
        const href = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin && !url.pathname.startsWith('/api/donemark-try')) {
          const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
          browser(`answered ${answer.status}`, method, url.pathname);
        }
      }
      return answer;
    };
    window.fetch = wrapper;

    // The server's own errors, kept by its hook. In the cloud the server has no key — the key came in the
    // address — so the strip tells DoneMark of them itself.
    let seen = new Set<string>();
    const poll = setInterval(async () => {
      try {
        const r = await original('/api/donemark-try/errors', { cache: 'no-store' });
        if (!r.ok) return;
        for (const s of (await r.json()) as Said[]) {
          const id = `${s.at}|${s.words}`;
          if (seen.has(id)) continue;
          // The server keeps 20: what it no longer lists is not remembered either.
          if (seen.size > 100) seen = new Set([...seen].slice(-40));
          seen.add(id);
          keep(s);
          if (!keyFromServer) tell(s);
        }
      } catch { /* the next tick asks again */ }
    }, 3000);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
      // Only if nothing wrapped it after the strip did.
      if (window.fetch === wrapper) window.fetch = original;
      clearInterval(poll);
    };
  }, [keyFromServer, baseFromServer]);

  if (hidden) return null;
  const n = said.length;
  async function copy() {
    const text = said.map(line).join('\n');
    try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setOpen(true); }
  }
  const button = { background: 'transparent', color: '#bfe8e5', border: '1px solid #4a5260', borderRadius: 6, padding: '3px 10px', font: 'inherit', cursor: 'pointer' } as const;
  return (
    <div role="region" aria-label="DoneMark try" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 2147483000, background: '#1d2026', color: '#e8eaee', font: '13px/1.45 ui-sans-serif, system-ui, sans-serif', borderTop: '1px solid #2e333b' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '6px 14px', flexWrap: 'wrap' }}>
        <b>DoneMark · Try</b>
        <span style={{ color: '#9aa3ae' }}>{n === 0 ? 'Nothing has gone wrong so far.' : 'What the app said, newest first.'}</span>
        {n > 0 ? <button type="button" style={{ ...button, color: '#ffd3c1', borderColor: '#7a4028' }} onClick={() => setOpen((o) => !o)}>{n} {n === 1 ? 'error' : 'errors'}</button> : null}
        <button type="button" style={{ ...button, marginLeft: 'auto' }} onClick={() => setHidden(true)}>Hide</button>
      </div>
      {open && n > 0 ? (
        <div style={{ maxHeight: 180, overflowY: 'auto', borderTop: '1px solid #2e333b' }}>
          {said.map((s, i) => (
            <div key={`${s.at}-${i}`} style={{ padding: '6px 14px', fontFamily: 'ui-monospace, monospace', color: '#ffd3c1', overflowWrap: 'anywhere' }}>{line(s)}</div>
          ))}
          <div style={{ padding: '6px 14px' }}>
            <button type="button" style={button} onClick={() => void copy()}>{copied ? 'Copied — paste it in your look' : 'Copy for my look'}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
