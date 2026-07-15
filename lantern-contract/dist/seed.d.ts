export interface SeedFields {
    n: string | null;
    q: string | null;
    s: string | null;
}
export declare function parseSeed(hash: string): SeedFields | null;
export declare function buildSeed(fields: Partial<SeedFields>): string;
//# sourceMappingURL=seed.d.ts.map