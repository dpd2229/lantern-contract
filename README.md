# lantern-contract

The shared wire contract between **Lantern** (the parent-facing app that writes journal
entries and the export file) and the **VI-Labs reader** (which ingests them). Both sides
depend on this one package so the format can never drift.

It contains **only** the pieces both sides must agree on:

- **Export types** — `LanternExport`, `JournalEntry`, `Statement`, `PictureBlock` (plus the
  supporting `DomainKey`, `Category`, `Flag` unions they are built from).
- **Construct registry** — the `ConstructId` union and the append-only `CONSTRUCT_IDS`
  list, the convergence key readers merge on. Plus `SCHEMA_VERSION`.
- **Seed-fragment codec** — `parseSeed` / `buildSeed` for the `#n=&q=&s=` referral
  fragment, DOM-free so both the QR panel (build) and Lantern (parse) share one core.
- **Checksum** — `crc32` and `canonicalize`, the integrity check over the canonicalised
  export. Both sides must hash identically.

No design tokens, no templates, no UI, no app dependencies. It is pure and
zero-runtime-dependency by design.

## Reader obligations

This package ships types and two pure functions. It contains no validator, so nothing in it
can enforce the rules below — a reader has to honour them, and a reader that does not will
fail in ways that look like corrupted data rather than like a bug.

**1. Recompute the checksum over the raw parsed JSON, never over a typed projection.**

`canonicalize` recursively sorts the keys of *whatever object it is handed*. Lantern computes
the checksum over the complete export with its own `checksum` field blanked:

```ts
data.checksum = crc32(canonicalize({ ...data, checksum: '' }));
```

A reader that parses the file, copies it onto its own `LanternExport`-shaped object, and
hashes *that* silently drops every field it does not recognise — and then reports a mismatch.
The file is intact; the projection is not. Because `LanternExport` is erased at runtime, this
mistake is invisible to the type system and would fire on every export from a version of
Lantern newer than the reader.

```ts
// Correct: hash what arrived.
const raw = JSON.parse(text) as Record<string, unknown>;
const expected = crc32(canonicalize({ ...raw, checksum: '' }));
const ok = expected === raw.checksum;

// Wrong: hashes only the fields this reader happens to know about.
const parsed: LanternExport = JSON.parse(text);
const expected = crc32(canonicalize({ ...pickKnownFields(parsed), checksum: '' }));
```

**2. Ignore unknown fields; never fail ingest on them.**

The export is additive by design. New fields may appear on `LanternExport`, on a
`JournalEntry`, or inside `picture` at any time, and `CONSTRUCT_IDS` and `CARDS` are
append-only, so a reader may meet a `constructId` or `cardId` it has never seen. Skip what
you do not understand and ingest the rest. Preserve unknown fields where you re-emit a
record, so a round trip through an older reader does not strip a newer writer's data.

**3. A checksum mismatch warns; it never rejects.**

The check exists to catch transit mangling — a messaging app re-encoding text, a truncated
download — not to authenticate anything. It is integrity, not security: there is deliberately
no signing and no encryption, because the file is the parent's property in the open. A
mismatched file is still the family's record and must still be readable. Say it may have been
damaged in transit; do not refuse to open it.

**Why this is documented rather than enforced:** as of this writing no reader exists, so the
rules cost nothing to adopt now and would cost a coordinated version bump to retrofit later.

## Install as a git dependency

```jsonc
// package.json
"dependencies": {
  "lantern-contract": "github:dpd2229/lantern-contract#<tag>"
}
```

Pin a tag, never a branch: both consumers must resolve the same bytes.

The built `dist/` is committed alongside the source, so consumers get a ready-to-use
package with no build step (no `prepare` hook) on install. For local development against a
checkout, a `file:` reference works too:

```jsonc
"lantern-contract": "file:../lantern-contract"
```

This package now lives in its own repository. Both Lantern and the VI-Labs platform consume
it by tag (`lantern-contract@v1.1.0` at the time of writing).

## Build

```sh
npm install
npm run build   # emits dist/ (JS + .d.ts)
```

## Usage

```ts
import {
  type LanternExport,
  crc32,
  canonicalize,
  parseSeed,
  buildSeed,
  CONSTRUCT_IDS,
} from 'lantern-contract';
```
