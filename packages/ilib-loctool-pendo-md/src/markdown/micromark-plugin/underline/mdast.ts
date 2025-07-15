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

// Based on https://github.com/syntax-tree/mdast-util-gfm-strikethrough/tree/0.2.3

import type { MdastExtension } from "mdast-util-from-markdown";
import type { Options } from "mdast-util-to-markdown";
import type { Parent, PhrasingContent } from "mdast";

import phrasing from "mdast-util-to-markdown/lib/util/container-phrasing";

const EXTENDED_NODE_TYPE = {
    UNDERLINE: "underline",
} as const;

const NODE_TYPE = {
    EMPHASIS: "emphasis",
} as const;

export interface Underline extends Parent {
    type: "underline";
    children: PhrasingContent[];
}

// extend available nodes in mdast
// as described in JSDoc of @types/mdast@3.0.15
declare module "mdast" {
    interface PhrasingContentMap {
        underline: Underline;
    }
}

const DELIM = "+";
const DOUBLE_DELIM = DELIM + DELIM;

export const fromMarkdown: MdastExtension = {
    // @ts-expect-error: as-is from mdast-util-gfm-strikethrough@0.2.3
    canContainEols: [EXTENDED_NODE_TYPE.UNDERLINE],
    enter: {
        [EXTENDED_NODE_TYPE.UNDERLINE]: function (token) {
            // @ts-expect-error: as-is from mdast-util-gfm-strikethrough@0.2.3
            this.enter({ type: EXTENDED_NODE_TYPE.UNDERLINE, children: [] }, token);
        },
    },
    exit: {
        [EXTENDED_NODE_TYPE.UNDERLINE]: function (token) {
            this.exit(token);
        },
    },
};

export const toMarkdown: Options = {
    unsafe: [{ character: DELIM, inConstruct: "phrasing" }],
    handlers: {
        [EXTENDED_NODE_TYPE.UNDERLINE]: function (node, _, context) {
            const exit = context.enter(NODE_TYPE.EMPHASIS);
            const value = phrasing(node, context, { before: DELIM, after: DELIM });
            exit();
            return DOUBLE_DELIM + value + DOUBLE_DELIM;
        },
    },
};

export default { fromMarkdown, toMarkdown };
