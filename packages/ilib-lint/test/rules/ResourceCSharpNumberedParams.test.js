/*
 * ResourceCSharpNumberedParams.test.js
 *
 * Copyright © 2025 JEDLSoft
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
import { ResourceString, ResourceArray, ResourcePlural } from 'ilib-tools-common';
import { IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

import ResourceMatcher from '../../src/rules/ResourceMatcher.js';
import { regexRules } from '../../src/plugins/BuiltinPlugin.js';

import {expect, test} from '@jest/globals';

function findRuleDefinition(name) {
    return regexRules.find(rule => rule.name === name);
}

// dummy file to be used with all tests
const sourceFile = new SourceFile("test/testfiles/xliff/test.xliff", {});

describe("test the ResourceCSharpNumberedParamsMatch rule", () => {
    test("ResourceCSharpNumberedParams find problem in a string", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {0} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {2} drin.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("The numbered parameter '{0}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Dies hat ein {2} drin.<e0></e0>");
        expect(actual[0].source).toBe('This has an {0} in it.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceCSharpNumberedParams no problems in a string", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {0} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {0} drin.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceCSharpNumberedParams formatting instructions in the param is okay", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {1:D} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {1:D} drin.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceCSharpNumberedParams finds an incorrect param", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {1} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {0} drin.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("The numbered parameter '{1}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Dies hat ein {0} drin.<e0></e0>");
        expect(actual[0].source).toBe('This has an {1} in it.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceCSharpNumberedParams finds an incorrect param with formatting instructions", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {1:D} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {0:D} drin.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("The numbered parameter '{1:D}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Dies hat ein {0:D} drin.<e0></e0>");
        expect(actual[0].source).toBe('This has an {1:D} in it.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceCSharpNumberedParams finds an incorrect param, but not in icu plurals", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'In {0} {days, plural, one {day} other {days}}',
            targetLocale: "de-DE",
            target: "In {1} {days, plural, one {Tag} other {Tagen}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // {day} is part of the plural, not a replacement param
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("The numbered parameter '{0}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: In {1} {days, plural, one {Tag} other {Tagen}}<e0></e0>");
        expect(actual[0].source).toBe('In {0} {days, plural, one {day} other {days}}');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceCSharpNumberedParams finds a problem outside of icu plurals", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'In {0} {days, plural, one {day} other {days}}',
            targetLocale: "de-DE",
            target: "In {1} {days, plural, one {Tag} other {Tagen}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("The numbered parameter '{0}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: In {1} {days, plural, one {Tag} other {Tagen}}<e0></e0>");
        expect(actual[0].source).toBe('In {0} {days, plural, one {day} other {days}}');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceCSharpNumberedParams does not catch problems in React-intl style params", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'In {number} {days, plural, one {day} other {days}}',
            targetLocale: "de-DE",
            target: "In {num} {days, plural, one {Tag} other {Tagen}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeFalsy();
    });

    test("ResourceCSharpNumberedParams ignores whitespace differences", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an { 0 } in it. { 1 }',
            targetLocale: "de-DE",
            target: "Dies hat ein {   0   } drin. {1}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeFalsy();
    });


    test("ResourceCSharpNumberedParams inside icu plurals", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: '{days, plural, one {{0} day} other {all the days}}',
                targetLocale: "zh-Hans-CN",
                target: "{days, plural, other {所有的日子}}",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });

        // should not match the parameters inside of the plural because sometimes the
        // translation of the plural adds or subtracts plural categories creating false matches
        expect(!actual).toBeTruthy();
    });

    test("ResourceCSharpNumberedParams finds problems in array resources", () => {
         expect.assertions(8);

         const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
         expect(rule).toBeTruthy();

         const resource = new ResourceArray({
             key: "url.test",
             sourceLocale: "en-US",
             source: ['This has an {1} in it.', 'This is another {3} link.' ],
             targetLocale: "de-DE",
             target: [ "Dies hat ein {1} drin.", "Dies ist noch einer {2}-Link." ],
             pathName: "a/b/c.xliff"
         });
         const ir = new IntermediateRepresentation({
             type: "resource",
             ir: [resource],
             sourceFile
         });
         const actual = rule.match({
            ir,
            file: resource.getPath()
         });
         expect(actual).toBeTruthy();

         expect(actual.severity).toBe("error");
         expect(actual.id).toBe("url.test");
         expect(actual.description).toBe("The numbered parameter '{3}' from the source string does not appear in the target string");
         expect(actual.highlight).toBe("Target[1]: Dies ist noch einer {2}-Link.<e0></e0>");
         expect(actual.source).toBe('This is another {3} link.');
         expect(actual.pathName).toBe("a/b/c.xliff");
     });

     test("ResourceCSharpNumberedParams does not find problems in array resources when there are no problems", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "url.test",
            sourceLocale: "en-US",
            source: ['This has an {1} in it.', 'This is another {3} link.' ],
            targetLocale: "de-DE",
            target: [ "Dies hat ein {1} drin.", "Dies ist noch einer {3}-Link." ],
            pathName: "a/b/c.xliff"
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
           ir,
           file: resource.getPath()
        });
        expect(actual).toBeFalsy();
    });

    test("ResourceCSharpNumberedParams finds problems in plural resources", () => {
        expect.assertions(8);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "url.test",
            sourceLocale: "en-US",
            source: {
                one: 'This has an {1} in it.',
                other: 'This is another {2} link.'
            },
            targetLocale: "de-DE",
            target: {
                one: "Dies hat ein {1} drin.",
                other: "Dies ist noch einer {3}-Link."
            },
            pathName: "a/b/c.xliff"
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
           ir,
           file: resource.getPath()
        });
        expect(actual).toBeTruthy();

        expect(actual.severity).toBe("error");
        expect(actual.id).toBe("url.test");
        expect(actual.description).toBe("The numbered parameter '{2}' from the source string does not appear in the target string");
        expect(actual.highlight).toBe("Target(other): Dies ist noch einer {3}-Link.<e0></e0>");
        expect(actual.source).toBe('This is another {2} link.');
        expect(actual.pathName).toBe("a/b/c.xliff");
    });

    test("ResourceCSharpNumberedParams does not find problems in plural resources when there are no problems", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-csharp-numbered-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "url.test",
            sourceLocale: "en-US",
            source: {
                one: 'This has an {1} in it.',
                other: 'This is another {2} link.'
            },
            targetLocale: "de-DE",
            target: {
                one: "Dies hat ein {1} drin.",
                other: "Dies ist noch einer {2}-Link."
            },
            pathName: "a/b/c.xliff"
        });
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const actual = rule.match({
           ir,
           file: resource.getPath()
        });
        expect(actual).toBeFalsy();
    });
});

