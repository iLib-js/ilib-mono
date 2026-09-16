#!/usr/bin/env node
/*
 * cli.ts - command-line entry point for loctool 3
 *
 * Copyright © 2026 HealthTap, Inc. and JEDLSoft
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

import { getVersionBanner } from "./index";

/**
 * Print CLI usage to stdout.
 */
export function usage(): void {
    console.log(getVersionBanner());
    console.log("Usage: loctool [--help] [--version] [command]");
    console.log("");
    console.log("loctool 3 is under development. Commands will be added as the rewrite proceeds.");
}

/**
 * Run the loctool CLI.
 * @param argv command-line arguments without the node and script paths
 * @returns process exit code
 */
export function main(argv: string[] = process.argv.slice(2)): number {
    if (argv.includes("--help") || argv.includes("-h") || argv.length === 0) {
        usage();
        return 0;
    }
    if (argv.includes("--version") || argv.includes("-v")) {
        console.log(getVersionBanner());
        return 0;
    }

    console.error(`Unknown arguments: ${argv.join(" ")}`);
    usage();
    return 1;
}

process.exit(main());
