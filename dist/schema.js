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
export const CONSTRUCT_IDS = [
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
export const CARDS = [
    { cardId: 'seeing-its-you', title: 'Seeing it’s you', constructId: 'recognition', domain: 'see' },
    { cardId: 'lights-on', title: 'Lights on', constructId: 'salience-light', domain: 'see' },
    { cardId: 'spotlight-it', title: 'Spotlight it', constructId: 'salience-light', domain: 'see' },
    { cardId: 'near-and-close', title: 'Near and close', constructId: 'distance', domain: 'see' },
    { cardId: 'one-thing-at-a-time', title: 'One thing at a time', constructId: 'complexity', domain: 'find' },
    { cardId: 'favourite-things', title: 'Favourite things', constructId: 'motivation', domain: 'use' },
    { cardId: 'look-then-reach', title: 'Look, then reach', constructId: 'guided-reach', domain: 'use' },
    { cardId: 'the-leading-sense', title: 'The leading sense', constructId: 'sensory-channels', domain: 'sens' },
    { cardId: 'following-and-finding', title: 'Following and finding', constructId: 'tracking', domain: 'find' },
    { cardId: 'one-sense-at-a-time', title: 'One sense at a time', constructId: 'divided-attention', domain: 'sens' },
    { cardId: 'making-choices', title: 'Making choices', constructId: 'visual-choice', domain: 'use' },
    { cardId: 'rest-and-recharge', title: 'Rest and recharge', constructId: 'fatigue', domain: 'sens' },
    { cardId: 'best-side', title: '{name}’s best side', constructId: 'field-preference', domain: 'find' },
];
//# sourceMappingURL=schema.js.map