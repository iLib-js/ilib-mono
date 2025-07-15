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

import type { SyntaxExtension } from "micromark/dist/shared-types";

export const syntax: SyntaxExtension = {
    // @ts-expect-error: disable mechanism based on https://github.com/micromark/micromark-extension-mdx-md/blob/0.1.1/index.js
    // seems to work fine even though it's not a valid type in micromark@2.11.4
    // also see https://github.com/micromark/micromark/blob/2.11.4/lib/constructs.mjs#L85
    disable: {
        null: [
            // disable syntax which is not supported in Pendo markdown
            // i.e. everything from https://github.com/micromark/micromark/blob/2.11.4/lib/constructs.mjs
            // except for
            // - plain text stuff: text, lineEnding, hardBreakEscape, characterEscape, characterReference
            // - bold and italic: attention
            // - labeled links: labelLink and labelEnd
            // - (un)ordered lists: list
            // - HTML inlines (currently needed for {color} parsing in `../../ast-transformer/color`): htmlText
            // as per https://support.pendo.io/hc/en-us/articles/360031866552-Use-markdown-syntax-for-guide-text-styling
            "autolink",
            "blockQuote",
            "codeFenced",
            "codeIndented",
            "codeText",
            "definition",
            "headingAtx",
            // @TODO also disable this after implementing the color syntax extension
            // "htmlFlow",
            // "htmlText",
            "labelStartImage",
            "setextUnderline",
            "thematicBreak",
        ],
    },
};

export default syntax;
