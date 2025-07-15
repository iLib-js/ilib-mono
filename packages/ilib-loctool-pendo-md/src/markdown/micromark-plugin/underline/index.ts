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

import mdast from "./mdast";
import syntax from "./syntax";
import type { Underline } from "./mdast";

// extend available nodes in mdast types
// as described in JSDoc of @types/mdast@3.0.15
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/e9a0a9a3fae552bff4df6fbad1a05f3ce45fcc4a/types/mdast/v3/index.d.ts#L73
declare module "mdast" {
    interface StaticPhrasingContentMap {
        underline: Underline;
    }
}

export type { Underline };

export default {
    mdastEstension: mdast,
    syntax: syntax,
};
