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
//# sourceMappingURL=schema.js.map