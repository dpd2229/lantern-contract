// The Lantern data contract — export shape and construct registry.
//
// This module is the interface between Lantern (which writes journal entries and the
// export file) and the VI-Labs reader (which ingests them). It has zero app and zero
// runtime dependencies, so both sides share one source of truth for the wire format.
//
// Cards are journal entries, not assessments: no scores, no right/wrong. Statements are
// authored WITH each card and snapshotted at save — deterministic assembly, never
// interpretation. The `{name}` token stays in stored text and is interpolated only at
// render/export by the consuming app, so a child's name never lands in storage.

export const SCHEMA_VERSION = 1;

export type DomainKey = 'see' | 'find' | 'use' | 'sens';

// ---- Construct registry (export brief §4, locked with the card set) ---------
// `constructId` aligns home evidence with CVI Classroom Insights sections without
// string-matching titles — the convergence key the subscribed reader merges on. One value
// per card (many cards may share a construct, e.g. both lighting cards). The registry is
// append-only: new cards may declare a new construct, but existing values never change.

export type ConstructId =
  | 'recognition'
  | 'salience-light'
  | 'distance'
  | 'complexity'
  | 'field-preference'
  | 'tracking'
  | 'guided-reach'
  | 'visual-choice'
  | 'motivation'
  | 'sensory-channels'
  | 'divided-attention'
  | 'fatigue';

export const CONSTRUCT_IDS: readonly ConstructId[] = [
  'recognition',
  'salience-light',
  'distance',
  'complexity',
  'field-preference',
  'tracking',
  'guided-reach',
  'visual-choice',
  'motivation',
  'sensory-channels',
  'divided-attention',
  'fatigue',
];

// ---- Card set (append-only, locked with the construct registry) -------------
// The authored card set. Each card declares its `constructId` (the convergence key) and
// its home `domain`; those values are copied onto a `JournalEntry` at save. Titles keep the
// literal `{name}` token — interpolated only at render/export, never stored with a child's
// name. Append-only alongside `CONSTRUCT_IDS`: new cards may be added, existing ones fixed.

export interface Card {
  cardId: string;
  title: string;
  constructId: ConstructId;
  domain: DomainKey;
}

export const CARDS: readonly Card[] = [
  { cardId: 'seeing-its-you',        title: 'Seeing it’s you',   constructId: 'recognition',       domain: 'see'  },
  { cardId: 'lights-on',             title: 'Lights on',         constructId: 'salience-light',    domain: 'see'  },
  { cardId: 'spotlight-it',          title: 'Spotlight it',      constructId: 'salience-light',    domain: 'see'  },
  { cardId: 'near-and-close',        title: 'Near and close',    constructId: 'distance',          domain: 'see'  },
  { cardId: 'one-thing-at-a-time',   title: 'One thing at a time', constructId: 'complexity',      domain: 'find' },
  { cardId: 'favourite-things',      title: 'Favourite things',  constructId: 'motivation',        domain: 'use'  },
  { cardId: 'look-then-reach',       title: 'Look, then reach',  constructId: 'guided-reach',      domain: 'use'  },
  { cardId: 'the-leading-sense',     title: 'The leading sense', constructId: 'sensory-channels',  domain: 'sens' },
  { cardId: 'following-and-finding', title: 'Following and finding', constructId: 'tracking',      domain: 'find' },
  { cardId: 'one-sense-at-a-time',   title: 'One sense at a time', constructId: 'divided-attention', domain: 'sens' },
  { cardId: 'making-choices',        title: 'Making choices',    constructId: 'visual-choice',     domain: 'use'  },
  { cardId: 'rest-and-recharge',     title: 'Rest and recharge', constructId: 'fatigue',           domain: 'sens' },
  { cardId: 'best-side',             title: '{name}’s best side', constructId: 'field-preference', domain: 'find' },
];

export type Category = 'strength' | 'support' | 'watch';

// Two flags a parent can pin to any saved entry. No severity, no ratings:
// `shines` lifts the statement to the top of the picture; `talk` joins the parent's own
// "To talk about together" agenda for the next QTVI conversation.
export type Flag = 'shines' | 'talk';

export interface Statement {
  domain: DomainKey;
  category: Category;
  text: string; // plain English; keeps the literal `{name}` token until render/export
}

// ---- Journal (append-only) --------------------------------------------------

export interface JournalEntry {
  entryId: string; // crypto.randomUUID()
  cardId: string;
  constructId: ConstructId; // convergence key (export brief §3/§4); copied from the card at save
  domain: DomainKey; // the card's home domain; copied from the card at save
  timestamp: string; // ISO 8601
  response: string; // chosen chip id
  cascadePath?: string[]; // ordered probe ids taken when the primary was flat (export brief §3)
  otherWays?: string[]; // selected alternative-response ids (the out)
  words?: string; // parent's own words, verbatim
  tipTried?: boolean;
  flags?: Flag[]; // parent-pinned flags (set plan §2)
  talkNote?: string; // optional "what would help" note, prompted softly by the `talk` flag (§2)
  // NOTE: brief §2 types this as a singular `statement`, but §4 requires recording the
  // chip statement AND every selected other-ways statement. We store an array — the only
  // shape that satisfies §4. Flagged for VI-Labs sign-off.
  statements: Statement[];
}

// ---- Export contract (export brief §3, authoritative) -----------------------
// One file, two readers (export brief §1): the parent's PDF and the QTVI's tools consume
// the same structure. The `picture` block is DERIVED at export so any reader can render the
// family's current picture at zero cost; it is recomputable from `entries` and never gated.
// Statements keep the literal `{name}` token — data minimisation (§1): the child's name
// lives only in `child.firstName`, interpolated at render.

export interface PictureBlock {
  current: Statement[]; // latest statement per card, strengths first
  shines: { entryId: string; text: string }[]; // pinned highlights (set plan §2)
  talk: { entryId: string; text: string; note?: string }[]; // the parent's "to talk about" agenda
  coverage: Record<DomainKey, number>; // 0–1 per domain; drives lanterns, never shown as a number
  epigraph?: { text: string; attribution: string }; // parent-chosen words for the sky (optional)
}

export interface LanternExport {
  schemaVersion: typeof SCHEMA_VERSION;
  exportedAt: string; // ISO 8601
  appVersion: string;
  checksum: string; // CRC32 of the canonicalised export (checksum blanked) — integrity, not security
  child: { firstName: string };
  referral?: { qtviFirstName?: string; seededCardId?: string };
  motivators: string[]; // from Favourite things, most-recent order
  entries: JournalEntry[]; // append-only, complete, chronological
  picture: PictureBlock; // derived at export; the free tier renders this
}
