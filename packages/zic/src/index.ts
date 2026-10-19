#!/usr/bin/env node
/*
 * index.ts - package entry point and CLI for ilib-zic
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
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from "fs";
import * as path from "path";
import { ZoneInfoCompiler } from "./ZoneInfoCompiler";

export { ZoneInfoCompiler } from "./ZoneInfoCompiler";
export type {
    ZoneInfoCompilerOptions,
    CompileResult,
} from "./ZoneInfoCompiler";

export { ParseException } from "./ParseException";
export { RelativeDate, StartRule } from "./RelativeDate";
export { Rule } from "./Rule";
export { RuleSet } from "./RuleSet";
export { Offset } from "./Offset";
export { Zone } from "./Zone";
export { ZoneInfoFile } from "./ZoneInfoFile";
export { ZoneWriter } from "./ZoneWriter";
export { JsonZoneWriter } from "./JsonZoneWriter";
export { createZoneWriter } from "./ZoneWriterFactory";

/**
 * Print the usage banner to stdout.
 */
function printHelp(): void {
    console.log(`Usage: ilib-zic [options] <src> <dest>
  Compile IANA tzdata sources into JSON zoneinfo for ilib.

  Arguments:
    src              Directory containing IANA tzdata source files
    dest             Directory to write compiled JSON zoneinfo

  Options:
    -h, --help       Show this help message
    -V, --version    Print the ilib-zic version and exit
    -v, --verbose    Print progress information during compilation`);
}

/**
 * Read the package version from package.json next to the built lib/.
 */
function getVersion(): string {
    const pkgPath = path.join(__dirname, "..", "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
        version: string;
    };
    return pkg.version;
}

/**
 * Parse argv and run the zone info compiler.
 *
 * @param argv Arguments after the node/script path
 * @returns Exit code (0 on success)
 */
function runCli(argv: string[]): number {
    let help = false;
    let version = false;
    let verbose = false;
    const positionals: string[] = [];

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        switch (arg) {
            case "-h":
            case "--help":
                help = true;
                break;
            case "-V":
            case "--version":
                version = true;
                break;
            case "-v":
            case "--verbose":
                verbose = true;
                break;
            default:
                if (arg.startsWith("-")) {
                    throw new Error(`Unknown argument: ${arg}`);
                }
                positionals.push(arg);
                break;
        }
    }

    if (help) {
        printHelp();
        return 0;
    }

    if (version) {
        console.log(`ilib-zic ${getVersion()}`);
        return 0;
    }

    if (positionals.length !== 2) {
        console.error("Error: both <src> and <dest> are required.");
        printHelp();
        return 1;
    }

    const [srcDir, destDir] = positionals;

    const compiler = new ZoneInfoCompiler({
        srcDir,
        destDir,
        verbose,
    });

    const result = compiler.compile();
    if (verbose) {
        console.log(`Wrote ${result.zoneCount} zone(s) to ${result.destDir}`);
    }
    return 0;
}

if (require.main === module) {
    try {
        process.exit(runCli(process.argv.slice(2)));
    } catch (e) {
        console.error(e instanceof Error ? e.message : e);
        process.exit(1);
    }
}
