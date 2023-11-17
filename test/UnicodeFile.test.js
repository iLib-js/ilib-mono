/*
 * UnicodeFile.test.js - test the Unicode file loading class
 *
 * Copyright © 2012, 2020, 2022-2023 JEDLSoft
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

import { Utils, UnicodeFile } from '../src/index';

const unifileData =
    "0041;LATIN CAPITAL LETTER A;Lu;0;L;;;;;N;;;;0061;\n" +
    "00A8;DIAERESIS;Sk;0;ON;<compat> 0020 0308;;;;N;SPACING DIAERESIS;;;;\n" +
    "00C4;LATIN CAPITAL LETTER A WITH DIAERESIS;Lu;0;L;0041 0308;;;;N;LATIN CAPITAL LETTER A DIAERESIS;;;00E4;\n" +
    "0160;LATIN CAPITAL LETTER S WITH CARON;Lu;0;L;0053 030C;;;;N;LATIN CAPITAL LETTER S HACEK;;;0161;\n" +
    "FF76;HALFWIDTH KATAKANA LETTER KA;Lo;0;L;<narrow> 30AB;;;;N;;;;;\n";

const unifileData2 =
    "# this is a line with a comment on it\n" +
    "# and on the next line, there is a blank line\n" +
    "\n" +
    "0041;LATIN CAPITAL LETTER A;Lu;0;L;;;;;N;;;;0061; # fake ; fields ; here ; skip ; these\n" +
    "00A8;DIAERESIS;Sk;0;ON;<compat> 0020 0308;;;;N;SPACING DIAERESIS;;;; # this line ends with a comment \n" +
    "\n" +
    "@Part 2\n" +
    "\n" +
    "00C4;LATIN CAPITAL LETTER A WITH DIAERESIS;Lu;0;L;0041 0308;;;;N;LATIN CAPITAL LETTER A DIAERESIS;;;00E4;\n" +
    "0160;LATIN CAPITAL LETTER S WITH CARON;Lu;0;L;0053 030C;;;;N;LATIN CAPITAL LETTER S HACEK;;;0161;\n" +
    "     # indented comment\n" +
    "FF76;HALFWIDTH KATAKANA LETTER KA;Lo;0;L;<narrow> 30AB;;;;N;;;;;\n";

const unifileData3 =
    "@ this is a tab defined file\n" +
    "\n" +
    "0041\tLATIN CAPITAL LETTER A\n" +
    "00A8\tDIAERESIS\n" +
    "\n" +
    "@Part 2\n" +
    "\n" +
    "00C4\tLATIN CAPITAL LETTER A WITH DIAERESIS\n" +
    "0160\tLATIN CAPITAL LETTER S WITH CARON\n" +
    "     @ indented comment\n" +
    "FF76\tHALFWIDTH KATAKANA LETTER KA\n";

const unifileData4 =
    "@@@+ this is a tab defined file\n" +
    "\twith multi-line comments\n" +
    "\twith multi-line comments\n" +
    "\twith multi-line comments\n" +
    "@ in it\n" +
    "0041\tLATIN CAPITAL LETTER A\n" +
    "00A8\tDIAERESIS\n" +
    "\n" +
    "@Part 2\n" +
    "\n" +
    "00C4\tLATIN CAPITAL LETTER A WITH DIAERESIS\n" +
    "0160\tLATIN CAPITAL LETTER S WITH CARON\n" +
    "     @ indented comment\n" +
    "FF76\tHALFWIDTH KATAKANA LETTER KA\n";

const unifileData5 =
    "@@@+ this is a tab defined file\n" +
    "0041\tLATIN CAPITAL LETTER A\n" +
    "\t= property\n" +
    "00A8\tDIAERESIS\n" +
    "\tx property\n" +
    "\n";

const unifileData6 =
    "#   L; 7\n" +
    "#   L LRE; 7\n" +
    "#\n" +
    "\n" +
    "@Levels:    x\n" +
    "@Reorder:   \n" +
    "LRE; 7\n" +
    "LRO; 7\n" +
    "RLE; 7\n" +
    "RLO; 7\n" +
    "PDF; 7\n" +
    "BN; 7\n";

describe("testUnicodeFile", () => {
    test("UFConstructor", () => {
        expect.assertions(1);
        var uf = new UnicodeFile({string: unifileData});
        expect(uf !== null).toBeTruthy();
    });
    test("UFLength", () => {
        expect.assertions(2);
        var uf = new UnicodeFile({string: unifileData});
        expect(uf !== null).toBeTruthy();

        expect(uf.length()).toBe(5);
    });
    test("UFGetRow", () => {
        expect.assertions(2);
        var uf = new UnicodeFile({string: unifileData});
        expect(uf !== null).toBeTruthy();

        var row = uf.get(2);
        expect(row !== null).toBeTruthy();
    });
    test("UFGetRowRightLength", () => {
        expect.assertions(3);
        var uf = new UnicodeFile({string: unifileData});
        expect(uf !== null).toBeTruthy();

        var row = uf.get(2);
        expect(row !== null).toBeTruthy();
        expect(row.length).toBe(15);
    });
    test("UFGetRowRightData", () => {
        expect.assertions(17);
        var uf = new UnicodeFile({string: unifileData});
        expect(uf !== null).toBeTruthy();

        var row = uf.get(2);
        expect(row !== null).toBeTruthy();

        expect("00C4").toBe(row[0]);
        expect("LATIN CAPITAL LETTER A WITH DIAERESIS").toBe(row[1]);
        expect("Lu").toBe(row[2]);
        expect("0").toBe(row[3]);
        expect("L").toBe(row[4]);
        expect("0041 0308").toBe(row[5]);
        expect("").toBe(row[6]);
        expect("").toBe(row[7]);
        expect("").toBe(row[8]);
        expect("N").toBe(row[9]);
        expect("LATIN CAPITAL LETTER A DIAERESIS").toBe(row[10]);
        expect("").toBe(row[11]);
        expect("").toBe(row[12]);
        expect("00E4").toBe(row[13]);
        expect("").toBe(row[14]);
    });
    test("UFSkipCommentsAndBlankLines", () => {
        expect.assertions(2);
        var uf = new UnicodeFile({string: unifileData2});
        expect(uf !== null).toBeTruthy();

        expect(uf.length()).toBe(6);
    });
    test("UFSkipTrailingComments", () => {
        expect.assertions(3);
        var uf = new UnicodeFile({string: unifileData2});
        expect(uf !== null).toBeTruthy();

        var row = uf.get(0);
        expect(row !== null).toBeTruthy();

        expect(row.length).toBe(15);
    });
    test("UFSkipCommentsRightData", () => {
        expect.assertions(17);
        var uf = new UnicodeFile({string: unifileData2});
        expect(uf !== null).toBeTruthy();

        var row = uf.get(3);
        expect(row !== null).toBeTruthy();
        expect("00C4").toBe(row[0]);
        expect("LATIN CAPITAL LETTER A WITH DIAERESIS").toBe(row[1]);
        expect("Lu").toBe(row[2]);
        expect("0").toBe(row[3]);
        expect("L").toBe(row[4]);
        expect("0041 0308").toBe(row[5]);
        expect("").toBe(row[6]);
        expect("").toBe(row[7]);
        expect("").toBe(row[8]);
        expect("N").toBe(row[9]);
        expect("LATIN CAPITAL LETTER A DIAERESIS").toBe(row[10]);
        expect("").toBe(row[11]);
        expect("").toBe(row[12]);
        expect("00E4").toBe(row[13]);
        expect("").toBe(row[14]);
    });
    test("UFTabFile", () => {
        expect.assertions(7);
        var uf = new UnicodeFile({
            string: unifileData3,
            splitChar: "\t",
            commentString: "@"
        });
        expect(uf !== null).toBeTruthy();

        var row = uf.get(2);
        expect(row !== null).toBeTruthy();
        expect("00C4").toBe(row[0]);
        expect("LATIN CAPITAL LETTER A WITH DIAERESIS").toBe(row[1]);

        row = uf.get(4);
        expect(row !== null).toBeTruthy();
        expect("FF76").toBe(row[0]);
        expect("HALFWIDTH KATAKANA LETTER KA").toBe(row[1]);
    });
    test("UFTabFileWithMultilineComments", () => {
        expect.assertions(7);
        var uf = new UnicodeFile({
            string: unifileData4,
            splitChar: "\t",
            commentString: "@",
            multilineComments: true
        });
        expect(uf !== null).toBeTruthy();

        var row = uf.get(2);
        expect(row !== null).toBeTruthy();
        expect("00C4").toBe(row[0]);
        expect("LATIN CAPITAL LETTER A WITH DIAERESIS").toBe(row[1]);

        row = uf.get(4);
        expect(row !== null).toBeTruthy();
        expect("FF76").toBe(row[0]);
        expect("HALFWIDTH KATAKANA LETTER KA").toBe(row[1]);
    });
    test("UFTabFileWithEmptyInitialFields", () => {
        expect.assertions(7);
        var uf = new UnicodeFile({
            string: unifileData5,
            splitChar: "\t",
            commentString: "@",
            multilineComments: true
        });
        expect(uf !== null).toBeTruthy();

        var row = uf.get(1);
        expect(row !== null).toBeTruthy();
        expect("").toBe(row[0]);
        expect("= property").toBe(row[1]);

        row = uf.get(3);
        expect(row !== null).toBeTruthy();
        expect("").toBe(row[0]);
        expect("x property").toBe(row[1]);
    });
});
