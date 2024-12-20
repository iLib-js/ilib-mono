// note(wwawrzenczak) 2024-11-26:
// This declaration file is a temporary solution to make the ilib-po package compile.
// Once types are provided by the ilib-locale package, it should be removed.

module "ilib-locale" {
    export default class Locale {
        constructor(language: string | Locale, region?: string, variant?: string, script?: string);
        getLanguage(): string | undefined;
        getSpec(): string | undefined;
    }
}
