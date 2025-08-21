/*
 * LintingStrategy.test.js
 *
 * Copyright © 2025 Box, Inc.
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

import { IntermediateRepresentation, Result, Rule } from "ilib-lint-common";
import LintingStrategy from "../src/LintingStrategy.js";

// ESM support
const jest = import.meta.jest;

// test utilities
const testIrType = "test-type";
const testFilePath = "test/path/name";

const createIR = () => {
    return new IntermediateRepresentation({
        type: testIrType,
        ir: {},
        // @ts-expect-error: unused in test
        sourceFile: null,
    });
};

/** Create an anonymous Rule with the supplied type and match function */
const createRule = (/** @type {Rule["match"]} */ match) => {
    /** @type {Rule & { match: jest.MockedFunction<Rule["match"]> }} */
    const instance = new (class extends Rule {
        match = jest.fn(match);
        type = testIrType;
    })();
    return instance;
};

const createResult = (/** @type {Rule} */ originRule) => {
    return new Result({
        severity: "error",
        description: "test description",
        highlight: "test highlight",
        pathName: testFilePath,
        rule: originRule,
    });
};

describe("LintingStrategy", () => {
    describe("rule application", () => {
        /** @type {IntermediateRepresentation} */
        let ir;

        beforeEach(() => {
            ir = createIR();
        });

        it("should apply rules to an IR", () => {
            const rule = createRule(() => []);

            const strategy = new LintingStrategy();
            strategy.apply({
                ir,
                rules: [rule],
                filePath: testFilePath,
            });

            expect(rule.match).toHaveBeenCalledWith(expect.objectContaining({ ir }));
        });

        it("should gracefully handle rules that return undefined", () => {
            const rule = createRule(() => undefined);

            const strategy = new LintingStrategy();
            strategy.apply({
                ir,
                rules: [rule],
                filePath: testFilePath,
            });

            expect(rule.match).toHaveBeenCalledWith(expect.objectContaining({ ir }));
        });

        it("should gracefully handle rules that throw an error", () => {
            const rule = createRule(() => {
                throw new Error();
            });

            const strategy = new LintingStrategy();

            expect(() => {
                strategy.apply({
                    ir,
                    rules: [rule],
                    filePath: testFilePath,
                });
            }).not.toThrow();
            expect(rule.match).toHaveBeenCalledWith(expect.objectContaining({ ir }));
            // TODO: test that the error is logged
        });

        it("should gracefully handle empty rules array", () => {
            const strategy = new LintingStrategy();
            expect(() => {
                strategy.apply({
                    ir,
                    rules: [],
                    filePath: testFilePath,
                });
            }).not.toThrow();
        });

        it("should pass the locale to the rule", () => {
            const locale = "test-locale";

            const rule = createRule(() => []);
            const strategy = new LintingStrategy();
            strategy.apply({
                ir,
                rules: [rule],
                filePath: testFilePath,
                locale,
            });

            expect(rule.match).toHaveBeenCalledWith(expect.objectContaining({ locale }));
        });

        it("should pass the file path to the rule", () => {
            const differentFilePath = "different/test/path/name";

            const rule = createRule(() => []);
            const strategy = new LintingStrategy();
            strategy.apply({
                ir,
                rules: [rule],
                filePath: differentFilePath,
            });

            expect(rule.match).toHaveBeenCalledWith(expect.objectContaining({ file: differentFilePath }));
        });
    });

    describe("result accumulation", () => {
        /** @type {IntermediateRepresentation} */
        let ir;

        beforeEach(() => {
            ir = createIR();
        });

        it("should return empty array if no rules are provided", () => {
            const strategy = new LintingStrategy();
            const results = strategy.apply({
                ir,
                rules: [],
                filePath: testFilePath,
            });

            expect(results).toHaveLength(0);
        });

        it("should accumulate results from multiple rules", () => {
            const rule1 = createRule(() => [createResult(rule1)]);
            const rule2 = createRule(() => [createResult(rule2)]);

            const strategy = new LintingStrategy();
            const results = strategy.apply({
                ir,
                rules: [rule1, rule2],
                filePath: testFilePath,
            });

            expect(results).toHaveLength(2);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        rule: rule1,
                    }),
                    expect.objectContaining({
                        rule: rule2,
                    }),
                ])
            );
        });

        it("should gracefully handle rules that return an empty array", () => {
            const rule1 = createRule(() => []);
            const rule2 = createRule(() => [createResult(rule2)]);

            const strategy = new LintingStrategy();
            const results = strategy.apply({
                ir,
                rules: [rule1, rule2],
                filePath: testFilePath,
            });

            expect(results).toHaveLength(1);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        rule: rule2,
                    }),
                ])
            );
        });

        it("should gracefully handle rules that return undefined", () => {
            const rule1 = createRule(() => undefined);
            const rule2 = createRule(() => [createResult(rule2)]);

            const strategy = new LintingStrategy();
            const results = strategy.apply({
                ir,
                rules: [rule1, rule2],
                filePath: testFilePath,
            });

            expect(results).toHaveLength(1);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        rule: rule2,
                    }),
                ])
            );
        });

        it("should return accumulated results if some rules throw", () => {
            const rule1 = createRule(() => [createResult(rule1)]);
            const rule2 = createRule(() => {
                throw new Error();
            });
            const rule3 = createRule(() => [createResult(rule3)]);

            const strategy = new LintingStrategy();
            const results = strategy.apply({
                ir,
                rules: [rule1, rule2, rule3],
                filePath: testFilePath,
            });

            expect(results).toHaveLength(2);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        rule: rule1,
                    }),
                    expect.objectContaining({
                        rule: rule3,
                    }),
                ])
            );
        });
    });
});
