/*
 * ResourceNoFullwidthDigits.test.js - test the resource-no-fullwidth-digits rule
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

import {ResourceString, ResourceArray, ResourcePlural} from 'ilib-tools-common';

import ResourceTargetChecker from '../src/rules/ResourceTargetChecker.js';
import {regexRules} from '../src/plugins/BuiltinPlugin.js';

import {IntermediateRepresentation} from 'ilib-lint-common';

import ResourceFixer from '../src/plugins/resource/ResourceFixer.js';

const rule = regexRules.find(rule => rule.name === "resource-no-fullwidth-digits");

describe("resource-no-fullwidth-digits rule", () => {
    it("detects full-width digits in the target string", () => {
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "matcher.test",
            source: 'Box12345',
            target: "Box１２３４５",
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("matcher.test");
        expect(result.description).toBe("The full-width characters '１２３４５' are not allowed in the target string. Use ASCII digits instead.");
        expect(result.highlight).toBe("Target: Box<e0>１２３４５</e0>");
        expect(result.source).toBe('Box12345');
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    it("detects full-width digits in the target array - NEEDS FIX !!!", () => {
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceArray({
            key: "matcher.test",
            source: [
                'Box12345'
            ],
            target: [
                "Box１２３４５"
            ],
            pathName: "a/b/c.xliff"
        });

        // TODO: fix error in DeclarativeResourceRule.checkString:  Cannot create a ResourceStringLocator for an array resource without an index
        const results = checker.matchString({
            source: resource.getSource()[0],
            target: resource.getTarget()[0],
            resource,
            file: "a/b/c.xliff"
        });
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("matcher.test");
        expect(result.description).toBe("The full-width characters '１２３４５' are not allowed in the target string. Use ASCII digits instead.");
        expect(result.highlight).toBe("Target: Box<e0>１２３４５</e0>");
        expect(result.source).toBe('Box12345');
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    it("detects full-width digits in the target plural - NEEDS FIX !!!", () => {
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourcePlural({
            key: "matcher.test",
            source: {
                one: 'Box1',
                other: 'Box12345'
            },
            target: {
                other: "Box１２３４５"
            },
            pathName: "a/b/c.xliff"
        });

        //TODO: fix error in DeclarativeResourceRule.checkString: Cannot create a ResourceStringLocator for a plural resource without a plural category
        const results = checker.matchString({
            source: resource.getSource().other,
            target: resource.getTarget().other,
            resource,
            file: "a/b/c.xliff"
        });
        const result = results[0];

        expect(results.length).toBe(1);
        expect(result.severity).toBe("error");
        expect(result.id).toBe("matcher.test");
        expect(result.description).toBe("The full-width characters '１２３４５' are not allowed in the target string. Use ASCII digits instead.");
        expect(result.highlight).toBe("Target: Box<e0>１２３４５</e0>");
        expect(result.source).toBe('Box12345');
        expect(result.pathName).toBe("a/b/c.xliff");
    });

    it("returns undefined if the target string is not a full-width digit", () => {
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceString({
            key: "matcher.test",
            source: 'Box12345',
            target: "Box12345",
        });

        const results = checker.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    it("returns undefined if the target array does not contain a full-width digit", () => {
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourceArray({
            key: "matcher.test",
            source: [
                'Box12345'
            ],
            target: [
                "Box12345"
            ],
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource()[0],
            target: resource.getTarget()[0],
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });

    it("returns undefined if the target plural does not contain a full-width digit", () => {
        const checker = new ResourceTargetChecker(rule);
        const resource = new ResourcePlural({
            key: "matcher.test",
            source: {
                one: 'Box1',
                other: 'Box12345'
            },
            target: {
                other: "Box12345"
            },
            pathName: "a/b/c.xliff"
        });

        const results = checker.matchString({
            source: resource.getSource().other,
            target: resource.getTarget().other,
            resource,
            file: "a/b/c.xliff"
        });

        expect(results).toBeUndefined();
    });
});
