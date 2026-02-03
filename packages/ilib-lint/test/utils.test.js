/*
 * util.test.js - test the utils functions
 *
 * Copyright ©  2025 JEDLSoft
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

import { getXliffInfo } from "../src/plugins/utils.js";

describe("getXliffInfo", () => {
    const defaultInfo = {
        version: "1.2",
        style: "standard",
        sourceLocale: "en-US"
    };

    test("should return default info when data is null", () => {
        expect(getXliffInfo()).toEqual(defaultInfo);
    });

    test("should return default info when XML is invalid", () => {
        const badXml = "<xliff><invalid></xliff>";
        expect(getXliffInfo(badXml)).toEqual(defaultInfo);
    });

    test("should parse XLIFF 1.2 correctly", () => {
        const xml12 = `
        <xliff version="1.2">
            <file source-language="en-US" target-language="nl-NL" product-name="webapp">
                <body></body>
            </file>
        </xliff>`;

        const result = getXliffInfo(xml12);

        expect(result.version).toBe("1.2");
        expect(result.sourceLocale).toBe("en-US");
        expect(result.style).toBe("standard");
    });

    test("should parse XLIFF 2.0 with webOS style (no projectAttr)", () => {
        const xml20 = `
        <?xml version="1.0" encoding="utf-8"?>
        <xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en-KR" trgLang="ko-KR">
            <file id="sample1_f1" original="sample1">
                <group id="sample1_g1" name="c">
                  <unit id="sample1_g1_1">
                  <segment>
                    <source>OK</source>
                    <target>확인</target>
                  </segment>
                  </unit>
                </group>
            </file>
        </xliff>`;

        const result = getXliffInfo(xml20);

        expect(result.version).toBe("2.0");
        expect(result.sourceLocale).toBe("en-KR");
        expect(result.style).toBe("webOS");
    });

    test("should parse XLIFF 2.0 with standard when projectAttr exists", () => {
        const xml20p = `
        <xliff version="2.0" srcLang="ja-JP" l:project="someProject">
            <file></file>
        </xliff>`;

        const result = getXliffInfo(xml20p);

        expect(result.version).toBe("2.0");
        expect(result.sourceLocale).toBe("ja-JP");
        expect(result.style).toBe("standard");
    });

    test("should fallback to default values when attributes missing", () => {
        const xmlNoAttrs = `<xliff><file></file></xliff>`;

        const result = getXliffInfo(xmlNoAttrs);

        expect(result.version).toBe("1.2");  
        expect(result.sourceLocale).toBe("en-US");  
        expect(result.style).toBe("standard");
    });
});
