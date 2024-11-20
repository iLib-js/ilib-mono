/*
 * pluralforms.ts - defines the plural forms for each locale
 *
 * Copyright © 2024 Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Name of a supported plural category. */
export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

const pluralForms = {
    ja: {
        rules: "nplurals=1; plural=0;",
        categories: ["other"],
    },
    zh: {
        rules: "nplurals=1; plural=0;",
        categories: ["other"],
    },
    ko: {
        rules: "nplurals=1; plural=0;",
        categories: ["other"],
    },
    th: {
        rules: "nplurals=1; plural=0;",
        categories: ["other"],
    },
    en: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    de: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    nl: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    sv: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    da: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    no: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    fo: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    es: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    pt: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    it: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    el: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    bg: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    fi: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    et: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    he: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    id: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    eo: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    hu: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    tr: {
        rules: "nplurals=2; plural=n != 1;",
        categories: ["one", "other"],
    },
    fr: {
        rules: "nplurals=2; plural=n>1;",
        categories: ["one", "other"],
    },
    lv: {
        rules: "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2;",
        categories: ["zero", "one", "other"],
    },
    ga: {
        rules: "nplurals=3; plural=n==1 ? 0 : n==2 ? 1 : 2;",
        categories: ["one", "two", "other"],
    },
    ro: {
        rules: "nplurals=3; plural=n==1 ? 0 : (n==0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2;",
        categories: ["one", "few", "other"],
    },
    lt: {
        rules: "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2;",
        categories: ["one", "few", "other"],
    },
    ru: {
        rules: "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        categories: ["one", "few", "other"],
    },
    uk: {
        rules: "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        categories: ["one", "few", "other"],
    },
    be: {
        rules: "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        categories: ["one", "few", "other"],
    },
    sr: {
        rules: "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        categories: ["one", "few", "other"],
    },
    hr: {
        rules: "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        categories: ["one", "few", "other"],
    },
    cs: {
        rules: "nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;",
        categories: ["one", "few", "other"],
    },
    sk: {
        rules: "nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;",
        categories: ["one", "few", "other"],
    },
    pl: {
        rules: "nplurals=3; plural=n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        categories: ["one", "few", "other"],
    },
    sl: {
        rules: "nplurals=4; plural=n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3",
        categories: ["one", "two", "few", "other"],
    },
    ar: {
        rules: "nplurals=6; plural=n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5;",
        categories: ["zero", "one", "two", "few", "many", "other"],
    },
} as const;

export default pluralForms as Record<string, { rules: string; categories: readonly PluralCategory[] }>;

/** One of locales for which plurals are supported. */
export type PluralLocale = keyof typeof pluralForms;

/** Required categories for each locale as defined in {@link pluralForms}. */
type RequiredCategories = {
    [Locale in PluralLocale]: (typeof pluralForms)[Locale]["categories"];
};

/**
 * Utility type to distribute over known required category combinations
 * as specified in values of {@link RequiredCategories}.
 *
 * Given a union type of string tuples like
 * ```ts
 * [ "other" ] | [ "one", "other" ] | [ "zero", "one", "other" ] | ...
 * ```
 * perform [union distribution](https://stackoverflow.com/questions/51691235/typescript-map-union-type-to-another-union-type)
 * to map to a union of object types, each of which has keys matching one of the strings in the tuple:
 * ```ts
 * { other: string } | { one: string; other: string } | { zero: string; one: string; other: string } | ...
 * ```
 *
 * Result is a type union of all possible plural forms such that no type is optional
 * and a union discrimination can be applied instead:
 *
 * ```ts
 *  { other: string }
 *  | { one: string; other: string }
 *  | { zero: string; one: string; other: string }
 *  | { one: string; two: string; other: string }
 *  | { one: string; few: string; other: string }
 *  | { one: string; two: string; few: string; other: string }
 *  | { zero: string; one: string; two: string; few: string; many: string; other: string }
 * ```
 *
 * This means that e.g. the following invalid assignments are caught at compile time
 * ```ts
 * const onlyOne: Plural = { one: "one" }; // Error: 'other' is missing
 * const incompleteArabic: Plural = { zero: "zero", one: "one", two: "two", few: "few", other: "other" }; // Error: 'many' is missing
 * ```
 */
type DistributePluralCategories<U> = U extends readonly string[] ? { [K in U[number]]: string } : never;

/**
 * Apply plural categories distribution for all locales defined in {@link RequiredCategories}.
 */
type DistributePluralLocaleDefinitions<U> = U extends RequiredCategories
    ? { [locale in keyof U]: DistributePluralCategories<U[locale]> }
    : never;

/**
 * Plural type definitions for all locales.
 *
 * The object keys are the locale names.
 * Each value is an object containing all required plural forms for this particular locale.
 */
type PluralsForLocales = DistributePluralLocaleDefinitions<RequiredCategories>;

/**
 * Object containing all required plural forms of a string for given locale (specified through a generic parameter).
 *
 * The object keys are the plural category names as defined in the CLDR plural rules.
 * Only specific combinations of categories are allowed, as defined in {@link pluralForms}.
 */
export type PluralForLocale<Locale extends keyof PluralsForLocales> = PluralsForLocales[Locale];

/**
 * Object containing plural forms of a string.
 *
 * This type is a union of all possible plural forms for any of the supported locales (as defined in {@link RequiredCategories}).
 */
export type Plural = PluralForLocale<keyof PluralsForLocales>;

type CollectPluralKeys<P> = P extends Plural ? keyof P : never;

/**
 * Object containing plural forms of a string, where all supported categories are optional.
 */
export type PartialPlural = { [Category in CollectPluralKeys<Plural>]?: string };

// type testing:

// @ts-expect-error -- "ja" does not allow "one" category
const extraCategory: PluralForLocale<"ja"> = { one: "asdf", other: "other" };

// @ts-expect-error -- "pl" requires "one" and "few" categories as well
const missingCategory: PluralForLocale<"pl"> = { other: "other" };

// @ts-expect-error -- "xx" is not a supported locale
const invalidLocale: PluralForLocale<"xx"> = { other: "other" };

const anyPlural: Plural = {
    // @ts-expect-error -- PO files do not support additional categories like '=1'
    "=1": "exactly one",
    one: "one",
    other: "other",
};

const partialPlural: PartialPlural = {
    one: "one",
    // @ts-expect-error -- "two" is not a supported category
    three: "three",
    // no error despite missing "other", because it is optional in partial
};
