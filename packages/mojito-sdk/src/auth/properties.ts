/*
 * properties.ts - Spring-style .properties parsing
 *
 * Copyright © 2026 JEDLSoft
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Parsed Spring `.properties` text.
 *
 * This class only parses and returns key/value pairs. It does not interpret
 * Mojito keys, apply defaults, or read the filesystem.
 */
export class Properties {
    private readonly values: Map<string, string>;

    private constructor(values: Map<string, string>) {
        this.values = values;
    }

    /**
     * Parse properties text into key/value pairs.
     *
     * Lines starting with `#` or `!` are comments. `=` and `:` are separators;
     * whichever appears first wins, so the other may appear in the value.
     * Keys and values are trimmed. A later duplicate key replaces the earlier one.
     *
     * @param text Raw properties file contents.
     * @returns Parsed properties. Empty or comment-only text yields an empty set.
     */
    static parse(text: string): Properties {
        const values = new Map<string, string>();
        for (const rawLine of text.split(/\r?\n/)) {
            const line = rawLine.trim();
            if (!line || line.startsWith("#") || line.startsWith("!")) {
                continue;
            }
            const eq = line.indexOf("=");
            const colon = line.indexOf(":");
            let sep = -1;
            if (eq >= 0 && colon >= 0) {
                sep = Math.min(eq, colon);
            } else if (eq >= 0) {
                sep = eq;
            } else if (colon >= 0) {
                sep = colon;
            }
            if (sep < 0) {
                continue;
            }
            const key = line.slice(0, sep).trim();
            const value = line.slice(sep + 1).trim();
            if (key) {
                values.set(key, value);
            }
        }
        return new Properties(values);
    }

    /**
     * Build a property set from an already-parsed map.
     *
     * @param values Key/value pairs, in insertion order.
     * @returns Parsed properties.
     */
    static from(values: Record<string, string>): Properties {
        return new Properties(new Map(Object.entries(values)));
    }

    /**
     * @returns An empty property set.
     */
    static empty(): Properties {
        return new Properties(new Map());
    }

    /**
     * Look up one parsed value.
     *
     * @param key Property key, compared exactly.
     * @returns The value, or undefined when the key was not present.
     */
    get(key: string): string | undefined {
        return this.values.get(key);
    }

    /**
     * @returns True when the key was present, including when its value is empty.
     */
    has(key: string): boolean {
        return this.values.has(key);
    }

    /**
     * @returns Parsed pairs in file order. A copy, so mutating it does not
     *   change this set.
     */
    entries(): Array<[string, string]> {
        return Array.from(this.values.entries());
    }

    /**
     * @returns A copy of the parsed key/value map.
     */
    toRecord(): Record<string, string> {
        return Object.fromEntries(this.values);
    }

    /**
     * @returns Number of parsed keys.
     */
    get size(): number {
        return this.values.size;
    }

    /**
     * Combine two parsed sets. Keys in `other` replace keys in this set.
     *
     * @param other Properties whose keys win on conflict.
     * @returns A new property set. Neither input is modified.
     */
    merge(other: Properties): Properties {
        const values = new Map(this.values);
        for (const [key, value] of other.values) {
            values.set(key, value);
        }
        return new Properties(values);
    }
}
