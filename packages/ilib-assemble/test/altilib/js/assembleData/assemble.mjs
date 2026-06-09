/*
 * assemble.mjs - alternate-root mock assembler for mergeJson tests
 *
 * This fixture exists to prove that mergeJson resolves and imports the
 * assemble.mjs file from the caller-provided ilibPath instead of assuming the
 * default test root. It also records process.cwd() so tests can verify that
 * mergeJson does not mutate or depend on the caller's working directory.
 */

export function assemble(modules, options) {
    const locales = (options && options.opt && options.opt.locales) || ["en"];
    const result = {};

    locales.forEach(locale => {
        result[locale] = {
            assembleUrl: import.meta.url,
            cwd: process.cwd(),
            modules,
            locale
        };
    });

    return result;
}