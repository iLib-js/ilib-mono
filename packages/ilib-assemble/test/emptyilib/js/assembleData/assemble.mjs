/*
 * assemble.mjs - empty-result mock assembler for mergeJson tests
 *
 * This fixture intentionally returns an empty object so mergeJson can verify
 * that a successfully imported assembler still fails when no locale payload is
 * produced.
 */

export function assemble() {
    return {};
}