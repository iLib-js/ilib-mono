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

export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

export type Plural = {
    other: string,
    zero?: string,
    one?: string,
    two?: string,
    few?: string,
    many?: string
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
 * @param source the source string
 * @param context the context string
 * @returns the key to use
 */
export function makeKey(source: string, context?: string): string {
    return context ? source + " --- " + context : source;
}

