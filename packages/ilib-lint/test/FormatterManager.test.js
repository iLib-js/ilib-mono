/*
 * FormatterManager.test.js - test the formatter manager
 *
 * Copyright © 2022-2024 JEDLSoft
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
import { Formatter, Result } from 'ilib-lint-common';

import FormatterManager from '../src/FormatterManager.js';
import ResourceMatcher from '../src/rules/ResourceMatcher.js';

describe("testFormatterManager", () => {
    test("FormatterManagerNormal", () => {
        expect.assertions(3);

        const mgr = new FormatterManager();
        expect(mgr).toBeTruthy();

        const formatter = mgr.get("ansi-console-formatter");

        expect(formatter).toBeTruthy();
        expect(formatter instanceof Formatter).toBeTruthy();
    });

    test("FormatterManagerNotFound", () => {
        expect.assertions(2);

        const mgr = new FormatterManager();
        expect(mgr).toBeTruthy();
        const formatter = mgr.get("non-existent");

        expect(!formatter).toBeTruthy();
    });

    test("FormatterManagerAddDeclarative", () => {
        expect.assertions(4);

        const mgr = new FormatterManager();
        expect(mgr).toBeTruthy();

        let formatter = mgr.get("minimal-formatter");
        expect(!formatter).toBeTruthy();

        mgr.add([{
            "name": "minimal-formatter",
            "description": "A minimalistic formatter that only outputs the path and the highlight",
            "template": "{pathName}\n{highlight}\n",
            "highlightStart": ">>",
            "highlightEnd": "<<"
        }]);

        formatter = mgr.get("minimal-formatter");
        expect(formatter).toBeTruthy();
        expect(formatter.getName()).toBe("minimal-formatter");
    });

    test("FormatterManagerAddDeclarativeRightSize", () => {
        expect.assertions(3);

        const mgr = new FormatterManager();
        expect(mgr).toBeTruthy();

        expect(mgr.size()).toBe(1);

        mgr.add([{
            "name": "minimal-formatter",
            "description": "A minimalistic formatter that only outputs the path and the highlight",
            "template": "{pathName}\n{highlight}\n",
            "highlightStart": ">>",
            "highlightEnd": "<<"
        }]);

        expect(mgr.size()).toBe(2);
    });

    test("FormatterManagerAddDeclarativeRightFormatter", () => {
        expect.assertions(4);

        const mgr = new FormatterManager();
        expect(mgr).toBeTruthy();

        let formatter = mgr.get("minimal-formatter");
        expect(!formatter).toBeTruthy();

        mgr.add([{
            "name": "minimal-formatter",
            "description": "A minimalistic formatter that only outputs the path and the highlight",
            "template": "{pathName}:\n{highlight}\n",
            "highlightStart": ">>",
            "highlightEnd": "<<"
        }]);

        formatter = mgr.get("minimal-formatter");
        expect(formatter).toBeTruthy();

        const testrule = new ResourceMatcher({
            "name": "x",
            "description": "x",
            "regexps":["x"],
            "note": "x",
            "sourceLocale": "en-US"
        });
        const actual = formatter.format(new Result({
            pathName: "a/b/c/d.txt",
            highlight: "Target: Do not <e0>add</e0> the context.",
            severity: "error",
            rule: testrule,
            description: `target string cannot contain the word "target"`,
            id: "test.id",
            source: "test"
        }));
        const expected = "a/b/c/d.txt:\nTarget: Do not >>add<< the context.\n";
        expect(actual).toBe(expected);
    });

    test("FormatterManagerFormatWithAllFields", () => {
        expect.assertions(4);

        const mgr = new FormatterManager();
        expect(mgr).toBeTruthy();

        let formatter = mgr.get("full-formatter");
        expect(!formatter).toBeTruthy();

        mgr.add([{
            "name": "full-formatter",
            "description": "A full formatter that outputs everything",
            "template": "{id}\n{severity}\n{lineNumber}\n{source}\n{pathName}\n{highlight}\n{ruleDescription}\n{ruleName}\n{ruleLink}\n",
            "highlightStart": ">>",
            "highlightEnd": "<<"
        }]);

        const testrule = new ResourceMatcher({
            "name": "x",
            "description": "y",
            "regexps":["test"],
            "note": "q",
            "sourceLocale": "en-US",
            "link": "https://github.com/docs/index.md"
        });
        formatter = mgr.get("full-formatter");
        expect(formatter).toBeTruthy();
        const actual = formatter.format(new Result({
            pathName: "a/b/c/d.txt",
            highlight: "Target: Do not <e0>add</e0> the context.",
            severity: "error",
            rule: testrule,
            lineNumber: 2342,
            description: `target string cannot contain the word "test"`,
            id: "test.id",
            source: "test"
        }));
        const expected = "test.id\nerror\n2342\ntest\na/b/c/d.txt\nTarget: Do not >>add<< the context.\ny\nx\nhttps://github.com/docs/index.md\n";
        expect(actual).toBe(expected);
    });

    test("FormatterManagerFormatWithAllFieldsSomeBlank", () => {
        expect.assertions(4);

        const mgr = new FormatterManager();
        expect(mgr).toBeTruthy();

        let formatter = mgr.get("full-formatter");
        expect(!formatter).toBeTruthy();

        mgr.add([{
            "name": "full-formatter",
            "description": "A full formatter that outputs everything",
            "template": "{id}\n{severity}\n{lineNumber}\n{source}\n{pathName}\n{highlight}\n{ruleDescription}\n{ruleName}\n{ruleLink}\n",
            "highlightStart": ">>",
            "highlightEnd": "<<"
        }]);

        const testrule = new ResourceMatcher({
            "name": "x",
            "description": "y",
            "regexps":["test"],
            "note": "q",
            "sourceLocale": "en-US",
        });
        formatter = mgr.get("full-formatter");
        expect(formatter).toBeTruthy();
        const actual = formatter.format(new Result({
            pathName: "a/b/c/d.txt",
            highlight: "Target: Do not <e0>add</e0> the context.",
            severity: "error",
            rule: testrule,
            lineNumber: 2342,
            description: `target string cannot contain the word "test"`,
            id: "test.id",
            source: "test"
        }));
        const expected = "test.id\nerror\n2342\ntest\na/b/c/d.txt\nTarget: Do not >>add<< the context.\ny\nx\n\n";
        expect(actual).toBe(expected);
    });
});

