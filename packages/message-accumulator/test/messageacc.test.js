/*
 * messageacc.test.js - test the message accumulator object
 *
 * Copyright © 2019, 2024 JEDLSoft
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

import MessageAccumulator from "../src/message-accumulator.js";

describe("testAccumulator", () => {
    test("MessageAccumulatorFactory", () => {
        expect.assertions(2);

        let ma = MessageAccumulator.create();
        expect(ma).toBeTruthy();
        expect(ma.root.children.length).toBe(0);
    });

    test("MessageAccumulatorFromString", () => {
        expect.assertions(4);

        let ma = MessageAccumulator.create("This is a test of the decomposition system.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);

        expect(ma.root.children).toEqual(expect.objectContaining([
            expect.objectContaining({value: "This is a test of the decomposition system."})
        ]));
    });

    test("MessageAccumulatorFromStringWithComponent", () => {
        expect.assertions(4);

        let ma = MessageAccumulator.create("This is a <c0>test</c0> of the decomposition system.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(3);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "This is a "}),
                expect.objectContaining({
                    children: [
                        expect.objectContaining({value: "test"})
                    ],
                    index: 0
                }),
                expect.objectContaining({value: " of the decomposition system."})
            ]
        }));
    });

    test("MessageAccumulatorFromStringWithEmptyComponent", () => {
        expect.assertions(4);

        let ma = MessageAccumulator.create("<c0/>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({
                    index: 0
                })
            ],
        }));
    });

    test("MessageAccumulatorFromStringWith2Components", () => {
        expect.assertions(4);

        let ma = MessageAccumulator.create("This is a <c0>test</c0> of the <c1>decomposition</c1> system.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(5);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "This is a "}),
                expect.objectContaining({
                    children: [
                        expect.objectContaining({value: "test"})
                    ],
                    index: 0
                }),
                expect.objectContaining({value: " of the "}),
                expect.objectContaining({
                    children: [
                        expect.objectContaining({value: "decomposition"})
                    ],
                    index: 1
                }),
                expect.objectContaining({value: " system."})
            ]
        }));
    });

    test("MessageAccumulatorFromStringWith2NestedComponents", () => {
        expect.assertions(4);

        let ma = MessageAccumulator.create("This is a <c0>test of the <c1>decomposition</c1> system</c0>.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(3);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "This is a "}),
                expect.objectContaining({
                    children: [
                        expect.objectContaining({value: "test of the "}),
                        expect.objectContaining({
                            children: [
                                expect.objectContaining({value: "decomposition"})
                            ],
                            index: 1
                        }),
                        expect.objectContaining({value: " system"})
                    ],
                    index: 0
                }),
                expect.objectContaining({value: "."})
            ]
        }));
    });

    test("MessageAccumulatorFromStringWithParam", () => {
        expect.assertions(4);

        let ma = MessageAccumulator.create("This is a <p0/> of the decomposition system.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(3);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "This is a "}),
                expect.objectContaining({
                    type: 'param',
                    index: 0
                }),
                expect.objectContaining({value: " of the decomposition system."})
            ]
        }));
    });

    test("MessageAccumulatorFromStringWithMultipleParams", () => {
        expect.assertions(4);

        let ma = MessageAccumulator.create("This is a <p0/> of the decomposition <p1/>.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(5);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "This is a "}),
                expect.objectContaining({
                    type: 'param',
                    index: 0
                }),
                expect.objectContaining({value: " of the decomposition "}),
                expect.objectContaining({
                    type: 'param',
                    index: 1
                }),
                expect.objectContaining({value: "."})
            ]
        }));
    });

    test("MessageAccumulatorFromStringWithMultipleParamsReversed", () => {
        expect.assertions(4);

        let ma = MessageAccumulator.create("This is a <p1/> of the decomposition <p0/>.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(5);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "This is a "}),
                expect.objectContaining({
                    type: 'param',
                    index: 1
                }),
                expect.objectContaining({value: " of the decomposition "}),
                expect.objectContaining({
                    type: 'param',
                    index: 0
                }),
                expect.objectContaining({value: "."})
            ]
        }));
    });

    test("MessageAccumulatorFromStringWithParamsAndComponents", () => {
        expect.assertions(4);

        let ma = MessageAccumulator.create("This is a <c0>test of the <c1><p0/></c1> system</c0>.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(3);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "This is a "}),
                expect.objectContaining({
                    children: [
                        expect.objectContaining({value: "test of the "}),
                        expect.objectContaining({
                            children: [
                                expect.objectContaining({
                                    type: 'param',
                                    index: 0
                                })
                            ],
                            index: 1
                        }),
                        expect.objectContaining({value: " system"})
                    ],
                    index: 0
                }),
                expect.objectContaining({value: "."})
            ]
        }));
    });

    test("MessageAccumulatorFromEmptyString", () => {
        expect.assertions(2);

        let ma = MessageAccumulator.create("");
        expect(ma).toBeTruthy();

        expect(ma.root.children.length).toBe(0);
    });

    test("MessageAccumulatorBuildAddTextRightNumberOfChildren", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is a test.");

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);
    });

    test("MessageAccumulatorBuildAddTextRightChildren", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is a test.");

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children[0].value).toBe("This is a test.");
    });

    test("MessageAccumulatorBuildAddTextWithWhitespace", () => {
        expect.assertions(5);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("   This is a test.");
        ma.addText(" ");
        ma.addText("\n");

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children[0].value).toBe("   This is a test.");
        expect(ma.root.children[1].value).toBe(" ");
        expect(ma.root.children[2].value).toBe("\n");
    });

    test("MessageAccumulatorBuildAddParam", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addParam({foo: "bar"});

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);
    });

    test("MessageAccumulatorBuildAddParamRightNumberOfChildren", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is a test ");
        ma.addParam({foo: "bar"});
        ma.addText(" other text.");

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(3);
    });

    test("MessageAccumulatorBuildAddUndefined", () => {
        expect.assertions(2);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText();

        expect(ma.root.children.length).toBe(0);
    });

    test("MessageAccumulatorBuildAddEmptyString", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("");

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);
    });

    test("MessageAccumulatorBuildPushRightNumberOfChildren", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);
    });

    test("MessageAccumulatorBuildPushRightChildren", () => {
        expect.assertions(4);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push(5);

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);
        expect(ma.root.children[0].extra).toBe(5);
    });

    test("MessageAccumulatorBuildPushAmongstOthers", () => {
        expect.assertions(5);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is ");
        ma.push(5);

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(2);
        expect(ma.root.children[0].value).toBe("This is ");
        expect(ma.root.children[1].extra).toBe(5);
    });

    test("MessageAccumulatorBuildPushAmongstOthersWithContent", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");

        expect(ma.root.children).toBeTruthy();

        expect(ma.root.children).toEqual(expect.objectContaining([
            expect.objectContaining({value: "This is "}),
            expect.objectContaining({
                children: [
                    expect.objectContaining({value: "a test"})
                ],
                index: 0,
                extra: 5
            })
        ]));
    });

    test("MessageAccumulatorBuildPushPopWithNoContent", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is ");
        ma.push(5);
        ma.pop();
        ma.addText("a test");

        expect(ma.root.children).toBeTruthy();

        expect(ma.root.children).toEqual(expect.objectContaining([
            expect.objectContaining({value: "This is "}),
            expect.objectContaining({
                index: 0,
                extra: 5
            }),
            expect.objectContaining({value: "a test"})
        ]));
    });

    test("MessageAccumulatorBuildPopNormal", () => {
        expect.assertions(5);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push(5);
        ma.addText("foo");
        expect(ma.pop()).toBe(5);

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);
        expect(ma.root.children[0].children.length).toBe(1);
    });

    test("MessageAccumulatorBuildPopNormalWithParam", () => {
        expect.assertions(5);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push(5);
        ma.addText("foo");
        ma.addParam(3);
        expect(ma.pop()).toBe(5);

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);
        expect(ma.root.children[0].children.length).toBe(2);
    });

    test("MessageAccumulatorBuildPopOnRoot", () => {
        expect.assertions(5);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("foo");
        expect(!ma.pop()).toBeTruthy(); // should have no effect

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);
        expect(ma.root.children[0].value).toBe("foo");
    });

    test("MessageAccumulatorBuildPopReturnExtra", () => {
        expect.assertions(2);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push({name: "a", value: true});
        ma.addText("foo");
        expect(ma.pop()).toStrictEqual({name: "a", value: true});
    });

    test("MessageAccumulatorBuildNotClosed", () => {
        expect.assertions(5);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push(5);
        ma.addText("foo");

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);
        expect(ma.root.children[0].children.length).toBe(1);
        expect(!ma.root.children[0].closed).toBeTruthy();
    });

    test("MessageAccumulatorBuildClosed", () => {
        expect.assertions(5);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push(5);
        ma.addText("foo");
        ma.pop();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);
        expect(ma.root.children[0].children.length).toBe(1);
        expect(ma.root.children[0].closed).toBeTruthy();
    });

    test("MessageAccumulatorGetStringSimple", () => {
        expect.assertions(2);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("Text");

        expect(ma.getString()).toBe("Text");
    });

    test("MessageAccumulatorGetStringEmpty", () => {
        expect.assertions(2);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        expect(ma.getString()).toBe("");
    });

    test("MessageAccumulatorGetStringWithComponent", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getString()).toBe("This is <c0>a test</c0>");
    });

    test("MessageAccumulatorGetStringWithComponentUnbalanced", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");

        expect(ma.root.children).toBeTruthy();

        expect(ma.getString()).toBe("This is <c0>a test</c0>");
    });

    test("MessageAccumulatorGetStringWithTwoComponents", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.pop();
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");

        expect(ma.root.children).toBeTruthy();

        expect(ma.getString()).toBe("This is <c0>a test</c0> of the <c1>emergency message system</c1>.");
    });

    test("MessageAccumulatorGetStringWithNestedComponents", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getString()).toBe("This is <c0>a test of the <c1>emergency message system</c1>.</c0>");
    });

    test("MessageAccumulatorGetStringWithOuterComponents", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push();
        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getString()).toBe("<c0>This is <c1>a test of the <c2>emergency message system</c2>.</c1></c0>");
    });

    test("MessageAccumulatorGetStringWithNoPop", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push();
        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");

        expect(ma.root.children).toBeTruthy();

        expect(ma.getString()).toBe("<c0>This is <c1>a test of the <c2>emergency message system</c2>.</c1></c0>");
    });

    test("MessageAccumulatorGetStringPushPopWithNoContents", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is a test of the ");
        ma.push(5);
        ma.pop();  // simulates a self-closing tag
        ma.addText(" emergency message system.");

        expect(ma.root.children.length).toBe(3);

        expect(ma.getString()).toBe("This is a test of the <c0/> emergency message system.");
    });

    test("MessageAccumulatorGetStringWithParam", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is a ");
        ma.addParam({value: "{test}"});
        ma.addText(" of the ");
        ma.addText("emergency message system");
        ma.addText(".");

        expect(ma.root.children).toBeTruthy();

        expect(ma.getString()).toBe("This is a <p0/> of the emergency message system.");
    });

    test("MessageAccumulatorGetStringWithMultipleParams", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is a ");
        ma.addParam({value: "{test}"});
        ma.addText(" of the ");
        ma.addText("emergency message ");
        ma.addParam({value: "{system}"});
        ma.addText(".");

        expect(ma.root.children).toBeTruthy();

        expect(ma.getString()).toBe("This is a <p0/> of the emergency message <p1/>.");
    });

    test("MessageAccumulatorGetStringWithParamsAndComponents", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is a ");
        ma.push(5);
        ma.addParam({value: "{test}"});
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message ");
        ma.pop();
        ma.addParam({value: "{system}"});
        ma.addText(".");
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getString()).toBe("This is a <c0><p0/> of the <c1>emergency message </c1><p1/>.</c0>");
    });

    test("MessageAccumulatorParseAndThenGetString", () => {
        expect.assertions(3);

        let ma = MessageAccumulator.create("<c0>This is <c1>a <p0/> of the <c2>emergency message system</c2>.</c1></c0>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getString()).toBe("<c0>This is <c1>a <p0/> of the <c2>emergency message system</c2>.</c1></c0>");
    });

    test("MessageAccumulatorGetExtra", () => {
        expect.assertions(5);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push(86);
        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getExtra(0)).toBe(86);
        expect(ma.getExtra(1)).toBe(5);
        expect(ma.getExtra(2)).toBe(4);
    });

    test("MessageAccumulatorGetExtraObjects", () => {
        expect.assertions(5);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push({foo: "bar"});
        ma.addText("This is ");
        ma.push({type: "component"});
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push({name: "a"});
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getExtra(0)).toStrictEqual({foo: "bar"});
        expect(ma.getExtra(1)).toStrictEqual({type: "component"});
        expect(ma.getExtra(2)).toStrictEqual({name: "a"});
    });

    test("MessageAccumulatorGetParam", () => {
        expect.assertions(5);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push(86);
        ma.addText("This is ");
        ma.push(5);
        ma.addText("a ");
        ma.addParam({value: "{test}"});
        ma.addText(" of the ");
        ma.push(4);
        ma.addParam({value: "{emergency}"});
        ma.addText(" message ");
        ma.addParam({value: "{system}"});
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getParam(0)).toStrictEqual({value: "{test}"});
        expect(ma.getParam(1)).toStrictEqual({value: "{emergency}"});
        expect(ma.getParam(2)).toStrictEqual({value: "{system}"});
    });

    test("MessageAccumulatorGetMapping", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push({foo: "bar"});
        ma.addText("This is ");
        ma.push({type: "component"});
        ma.addText("a ");
        ma.addParam({value: "{test}"});
        ma.addText(" of the ");
        ma.push({name: "a"});
        ma.addText("emergency message ");
        ma.addParam({value: "{system}"});
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getMapping()).toStrictEqual({
            "c0": {foo: "bar"},
            "c1": {type: "component"},
            "c2": {name: "a"},
            "p0": {value: "{test}"},
            "p1": {value: "{system}"}
        });
    });

    test("MessageAccumulatorIsRootTrue", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is ");

        expect(ma.root.children).toBeTruthy();

        expect(ma.isRoot()).toBeTruthy();
    });

    test("MessageAccumulatorIsRootFalse", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is ");
        ma.push({foo: "bar"});

        expect(ma.root.children).toBeTruthy();

        expect(!ma.isRoot()).toBeTruthy();
    });

    test("MessageAccumulatorGetTextLength", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("This is ");
        ma.push({type: "component"});
        ma.addText("a test.");
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getTextLength()).toBe(12);
    });

    test("MessageAccumulatorGetTextLengthAllInsideAComponent", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push({foo: "bar"});
        ma.addText("test");
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getTextLength()).toBe(4);
    });

    test("MessageAccumulatorGetTextLengthWithParam", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("test ");
        ma.addParam("%1");

        expect(ma.root.children).toBeTruthy();

        expect(ma.getTextLength()).toBe(9);
    });

    test("MessageAccumulatorGetTextLengthZero", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push({type: "component"});
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getTextLength()).toBe(0);
    });

    test("MessageAccumulatorGetTextLengthIgnoreWhiteSpace", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.addText("\t\t");
        ma.push({foo: "bar"});
        ma.addText("\n    \n\t\t\    \n");
        ma.pop();
        ma.addText("  ");

        expect(ma.root.children).toBeTruthy();

        expect(ma.getTextLength()).toBe(0);
    });

    test("MessageAccumulatorGetTextLengthIgnoreUnicodeWhiteSpace", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        ma.push({foo: "bar"});
        ma.addText("            ​‌‍ ⁠");
        ma.pop();

        expect(ma.root.children).toBeTruthy();

        expect(ma.getTextLength()).toBe(0);
    });

    test("MessageAccumulatorCreateWithSource", () => {
        expect.assertions(7);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");

        // The translation has the components swapped from the English
        let ma = MessageAccumulator.create("Einen großen <c1>Tritt</c1> in Richtung Tors geben Sie am <c0>Ball</c0> hin.", source);
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(5);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "Einen großen "}),
                expect.objectContaining({
                    type: "component",
                    children: [
                        expect.objectContaining({value: "Tritt"})
                    ],
                    index: 1,
                    extra: expect.objectContaining({
                        name: "i"
                    })
                }),
                expect.objectContaining({value: " in Richtung Tors geben Sie am "}),
                expect.objectContaining({
                    type: "component",
                    children: [
                        expect.objectContaining({value: "Ball"})
                    ],
                    index: 0,
                    extra: expect.objectContaining({
                        name: "b"
                    })
                }),
                expect.objectContaining({value: " hin."})
            ]
        }));

        // now check the extra information is attached in the right place
        expect(ma.root.children[1].extra).toStrictEqual({name: "i"});
        expect(ma.root.children[3].extra).toStrictEqual({name: "b"});
    });

    test("MessageAccumulatorCreateWithSourceAndParams", () => {
        expect.assertions(7);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ");
        source.addParam("{ball}");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addParam("{kick}");
        source.pop();
        source.addText(" towards the goal.");

        // The translation has the components swapped from the English
        let ma = MessageAccumulator.create("Einen großen <c1><p1/></c1> in Richtung Tors geben Sie am <c0><p0/></c0> hin.", source);
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(5);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "Einen großen "}),
                expect.objectContaining({
                    type: 'component',
                    children: [
                        expect.objectContaining({
                            type: 'param',
                            index: 1
                        })
                    ],
                    index: 1
                }),
                expect.objectContaining({value: " in Richtung Tors geben Sie am "}),
                expect.objectContaining({
                    type: 'component',
                    children: [
                        expect.objectContaining({
                            type: 'param',
                            index: 0
                        })
                    ],
                    index: 0
                }),
                expect.objectContaining({value: " hin."})
            ]
        }));

        // now check the extra information is attached in the right place
        expect(ma.root.children[1].extra).toStrictEqual({name: "i"});
        expect(ma.root.children[3].extra).toStrictEqual({name: "b"});
    });

    test("MessageAccumulatorCreateWithSourceMissingComponents", () => {
        expect.assertions(7);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");

        // The translation has the components swapped from the English
        let ma = MessageAccumulator.create("Einen großen <c1>Tritt</c1> in Richtung Tors <c2/> geben <c3>Sie</c3> am <c0>Ball</c0> hin.", source);
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(9);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "Einen großen "}),
                expect.objectContaining({
                    type: "component",
                    children: [
                        expect.objectContaining({value: "Tritt"})
                    ],
                    index: 1,
                    extra: expect.objectContaining({
                        name: "i"
                    })
                }),
                expect.objectContaining({value: " in Richtung Tors "}),
                expect.objectContaining({
                    type: "component",
                    children: [],
                    index: 2
                }),
                expect.objectContaining({value: " geben "}),
                expect.objectContaining({
                    type: "component",
                    children: [
                        expect.objectContaining({value: "Sie"})
                    ],
                    index: 3
                }),
                expect.objectContaining({value: " am "}),
                expect.objectContaining({
                    type: "component",
                    children: [
                        expect.objectContaining({value: "Ball"})
                    ],
                    index: 0,
                    extra: expect.objectContaining({
                        name: "b"
                    })
                }),
                expect.objectContaining({value: " hin."})
            ]
        }));

        // the components with no mapping to the source should have no "extra" property
        expect(!ma.root.children[3].extra).toBeTruthy();
        expect(!ma.root.children[5].extra).toBeTruthy();
    });

    test("MessageAccumulatorGetCurrentLevelEmpty", () => {
        expect.assertions(2);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        expect(ma.getCurrentLevel()).toBe(0);
    });

    test("MessageAccumulatorGetCurrentLevelNoContext", () => {
        expect.assertions(3);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        expect(ma.getCurrentLevel()).toBe(0);
        // does not push a new context
        ma.addText("You give ");

        expect(ma.getCurrentLevel()).toBe(0);
    });

    test("MessageAccumulatorGetCurrentLevel", () => {
        expect.assertions(6);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        expect(ma.getCurrentLevel()).toBe(0);

        ma.addText("You give ");

        expect(ma.getCurrentLevel()).toBe(0);

        ma.push({name: "b"});

        expect(ma.getCurrentLevel()).toBe(1);

        ma.addText("the ball");

        expect(ma.getCurrentLevel()).toBe(1);

        ma.pop();

        expect(ma.getCurrentLevel()).toBe(0);
    });

    test("MessageAccumulatorGetCurrentLevelDeep", () => {
        expect.assertions(11);

        let ma = new MessageAccumulator();
        expect(ma).toBeTruthy();

        expect(ma.getCurrentLevel()).toBe(0);

        ma.addText("You give ");

        expect(ma.getCurrentLevel()).toBe(0);

        ma.addParam("{test}");

        expect(ma.getCurrentLevel()).toBe(0);

        ma.push({name: "a"});

        expect(ma.getCurrentLevel()).toBe(1);

        ma.push({name: "b"});

        expect(ma.getCurrentLevel()).toBe(2);

        ma.push({name: "c"});

        expect(ma.getCurrentLevel()).toBe(3);

        ma.addText("the ball");

        expect(ma.getCurrentLevel()).toBe(3);

        ma.pop();

        expect(ma.getCurrentLevel()).toBe(2);

        ma.pop();

        expect(ma.getCurrentLevel()).toBe(1);

        ma.pop();

        expect(ma.getCurrentLevel()).toBe(0);
    });

    test("MessageAccumulatorMinimizeOuterComponents", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        expect(source.getString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
        expect(source.getMinimalString()).toBe("You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");
    });

    test("MessageAccumulatorGetPrefix", () => {
        expect.assertions(6);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        expect(source.getString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
        expect(source.getMinimalString()).toBe("You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");
        var prefix = source.getPrefix();
        expect(prefix).toBeTruthy();
        expect(prefix.length).toBe(1);
        expect(prefix[0]).toEqual(expect.objectContaining({extra: {name: "a"}, use: "start"}));
    });

    test("MessageAccumulatorGetSuffix", () => {
        expect.assertions(6);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        expect(source.getString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
        expect(source.getMinimalString()).toBe("You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");
        var suffix = source.getSuffix();
        expect(suffix).toBeTruthy();
        expect(suffix.length).toBe(1);
        expect(suffix[0]).toEqual(expect.objectContaining({extra: {name: "a"}, use: "end"}));
    });

    test("MessageAccumulatorMinimizeOuterComponentSelfClosing", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.pop();
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        expect(source.getString()).toBe("<c0/>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.");
        expect(source.getMinimalString()).toBe("You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");
    });

    test("MessageAccumulatorMinimizeOuterComponentSelfClosingWithKeepProperty", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"}, true); // true keeps this component during getMinimalString
        source.pop();
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        expect(source.getString()).toBe("<c0/>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.");
        expect(source.getMinimalString()).toBe("<c0/>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.");
    });

    test("MessageAccumulatorMinimizeOuterComponentsButNotParams", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addParam("{test}");
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        expect(source.getString()).toBe("<c0><p0/>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
        expect(source.getMinimalString()).toBe("<p0/>You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");
    });

    test("MessageAccumulatorMinimizeOuterComponentsButNotWithKeepProperty", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"}, true); // true to keep this one
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        expect(source.getString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
        expect(source.getMinimalString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
    });

    test("MessageAccumulatorMinimizeMultipleOuterComponents", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.push({name: "x"});
        source.push({name: "y"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.pop();
        source.pop();

        expect(source.getString()).toBe("<c0><c1><c2>You give <c3>the ball</c3> a big <c4>kick</c4> towards the goal.</c2></c1></c0>");
        expect(source.getMinimalString()).toBe("You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");
    });

    test("MessageAccumulatorGetPrefixMultiple", () => {
        expect.assertions(8);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.push({name: "x"});
        source.push({name: "y"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.pop();
        source.pop();

        expect(source.getString()).toBe("<c0><c1><c2>You give <c3>the ball</c3> a big <c4>kick</c4> towards the goal.</c2></c1></c0>");
        expect(source.getMinimalString()).toBe("You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");

        var prefix = source.getPrefix();
        expect(prefix).toBeTruthy();
        expect(prefix.length).toBe(3);
        expect(prefix[0]).toEqual(expect.objectContaining({extra: {name: "a"}, use: "start"}));
        expect(prefix[1]).toEqual(expect.objectContaining({extra: {name: "x"}, use: "start"}));
        expect(prefix[2]).toEqual(expect.objectContaining({extra: {name: "y"}, use: "start"}));
    });

    test("MessageAccumulatorGetSuffixMultiple", () => {
        expect.assertions(8);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.push({name: "x"});
        source.push({name: "y"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.pop();
        source.pop();

        expect(source.getString()).toBe("<c0><c1><c2>You give <c3>the ball</c3> a big <c4>kick</c4> towards the goal.</c2></c1></c0>");
        expect(source.getMinimalString()).toBe("You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");

        var suffix = source.getSuffix();
        expect(suffix).toBeTruthy();
        expect(suffix.length).toBe(3);
        expect(suffix[0]).toEqual(expect.objectContaining({extra: {name: "y"}, use: "end"}));
        expect(suffix[1]).toEqual(expect.objectContaining({extra: {name: "x"}, use: "end"}));
        expect(suffix[2]).toEqual(expect.objectContaining({extra: {name: "a"}, use: "end"}));
    });

    test("MessageAccumulatorDontMinimizeNonOuterComponents", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.addText(" After you score, you celebrate.");

        expect(source.getString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0> After you score, you celebrate.");
        expect(source.getMinimalString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0> After you score, you celebrate.");
    });

    test("MessageAccumulatorDontMinimizeNonOuterComponentsWithParams", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.addParam("%1s@");

        expect(source.getString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0><p0/>");
        expect(source.getMinimalString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0><p0/>");
    });

    test("MessageAccumulatorDontMinimizeNonOuterComponentsNoPrefixOrSuffix", () => {
        expect.assertions(7);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.addText(" After you score, you celebrate.");

        expect(source.getString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0> After you score, you celebrate.");
        expect(source.getMinimalString()).toBe("<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0> After you score, you celebrate.");

        var prefix = source.getPrefix();
        expect(prefix).toBeTruthy();
        expect(prefix.length).toBe(0);

        var suffix = source.getSuffix();
        expect(suffix).toBeTruthy();
        expect(suffix.length).toBe(0);
    });

    test("MessageAccumulatorMinimizeEmpty", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        expect(source.getString()).toBe("");
        expect(source.getMinimalString()).toBe("");
    });

    test("MessageAccumulatorMinimizeSimple", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.addText("Test");

        expect(source.getString()).toBe("Test");
        expect(source.getMinimalString()).toBe("Test");
    });

    test("MessageAccumulatorMinimizeUnbalanced", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "i"});
        source.addText("Test");

        expect(source.getString()).toBe("<c0>Test</c0>");
        expect(source.getMinimalString()).toBe("Test");
    });

    test("MessageAccumulatorMinimizeWhiteSpace", () => {
        expect.assertions(3);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "i"});
        source.addText("    \n\t   ");
        source.pop();

        expect(source.getString()).toBe("<c0>    \n\t   </c0>");
        expect(source.getMinimalString()).toBe("");
    });

    test("MessageAccumulatorMinimizeWhitespace", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("   This is a test of the <c0>decomposition</c0> system.   ");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(3);

        expect(ma.getString()).toBe("   This is a test of the <c0>decomposition</c0> system.   ");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizePrefixComponents", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0/>This is a test of the <c1>decomposition</c1> system.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(4);

        expect(ma.getString()).toBe("<c0/>This is a test of the <c1>decomposition</c1> system.");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizePrefixComponentsWithSpace", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0>    </c0>This is a test of the <c1>decomposition</c1> system.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(4);

        expect(ma.getString()).toBe("<c0>    </c0>This is a test of the <c1>decomposition</c1> system.");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizePrefixComponentsWithParam", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0><p0/></c0>This is a test of the <c1>decomposition</c1> system.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(4);

        expect(ma.getString()).toBe("<c0><p0/></c0>This is a test of the <c1>decomposition</c1> system.");
        expect(ma.getMinimalString()).toBe("<c0><p0/></c0>This is a test of the <c1>decomposition</c1> system.");
    });

    test("MessageAccumulatorMinimizePrefixComponentsWithSpaceAndSubcomponents", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0>\n  <c1>\n  </c1>\n</c0>This is a test of the <c2>decomposition</c2> system.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(4);

        expect(ma.getString()).toBe("<c0>\n  <c1>\n  </c1>\n</c0>This is a test of the <c2>decomposition</c2> system.");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizeSuffixComponents", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("This is a test of the <c0>decomposition</c0> system.<c1/>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(4);

        expect(ma.getString()).toBe("This is a test of the <c0>decomposition</c0> system.<c1/>");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizeSuffixComponentsWithSpace", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("This is a test of the <c0>decomposition</c0> system.<c1>    </c1>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(4);

        expect(ma.getString()).toBe("This is a test of the <c0>decomposition</c0> system.<c1>    </c1>");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizeSuffixComponentsWithSpaceAndSubcomponents", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("This is a test of the <c0>decomposition</c0> system.<c1>\n  <c2>\n  </c2>\n</c1>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(4);

        expect(ma.getString()).toBe("This is a test of the <c0>decomposition</c0> system.<c1>\n  <c2>\n  </c2>\n</c1>");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizePrefixAndSuffixComponents", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0/>This is a test of the <c1>decomposition</c1> system.<c2/>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(5);

        expect(ma.getString()).toBe("<c0/>This is a test of the <c1>decomposition</c1> system.<c2/>");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizePrefixAndSuffixComponentsWithSpace", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0>\n</c0>This is a test of the <c1>decomposition</c1> system.<c2>    </c2>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(5);

        expect(ma.getString()).toBe("<c0>\n</c0>This is a test of the <c1>decomposition</c1> system.<c2>    </c2>");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizePrefixAndSuffixComponentsWithSpaceAndSubcomponents", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0>\n  <c1>\n  </c1>\n</c0>This is a test of the <c2>decomposition</c2> system.<c3>  <c4> </c4>  </c3>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(5);

        expect(ma.getString()).toBe("<c0>\n  <c1>\n  </c1>\n</c0>This is a test of the <c2>decomposition</c2> system.<c3>  <c4> </c4>  </c3>");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizePrefixAndOuterComponents", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0><c1/>This is a test of the <c2>decomposition</c2> system.</c0>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);

        expect(ma.getString()).toBe("<c0><c1/>This is a test of the <c2>decomposition</c2> system.</c0>");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizeSuffixAndOuterComponents", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0>This is a test of the <c1>decomposition</c1> system.<c2/></c0>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);

        expect(ma.getString()).toBe("<c0>This is a test of the <c1>decomposition</c1> system.<c2/></c0>");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizeVeryComplexWithMultipleLevels", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0><c1>  \t </c1><c2>\n<c3>\n<c4/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);

        expect(ma.getString()).toBe("<c0><c1>  \t </c1><c2>\n<c3>\n<c4/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        expect(ma.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");
    });

    test("MessageAccumulatorMinimizeVeryComplexWithMultipleLevelsAndEmbeddedParam", () => {
        expect.assertions(5);

        let ma = MessageAccumulator.create("<c0><c1>  \t </c1><c2>\n<c3>\n<c4/><p0/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(1);

        expect(ma.getString()).toBe("<c0><c1>  \t </c1><c2>\n<c3>\n<c4/><p0/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        expect(ma.getMinimalString()).toBe("<c0>\n<c1/><p0/></c0>\n  This is a test of the <c2>decomposition</c2> system.");
    });

    test("MessageAccumulatorMinimizeVeryComplexPrefix", () => {
        expect.assertions(18);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.push({name: "b"});
        source.addText("  \t ");
        source.pop();
        source.push({name: "c"});
        source.addText("\n");
        source.push({name: "d"});
        source.addText("\n");
        source.push({name: "e"});
        source.pop();
        source.pop();
        source.addText("\n  This is a test of the ");
        source.push({name: "f"});
        source.addText("decomposition");
        source.pop();
        source.addText(" system.   ");
        source.push({name: "g"});
        source.addText("\n");
        source.pop();
        source.pop();
        source.pop();

        expect(source.root.children).toBeTruthy();
        expect(source.root.children.length).toBe(1);

        expect(source.getString()).toBe("<c0><c1>  \t </c1><c2>\n<c3>\n<c4/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        expect(source.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");

        var prefix = source.getPrefix();
        expect(prefix).toBeTruthy();
        expect(prefix.length).toBe(11);
        expect(prefix[0]).toEqual(expect.objectContaining({extra: {name: "a"}, use: "start"}));
        expect(prefix[1]).toEqual(expect.objectContaining({extra: {name: "b"}, use: "start"}));
        expect(prefix[2]).toEqual(expect.objectContaining({value: "  \t "}));
        expect(prefix[3]).toEqual(expect.objectContaining({extra: {name: "b"}, use: "end"}));
        expect(prefix[4]).toEqual(expect.objectContaining({extra: {name: "c"}, use: "start"}));
        expect(prefix[5]).toEqual(expect.objectContaining({value: "\n"}));
        expect(prefix[6]).toEqual(expect.objectContaining({extra: {name: "d"}, use: "start"}));
        expect(prefix[7]).toEqual(expect.objectContaining({value: "\n"}));
        expect(prefix[8]).toEqual(expect.objectContaining({extra: {name: "e"}, use: "startend"}));
        expect(prefix[9]).toEqual(expect.objectContaining({extra: {name: "d"}, use: "end"}));
        expect(prefix[10]).toEqual(expect.objectContaining({value: "\n  "}));
    });

    test("MessageAccumulatorMinimizeAllWhiteSpacePrefix", () => {
        expect.assertions(9);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("  \t\t \n     ");
        source.pop();

        expect(source.root.children).toBeTruthy();
        expect(source.root.children.length).toBe(1);

        expect(source.getString()).toBe("<c0>  \t\t \n     </c0>");
        expect(source.getMinimalString()).toBe("");

        var prefix = source.getPrefix();
        expect(prefix).toBeTruthy();
        expect(prefix.length).toBe(2);
        expect(prefix[0]).toEqual(expect.objectContaining({extra: {name: "a"}, use: "start"}));
        expect(prefix[1]).toEqual(expect.objectContaining({value: "  \t\t \n     "}));
    });

    test("MessageAccumulatorMinimizeUnicodeWhiteSpacePrefix", () => {
        expect.assertions(9);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("            ​‌‍ ⁠"); // includes non-breaking space and other Unicode space chars
        source.pop();

        expect(source.root.children).toBeTruthy();
        expect(source.root.children.length).toBe(1);

        expect(source.getString()).toBe("<c0>            ​‌‍ ⁠</c0>");
        expect(source.getMinimalString()).toBe("");

        var prefix = source.getPrefix();
        expect(prefix).toBeTruthy();
        expect(prefix.length).toBe(2);
        expect(prefix[0]).toEqual(expect.objectContaining({extra: {name: "a"}, use: "start"}));
        expect(prefix[1]).toEqual(expect.objectContaining({value: "            ​‌‍ ⁠"}));
    });

    test("MessageAccumulatorMinimizeVeryComplexSuffix", () => {
        expect.assertions(13);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.push({name: "b"});
        source.addText("  \t ");
        source.pop();
        source.push({name: "c"});
        source.addText("\n");
        source.push({name: "d"});
        source.addText("\n");
        source.push({name: "e"});
        source.pop();
        source.pop();
        source.addText("\n  This is a test of the ");
        source.push({name: "f"});
        source.addText("decomposition");
        source.pop();
        source.addText(" system.   ");
        source.push({name: "g"});
        source.addText("\n");
        source.pop();
        source.pop();
        source.pop();

        expect(source.root.children).toBeTruthy();
        expect(source.root.children.length).toBe(1);

        expect(source.getString()).toBe("<c0><c1>  \t </c1><c2>\n<c3>\n<c4/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        expect(source.getMinimalString()).toBe("This is a test of the <c0>decomposition</c0> system.");

        var prefix = source.getSuffix();
        expect(prefix).toBeTruthy();
        expect(prefix.length).toBe(6);

        expect(prefix[0]).toEqual(expect.objectContaining({value: "   "}));
        expect(prefix[1]).toEqual(expect.objectContaining({extra: {name: "g"}, use: "start"}));
        expect(prefix[2]).toEqual(expect.objectContaining({value: "\n"}));
        expect(prefix[3]).toEqual(expect.objectContaining({extra: {name: "g"}, use: "end"}));
        expect(prefix[4]).toEqual(expect.objectContaining({extra: {name: "c"}, use: "end"}));
        expect(prefix[5]).toEqual(expect.objectContaining({extra: {name: "a"}, use: "end"}));
    });

    test("MessageAccumulatorMinimizeAllWhitespaceSuffix", () => {
        expect.assertions(8);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("  \t\t \n     ");
        source.pop();

        expect(source.root.children).toBeTruthy();
        expect(source.root.children.length).toBe(1);

        expect(source.getString()).toBe("<c0>  \t\t \n     </c0>");
        expect(source.getMinimalString()).toBe("");

        var suffix = source.getSuffix();
        expect(suffix).toBeTruthy();
        expect(suffix.length).toBe(1);

        expect(suffix[0]).toEqual(expect.objectContaining({extra: {name: "a"}, use: "end"}));
    });

    test("MessageAccumulatorMinimizeUnicodeWhitespaceSuffix", () => {
        expect.assertions(8);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("            ​‌‍ ⁠"); // includes non-breaking space and other Unicode space chars
        source.pop();

        expect(source.root.children).toBeTruthy();
        expect(source.root.children.length).toBe(1);

        expect(source.getString()).toBe("<c0>            ​‌‍ ⁠</c0>");
        expect(source.getMinimalString()).toBe("");

        var suffix = source.getSuffix();
        expect(suffix).toBeTruthy();
        expect(suffix.length).toBe(1);

        expect(suffix[0]).toEqual(expect.objectContaining({extra: {name: "a"}, use: "end"}));
    });

    test("MessageAccumulatorMinimizeMappingStillCorrect", () => {
        expect.assertions(7);

        let ma = MessageAccumulator.create("<c0>This is a test of the <c1><p0/></c1> system.<c2/></c0>");
        expect(ma).toBeTruthy();
        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.push({name: "a"});
        source.addText("This is a test of the ");
        source.push({name: "b"});
        source.addParam("decomposition");
        source.pop();
        source.addText(" system.");
        source.push({name: "c"});
        source.pop();
        source.pop();

        expect(source.root.children).toBeTruthy();
        expect(source.root.children.length).toBe(1);

        expect(source.getMapping()).toStrictEqual({
            "c0": {name: "a"},
            "c1": {name: "b"},
            "c2": {name: "c"},
            "p0": "decomposition"
        });

        expect(source.getMinimalString()).toBe("This is a test of the <c0><p0/></c0> system.");

        expect(source.getMapping()).toStrictEqual({
            "c0": {name: "b"},
            "p0": "decomposition"
        });
    });

    test("MessageAccumulatorParseSelfClosingComponent", () => {
        expect.assertions(4);

        let ma = MessageAccumulator.create("This is a test of the <c0/> decomposition system.");
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(3);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "This is a test of the "}),
                expect.objectContaining({
                    children: [],
                    index: 0
                }),
                expect.objectContaining({value: " decomposition system."})
            ]
        }));
    });

    test("MessageAccumulatorCreateWithSource", () => {
        expect.assertions(5);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.addText("This is a test of the ");
        source.push({text: '<img src="http://www.example.com/foo.jpg">'});
        source.pop();
        source.addText(" decomposition system.");

        // The translation has the components swapped from the English
        let ma = MessageAccumulator.create("Dies ist einen Test des <c0/> Zersetzungssystems.", source);
        expect(ma).toBeTruthy();

        expect(ma.root.children).toBeTruthy();
        expect(ma.root.children.length).toBe(3);

        expect(ma.root).toEqual(expect.objectContaining({
            children: [
                expect.objectContaining({value: "Dies ist einen Test des "}),
                expect.objectContaining({
                    children: [],
                    index: 0,
                    extra: {text: '<img src="http://www.example.com/foo.jpg">'}
                }),
                expect.objectContaining({value: " Zersetzungssystems."})
            ]
        }));
    });

    test("MessageAccumulatorGetStringSelfClosing", () => {
        expect.assertions(2);

        let source = new MessageAccumulator();
        expect(source).toBeTruthy();

        source.addText("This is a test of the ");
        source.push({text: '<img src="http://www.example.com/foo.jpg">'});
        source.pop();
        source.addText(" decomposition system.");

        expect(source.getString()).toBe("This is a test of the <c0/> decomposition system.");
    });

});