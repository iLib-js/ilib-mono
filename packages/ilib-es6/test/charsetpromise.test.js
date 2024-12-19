/*
 * charsetasync.test.js - test the charset info object
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

import Charset from "../src/Charset.js";

describe("testcharsetpromise", () => {
    test("CharsetAsyncConstructor", () => {
        expect.assertions(1);
        return Charset.create({
            sync: false
        }).then(cs => {
            expect(cs !== null).toBeTruthy();
        });
    });

    test("CharsetAsyncGetStandardNameIdentity", () => {
        expect.assertions(2);
        return Charset.create({
            name: "UTF-8",
            sync: false
        }).then(cs => {
            expect(cs.getName()).toBe("UTF-8");
            return Charset.create({
                name: "KOI8-R",
                sync: false
            });
        }).then(cs => {
            expect(cs.getName()).toBe("KOI8-R");
        });
    });

    test("CharsetAsyncGetStandardNameUndefined", () => {
        expect.assertions(1);
        return Charset.create({
            sync: false
        }).then(cs => {
            expect(typeof(cs) !== "undefined").toBeTruthy();
        });
    });

    test("CharsetAsyncGetStandardNameIdentityUnknown", () => {
        expect.assertions(1);
        return Charset.create({
            name: "foobarfoo",
            sync: false
        }).then(cs => {
            expect(cs.getName()).toBe("foobarfoo");
        });
    });

    test("CharsetAsyncGetStandardNameUTF8", () => {
        expect.assertions(1);
        return Charset.create({
            name: "UTF8",
            sync: false
        }).then(cs => {
            expect(cs.getName()).toBe("UTF-8");
        });
    });

    test("CharsetAsyncGetStandardNameISOLatin1", () => {
        expect.assertions(3);
        return Charset.create({
            name: "Latin1",
            sync: false
        }).then(cs => {
            expect(cs.getName()).toBe("ISO-8859-1");
            return Charset.create({
                name: "ISO-8859-1",
                sync: false
            });
        }).then(cs => {
            expect(cs.getName()).toBe("ISO-8859-1");
            return Charset.create({
                name: "ISO-Latin-1",
                sync: false
            });
        }).then(cs => {
            expect(cs.getName()).toBe("ISO-8859-1");
        });
    });

    test("CharsetAsyncGetOriginalNameUnknown", () => {
        expect.assertions(1);
        return Charset.create({
            name: "foobarfoo",
            sync: false
        }).then(cs => {
            expect(cs.getOriginalName()).toBe("foobarfoo");
        });
    });

    test("CharsetAsyncMinCharWidth1", () => {
        expect.assertions(1);
        return Charset.create({
            name: "Latin1",
            sync: false
        }).then(cs => {
            expect(cs.getMinCharWidth()).toBe(1);
        });
    });

    test("CharsetAsyncMinCharWidth2", () => {
        expect.assertions(1);
        // built-in
        return Charset.create({
            name: "UCS-2",
            sync: false
        }).then(cs => {
            expect(cs.getMinCharWidth()).toBe(2);
        });
    });

    test("CharsetAsyncIsMultibyteTrue", () => {
        expect.assertions(1);
        return Charset.create({
            name: "Shift_JIS",
            sync: false
        }).then(cs => {
            expect(cs.isMultibyte()).toBeTruthy();
        });
    });


    test("CharsetAsyncIsBigEndianUTF16", () => {
        expect.assertions(1);
        return Charset.create({
            name: "UTF-16",
            sync: false
        }).then(cs => {
            expect(cs.isBigEndian()).toBeTruthy();
        });
    });
});
