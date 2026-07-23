/**
 * Copyright © 2024, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licensefs/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Manual type definitions for micromark@~2.11.0
// based on https://github.com/micromark/micromark/tree/2.11.4
//
// Added missing definitions for functions used in mdast-util-gfm-strikethrough@~0.6.5
// (https://github.com/micromark/micromark-extension-gfm-strikethrough/tree/0.6.5)
// which were needed to reimplement it for `++underline++` syntax in TS (see `../syntax.ts`).

declare module "micromark/dist/util/classify-character" {
    export default function classifyCharacter(code: number): 1 | 2 | undefined;
}

declare module "micromark/dist/util/chunked-splice" {
    export default function chunkedSplice<T>(array: T[], start: number, end: number, replace: T[]): void;
}

declare module "micromark/dist/util/resolve-all" {
    import type { Construct, Event, Tokenizer } from "micromark/dist/shared-types";
    export default function resolveAll(constructs: Construct[], events: Event[], context: Tokenizer): Event[];
}
