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

## Install as a git dependency

```jsonc
// package.json
"dependencies": {
  "lantern-contract": "git+https://github.com/dpd2229/VI-Labs-Lantern.git#<ref>"
}
```

The built `dist/` is committed alongside the source, so consumers get a ready-to-use
package with no build step (no `prepare` hook) on install. For local development against a
checkout, a `file:` reference works too:

```jsonc
"lantern-contract": "file:../lantern-contract"
```

While this package still lives inside the Lantern repo it is wired as an npm **workspace**
(see the root `package.json`), so a plain `npm install` at the repo root links it. The
committed `dist/` is used as-is. When it graduates to its own repo, swap the consumer's
dependency for the `git+https://…` form above — nothing else changes.

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
