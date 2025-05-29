/*
 * ResourceFullwidthDigitsFixer.test.js - test the fixer for fullwidth digit characters
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

import { ResourceString, ResourcePlural, ResourceArray } from 'ilib-tools-common';
import { IntermediateRepresentation, SourceFile } from "ilib-lint-common";
import ResourceFixer from "../../../src/plugins/resource/ResourceFixer.js";
import { regexRules } from '../../../src/plugins/BuiltinPlugin.js';

const rule = regexRules.find(rule => rule.name === "resource-no-fullwidth-digits");

describe("ResourceFullwidthDigitsFixer", () => {
    test("fixes fullwidth digits in simple string", () => {
        const fixer = new ResourceFixer();
        const resource = new ResourceString({
            key: "test.key",
            source: "Box12345",
            target: "Box１２３４５",
        });
        const source = getSource();
        const representation = getIntermediateRepresentation({ source, resource });
        const fixes = getFixesForStringResource(resource);

        fixer.applyFixes(representation, fixes);

        expect(resource.getTarget()).toBe("Box12345");
    });

    test("fixes fullwidth digits in plural string", () => {
        const fixer = new ResourceFixer();
        const resource = new ResourcePlural({
            key: "test.key",
            source: {
                one: "Box1",
                other: "Box12345"
            },
            target: {
                other: "Box１２３４５"
            },
        });
        const source = getSource()
        const representation = getIntermediateRepresentation({ source, resource })
        const fixes = getFixsesForObjectResource(resource);

        fixer.applyFixes(representation, fixes);

        expect(resource.getTarget().other).toBe("Box12345");
    });

    test("fixes fullwidth digits in array string", () => {
        const fixer = new ResourceFixer();
        const resource = new ResourceArray({
            key: "test.key",
            source: ["Box12345", "Box67890"],
            target: ["Box１２３４５", "Box６７８９０"],
        });
        const source = getSource()
        const representation = getIntermediateRepresentation({ source, resource })
        const fixes = getFixesForArrayResource(resource);

        fixer.applyFixes(representation, fixes);

        expect(resource.getTarget()).toEqual(["Box12345", "Box67890"]);
    });
});


function getIntermediateRepresentation({ source, resource }) {
    return new IntermediateRepresentation({
        sourceFile: source,
        type: "resource",
        ir: [resource],
        dirty: false
    })
}

function getSource() {
    return new SourceFile("test.xliff", {
        sourceLocale: "en-US",
        type: "resource"
    });
}

function getFixesForStringResource(resource) {
    return rule.fixes.map(fix => {
        const target = resource.getTarget()
        const fullwidthChar = String.fromCharCode(parseInt(fix.search.slice(2), 16));
        const position = target.indexOf(fullwidthChar);
        const hasFullwidthChar = position !== -1;

        if (hasFullwidthChar) {
            return ResourceFixer.createFix({
                resource,
                commands: [
                    ResourceFixer.createStringCommand(position, 1, fix.replace)
                ]
            });
        }
        return null;
    }).filter(fix => fix !== null);
}

function getFixsesForObjectResource(resource) {
    return rule.fixes.map(fix => {
        const target = resource.getTarget().other
        const fullwidthChar = String.fromCharCode(parseInt(fix.search.slice(2), 16));
        const position = target.indexOf(fullwidthChar);
        const hasFullwidthChar = position !== -1;

        if (hasFullwidthChar) {
            return ResourceFixer.createFix({
                resource,
                category: "other",
                commands: [
                    ResourceFixer.createStringCommand(position, 1, fix.replace)
                ]
            });
        }
        return null;
    }).filter(fix => fix !== null)
}

function getFixesForArrayResource(resource) {
    const targets = resource.getTarget()

    return targets.flatMap((target, index) => {
        return rule.fixes.map(fix => {
            const fullwidthChar = String.fromCharCode(parseInt(fix.search.slice(2), 16));
            const position = target.indexOf(fullwidthChar);
            const hasFullwidthChar = position !== -1;

            if (hasFullwidthChar) {
                return ResourceFixer.createFix({
                    resource,
                    index,
                    commands: [
                        ResourceFixer.createStringCommand(position, 1, fix.replace)
                    ]
                });
            }
            return null;
        }).filter(fix => fix !== null);
    });
} 