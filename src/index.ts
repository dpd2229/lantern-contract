// lantern-contract — the shared wire contract between Lantern and the VI-Labs reader.
//
// Contains only what both sides must agree on: the export shape, the construct registry,
// the seed-fragment codec, and the integrity checksum. No design tokens, no templates, no
// UI — those stay in the apps that consume this package.

export {
  SCHEMA_VERSION,
  CONSTRUCT_IDS,
  CARDS,
} from './schema.js';
export type {
  DomainKey,
  ConstructId,
  Category,
  Flag,
  Card,
  Statement,
  JournalEntry,
  PictureBlock,
  LanternExport,
} from './schema.js';

export { crc32, canonicalize } from './checksum.js';

export { parseSeed, buildSeed } from './seed.js';
export type { SeedFields } from './seed.js';
