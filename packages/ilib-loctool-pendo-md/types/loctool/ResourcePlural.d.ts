/**
 * Copyright © 2024, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licensefs/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// per https://github.com/iLib-js/loctool/blob/201b56fc5a524ae578b55f582ff9b309010b4c3c/docs/Plugins.md#resourceplural
declare module "loctool" {
    type PluralCategoryZero = "zero";
    type PluralCategoryOne = "one";
    type PluralCategoryTwo = "two";
    type PluralCategoryFew = "few";
    type PluralCategoryMany = "many";
    type PluralCategoryOther = "other";

    /**
     * Plural categories defined per the Unicode CLDR specification: http://cldr.unicode.org/index/cldr-spec/plural-rules
     */
    export type PluralCategory =
        | PluralCategoryZero
        | PluralCategoryOne
        | PluralCategoryTwo
        | PluralCategoryFew
        | PluralCategoryMany
        | PluralCategoryOther;

    export class ResourcePlural extends Resource {
        /**
         * Return the source plurals hash of this plurals resource.
         * The hash maps the plural category to the source string
         * for that category.
         */
        getSourcePlurals(): Record<PluralCategory, string>;

        /**
         * Return the target plurals hash of this plurals resource.
         * The hash maps the plural category to the translation of
         * the source string for that category. Note that the source
         * and target hashes may contain different categories due
         * to the differences in plural rules between the source and
         * target languages.
         */
        getTargetPlurals(): Record<PluralCategory, string>;

        /**
         * Set the source plurals hash of this plurals resource.
         */
        setSourcePlurals(plurals: Record<PluralCategory, string>): void;

        /**
         * Set the target plurals hash of this plurals resource.
         */
        setTargetPlurals(plurals: Record<PluralCategory, string>): void;

        /**
         * Return the source string of the given plural category.
         *
         * @param pluralCategory the category of the
         * source string being sought
         * @returns the source string for the given
         * plural category
         */
        getSource(pluralCategory: PluralCategory): string | undefined;

        /**
         * Return the target string of the given plural category.
         *
         * @param pluralCategory the category of the
         * target string being sought
         * @returns the target string for the given
         * plural class
         */
        getTarget(pluralCategory: PluralCategory): string | undefined;

        /**
         * Return the number of plural categories in
         * the source of this resource.
         *
         * @returns the number of source categories
         */
        getClasses(): number;

        /**
         * Add a string with the given plural category to the source of
         * this plural resource.
         *
         * @param pluralCategory the CLDR category of this string
         * @param str the source string to add for the category
         */
        addSource(pluralCategory: PluralCategory, str: string): void;

        /**
         * Add a string with the given plural category to the target of
         * this plural resource.
         *
         * @param pluralCategory the CLDR category of this string
         * @param str the target string to add for the category
         */
        addTarget(pluralCategory: PluralCategory, str: string): void;

        /**
         * Return the number of categories in this resource. If
         * there are translations in this resource, the number of target categories
         * is returned. If there are only source strings in this resource,
         * the number of source categories is returned.
         *
         * @returns the number of categories in this
         * resource
         */
        size(): number;
    }
}
