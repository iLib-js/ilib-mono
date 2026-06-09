/*
 * assemble.mjs - failing mock assembler for mergeJson tests
 *
 * This fixture throws a deterministic layout-style error so mergeJson tests
 * can verify that assembler failures are surfaced with the expected wrapper
 * message.
 */

export function assemble() {
    throw new Error("iLib locale data directory not found: /broken/js/data/locale");
}