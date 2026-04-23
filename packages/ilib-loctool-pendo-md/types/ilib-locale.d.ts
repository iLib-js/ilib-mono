/*
 * Local module declaration so this CommonJS package can import ilib-locale with a
 * default import without TypeScript resolving the package "import" condition to ESM
 * (TS1479). Runtime still loads ilib-locale via Node as usual.
 */
declare module "ilib-locale" {
    export default class Locale {
        constructor(language: string | Locale, region?: string, variant?: string, script?: string);
        getLanguage(): string | undefined;
        getRegion(): string | undefined;
        getSpec(): string | undefined;
    }
}
