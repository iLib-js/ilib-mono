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

// based on https://github.com/syntax-tree/mdast-util-gfm-strikethrough/blob/0.2.3/test.js
// and https://github.com/micromark/micromark-extension-gfm-strikethrough/blob/0.6.5/test/index.js

import fromMarkdown from "mdast-util-from-markdown";
import toMarkdown from "mdast-util-to-markdown";

import syntax from "../syntax";
import mdast from "../mdast";
import removePosition from "unist-util-remove-position";
import u from "unist-builder";

import type { Root } from "mdast";

const parse = (markdown: string, singlePlus?: boolean) =>
    removePosition(
        fromMarkdown(markdown, { extensions: [syntax({ singlePlus })], mdastExtensions: [mdast.fromMarkdown] }),
        true,
    ) as Root;

const stringify = (tree: Root) => toMarkdown(tree, { extensions: [mdast.toMarkdown] });

describe("micromark-plugin-underline", () => {
    describe("markdown to mdast", () => {
        it("should support underline", () => {
            const markdown = "a ++b++ c.";
            const tree = parse(markdown);

            const expected = u("root", [
                u("paragraph", [u("text", "a "), u("underline", [u("text", "b")]), u("text", " c.")]),
            ]);

            expect(tree).toStrictEqual(expected);
        });

        it("should support underline with eols", () => {
            const markdown = "a ++b\nc++ d.";
            const tree = parse(markdown);

            const expected = u("root", [
                u("paragraph", [u("text", "a "), u("underline", [u("text", "b\nc")]), u("text", " d.")]),
            ]);

            expect(tree).toStrictEqual(expected);
        });

        it("should support underline with one plus", () => {
            const markdown = "a +b+ c.";
            const tree = parse(markdown);

            const expected = u("root", [
                u("paragraph", [u("text", "a "), u("underline", [u("text", "b")]), u("text", " c.")]),
            ]);

            expect(tree).toStrictEqual(expected);
        });

        it("should not support underline with three plus", () => {
            const markdown = "a +++b+++ c.";
            const tree = parse(markdown);

            const expected = u("root", [u("paragraph", [u("text", "a +++b+++ c.")])]);

            expect(tree).toStrictEqual(expected);
        });

        it("should support strikethrough when after an escaped plus", () => {
            const markdown = "a \\+++b++ c.";
            const tree = parse(markdown);

            const expected = u("root", [
                u("paragraph", [u("text", "a +"), u("underline", [u("text", "b")]), u("text", " c.")]),
            ]);

            expect(tree).toStrictEqual(expected);
        });

        it("should open if preceded by whitespace and followed by punctuation", () => {
            const markdown = "a ++-b++";
            const tree = parse(markdown);

            const expected = u("root", [u("paragraph", [u("text", "a "), u("underline", [u("text", "-b")])])]);

            expect(tree).toStrictEqual(expected);
        });

        it("should close if preceded by punctuation and followed by whitespace", () => {
            const markdown = "a++b.++ c";
            const tree = parse(markdown);

            const expected = u("root", [
                u("paragraph", [u("text", "a"), u("underline", [u("text", "b.")]), u("text", " c")]),
            ]);

            expect(tree).toStrictEqual(expected);
        });

        it("should close if preceded and followed by punctuation", () => {
            const markdown = "++b.++.";
            const tree = parse(markdown);

            const expected = u("root", [u("paragraph", [u("underline", [u("text", "b.")]), u("text", ".")])]);

            expect(tree).toStrictEqual(expected);
        });

        it("should not support underline with one plus when `singlePlus: false`", () => {
            const markdown = "a +b+ c.";
            const singlePlus = false;
            const tree = parse(markdown, singlePlus);

            const expected = u("root", [u("paragraph", [u("text", "a +b+ c.")])]);

            expect(tree).toStrictEqual(expected);
        });

        it("should support underline with one plus when `singlePlus: true`", () => {
            const markdown = "a +b+ c.";
            const singlePlus = true;
            const tree = parse(markdown, singlePlus);

            const expected = u("root", [
                u("paragraph", [u("text", "a "), u("underline", [u("text", "b")]), u("text", " c.")]),
            ]);

            expect(tree).toStrictEqual(expected);
        });
    });

    describe("mdast to markdown", () => {
        it("should serialize underline", () => {
            const tree = u("root", [
                u("paragraph", [u("text", "a "), u("underline", [u("text", "b")]), u("text", " c.")]),
            ]);
            const markdown = stringify(tree);

            expect(markdown).toBe("a ++b++ c.\n");
        });

        it("should serialize underline w/ eols", () => {
            const tree = u("root", [
                u("paragraph", [u("text", "a "), u("underline", [u("text", "b\nc")]), u("text", " d.")]),
            ]);
            const markdown = stringify(tree);

            expect(markdown).toBe("a ++b\nc++ d.\n");
        });
    });
});
