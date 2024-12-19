/*
 * scriptinfoasync.test.js - test the script info object
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

import ilib from '../src/ilib.js';
import ScriptInfo from "../src/ScriptInfo.js";

describe("testscriptinfopromise", () => {
    beforeEach(() => {
        ilib.clearCache();
    });

    test("ScriptInfoAsyncConstructor", () => {
        expect.assertions(1);
        return ScriptInfo.create(undefined, {
            sync: false
        }).then(si => {
            expect(si !== null).toBeTruthy();
        });
    });

    test("ScriptInfoAsyncGet1", () => {
        expect.assertions(8);
        return ScriptInfo.create("Latn", {
            sync: false
        }).then(si => {
            expect(si !== null).toBeTruthy();

            expect(si.getCode()).toBe("Latn");
            expect(si.getCodeNumber()).toBe(215);
            expect(si.getName()).toBe("Latin");
            expect(si.getLongCode()).toBe("Latin");
            expect(si.getScriptDirection()).toBe("ltr");
            expect(!si.getNeedsIME()).toBeTruthy();
            expect(si.getCasing()).toBeTruthy();
        });
    });

    test("ScriptInfoAsyncGet4", () => {
        expect.assertions(8);
        return ScriptInfo.create("Hans", {
            sync: false
        }).then(si => {
            expect(si !== null).toBeTruthy();

            expect(si.getCode()).toBe("Hans");
            expect(si.getCodeNumber()).toBe(501);
            expect(si.getName()).toBe("Han (Simplified variant)");
            expect(si.getLongCode()).toBe("Han_(Simplified_variant)");
            expect(si.getScriptDirection()).toBe("ltr");
            expect(si.getNeedsIME()).toBeTruthy();
            expect(!si.getCasing()).toBeTruthy();
        });
    });

    test("ScriptInfoAsyncGetDefaultLongCodeArab", () => {
        expect.assertions(8);
        return ScriptInfo.create("Arab", {
            sync: false
        }).then(si => {
            expect(si !== null).toBeTruthy();

            expect(si.getCode()).toBe("Arab");
            expect(si.getCodeNumber()).toBe(160);
            expect(si.getName()).toBe("Arabic");
            expect(si.getLongCode()).toBe("Arabic");
            expect(si.getScriptDirection()).toBe("rtl");
            expect(!si.getNeedsIME()).toBeTruthy();
            expect(!si.getCasing()).toBeTruthy();
        });
    });
    test("ScriptInfoAsyncGetUnknown", () => {
        expect.assertions(5);
        return ScriptInfo.create("Fooo", {
            sync: false
        }).then(si => {
            expect(si !== null).toBeTruthy();

            expect(si.getCode()).toBe(undefined);
            expect(si.getCodeNumber()).toBe(0);
            expect(si.getName()).toBe(undefined);
            expect(si.getLongCode()).toBe(undefined);
        });
    });

    test("ScriptInfoAsyncGetAllScripts", () => {
        expect.assertions(11);
        ScriptInfo.getAllScripts(false, undefined, scripts => {
            expect(scripts !== null).toBeTruthy();

            expect(scripts.length).toBe(223);

            expect(scripts[0]).toBe("Adlm");
            expect(scripts[1]).toBe("Afak");
            expect(scripts[2]).toBe("Aghb");
            expect(scripts[4]).toBe("Arab");
            expect(scripts[scripts.length-1]).toBe("Zzzz");

            // make sure the callback is called after the 2nd call
            ScriptInfo.getAllScripts(false, undefined, scripts => {
                expect(scripts !== null).toBeTruthy();

                expect(scripts.length).toBe(223);

                expect(scripts[0]).toBe("Adlm");
                expect(scripts[scripts.length-1]).toBe("Zzzz");
            });
        });
    });
});
