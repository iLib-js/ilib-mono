/*
 * scriptinfo.test.js - test the script info static methods synchronously
 *
 * Copyright © 2024 JEDLSoft
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

describe("testscriptinfo synchronously", () => {
    beforeEach(() => {
        ilib.clearCache();
    });

    test("ScriptInfoAsyncGetAllScripts", () => {
        expect.assertions(7);
        const scripts = ScriptInfo.getAllScripts();
        expect(scripts !== null).toBeTruthy();

        expect(scripts.length).toBe(223);

        expect(scripts[0]).toBe("Adlm");
        expect(scripts[1]).toBe("Afak");
        expect(scripts[2]).toBe("Aghb");
        expect(scripts[4]).toBe("Arab");
        expect(scripts[scripts.length-1]).toBe("Zzzz");
    });
});
