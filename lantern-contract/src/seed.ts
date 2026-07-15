// Seed fragment — the referral hand-off between the VI-Labs QR panel and Lantern.
//
// Everything rides in the URL fragment: `#n=Arya&q=Sarah&s=seeing-its-you`. Fragments
// never reach any server or log. The QR panel BUILDS one client-side; Lantern PARSES it on
// first open, saves the values locally, then strips the fragment. This module is the pure,
// DOM-free core of both sides — the app supplies `location.hash` and the storage writes.
//
//   n = child's first name
//   q = QTVI (vision teacher) first name
//   s = seeded start card id

export interface SeedFields {
  n: string | null; // child's first name
  q: string | null; // QTVI first name
  s: string | null; // seeded start card id
}

// Parse a seed fragment into its fields, or null when the hash is not a seed.
//
// A seed fragment carries `key=value` pairs; route hashes (`#card/…`, `#see`, `#picture`)
// do not. A leading `#` is accepted and ignored. Returns null when there is no `=` at all,
// or when none of n/q/s are present — so plain route hashes are never mistaken for a seed.
export function parseSeed(hash: string): SeedFields | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw || !raw.includes('=')) return null;

  const params = new URLSearchParams(raw);
  const n = params.get('n');
  const q = params.get('q');
  const s = params.get('s');
  if (!n && !q && !s) return null;

  return { n, q, s };
}

// Build a seed fragment from fields — the inverse of `parseSeed`, for the referral link /
// QR panel. Empty and missing fields are omitted; percent-encoding is handled by
// URLSearchParams so `parseSeed` recovers the exact values. Returns '' when nothing is set.
export function buildSeed(fields: Partial<SeedFields>): string {
  const params = new URLSearchParams();
  if (fields.n) params.set('n', fields.n);
  if (fields.q) params.set('q', fields.q);
  if (fields.s) params.set('s', fields.s);
  const qs = params.toString();
  return qs ? `#${qs}` : '';
}
