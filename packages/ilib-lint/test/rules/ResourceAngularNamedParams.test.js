/*
 * ResourceAngularNamedParams.test.js
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

describe("test the ResourceAngularNamedParamsMatch rule", () => {
    test("ResourceAngularNamedParams find problem in a string", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {{URL}} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {{job}} drin.",
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
        expect(actual[0].description).toBe("The named parameter '{{URL}}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Dies hat ein {{job}} drin.<e0></e0>");
        expect(actual[0].source).toBe('This has an {{URL}} in it.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceAngularNamedParams no problems in a string", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {{job}} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {{job}} drin.",
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

    test("ResourceAngularNamedParams capital in the name is okay", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {{URL}} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {{URL}} drin.",
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

    test("ResourceAngularNamedParams whole expressions are okay", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {{arr[5].getName()}} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {{arr[5].getName()}} drin.",
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

    test("ResourceAngularNamedParams finds an incorrect param", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {{URL}} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {{job}} drin.",
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
        expect(actual[0].description).toBe("The named parameter '{{URL}}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Dies hat ein {{job}} drin.<e0></e0>");
        expect(actual[0].source).toBe('This has an {{URL}} in it.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceAngularNamedParams finds an incorrect param, but not in icu plurals", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'In {{number}} {days, plural, one {day} other {days}}',
            targetLocale: "de-DE",
            target: "In {{number}} {days, plural, one {Tag} other {Tagen}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // {day} is part of the plural, not a replacement param
        expect(!actual).toBeTruthy();
    });

    test("ResourceAngularNamedParams finds a problem outside of icu plurals", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'In {{number}} {days, plural, one {day} other {days}}',
            targetLocale: "de-DE",
            target: "In {{num}} {days, plural, one {Tag} other {Tagen}}",
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
        expect(actual[0].description).toBe("The named parameter '{{number}}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: In {{num}} {days, plural, one {Tag} other {Tagen}}<e0></e0>");
        expect(actual[0].source).toBe('In {{number}} {days, plural, one {day} other {days}}');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceAngularNamedParams does not catch problems in React-intl style params", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
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

    test("ResourceAngularNamedParams works with expressions ", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {{ site.settings.URL }} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {{ site.settings.URL }} drin.",
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

    test("ResourceAngularNamedParams works with expressions and ignores whitespace differences", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {{ site.settings.URL }} in it. {{ obj.learnMoreText }}',
            targetLocale: "de-DE",
            target: "Dies hat ein {{ site.settings.URL    }} drin. {{obj.learnMoreText}}",
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


    test("ResourceAngularNamedParams inside icu plurals", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: '{days, plural, one {{count} day} other {all the days}}',
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

    test("ResourceAngularNamedParams finds problems in array resources", () => {
         expect.assertions(8);

         const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
         expect(rule).toBeTruthy();

         const resource = new ResourceArray({
             key: "url.test",
             sourceLocale: "en-US",
             source: ['This has an {{URL}} in it.', 'This is another {{ URL2 }} link.' ],
             targetLocale: "de-DE",
             target: [ "Dies hat ein {{URL}} drin.", "Dies ist noch einer {{ IRL }}-Link." ],
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
         expect(actual.description).toBe("The named parameter '{{URL2}}' from the source string does not appear in the target string");
         expect(actual.highlight).toBe("Target[1]: Dies ist noch einer {{ IRL }}-Link.<e0></e0>");
         expect(actual.source).toBe('This is another {{ URL2 }} link.');
         expect(actual.pathName).toBe("a/b/c.xliff");
     });

     test("ResourceAngularNamedParams does not find problems in array resources when there are no problems", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "url.test",
            sourceLocale: "en-US",
            source: ['This has an {{URL}} in it.', 'This is another {{ URL2 }} link.' ],
            targetLocale: "de-DE",
            target: [ "Dies hat ein {{URL}} drin.", "Dies ist noch einer {{ URL2 }}-Link." ],
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

    test("ResourceAngularNamedParams finds problems in plural resources", () => {
        expect.assertions(8);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "url.test",
            sourceLocale: "en-US",
            source: {
                one: 'This has an {{URL}} in it.',
                other: 'This is another {{ URL2 }} link.'
            },
            targetLocale: "de-DE",
            target: {
                one: "Dies hat ein {{URL}} drin.",
                other: "Dies ist noch einer {{ IRL }}-Link."
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
        expect(actual.description).toBe("The named parameter '{{URL2}}' from the source string does not appear in the target string");
        expect(actual.highlight).toBe("Target(other): Dies ist noch einer {{ IRL }}-Link.<e0></e0>");
        expect(actual.source).toBe('This is another {{ URL2 }} link.');
        expect(actual.pathName).toBe("a/b/c.xliff");
    });

    test("ResourceAngularNamedParams does not find problems in plural resources when there are no problems", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-angular-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "url.test",
            sourceLocale: "en-US",
            source: {
                one: 'This has an {{URL}} in it.',
                other: 'This is another {{ URL2 }} link.'
            },
            targetLocale: "de-DE",
            target: {
                one: "Dies hat ein {{URL}} drin.",
                other: "Dies ist noch einer {{ URL2 }}-Link."
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

