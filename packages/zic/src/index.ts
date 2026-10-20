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

import { ZoneInfoPipeline } from "./ZoneInfoPipeline";

export { ZoneInfoCompiler } from "./ZoneInfoCompiler";
export type {
    ZoneInfoCompilerOptions,
    CompileResult,
} from "./ZoneInfoCompiler";

export { ZoneInfoEnricher } from "./ZoneInfoEnricher";
export type { ZoneInfoEnricherOptions } from "./ZoneInfoEnricher";

export { LocaleDataWriter } from "./LocaleDataWriter";
export type {
    LocaleDataWriterOptions,
    WriteResult,
} from "./LocaleDataWriter";

export { ZoneInfoPipeline } from "./ZoneInfoPipeline";
export type {
    ZoneInfoPipelineOptions,
    PipelineResult,
} from "./ZoneInfoPipeline";

export {
    COUNTRY_EXCEPTIONS,
    BACKWARDS_EXCEPTIONS,
    DEFAULT_TIMEZONE_ID,
    POSIX_ZONE_IDS,
} from "./defaults";

export type {
    DstRuleInfo,
    ZoneInfo,
    LocaleTimezoneInfo,
    EnrichedTzData,
    WindowsZoneMapZone,
    WindowsZonesData,
} from "./types";

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
    console.log(`Usage: ilib-zic [options] <src> <localeDir>
  Compile IANA tzdata into ilib locale timezone data (compile → enrich → write).

  Arguments:
    src              Directory containing IANA tzdata source files
    localeDir        Locale root to write (zoneinfo/, timezone.jf, und/)

  Options:
    -h, --help       Show this help message
    -V, --version    Print the ilib-zic version and exit
    -v, --verbose    Print progress information
    --compile-only   Skip enrichment; write raw zoneinfo JSON only`);
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
 * Parse argv and run the timezone data pipeline.
 *
 * @param argv Arguments after the node/script path
 * @returns Exit code (0 on success)
 */
function runCli(argv: string[]): number {
    let help = false;
    let version = false;
    let verbose = false;
    let compileOnly = false;
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
            case "--compile-only":
                compileOnly = true;
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
        console.error("Error: both <src> and <localeDir> are required.");
        printHelp();
        return 1;
    }

    const [srcDir, localeDir] = positionals;

    const pipeline = new ZoneInfoPipeline({
        srcDir,
        localeDir,
        verbose,
        compileOnly,
    });

    const result = pipeline.run();
    if (verbose) {
        console.log(
            `Wrote ${result.zoneCount} zone(s) to ${result.localeDir}` +
                (result.compileOnly ? " (compile-only)" : "")
        );
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
