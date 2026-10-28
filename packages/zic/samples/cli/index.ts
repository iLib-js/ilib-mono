#!/usr/bin/env node

/*
 * index.ts - command-line demo of the ilib-zic library
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

import * as path from "path";
import { ZoneInfoPipeline } from "ilib-zic";

/**
 * Demo entry point.
 *
 * With no args, runs compile → enrich → write on the bundled mini tzdata
 * under `data/` into `./locale` (zoneinfo/, timezone.jf, und/).
 * Optional positional args override src and localeDir.
 */
function main(argv: string[]): void {
    console.log("ilib-zic sample");

    const positionals = argv.filter((arg) => !arg.startsWith("-"));
    const srcDir = positionals[0] || path.join(__dirname, "data");
    const localeDir = positionals[1] || path.join(__dirname, "locale");

    console.log(`Compiling ${srcDir} -> ${localeDir}`);

    const result = new ZoneInfoPipeline({
        srcDir,
        localeDir,
        verbose: true,
    }).run();
    console.log(`Wrote ${result.zoneCount} zone(s) to ${result.localeDir}`);
}

main(process.argv.slice(2));
