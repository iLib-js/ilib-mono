/*
 * charmapasync.test.js - Test the charset mapping routines
 *
 * Copyright © 2018, 2022, 2024 JEDLSoft
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

import CharmapFactory, {CharmapFactoryAsync} from "../src/CharmapFactory.js";

describe("testcharmappromise", () => {
    test("CharmapAsyncConstructor", () => {
        expect.assertions(1);
        return CharmapFactoryAsync().then(cm => {
            expect(typeof(cm) !== "undefined").toBeTruthy();
        });
    });

    test("CharmapAsyncLoadMap", () => {
        expect.assertions(3);
        return CharmapFactoryAsync({
            name: "ISO-8859-15"
        }).then(cm => {
            expect(typeof(cm) !== "undefined").toBeTruthy();
            expect(typeof(cm.map) !== "undefined").toBeTruthy();
            expect(cm.getName()).toBe("ISO-8859-15");
        });
    });

    test("CharmapAsyncAlias", () => {
        expect.assertions(3);
        return CharmapFactoryAsync({
            name: "ISO-Latin-9"
        }).then(cm => {
            expect(typeof(cm) !== "undefined").toBeTruthy();
            expect(typeof(cm.map) !== "undefined").toBeTruthy();
            expect(cm.getName()).toBe("ISO-8859-15");
        });
    });

    test("CharmapAsyncLoadAlgorithmic", () => {
        expect.assertions(3);
        return CharmapFactoryAsync({
            name: "UTF-8"
        }).then(cm => {
            expect(typeof(cm) !== "undefined").toBeTruthy();
            expect(typeof(cm.map) === "undefined").toBeTruthy(); // no map because it's algorithmic
            expect(cm.getName()).toBe("UTF-8");
        });
    });

    test("CharmapAsyncUTF8MapToUnicodeUint8ArrayExtended3", () => {
        expect.assertions(2);
        return CharmapFactoryAsync({
            name: "UTF-8"
        }).then(cm => {
            expect(typeof(cm) !== "undefined").toBeTruthy();
            const input = new Uint8Array([
                0xe4, 0xb8, 0x80,
                0xe4, 0xb8, 0x81,
                0xe4, 0xb8, 0x82,
                0xe5, 0x9c, 0x81,
                0xe5, 0x9c, 0x82,
                0xe5, 0x9c, 0x83
            ]);

            expect(cm.mapToUnicode(input)).toBe("一丁丂圁圂圃");
        });
    });

    test("CharmapAsyncCNMapToUnicode", () => {
        const big5source = [
            0xa4, 0xb1, // 仃
            0xa4, 0x48, // 人
            0xae, 0x49, // 埋
            0xaa, 0x42, // 朋
            0xae, 0x54  // 娛
        ];

        return CharmapFactoryAsync({
            name: "Big5"
        }).then(cm => {
            expect(typeof(cm) !== "undefined").toBeTruthy();
            expect(cm.mapToUnicode(big5source)).toStrictEqual("仃人埋朋娛");
        });
    });

    test("CharmapAsyncCNMapToNative", () => {
        const big5source = new Uint8Array([
            0xa4, 0xb1, // 仃
            0xa4, 0x48, // 人
            0xae, 0x49, // 埋
            0xaa, 0x42, // 朋
            0xae, 0x54  // 娛
        ]);

        return CharmapFactoryAsync({
            name: "Big5"
        }).then(cm => {
            expect(typeof(cm) !== "undefined").toBeTruthy();
            expect(cm.mapToNative("仃人埋朋娛")).toStrictEqual(big5source);
        });
    });
});
