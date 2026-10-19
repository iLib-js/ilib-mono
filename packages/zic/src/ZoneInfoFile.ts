/*
 * ZoneInfoFile.ts - parse a single IANA tzdata source file
 *
 * Copyright © 2014, 2026 JEDLSoft
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

import * as fs from "fs";

import { Offset } from "./Offset";
import { Rule } from "./Rule";
import { RuleSet } from "./RuleSet";
import { Zone } from "./Zone";

/**
 * Parses one IANA zone-information source file into Zone and RuleSet maps.
 */
export class ZoneInfoFile {
    /**
     * Absolute or relative path of the tzdata source file being parsed.
     */
    private readonly filePath: string;

    /**
     * File contents split into lines.
     */
    private lines: string[] = [];

    /**
     * Index of the next line to read from {@link lines}.
     */
    private lineIndex = 0;

    /**
     * One-line pushback buffer used when a non-continuation line must be
     * re-processed by the caller loop.
     */
    private buffer: string | null = null;

    /**
     * Read and prepare a tzdata source file for parsing.
     *
     * @param filePath Path to an extensionless IANA file such as `europe`
     */
    constructor(filePath: string) {
        this.filePath = filePath;
        const content = fs.readFileSync(filePath, "utf-8");
        this.lines = content.split(/\r?\n/);
        this.lineIndex = 0;
    }

    /**
     * Return the next significant source line, skipping blanks and comments.
     *
     * Trailing `#` comments are stripped. Returns `null` at end of file.
     *
     * @returns Next line to parse, or `null` when exhausted
     */
    private getLine(): string | null {
        let line: string | null;
        if (this.buffer !== null) {
            line = this.buffer;
            this.buffer = null;
            return line;
        }

        while (this.lineIndex < this.lines.length) {
            line = this.lines[this.lineIndex++];
            if (
                line.length === 0 ||
                line.charAt(0) === "#" ||
                /^\s+(#.*)?$/.test(line)
            ) {
                continue;
            }
            const hash = line.indexOf("#");
            if (hash >= 0) {
                line = line.substring(0, hash);
            }
            return line;
        }
        return null;
    }

    /**
     * Parse this file, merging results into the shared maps.
     *
     * Handles `Zone` (with continuation offsets), `Rule`, and `Link` lines.
     * Links only succeed when the target zone is already present in `zones`.
     *
     * @param zones Accumulator of zone id → {@link Zone}
     * @param ruleSets Accumulator of rule-set name → {@link RuleSet}
     */
    parse(zones: Map<string, Zone>, ruleSets: Map<string, RuleSet>): void {
        let line = this.getLine();

        while (line !== null) {
            if (line.startsWith("Zone")) {
                const zone = new Zone(line, ruleSets);
                if (zone.getName()) {
                    zones.set(zone.getName() as string, zone);
                }
                line = this.getLine();
                while (
                    line !== null &&
                    line.length > 0 &&
                    /\s/.test(line.charAt(0))
                ) {
                    const offset = new Offset(
                        line,
                        ruleSets,
                        zone.getName() || ""
                    );
                    zone.addOffset(offset);
                    line = this.getLine();
                }
            } else if (line.startsWith("Rule")) {
                const rule = new Rule(line);
                const setName = rule.ruleSetName as string;
                let rules = ruleSets.get(setName);
                if (!rules) {
                    rules = new RuleSet();
                    rules.setName(setName);
                    ruleSets.set(setName, rules);
                }
                rules.add(rule);
                line = this.getLine();
            } else if (line.startsWith("Link")) {
                const tokens = line.split(/[ \t]+/);
                if (tokens.length > 2) {
                    const zone = zones.get(tokens[1]);
                    if (zone) {
                        zones.set(tokens[2], zone);
                    }
                }
                line = this.getLine();
            } else {
                line = this.getLine();
            }
        }
    }

    /**
     * Release resources. No-op for synchronous filesystem reads; retained
     * for API parity with the Java port.
     */
    close(): void {
        // nothing to close for sync fs reads; kept for API parity with Java
    }

    /**
     * @returns Path passed to the constructor
     */
    getPath(): string {
        return this.filePath;
    }
}
