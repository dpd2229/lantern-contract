// Integrity, not security (export brief §2). A CRC32 over the canonicalised export detects
// transit mangling — messaging apps re-encoding text, a truncated download — and lets the
// reader WARN (never fail) on mismatch. Deliberately no signing or encryption: the file is
// the parent's property in the open.
//
// This module is zero-dependency and pure so both Lantern and the VI-Labs reader hash
// byte-identically — both sides must canonicalise and hash the same way.
// Standard IEEE 802.3 CRC32, table built once.
const TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++)
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[n] = c >>> 0;
    }
    return Array.from(t);
})();
// CRC32 of a string (encoded UTF-8) → 8-char lowercase hex.
export function crc32(input) {
    const bytes = new TextEncoder().encode(input);
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) {
        crc = TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    return crc.toString(16).padStart(8, '0');
}
// Deterministic JSON with recursively sorted object keys. Two structurally-equal values
// serialise to the same string regardless of key insertion order, so a checksum computed
// here on Lantern's side reproduces exactly on the reader's side. Arrays keep their order
// (order is meaningful — chronological entries, strengths-first statements).
export function canonicalize(value) {
    return JSON.stringify(sortKeys(value));
}
function sortKeys(value) {
    if (Array.isArray(value))
        return value.map(sortKeys);
    if (value && typeof value === 'object') {
        const out = {};
        for (const key of Object.keys(value).sort()) {
            out[key] = sortKeys(value[key]);
        }
        return out;
    }
    return value;
}
//# sourceMappingURL=checksum.js.map