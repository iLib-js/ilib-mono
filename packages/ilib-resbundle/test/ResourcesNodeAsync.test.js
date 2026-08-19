/*
 * testresourcesasync.js - test the Resources object
 *
 * Copyright © 2018-2019, 2022, 2026 JEDLSoft
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

import ResBundle from "../src/index.js";

import IString from "ilib-istring";
import Locale from "ilib-locale";
import { Path } from "ilib-common";
import { LocaleData } from 'ilib-localedata';
import path from 'node:path';

const __dirname = Path.dirname(Path.fileUriToPath(import.meta.url));

describe("testResourcesNodeAsync", () => {
    test("ResBundleAsyncLocaleformatChoice_de_DE", async () => {
        expect.assertions(2);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const base = path.relative(process.cwd(), path.resolve(__dirname, "./resources"));
        return ResBundle.create({
            locale: "de-DE",
            basePath: base
        }).then((rb) => {
            const loc = rb.getLocale();
            expect(loc.toString()).toBe("de-DE");

            const str = new IString("one#({N}) file selected|#({N}) files selected");
            const temp = rb.getString(str);
            expect(temp.formatChoice(2, {N:2})).toBe("(2) Dateien ausgewählt");
        });
    });

    test("ResBundleAsyncLocaleformatChoice_ko_KR", async () => {
        expect.assertions(2);
        // clear this to be sure it is actually loading something
        LocaleData.clearCache();
        const base = path.relative(process.cwd(), path.resolve(__dirname, "./resources"));
        const rb = await ResBundle.create({
            locale: "ko-KR",
            basePath: base
        });
        const loc = rb.getLocale();
        expect(loc.toString()).toBe("ko-KR");

        const str = new IString("one#({N}) file selected|#({N}) files selected");
        const temp = rb.getString(str);
        expect(temp.formatChoice(1, {N:1})).toBe("(1)개 파일 선택됨(other)");
    });

    test("ResBundleAsyncGetStringOtherBundleesMX", async () => {
        expect.assertions(4);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const base = path.relative(process.cwd(), path.resolve(__dirname, "./resources"));

        return ResBundle.create({
            locale: "es-MX",
            basePath: base
        }).then((rb) => {
            expect(rb).not.toBeNull();

            expect(rb.getString("Hello from {country}").toString()).toBe("Que tal de {country}");
            expect(rb.getString("Hello from {city}").toString()).toBe("Que tal de {city}");
            expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Hola de {city} en {country}");
        });
    });

    test("ResBundleAsyncGetStringWithPathesMX", async () => {
        expect.assertions(4);

        // clear this to be sure it is actually loading something
        LocaleData.clearCache();

        const base = path.relative(process.cwd(), path.resolve(__dirname, "./resources"));

        return ResBundle.create({
            locale: "es-MX",
            basePath: base
        }).then((rb) => {
            expect(rb).not.toBeNull();

            expect(rb.getString("Hello from {country}").toString()).toBe("Que tal de {country}");
            expect(rb.getString("Hello from {city}").toString()).toBe("Que tal de {city}");
            expect(rb.getString("Greetings from {city} in {country}").toString()).toBe("Hola de {city} en {country}");
        });
    });
});
