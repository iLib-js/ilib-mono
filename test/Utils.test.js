/*
 * Utils.test.js - test the common routines
 *
 * Copyright © 2020, 2022-2023 JEDLSoft
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

import { Utils } from '../src/index';

var memberTest1 = [
    2,
    4,
    6,
    8
];

var memberTest2 = [];

/* @type Array.<object> */
var memberTest3 = [
    2,
    [4,8],
    10
];

var memberTest4 = [
    -8,
    [-4,-2],
    0,
    1,
    [4,6],
    8,
];

describe("testUtils", () => {
    test("UTFToCodePoint", () => {
        expect.assertions(1)

        var str = String.fromCharCode(0xD800) + String.fromCharCode(0xDF02);
        expect(0x10302).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("UTFToCodePoint", () => {
        expect.assertions(1)
        var str = String.fromCharCode(0xD800) + String.fromCharCode(0xDF02);

        expect(0x10302).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("UTFToCodePointLast", () => {
        expect.assertions(1)
        var str = String.fromCharCode(0xDBFF) + String.fromCharCode(0xDFFD);

        expect(0x10FFFD).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("UTFToCodePointFirst", () => {
        expect.assertions(1)
        var str = String.fromCharCode(0xD800) + String.fromCharCode(0xDC00);

        expect(0x10000).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("UTFToCodePointBeforeFirst", () => {
        expect.assertions(1)
        var str = String.fromCharCode(0xFFFF);

        expect(0xFFFF).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("UTFToCodePointNotSupplementary", () => {
        expect.assertions(1)
        var str = String.fromCharCode(0x0302);

        expect(0x0302).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("CodePointToUTF", () => {
        expect.assertions(3)
        var str = Utils.codePointToUTF16(0x10302);

        expect(str.length).toBe(2);
        expect(0xD800).toBe(str.charCodeAt(0));
        expect(0xDF02).toBe(str.charCodeAt(1));
    });
    test("CodePointToUTFLast", () => {
        expect.assertions(3)
        var str = Utils.codePointToUTF16(0x10FFFD);

        expect(str.length).toBe(2);
        expect(0xDBFF).toBe(str.charCodeAt(0));
        expect(0xDFFD).toBe(str.charCodeAt(1));
    });
    test("CodePointToUTFFirst", () => {
        expect.assertions(3)
        var str = Utils.codePointToUTF16(0x10000);

        expect(str.length).toBe(2);
        expect(0xD800).toBe(str.charCodeAt(0));
        expect(0xDC00).toBe(str.charCodeAt(1));
    });
    test("CodePointToUTFBeforeFirst", () => {
        expect.assertions(2)
        var str = Utils.codePointToUTF16(0xFFFF);

        expect(str.length).toBe(1);
        expect(0xFFFF).toBe(str.charCodeAt(0));
    });
    test("CodePointToUTFNotSupplementary", () => {
        expect.assertions(2)
        var str = Utils.codePointToUTF16(0x0302);

        expect(str.length).toBe(1);
        expect(0x0302).toBe(str.charCodeAt(0));
    });
    test("UTFToCodePoint", () => {
        expect.assertions(1)
        var str = String.fromCharCode(0xD800) + String.fromCharCode(0xDF02);

        expect(0x10302).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("UTFToCodePointLast", () => {
        expect.assertions(1)
        var str = String.fromCharCode(0xDBFF) + String.fromCharCode(0xDFFD);

        expect(0x10FFFD).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("UTFToCodePointFirst", () => {
        expect.assertions(1)
        var str = String.fromCharCode(0xD800) + String.fromCharCode(0xDC00);

        expect(0x10000).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("UTFToCodePointBeforeFirst", () => {
        expect.assertions(1)
        var str = String.fromCharCode(0xFFFF);

        expect(0xFFFF).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("UTFToCodePointNotSupplementary", () => {
        expect.assertions(1)
        var str = String.fromCharCode(0x0302);

        expect(0x0302).toBe(Utils.UTF16ToCodePoint(str));
    });
    test("IsMemberTrue", () => {
        expect.assertions(4)
        expect(Utils.isMember(memberTest1, 2)).toBeTruthy();
        expect(Utils.isMember(memberTest1, 4)).toBeTruthy();
        expect(Utils.isMember(memberTest1, 6)).toBeTruthy();
        expect(Utils.isMember(memberTest1, 8)).toBeTruthy();
    });
    test("IsMemberFalse", () => {
        expect.assertions(5)
        expect(!Utils.isMember(memberTest1, 1)).toBeTruthy();
        expect(!Utils.isMember(memberTest1, 3)).toBeTruthy();
        expect(!Utils.isMember(memberTest1, 5)).toBeTruthy();
        expect(!Utils.isMember(memberTest1, 7)).toBeTruthy();
        expect(!Utils.isMember(memberTest1, 9)).toBeTruthy();
    });
    test("IsMemberEmpty", () => {
        expect.assertions(4)
        expect(!Utils.isMember(memberTest2, 2)).toBeTruthy();
        expect(!Utils.isMember(memberTest2, 4)).toBeTruthy();
        expect(!Utils.isMember(memberTest2, 6)).toBeTruthy();
        expect(!Utils.isMember(memberTest2, 8)).toBeTruthy();
    });
    test("IsMemberRange", () => {
        expect.assertions(7)
        expect(Utils.isMember(memberTest3, 2)).toBeTruthy();
        expect(Utils.isMember(memberTest3, 4)).toBeTruthy();
        expect(Utils.isMember(memberTest3, 5)).toBeTruthy();
        expect(Utils.isMember(memberTest3, 6)).toBeTruthy();
        expect(Utils.isMember(memberTest3, 7)).toBeTruthy();
        expect(Utils.isMember(memberTest3, 8)).toBeTruthy();
        expect(Utils.isMember(memberTest3, 10)).toBeTruthy();
    });
    test("IsMemberOutsideRange", () => {
        expect.assertions(4)
        expect(!Utils.isMember(memberTest3, 1)).toBeTruthy();
        expect(!Utils.isMember(memberTest3, 3)).toBeTruthy();
        expect(!Utils.isMember(memberTest3, 9)).toBeTruthy();
        expect(!Utils.isMember(memberTest3, 11)).toBeTruthy();
    });
    test("IsMemberWithNegativeRanges", () => {
        expect.assertions(10)
        expect(Utils.isMember(memberTest4, -8)).toBeTruthy();
        expect(Utils.isMember(memberTest4, -4)).toBeTruthy();
        expect(Utils.isMember(memberTest4, -3)).toBeTruthy();
        expect(Utils.isMember(memberTest4, -2)).toBeTruthy();
        expect(Utils.isMember(memberTest4, 0)).toBeTruthy();
        expect(Utils.isMember(memberTest4, 1)).toBeTruthy();
        expect(Utils.isMember(memberTest4, 4)).toBeTruthy();
        expect(Utils.isMember(memberTest4, 5)).toBeTruthy();
        expect(Utils.isMember(memberTest4, 6)).toBeTruthy();
        expect(Utils.isMember(memberTest4, 8)).toBeTruthy();
    });
    test("IsMemberOutsideRange2", () => {
        expect.assertions(8)
        expect(!Utils.isMember(memberTest4, -9)).toBeTruthy();
        expect(!Utils.isMember(memberTest4, -7)).toBeTruthy();
        expect(!Utils.isMember(memberTest4, -5)).toBeTruthy();
        expect(!Utils.isMember(memberTest4, -1)).toBeTruthy();
        expect(!Utils.isMember(memberTest4, 2)).toBeTruthy();
        expect(!Utils.isMember(memberTest4, 3)).toBeTruthy();
        expect(!Utils.isMember(memberTest4, 7)).toBeTruthy();
        expect(!Utils.isMember(memberTest4, 9)).toBeTruthy();
    });
    test("CoelesceCase1RightLength", () => {
        expect.assertions()

        var a = [[1], [2], [4], [5], [7]];
        var b = Utils.coelesce(a, 0);

        expect(b.length).toBe(3);
        expect(b[0].length).toBe(2);
        expect(b[1].length).toBe(2);
        expect(b[2].length).toBe(1);
    });
    test("CoelesceCase1RightContent", () => {
        expect.assertions(5)
        var a = [[1], [2], [4], [5], [7]];
        var b = Utils.coelesce(a, 0);

        expect(b[0][0]).toBe(1);
        expect(b[0][1]).toBe(2);
        expect(b[1][0]).toBe(4);
        expect(b[1][1]).toBe(5);
        expect(b[2][0]).toBe(7);
    });
    test("CoelesceCase2RightLength", () => {
        expect.assertions(4)
        var a = [[1], [2,3], [5], [6,10], [12]];
        var b = Utils.coelesce(a, 0);

        expect(b.length).toBe(3);
        expect(b[0].length).toBe(2);
        expect(b[1].length).toBe(2);
        expect(b[2].length).toBe(1);
    });
    test("CoelesceCase2RightContent", () => {
        expect.assertions(5)
        var a = [[1], [2,3], [5], [6,10], [12]];
        var b = Utils.coelesce(a, 0);

        expect(b[0][0]).toBe(1);
        expect(b[0][1]).toBe(3);
        expect(b[1][0]).toBe(5);
        expect(b[1][1]).toBe(10);
        expect(b[2][0]).toBe(12);
    });
    test("CoelesceCase3RightLength", () => {
        expect.assertions(4)
        var a = [[1,3], [4], [6,9], [10], [12]];
        var b = Utils.coelesce(a, 0);

        expect(b.length).toBe(3);
        expect(b[0].length).toBe(2);
        expect(b[1].length).toBe(2);
        expect(b[2].length).toBe(1);
    });
    test("CoelesceCase3RightContent", () => {
        expect.assertions(5)
        var a = [[1,3], [4], [6,9], [10], [12]];
        var b = Utils.coelesce(a, 0);

        expect(b[0][0]).toBe(1);
        expect(b[0][1]).toBe(4);
        expect(b[1][0]).toBe(6);
        expect(b[1][1]).toBe(10);
        expect(b[2][0]).toBe(12);
    });
    test("CoelesceCase4RightLength", () => {
        expect.assertions(4)
        var a = [[1,3], [4,6], [10,12], [13,15], [17]];
        var b = Utils.coelesce(a, 0);

        expect(b.length).toBe(3);
        expect(b[0].length).toBe(2);
        expect(b[1].length).toBe(2);
        expect(b[2].length).toBe(1);
    });
    test("CoelesceCase4RightContent", () => {
        expect.assertions(5)
        var a = [[1,3], [4,6], [10,12], [13,15], [17]];
        var b = Utils.coelesce(a, 0);

        expect(b[0][0]).toBe(1);
        expect(b[0][1]).toBe(6);
        expect(b[1][0]).toBe(10);
        expect(b[1][1]).toBe(15);
        expect(b[2][0]).toBe(17);
    });
    test("CoelesceMultipleCasesLength", () => {
        expect.assertions(1)
        var a = [[1], [2,3], [4], [5], [6,10], [11,15]];
        var b = Utils.coelesce(a, 0);

        expect(b.length).toBe(1);
    });
    test("CoelesceMultipleCasesContent", () => {
        expect.assertions(2)
        var a = [[1], [2,3], [4], [5], [6,10], [11,15]];
        var b = Utils.coelesce(a, 0);

        expect(b[0][0]).toBe(1);
        expect(b[0][1]).toBe(15);
    });
    test("CoelesceMultipleCasesWithSkipLength", () => {
        expect.assertions(4)
        var a = [
            ["foo", 1],
            ["foo", 2, 3],
            ["foo", 4],
            ["foo", 5],
            ["bar", 6],
            ["bar", 7],
            ["bar", 8, 12],
            ["bar", 13, 16]
            ["bar", 17],
            ["foo", 26, 30],
            ["foo", 31, 35]
        ];

        var b = Utils.coelesce(a, 1);

        expect(b.length).toBe(3);
        expect(b[0].length).toBe(3);
        expect(b[1].length).toBe(3);
        expect(b[2].length).toBe(3);
    });

    /*test("CoelesceMultipleCasesWithSkipContent", () => {
        expect.assertions(9)
        var a = [
            ["foo", 1],
            ["foo", 2, 3],
            ["foo", 4],
            ["foo", 5],
            ["bar", 6],
            ["bar", 7],
            ["bar", 8, 12],
            ["bar", 13, 16]
            ["bar", 17],
            ["foo", 26, 30],
            ["foo", 31, 35]
        ];

        var b = Utils.coelesce(a, 1);

        expect("foo").toBe(b[0][0]);
        expect(b[0][1]).toBe(1);
        expect(b[0][2]).toBe(5);
        expect("bar").toBe(b[1][0]);
        expect(b[1][1]).toBe(6);
        expect(b[1][2]).toBe(17);
        expect("foo").toBe(b[2][0]);
        expect(b[2][1]).toBe(26);
        expect(b[2][2]).toBe(35);
    },*/
    test("CoelesceEmpty", () => {
        expect.assertions(2)
        var a = [];
        var b = Utils.coelesce(a, 0);
        expect(typeof(b) !== "undefined").toBeTruthy();
        expect(b.length).toBe(0);
    });
    test("Prune", () => {
        expect.assertions(1)
        var parent = {
            "a": 0,
            "b": 1,
            "c": 2,
            "d": 3
        };
        var child = {
            "a": 0,
            "b": 1,
            "c": 4,
            "d": 5,
            "e": 6
        };

        var expected = {
            "c": 4,
            "d": 5,
            "e": 6
        };
        var pruned = Utils.prune(parent, child);
        expect(expected).toStrictEqual(pruned);
    });
    test("PruneWithSubobjects", () => {
        expect.assertions(1)
        var parent = {
            "a": 0,
            "b": 1,
            "c": 2,
            "d": 3,
            "m": {
                "x": 1,
                "y": 2
            }
        };
        var child = {
            "a": 0,
            "b": 1,
            "c": 4,
            "d": 5,
            "e": 6,
            "m": {
                "x": 1,
                "y": 3,
                "z": 4
            }
        };

        var expected = {
            "c": 4,
            "d": 5,
            "e": 6,
            "m": {
                "y": 3,
                "z": 4
            }
        };
        var pruned = Utils.prune(parent, child);
        expect(expected).toStrictEqual(pruned);
    });
    test("PruneMissingChildValues", () => {
        expect.assertions(1)
        var parent = {
            "a": 0,
            "b": 1,
            "c": 2,
            "d": 3
        };
        var child = {
            "a": 0,
            "b": 2
        };

        var expected = {
            "b": 2
        };
        var pruned = Utils.prune(parent, child);
        expect(expected).toStrictEqual(pruned);
    });
    test("MergeAndPruneAllSame", () => {
        expect.assertions(2)
        var data = {
            data: {
                "sun": 0,
                "mon": 1,
                "tue": 2,
                "wed": 3,
                "thu": 4,
                "fri": 5,
                "sat": 6,
                "east": "west",
                "west": "east"
            },
            a: {
                data: {
                    "sun": 0,
                    "mon": 1,
                    "tue": 2,
                    "wed": 3,
                    "thu": 4,
                    "fri": 5,
                    "sat": 6
                },
                n: {
                    data: {
                        "days": 7
                    }
                },
                m: {
                    data: {
                        "days": 7,
                        "sun": 1,
                        "mon": 2,
                        "tue": 3
                    }
                }
            },
            b: {
                data: {
                    "sun": 100,
                    "mon": 101,
                    "tue": 102,
                    "wed": 103,
                    "thu": 104,
                    "fri": 105,
                    "sat": 106
                },
                x: {
                    data: {
                        foo: "bar",
                        "sun": 0,
                        "fri": 5,
                        "sat": 106,
                        "mon": 101
                    }
                },
                y: {
                    data: {
                        foo: "asdf",
                        "mon": 1,
                        "sat": 6
                    }
                }
            }
        };

        Utils.mergeAndPrune(data);
        var adata = {
        };
        expect(adata).toStrictEqual(data.a.data);

        var adatamerged = {
            "sun": 0,
            "mon": 1,
            "tue": 2,
            "wed": 3,
            "thu": 4,
            "fri": 5,
            "sat": 6,
            "east": "west",
            "west": "east"
        };
        expect(adatamerged).toStrictEqual(data.a.merged);
    });
    test("MergeAndPruneAddProps", () => {
        expect.assertions(2)
        var data = {
            data: {
                "sun": 0,
                "mon": 1,
                "tue": 2,
                "wed": 3,
                "thu": 4,
                "fri": 5,
                "sat": 6,
                "east": "west",
                "west": "east"
            },
            a: {
                data: {
                    "sun": 0,
                    "mon": 1,
                    "tue": 2,
                    "wed": 3,
                    "thu": 4,
                    "fri": 5,
                    "sat": 6
                },
                n: {
                    data: {
                        "days": 7
                    }
                }
            }
        };

        Utils.mergeAndPrune(data);
        var andata = {
            days: 7   // add property that ancestors don't have
        };
        expect(andata).toStrictEqual(data.a.n.data);
        var andatamerged = {
            "sun": 0,
            "mon": 1,
            "tue": 2,
            "wed": 3,
            "thu": 4,
            "fri": 5,
            "sat": 6,
            "east": "west",
            "west": "east",
            "days": 7
        };
        expect(andatamerged).toStrictEqual(data.a.n.merged);
    });
    test("MergeAndPruneDontAddSame", () => {
        expect.assertions(2)
        var data = {
            data: {
                "sun": 0,
                "mon": 1,
                "tue": 2,
                "wed": 3,
                "thu": 4,
                "fri": 5,
                "sat": 6,
                "east": "west",
                "west": "east"
            },
            a: {
                data: {
                    "sun": 0,
                    "mon": 1,
                    "tue": 2,
                    "wed": 3,
                    "thu": 4,
                    "fri": 5,
                    "sat": 6
                },
                m: {
                    data: {
                        "days": 7,
                        "sun": 0,
                        "mon": 2,
                        "tue": 2
                    }
                }
            }
        };

        Utils.mergeAndPrune(data);
        var amdata = {
            "days": 7,
            "mon": 2    // sun and tue were same as parent
        };
        expect(amdata).toStrictEqual(data.a.m.data);
        var amdatamerged = {
            "sun": 0,
            "mon": 2,
            "tue": 2,
            "wed": 3,
            "thu": 4,
            "fri": 5,
            "sat": 6,
            "east": "west",
            "west": "east",
            "days": 7
        };
        expect(amdatamerged).toStrictEqual(data.a.m.merged);
    });
    test("MergeAndPruneDontOverrideGrandParent", () => {
        expect.assertions(2)
        var data = {
            data: {
                "sun": 0,
                "mon": 1,
                "tue": 2,
                "wed": 3,
                "thu": 4,
                "fri": 5,
                "sat": 6,
                "east": "west",
                "west": "east"
            },
            b: {
                data: {
                    "sun": 100,
                    "mon": 101,
                    "tue": 102,
                    "wed": 103,
                    "thu": 104,
                    "fri": 105,
                    "sat": 106
                },
                y: {
                    data: {
                        foo: "asdf",
                        "mon": 1,
                        "sat": 6,
                        "east": "west"
                    }
                }
            }
        };

        Utils.mergeAndPrune(data);
        var bydata = {
            foo: "asdf",
            "mon": 1,
            "sat": 6 // should not contain east: west from the grandparent
        };
        expect(bydata).toStrictEqual(data.b.y.data);
        var bydatamerged = {
            "sun": 100,
            "mon": 1,
            "tue": 102,
            "wed": 103,
            "thu": 104,
            "fri": 105,
            "sat": 6,
            "east": "west",
            "west": "east",
            "foo": "asdf"
        };
        expect(bydatamerged).toStrictEqual(data.b.y.merged);
    });
    test("MergeAndPruneOverrideGrandparentOnly", () => {
        expect.assertions(2)
        var data = {
            data: {
                "sun": 0,
                "mon": 1,
                "tue": 2,
                "wed": 3,
                "thu": 4,
                "fri": 5,
                "sat": 6,
                "east": "west",
                "west": "east"
            },
            a: {
                data: {
                    "sun": 0,
                    "mon": 1,
                    "tue": 2,
                    "wed": 3,
                    "thu": 4,
                    "fri": 5,
                    "sat": 6
                },
                m: {
                    data: {
                        "east": "north"
                    }
                }
            }
        };

        Utils.mergeAndPrune(data);
        var amdata = {
            "east": "north"
        };
        expect(amdata).toStrictEqual(data.a.m.data);
        var amdatamerged = {
            "sun": 0,
            "mon": 1,
            "tue": 2,
            "wed": 3,
            "thu": 4,
            "fri": 5,
            "sat": 6,
            "east": "north",
            "west": "east"
        };
        expect(amdatamerged).toStrictEqual(data.a.m.merged);
    });
    test("MergeAndPruneComplexObject", () => {
        expect.assertions(1)
        var data = {
            data: {
                "sun": 0,
                "mon": 1,
                "tue": 2,
                "wed": 3,
                "thu": 4,
                "fri": 5,
                "sat": 6,
                "cardinaldirections" : {
                    "east": "west",
                    "west": "east"
                }
            },
            a: {
                data: {
                    "sun": 0,
                    "mon": 1,
                    "tue": 2,
                    "wed": 3,
                    "thu": 4,
                    "fri": 5,
                    "sat": 6,
                    "cardinaldirections" : {
                        "east": "north"
                    }
                },
                m: {
                    data: {
                        "cardinaldirections" : {
                            "east": "north"
                        }
                    }
                }
            }
        };
        Utils.mergeAndPrune(data);
        //console.log("data.a.m.data is " + JSON.stringify(data.a.m.data));
        expect(Utils.isEmpty(data.a.m.data)).toBeTruthy();
    });

    test("HexToChar0", () => {
        expect.assertions(1)
        expect(Utils.hexToChar("1")).toBe('\u0001');
    });
    test("HexToChar1", () => {
        expect.assertions(1)
        expect(Utils.hexToChar("20")).toBe(' ');
    });
    test("HexToChar2", () => {
        expect.assertions(1)
        expect(Utils.hexToChar("65")).toBe('e');
    });
    test("HexToChar3", () => {
        expect.assertions(1)
        expect(Utils.hexToChar("1E0A")).toBe('Ḋ');
    });
    test("HexToChar3", () => {
        expect.assertions(1)
        expect(Utils.hexToChar("1E0A")).toBe('Ḋ');
    });
    test("HexToChar4", () => {
        expect.assertions(1)
        expect(Utils.hexToChar("10190")).toBe('𐆐');
    });
    test("HexToChar5", () => {
        expect.assertions(1)
        expect(Utils.hexToChar("016FF0")).toBe('𖿰');
    });

    test("LocaleMergeAndPrune", () => {
        expect.assertions(1)

        var data = {
            "root": {
                data: {
                    "a": "b",
                    "c": "d"
                }
            },
            "zh": {
                data: {
                    "a": "x"
                }
            },
            "und-CN": {
                data: {
                    "a": "b"
                }
            },
            "zh-Hans": {
                data: {
                    "c": "y"
                }
            },
            "zh-Hans-CN": {
                data: {
                    "n": "m"
                }
            }
        };

        Utils.localeMergeAndPrune(data);
        var expected = {
            "root": {
                data: {
                    "a": "b",
                    "c": "d"
                },
                merged: {
                    "a": "b",
                    "c": "d"
                },
                pruned: {
                    "a": "b",
                    "c": "d"
                }
            },
            "zh": {
                data: {
                    "a": "x"
                },
                merged: {
                    "a": "x",
                    "c": "d"
                },
                pruned: {
                    "a": "x"
                }
            },
            "und-CN": {
                data: {
                    "a": "b"
                },
                merged: {
                    "a": "b",
                    "c": "d"
                },
                pruned: {
                    "a": "b"
                }
            },
            "zh-Hans": {
                data: {
                    "c": "y"
                },
                merged: {
                    "a": "b",
                    "c": "y"
                },
                pruned: {
                    "c": "y"
                }
            },
            "zh-Hans-CN": {
                data: {
                    "n": "m"
                },
                merged: {
                    "a": "b",
                    "c": "y",
                    "n": "m"
                },
                pruned: {
                    "n": "m"
                }
            }
        };
        expect(data).toStrictEqual(expected);
    });

    test("LocaleMergeAndPruneDoPruneExtraSettings", () => {
        expect.assertions(1)

        var data = {
            "root": {
                data: {
                    "a": "b",
                    "c": "d"
                }
            },
            "zh": {
                data: {
                    "a": "x",
                    "c": "d"
                }
            },
            "und-CN": {
                data: {
                    "a": "b",
                    "c": "d"
                }
            },
            "zh-Hans": {
                data: {
                    "a": "x",
                    "c": "y"
                }
            },
            "zh-Hans-CN": {
                data: {
                    "a": "x",
                    "c": "y",
                    "n": "m"
                }
            }
        };

        Utils.localeMergeAndPrune(data);
        var expected = {
            "root": {
                data: {
                    "a": "b",
                    "c": "d"
                },
                merged: {
                    "a": "b",
                    "c": "d"
                },
                pruned: {
                    "a": "b",
                    "c": "d"
                }
            },
            "zh": {
                data: {
                    "a": "x",
                    "c": "d"
                },
                merged: {
                    "a": "x",
                    "c": "d"
                },
                pruned: {
                    "a": "x"
                }
            },
            "und-CN": {
                data: {
                    "a": "b",
                    "c": "d"
                },
                merged: {
                    "a": "b",
                    "c": "d"
                },
                pruned: {
                    "a": "b"
                }
            },
            "zh-Hans": {
                data: {
                    "a": "x",
                    "c": "y"
                },
                merged: {
                    "a": "x",
                    "c": "y"
                },
                pruned: {
                    "a": "x",
                    "c": "y"
                }
            },
            "zh-Hans-CN": {
                data: {
                    "a": "x",
                    "c": "y",
                    "n": "m"
                },
                merged: {
                    "a": "x",
                    "c": "y",
                    "n": "m"
                },
                pruned: {
                    "n": "m"
                }
            }
        };
        expect(data).toStrictEqual(expected);
    });

    test("LocaleMergeAndPruneMissingLocales", () => {
        expect.assertions(1)

        var data = {
            "root": {
                data: {
                    "a": "b",
                    "c": "d"
                }
            },
            "und-CN": {
                data: {
                    "a": "b",
                    "c": "y"
                }
            },
            "zh-Hans-CN": {
                data: {
                    "a": "x",
                    "n": "m"
                }
            }
        };

        Utils.localeMergeAndPrune(data);
        var expected = {
            "root": {
                data: {
                    "a": "b",
                    "c": "d"
                },
                merged: {
                    "a": "b",
                    "c": "d"
                },
                pruned: {
                    "a": "b",
                    "c": "d"
                }
            },
            "und-CN": {
                data: {
                    "a": "b",
                    "c": "y"
                },
                merged: {
                    "a": "b",
                    "c": "y"
                },
                pruned: {
                    "c": "y"
                }
            },
            "zh-Hans-CN": {
                data: {
                    "a": "x",
                    "n": "m"
                },
                merged: {
                    "a": "x",
                    "c": "y",
                    "n": "m"
                },
                pruned: {
                    "a": "x",
                    "n": "m"
                }
            }
        };
        expect(data).toStrictEqual(expected);
    });

    test("LocaleMergeAndPruneNoChangeFromParentMeansEmptyPruned", () => {
        expect.assertions(1)

        var data = {
            "root": {
                data: {
                    "a": "b",
                    "c": "d"
                }
            },
            "und-CN": {
                data: {
                    "a": "b",
                    "c": "d"
                }
            },
            "zh-Hans-CN": {
                data: {
                    "a": "b",
                    "c": "d"
                }
            }
        };

        Utils.localeMergeAndPrune(data);
        var expected = {
            "root": {
                data: {
                    "a": "b",
                    "c": "d"
                },
                merged: {
                    "a": "b",
                    "c": "d"
                },
                pruned: {
                    "a": "b",
                    "c": "d"
                }
            },
            "und-CN": {
                data: {
                    "a": "b",
                    "c": "d"
                },
                merged: {
                    "a": "b",
                    "c": "d"
                },
                pruned: {
                }
            },
            "zh-Hans-CN": {
                data: {
                    "a": "b",
                    "c": "d"
                },
                merged: {
                    "a": "b",
                    "c": "d"
                },
                pruned: {
                }
            }
        };
        expect(data).toStrictEqual(expected);
    });

    test("LocaleMergeAndPruneDeepMerge", () => {
        expect.assertions(1)

        var data = {
            "root": {
                data: {
                    "a": {
                        "m": "n",
                        "x": {
                            "y": "z"
                        }
                    },
                    "c": "d"
                }
            },
            "und-CN": {
                data: {
                    "a": {
                        "m": "q",
                    },
                    "c": "d"
                }
            },
            "zh-Hans-CN": {
                data: {
                    "a": {
                        "x": {
                            "y": "q",
                            "u": "i"
                        }
                    },
                    "c": "d"
                }
            }
        };

        Utils.localeMergeAndPrune(data);
        var expected = {
            "root": {
                data: {
                    "a": {
                        "m": "n",
                        "x": {
                            "y": "z"
                        }
                    },
                    "c": "d"
                },
                merged: {
                    "a": {
                        "m": "n",
                        "x": {
                            "y": "z"
                        }
                    },
                    "c": "d"
                },
                pruned: {
                    "a": {
                        "m": "n",
                        "x": {
                            "y": "z"
                        }
                    },
                    "c": "d"
                }
            },
            "und-CN": {
                data: {
                    "a": {
                        "m": "q",
                    },
                    "c": "d"
                },
                merged: {
                    "a": {
                        "m": "q",
                        "x": {
                            "y": "z"
                        }
                    },
                    "c": "d"
                },
                pruned: {
                    "a": {
                        "m": "q",
                    }
                }
            },
            "zh-Hans-CN": {
                data: {
                    "a": {
                        "x": {
                            "y": "q",
                            "u": "i"
                        }
                    },
                    "c": "d"
                },
                merged: {
                    "a": {
                        "m": "q",
                        "x": {
                            "y": "q",
                            "u": "i"
                        }
                    },
                    "c": "d"
                },
                pruned: {
                    "a": {
                        "x": {
                            "y": "q",
                            "u": "i"
                        }
                    }
                }
            }
        };
        expect(data).toStrictEqual(expected);
    });
});
