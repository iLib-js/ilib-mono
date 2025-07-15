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

// Manual type definitions for mdast-util-to-markdown@0.6.5
// (https://github.com/syntax-tree/mdast-util-to-markdown/tree/0.6.5)
//
// Added missing definitions for functions used in mdast-util-gfm-strikethrough@0.2.3
// (https://github.com/syntax-tree/mdast-util-gfm-strikethrough/tree/0.2.3)
// which were needed to reimplement it for `++underline++` syntax in TS (see `..e/mdast.ts`).

declare module "mdast-util-to-markdown/lib/util/container-phrasing" {
    import type { Node } from "unist";
    import type { Context } from "mdast-util-to-markdown";
    export default function phrasing(
        parent: Node,
        context: Context,
        safeOptions: { before: string; after: string },
    ): string;
}
