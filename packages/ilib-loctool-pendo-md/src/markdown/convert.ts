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

import baseMarkdownParse from "mdast-util-from-markdown";
import baseMarkdownStringify from "mdast-util-to-markdown";
import strikethrough from "mdast-util-gfm-strikethrough";
import strikethroughSyntax from "micromark-extension-gfm-strikethrough";
import unistUtilRemovePosition from "unist-util-remove-position";
import * as colorString from "./string-transformer/color";
import * as colorAst from "./ast-transformer/color";
import * as underline from "./micromark-plugin/underline";
import * as unsupported from "./micromark-plugin/unsupported";
import * as componentAst from "./ast-transformer/component";

import type { ComponentData } from "./ast-transformer/component/mdastMapping";
import type { Root } from "mdast";

/**
 * Markdown parse function with injected extensions.
 */
const markdownParse = (markdown: string) =>
    baseMarkdownParse(markdown, {
        extensions: [unsupported.syntax, strikethroughSyntax({ singleTilde: false }), underline.syntax()],
        mdastExtensions: [strikethrough.fromMarkdown, underline.fromMarkdown],
    });

/**
 * Markdown stringify function with injected extensions.
 */
const markdownStringify = (ast: Root) =>
    baseMarkdownStringify(ast, {
        // note (intentional): in `toMarkdown`, mdast extensions should be passed to opt `extensions`
        extensions: [strikethrough.toMarkdown, underline.toMarkdown],
    });

/**
 * Take a Pendo markdown string and escape syntax using components.
 *
 * Given a Pendo markdown string like this
 * ``` markdown
 * string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)
 * ```
 * transform it to escape markdown syntax (as specified by
 * [Pendo documentation](https://support.pendo.io/hc/en-us/articles/360031866552-Use-markdown-syntax-for-guide-text-styling)
 * \- including their extensions) using numbered components
 * ```text
 * string with <c0>emphasis</c0>, <c1>underline</c1>, <c2>color</c2> and <c3>a link</c3>
 * ```
 * additionally, output data about those components
 * ```text
 * - c0: emphasis
 * - c1: underline
 * - c2: color #FF0000
 * - c3: link https://example.com
 * ```
 * to use it later for backconversion.
 *
 * @returns Tuple of escaped string and the list of components
 */
export const convert = (markdown: string): readonly [string, ComponentData[]] => {
    // [step 0]: {color: #FFFFFF}*pizza* spaghetti{/color}

    // [step 1]: <color value="#FFFFFF">*pizza* spaghetti</color>
    // pre-transform Pendo markdown string
    // to convert their custom Color tags {color: #000000}{/color}
    // into HTML tags <color value="#000000"></color>
    // which are easier to process through AST transformations
    // @TODO this and related steps should be removed after implementing proper micromark extension for parsing color tags
    markdown = colorString.toHtmlTags(markdown);

    // [step 2]:
    //     [root: [paragraph: [html(<color value="#FFFFFF">), emphasis: [text(pizza)], text(spaghetti), html(</color>)]]]
    // parse the pre-transformed markdown into mdast;
    // use parser plugins to support syntax extensions
    // for GFM strikethrough (~~ ~~) and Pendo underline (++ ++)
    // and disable syntax which is NOT supported by Pendo (headings, blockquotes, code, autolinks etc.)
    let ast = markdownParse(markdown);

    // remove position data from the AST since we don't need it for further processing
    // and also it does not reflect the original markdown string anyway
    ast = unistUtilRemovePosition(ast, true) as Root;

    // [step 3]:
    // [root: [
    //     paragraph: [
    //         color(#FFFFFF): [
    //             emphasis: [text(pizza)],
    //             text(spaghetti),
    //         ],
    //     ],
    // ]]
    // transform the given mdast tree to find HTML nodes corresponding to <color ...> tags
    // and replace them with custom Color ast nodes
    // This is paired with the colorString.toHtmlTags (Step 1), so that after this step the resulting AST
    // looks as if there was an actual extension for parsing color tags (i.e. it produces AST nodes with type "color")
    ast = colorAst.toColorNodes(ast);

    // [step 4]:
    //     [root: [
    //         paragraph: [
    //             component(0, color): [
    //                 component(1, emphasis): [text(pizza)],
    //                 text(spaghetti),
    //             ],
    //         ],
    //     ]]
    // map every AST node that we want to escape to a non-standard abstract AST node with type "component" (see ComponentNode)
    // this component node is something that cannot be rendered, so in the next step we will replace it with a HTML representation
    let components;
    ({ tree: ast, components } = componentAst.toComponents(ast));

    // [step 5]:
    //     [root: [
    //         paragraph: [
    //             html(<c0>),
    //             html(<c1>),
    //             text(pizza),
    //             html(</c1>),
    //             text(spaghetti),
    //             html(</c0>),
    //         ],
    //     ]]
    // transform the ComponentNodes into HTML nodes
    ast = componentAst.componentNodesToHtmlNodes(ast);

    // [step 5]: <c0><c1>pizza<c1> spaghetti</c0>
    // reassemble the transformed markdown AST into a string to produce the escaped string with numbered HTML elements
    let escapedMarkdown = markdownStringify(ast);

    // step 6:
    // trim the produced string to remove the trailing newline
    // (`toMarkdown` always inerts a newline at the end of a paragraph)
    escapedMarkdown = escapedMarkdown.trimEnd();

    return [escapedMarkdown, components] as const;
};

/**
 * Take an escaped string and a list of components and backconvert it to Pendo markdown syntax.
 *
 * Given an escaped string with numbered components like this
 * ```text
 * string with <c0>emphasis</c0>, <c1>underline</c1>, <c2>colored text</c2> and <c3>a link</c3>
 * ```
 * and a list of components like this
 * ```text
 * - c0: emphasis
 * - c1: underline
 * - c2: color #FF0000
 * - c3: link https://example.com
 * ```
 * transform it back to Pendo markdown syntax
 * ``` markdown
 * string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)
 * ```
 *
 * This is reverse operation to {@link convert} and should produce the original markdown string.
 */
export const backconvert = (escapedMarkdown: string, components: ComponentData[]): string => {
    // step 1:
    // parse the escaped string into mdast;
    // use the same parser plugins as in `convert` to ensure compatibility
    // (most importantly, the unsupported syntax should match)
    let ast = markdownParse(escapedMarkdown);

    // step 2:
    // transform the HTML nodes into Component nodes
    ast = componentAst.htmlNodesToComponentNodes(ast);

    // step 2:
    // replace numbered components with original mdast nodes
    // (this includes custom Color nodes)
    ast = componentAst.fromComponents(ast, components);

    // step 3:
    // replace custom Color nodes with HTML <color ...> tags
    ast = colorAst.fromColorNodes(ast);

    // step 4:
    // reassemble the backconverted string
    let backconvertedMarkdown = markdownStringify(ast);

    // step 5:
    // revert color tags <color value="#000000"></color>
    // back to Pendo markdown syntax {color: #000000}{/color}
    backconvertedMarkdown = colorString.fromHtmlTags(backconvertedMarkdown);

    // step 6:
    // trim the produced string to remove the trailing newline
    // (`toMarkdown` always inerts a newline at the end of a paragraph)
    backconvertedMarkdown = backconvertedMarkdown.trimEnd();

    return backconvertedMarkdown;
};
