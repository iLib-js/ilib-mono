/*
 * utils.ts - various utility functions
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

// @ts-ignore
import { Resource } from 'ilib-tools-common';

/**
 * Plural categories according to Unicode's CLDR.
 */
export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

/**
 * Plural forms of a particular string. Only the "other" form is required in all
 * languages. In English, the "one" form (singular) is also required.
 */
export type Plural = {
    other: string,
    zero?: string,
    one?: string,
    two?: string,
    few?: string,
    many?: string
};

/**
 * The types of comments that can be in a PO file.
 */
export type CommentType = "translator" | "extracted" | "flags" | "previous" | "paths";

/**
 * The values of various types of comments in a PO file.
 */
export type Comments = {
    [key in CommentType]?: string[]
};

/**
 * Escape quotes in a string.
 * @param str the string to escape
 * @returns the escaped string
 */
export function escapeQuotes(str: string): string {
    if (!str) return "";
    return str ? str.replace(/"/g, '\\"') : str;
}

/**
 * Unescape quotes in a string.
 * @param str the string to unescape
 * @returns the unescaped string
 */
export function unescapeQuotes(str: string): string {
    if (!str) return "";
    return str ? str.replace(/\\"/g, '"') : str;
}

/**
 * Get the key to use for the given source and context.
 * @param type the type of resource
 * @param source the source string, array, or plurals object
 * @param [context] the context to make part of the key
 * @returns the key to use
 */
export function makeKey(type: string, source: any, context?: string): string {
    switch (type) {
        case "plural":
            const key = source.one ?? source.other;
            return context ? key + " --- " + context : key;
        case "array":
            return context ? source[0] + " --- " + context : source[0];
        case "string":
        default:
            return context ? source + " --- " + context : source;
    }
}

