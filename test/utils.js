/*
 * utils.js
 *
 * Copyright © 2023 Box, Inc.
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

export const trimIndent = (/** @type {string} */ str) => {
    // find first line indent (excluding leading newline)
    const indent = /(?:\n)?(\s+)/g.exec(str)?.[1];
    if (!indent) {
        return str;
    }

    // trim it from each line
    return str
        .split("\n")
        .map((line) =>
            line.startsWith(indent) ? line.slice(indent.length) : line
        )
        .join("\n");
};

/**
 * @template T
 * @param {T[]} items
 * @param {(one: T, other: T) => boolean} equals
 * @returns {T[]}
 */
export const distinct = (items, equals = (one, other) => one === other) => {
    const /** @type {T[]} */ distinctItems = [];
    for (const item of items) {
        if (!distinctItems.some(picked => equals(picked, item))) {
            distinctItems.push(item);
        }
    }
    return distinctItems;
};