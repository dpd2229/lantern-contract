export declare const SCHEMA_VERSION = 1;
export type DomainKey = 'see' | 'find' | 'use' | 'sens';
export type ConstructId = 'recognition' | 'salience-light' | 'distance' | 'complexity' | 'field-preference' | 'tracking' | 'guided-reach' | 'visual-choice' | 'motivation' | 'sensory-channels' | 'divided-attention' | 'fatigue';
export declare const CONSTRUCT_IDS: readonly ConstructId[];
export interface Card {
    cardId: string;
    title: string;
    constructId: ConstructId;
    domain: DomainKey;
}
export declare const CARDS: readonly Card[];
export type Category = 'strength' | 'support' | 'watch';
export type Flag = 'shines' | 'talk';
export interface Statement {
    domain: DomainKey;
    category: Category;
    text: string;
}
export interface JournalEntry {
    entryId: string;
    cardId: string;
    constructId: ConstructId;
    domain: DomainKey;
    timestamp: string;
    response: string;
    cascadePath?: string[];
    otherWays?: string[];
    words?: string;
    tipTried?: boolean;
    flags?: Flag[];
    talkNote?: string;
    statements: Statement[];
}
export interface PictureBlock {
    current: Statement[];
    shines: {
        entryId: string;
        text: string;
    }[];
    talk: {
        entryId: string;
        text: string;
        note?: string;
    }[];
    coverage: Record<DomainKey, number>;
    epigraph?: {
        text: string;
        attribution: string;
    };
}
export interface LanternExport {
    schemaVersion: typeof SCHEMA_VERSION;
    exportedAt: string;
    appVersion: string;
    checksum: string;
    child: {
        firstName: string;
    };
    referral?: {
        qtviFirstName?: string;
        seededCardId?: string;
    };
    motivators: string[];
    entries: JournalEntry[];
    picture: PictureBlock;
}
//# sourceMappingURL=schema.d.ts.map