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

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- import used in JSDoc link
import type astTransformerColor from "../../ast-transformer/color";
/**
 * Used to match post-conversion color opening and closing nodes
 * ```markdown
 * <color value="#000000">colored text</color>
 * ```
 */
export const htmlRegex = {
    opening: /<color value="(?<value>#[a-fA-F0-9]{6})">/,
    closing: /<\/color>/,
} as const;

/**
 * Used to match Pendo extended markdown color opening and closing nodes for conversion
 * ```markdown
 * {color: #000000}colored text{/color}
 * ```
 */
export const tagRegex = {
    opening: /\{color: (?<value>#[a-fA-F0-9]{6})\}/,
    closing: /\{\/color\}/,
} as const;

const globalRegex = (regex: RegExp) => new RegExp(regex, "g");

/**
 * Replace Pendo extended markdown syntax for color spans into HTML tags,
 * so that micromark would parse them as inline HTML nodes (rather than just plain text).
 *
 * This allows for further transformation of the AST to obtain custom Color nodes
 * \- see {@link astTransformerColor.toColorNodes}.
 *
 * Pendo extended markdown color syntax is
 * ```markdown
 * {color: #000000}colored text{/color}
 * ```
 * This function replaces all occurrences of opening and closing tags with HTML-like tags
 * ```markdown
 * <color value="#000000">colored text</color>
 * ```
 */
export const toHtmlTags = (markdown: string) =>
    markdown
        .replaceAll(globalRegex(tagRegex.opening), '<color value="$<value>">')
        .replaceAll(globalRegex(tagRegex.closing), "</color>");

/**
 * Backconverts the XML color tags into Pendo markdown extended color syntax
 *
 * @see {@link toHtmlTags}
 */
export const fromHtmlTags = (convertedString: string) =>
    convertedString
        .replaceAll(globalRegex(htmlRegex.opening), "{color: $<value>}")
        .replace(globalRegex(htmlRegex.closing), "{/color}");
