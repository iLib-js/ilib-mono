/*
 * ZoneInfoCompiler.ts - compile IANA tzdata into ilib JSON zoneinfo
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
import * as path from "path";

import { RuleSet } from "./RuleSet";
import { Zone } from "./Zone";
import { ZoneInfoFile } from "./ZoneInfoFile";
import { createZoneWriter } from "./ZoneWriterFactory";

/**
 * Options for {@link ZoneInfoCompiler}.
 */
export interface ZoneInfoCompilerOptions {
    /**
     * Directory containing unpacked IANA tzdata source files
     * (for example `africa`, `europe`, `northamerica`).
     */
    srcDir: string;

    /**
     * Directory where compiled JSON zoneinfo files will be written.
     */
    destDir: string;

    /**
     * When true, emit progress messages to stdout.
     */
    verbose?: boolean;

    /**
     * When true (default), only emit the currently applicable offset and
     * DST rules for each zone, not historical offsets.
     */
    currentOnly?: boolean;

    /**
     * Output file type. Currently only `"json"` is supported.
     */
    format?: string;
}

/**
 * Summary of a successful compile run.
 */
export interface CompileResult {
    /** Number of zone files written. */
    zoneCount: number;

    /** Absolute path to the output directory. */
    destDir: string;
}

/**
 * Compiles IANA tzdata zone sources into JSON zoneinfo files for ilib.
 *
 * TypeScript port of the Java tool in `com.ilib.tools.zic.ZoneInfoCompiler`
 * from the monolithic ilib package.
 */
export class ZoneInfoCompiler {
    /**
     * Directory containing unpacked IANA tzdata source files.
     */
    private readonly srcDir: string;

    /**
     * Directory where compiled JSON zoneinfo files will be written.
     */
    private readonly destDir: string;

    /**
     * When true, emit progress messages to stdout.
     */
    private readonly verbose: boolean;

    /**
     * When true, only emit the currently applicable offset and DST rules.
     */
    private readonly currentOnly: boolean;

    /**
     * Output file type (currently only `"json"`).
     */
    private readonly format: string;

    /**
     * Create a new compiler instance.
     *
     * @param options Source and destination directories for compilation
     */
    constructor(options: ZoneInfoCompilerOptions) {
        if (!options || !options.srcDir || !options.destDir) {
            throw new Error("srcDir and destDir are required");
        }
        this.srcDir = options.srcDir;
        this.destDir = options.destDir;
        this.verbose = Boolean(options.verbose);
        this.currentOnly =
            options.currentOnly === undefined ? true : Boolean(options.currentOnly);
        this.format = options.format || "json";
    }

    /**
     * Compile zone info from the configured source directory into JSON
     * files under the destination directory.
     *
     * @returns Summary of the compile run
     */
    compile(): CompileResult {
        const infoDir = path.resolve(this.srcDir);
        const outputDir = path.resolve(this.destDir);

        if (this.verbose) {
            console.log("Reading zone info directory: " + infoDir);
            console.log("Only output current rules: " + this.currentOnly);
            console.log("File type is: " + this.format);
            console.log("Output dir name: " + outputDir);
        }

        if (!fs.existsSync(infoDir) || !fs.statSync(infoDir).isDirectory()) {
            throw new Error(infoDir + " is not a directory.");
        }

        if (fs.existsSync(outputDir)) {
            if (!fs.statSync(outputDir).isDirectory()) {
                throw new Error(
                    outputDir + " exists, but is not a directory."
                );
            }
        } else {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const zones = new Map<string, Zone>();
        const ruleSets = new Map<string, RuleSet>();

        const infoFiles = fs.readdirSync(infoDir);
        for (const name of infoFiles) {
            // skip files with extensions — they are not zone info files
            if (name.indexOf(".") !== -1) {
                continue;
            }
            const filePath = path.join(infoDir, name);
            if (!fs.statSync(filePath).isFile()) {
                continue;
            }
            try {
                const zif = new ZoneInfoFile(filePath);
                zif.parse(zones, ruleSets);
                zif.close();
            } catch (e) {
                if (this.verbose) {
                    console.warn(
                        "Skipping file " + filePath + ": " +
                            (e instanceof Error ? e.message : e)
                    );
                }
            }
        }

        const writer = createZoneWriter(
            this.format,
            outputDir,
            this.verbose
        );
        if (!writer) {
            throw new Error("Unsupported output format: " + this.format);
        }
        const zoneCount = writer.writeZones(zones, this.currentOnly);

        return {
            zoneCount,
            destDir: outputDir,
        };
    }
}
