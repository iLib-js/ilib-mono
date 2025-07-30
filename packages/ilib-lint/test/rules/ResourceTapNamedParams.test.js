/*
 * ResourceTapNamedParams.test.js
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

describe("test the ResourceTapNamedParamsMatch rule", () => {
    test("ResourceTapNamedParams find problem in a string", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an __URL__ in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein __job__ drin.",
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
        expect(actual[0].description).toBe("The named parameter '__URL__' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Dies hat ein __job__ drin.<e0></e0>");
        expect(actual[0].source).toBe('This has an __URL__ in it.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTapNamedParams no problems in a string", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an __job__ in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein __job__ drin.",
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

    test("ResourceTapNamedParams capital in the name is okay", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an __URL__ in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein __URL__ drin.",
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

    test("ResourceTapNamedParams underscores in parameter names are allowed", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an __user_name__ in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein __user_name__ drin.",
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

    test("ResourceTapNamedParams dots in parameter names for property dereferencing", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'Hello __user.name__, welcome to __site.title__!',
            targetLocale: "de-DE",
            target: "Hallo __user.name__, willkommen bei __site.title__!",
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

    test("ResourceTapNamedParams dots in parameter names with missing target", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'Hello __user.name__, welcome to __site.title__!',
            targetLocale: "de-DE",
            target: "Hallo __user.name__, willkommen!",
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
        expect(actual[0].description).toBe("The named parameter '__site.title__' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Hallo __user.name__, willkommen!<e0></e0>");
        expect(actual[0].source).toBe('Hello __user.name__, welcome to __site.title__!');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTapNamedParams numbers in parameter names are allowed", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has __item1__ and __item2__ in it.',
            targetLocale: "de-DE",
            target: "Dies hat __item1__ und __item2__ drin.",
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

    test("ResourceTapNamedParams complex parameter names with underscores and dots", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'Hello __user_profile.name__, your __account_info.balance__ is __current_balance__.',
            targetLocale: "de-DE",
            target: "Hallo __user_profile.name__, dein __account_info.balance__ ist __current_balance__.",
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

    test("ResourceTapNamedParams finds an incorrect param", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an __URL__ in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein __job__ drin.",
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
        expect(actual[0].description).toBe("The named parameter '__URL__' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Dies hat ein __job__ drin.<e0></e0>");
        expect(actual[0].source).toBe('This has an __URL__ in it.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTapNamedParams does not catch problems in React-intl style params", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'In {number} days',
            targetLocale: "de-DE",
            target: "In {num} Tagen",
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

    test("ResourceTapNamedParams does not catch problems in Angular style params", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'In {{number}} days',
            targetLocale: "de-DE",
            target: "In {{num}} Tagen",
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

    test("ResourceTapNamedParams works with multiple parameters", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'Hello __name__, you have __count__ messages.',
            targetLocale: "de-DE",
            target: "Hallo __name__, du hast __count__ Nachrichten.",
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

    test("ResourceTapNamedParams finds missing parameter in multiple parameter string", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'Hello __name__, you have __count__ messages.',
            targetLocale: "de-DE",
            target: "Hallo __name__, du hast Nachrichten.",
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
        expect(actual[0].description).toBe("The named parameter '__count__' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Hallo __name__, du hast Nachrichten.<e0></e0>");
        expect(actual[0].source).toBe('Hello __name__, you have __count__ messages.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });



    test("ResourceTapNamedParams finds problems in plural resources", () => {
        expect.assertions(8);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "url.test",
            sourceLocale: "en-US",
            source: {
                one: 'This has an __URL__ in it.',
                other: 'This is another __URL2__ link.'
            },
            targetLocale: "de-DE",
            target: {
                one: "Dies hat ein __URL__ drin.",
                other: "Dies ist noch einer __IRL__-Link."
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
        expect(actual.description).toBe("The named parameter '__URL2__' from the source string does not appear in the target string");
        expect(actual.highlight).toBe("Target(other): Dies ist noch einer __IRL__-Link.<e0></e0>");
        expect(actual.source).toBe('This is another __URL2__ link.');
        expect(actual.pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTapNamedParams handles array resources", () => {
        expect.assertions(8);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "url.test",
            sourceLocale: "en-US",
            source: [
                'Hello __name__!',
                'Welcome __user__!',
                'Goodbye __visitor__!'
            ],
            targetLocale: "de-DE",
            target: [
                'Hallo __name__!',
                'Willkommen __user__!',
                'Auf Wiedersehen!'
            ],
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
        expect(actual.description).toBe("The named parameter '__visitor__' from the source string does not appear in the target string");
        expect(actual.highlight).toBe("Target[2]: Auf Wiedersehen!<e0></e0>");
        expect(actual.source).toBe('Goodbye __visitor__!');
        expect(actual.pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTapNamedParams handles deep property access", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'Hello __user.profile.first_name__, your __account.settings.notifications.email__ is enabled.',
            targetLocale: "de-DE",
            target: "Hallo __user.profile.first_name__, deine __account.settings.notifications.email__ ist aktiviert.",
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

    test("ResourceTapNamedParams handles mixed parameter types", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'Hello __user_name__, your __account.balance__ is __current_amount__.',
            targetLocale: "de-DE",
            target: "Hallo __user_name__, dein __account.balance__ ist __current_amount__.",
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

    test("ResourceTapNamedParams handles parameters with numbers in middle", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'You have __item_1__ and __item_2__ in your cart.',
            targetLocale: "de-DE",
            target: "Du hast __item_1__ und __item_2__ in deinem Warenkorb.",
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

    test("ResourceTapNamedParams handles parameters with dots and underscores", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'Hello __user_profile.first_name__, your __account_info.balance__ is __current_balance__.',
            targetLocale: "de-DE",
            target: "Hallo __user_profile.first_name__, dein __account_info.balance__ ist __current_balance__.",
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

    test("ResourceTapNamedParams handles reordered parameters correctly", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        // English: "Hello __name__, you have __count__ messages"
        // German: "Hallo __name__, du hast __count__ Nachrichten" (same order)
        // French: "Bonjour __name__, vous avez __count__ messages" (same order)
        // Japanese: "__count__件のメッセージがあります、__name__さん" (reordered for grammar)
        const resource = new ResourceString({
            key: "messages.test",
            sourceLocale: "en-US",
            source: 'Hello __name__, you have __count__ messages.',
            targetLocale: "ja-JP",
            target: "__count__件のメッセージがあります、__name__さん。",
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

    test("ResourceTapNamedParams handles reordered parameters with property access", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        // English: "Welcome __user.name__ to __site.title__"
        // Arabic: "مرحباً بك في __site.title__ يا __user.name__" (reordered for Arabic grammar)
        const resource = new ResourceString({
            key: "welcome.test",
            sourceLocale: "en-US",
            source: 'Welcome __user.name__ to __site.title__!',
            targetLocale: "ar-SA",
            target: "مرحباً بك في __site.title__ يا __user.name__!",
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

    test("ResourceTapNamedParams finds missing parameter in reordered translation", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        // English: "Hello __name__, you have __count__ messages"
        // Japanese: "メッセージがあります、__name__さん" (missing __count__)
        const resource = new ResourceString({
            key: "messages.test",
            sourceLocale: "en-US",
            source: 'Hello __name__, you have __count__ messages.',
            targetLocale: "ja-JP",
            target: "メッセージがあります、__name__さん。",
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
        expect(actual[0].id).toBe("messages.test");
        expect(actual[0].description).toBe("The named parameter '__count__' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: メッセージがあります、__name__さん。<e0></e0>");
        expect(actual[0].source).toBe('Hello __name__, you have __count__ messages.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTapNamedParams finds wrong parameter name in reordered translation", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        // English: "Hello __name__, you have __count__ messages"
        // Japanese: "__count__件のメッセージがあります、__user__さん" (wrong parameter name)
        const resource = new ResourceString({
            key: "messages.test",
            sourceLocale: "en-US",
            source: 'Hello __name__, you have __count__ messages.',
            targetLocale: "ja-JP",
            target: "__count__件のメッセージがあります、__user__さん。",
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
        expect(actual[0].id).toBe("messages.test");
        expect(actual[0].description).toBe("The named parameter '__name__' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: __count__件のメッセージがあります、__user__さん。<e0></e0>");
        expect(actual[0].source).toBe('Hello __name__, you have __count__ messages.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTapNamedParams handles complex reordering with multiple parameters", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-tap-named-params"));
        expect(rule).toBeTruthy();

        // English: "The __item__ costs __price__ at __store__"
        // Hebrew: "הפריט __item__ עולה __price__ ב__store__" (reordered for Hebrew grammar)
        const resource = new ResourceString({
            key: "pricing.test",
            sourceLocale: "en-US",
            source: 'The __item__ costs __price__ at __store__.',
            targetLocale: "he-IL",
            target: "הפריט __item__ עולה __price__ ב__store__.",
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
});
