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

/**
 * Remove a common indent from each line of a multiline string. Exact indent
 * sequence is based on the indent of first non-empty line. Lines which don't
 * begin with the detected indent are not modified.
 *
 * @param {string} str
 * @returns {string}
 */
export const trimIndent = (str) => {
    const lines = str.split("\n");

    // skip leading empty lines
    const firstLine = lines.find((line) => line.trim().length > 0);
    if (!firstLine) {
        return str;
    }

    // find first line indent
    const indent = /^(?:\n)?(\s+)/.exec(firstLine)?.[1];
    if (!indent) {
        return str;
    }

    // trim it from each line
    return lines
        .map((line) =>
            line.startsWith(indent) ? line.slice(indent.length) : line
        )
        .join("\n");
};
