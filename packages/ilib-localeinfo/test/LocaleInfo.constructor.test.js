/*
 * Copyright © 2022-2026 JEDLSoft
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
 *
 * LocaleInfo.constructor.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setLocale } from 'ilib-env';
import { setupLocaleInfoTests } from './setup.js';

describe("LocaleInfo.constructor", () => {

    setupLocaleInfoTests();

    test("should construct a LocaleInfo instance", () => {
        expect.assertions(1);
        const loc = new LocaleInfo();
        expect(loc).not.toBeNull()
    });

    test("should construct a LocaleInfo for the current locale", () => {
        expect.assertions(4);
        setLocale(undefined);
        const info = new LocaleInfo(); // gives locale of the host JS engine

        expect(info).not.toBeNull()

        const loc = info.getLocale();

        expect(loc.getLanguage()).toBe("en")
        expect(loc.getRegion()).toBe("US")
        expect(loc.getVariant()).toBeUndefined()
    });

    test("should construct a LocaleInfo for a given locale", () => {
        expect.assertions(4);
        const info = new LocaleInfo("de-DE");

        expect(info).not.toBeNull()

        const loc = info.getLocale();

        expect(loc.getLanguage()).toBe("de")
        expect(loc.getRegion()).toBe("DE")
        expect(loc.getVariant()).toBeUndefined()
    });
});
