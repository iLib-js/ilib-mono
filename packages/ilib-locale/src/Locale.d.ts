/*
 * Locale.d.ts - TypeScript declarations for ilib-locale
 *
 * Copyright © 2025-2026 JEDLSoft
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

/**
 * Represent a locale specifier instance.
 * Locales are specified either with a specifier string
 * that follows the BCP-47 convention (roughly: "language-region-script-variant") or
 * with 4 parameters that specify the language, region, variant, and script individually.
 */
declare class Locale {
    /**
     * Create a new locale instance. Locales are specified either with a specifier string
     * that follows the BCP-47 convention (roughly: "language-region-script-variant") or
     * with 4 parameters that specify the language, region, variant, and script individually.
     *
     * @param language the ISO 639 2-letter code for the language, or a full
     *     locale spec in BCP-47 format, or another Locale instance to copy from
     * @param region the ISO 3166 2-letter code for the region
     * @param variant the name of the variant of this locale, if any
     * @param script the ISO 15924 code of the script for this locale, if any
     */
    constructor(language?: string | Locale, region?: string, variant?: string, script?: string);

    /**
     * Return the ISO 639 language code for this locale.
     * @returns the language code for this locale
     */
    getLanguage(): string | undefined;

    /**
     * Return the language of this locale as an ISO-639-alpha3 language code
     * @returns the alpha3 language code of this locale
     */
    getLanguageAlpha3(): string | undefined;

    /**
     * Return the ISO 3166 region code for this locale.
     * @returns the region code of this locale
     */
    getRegion(): string | undefined;

    /**
     * Return the region of this locale as an ISO-3166-alpha3 region code
     * @returns the alpha3 region code of this locale
     */
    getRegionAlpha3(): string | undefined;

    /**
     * Return the ISO 15924 script code for this locale
     * @returns the script code of this locale
     */
    getScript(): string | undefined;

    /**
     * Return the variant code for this locale
     * @returns the variant code of this locale, if any
     */
    getVariant(): string | undefined;

    /**
     * Return the whole locale specifier as a string.
     * @returns the locale specifier
     */
    getSpec(): string;

    /**
     * Return the language locale specifier. This includes the
     * language and the script if it is available. This can be
     * used to see whether the written language of two locales
     * match each other regardless of the region or variant.
     *
     * @returns the language locale specifier
     */
    getLangSpec(): string;

    /**
     * Express this locale object as a string. Currently, this simply calls the getSpec
     * function to represent the locale as its specifier.
     *
     * @returns the locale specifier
     */
    toString(): string;

    /**
     * Return true if the the other locale is exactly equal to the current one.
     * @param other the other locale to compare
     * @returns whether or not the other locale is equal to the current one
     */
    equals(other: Locale): boolean;

    /**
     * Return true if the current locale uses valid ISO codes for each component
     * of the locale that exists.
     * @returns true if the current locale has all valid components, and false otherwise
     */
    isValid(): boolean;

    /**
     * Return the ISO-3166 alpha3 equivalent region code for the given ISO 3166 alpha2
     * region code. If the given alpha2 code is not found, this function returns its
     * argument unchanged.
     * @param alpha2 the alpha2 code to map
     * @returns the alpha3 equivalent of the given alpha2 code, or the alpha2
     *     parameter if the alpha2 value is not found
     */
    static regionAlpha2ToAlpha3(alpha2: string | undefined): string | undefined;

    /**
     * Return the ISO-639 alpha3 equivalent language code for the given ISO 639 alpha1
     * language code. If the given alpha1 code is not found, this function returns its
     * argument unchanged.
     * @param alpha1 the alpha1 code to map
     * @returns the alpha3 equivalent of the given alpha1 code, or the alpha1
     *     parameter if the alpha1 value is not found
     */
    static languageAlpha1ToAlpha3(alpha1: string | undefined): string | undefined;

    /**
     * Check whether the given string conforms to the syntax of a POSIX locale specifier.
     *
     * POSIX locales follow the format: `language[_territory][.codeset][@modifier]`
     *
     * This method performs a syntactic check only - it does not validate whether
     * the language or territory codes are valid ISO codes.
     *
     * @param spec the string to check
     * @returns true if the string conforms to POSIX locale syntax, false otherwise
     */
    static isPosixLocale(spec: string): boolean;

    /**
     * Factory method to create a Locale instance from a POSIX locale specifier.
     *
     * POSIX locales follow the format: `language[_territory][.codeset][@modifier]`
     *
     * The codeset (e.g., UTF-8, ISO-8859-1) is preserved using the BCP-47 private
     * use extension `x-encoding-`. For example, `en_US.UTF-8` becomes
     * `en-US-x-encoding-utf8`.
     *
     * The modifier may be mapped to a BCP-47 script or variant as appropriate.
     * For example, `@latin` may become script "Latn", while `@euro` may become
     * a variant.
     *
     * @param posixLocale the POSIX locale specifier to parse
     * @returns a new Locale instance representing the given POSIX locale,
     *     or `undefined` if the input does not conform to POSIX locale syntax
     */
    static fromPosix(posixLocale: string): Locale | undefined;

    /** Mapping from ISO 3166 alpha2 region codes to alpha3 codes */
    static a2toa3regmap: { [key: string]: string };

    /** Mapping from ISO 639 alpha1 language codes to alpha3 codes */
    static a1toa3langmap: { [key: string]: string };

    /** Array of valid ISO 15924 script codes */
    static iso15924: string[];
}

export default Locale;
