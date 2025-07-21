/*
 * MassiveConcurrent.test.js - test massive concurrent locale loading to verify race condition fixes
 *
 * Copyright © 2025 JEDLSoft
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

import LocaleData from '../src/LocaleData.js';
import Locale from 'ilib-locale';

describe('Massive Concurrent Locale Loading', () => {
    beforeAll(() => {
        // Add the test root with 50+ locale files
        LocaleData.addGlobalRoot("./test/files3");
    });

    afterAll(() => {
        // Clean up after all tests
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();
    });

    test('should handle massive concurrent locale loading without race conditions and verify correct translations', async () => {
        // This test simulates the real-world scenario from ilib-address tests
        // where 50+ locales are being loaded concurrently, which is exactly
        // where the race condition was occurring

        const testLocales = [
            'en-GB', 'en-CA', 'en-AU', 'en-NZ',
            'es-ES', 'es-MX', 'es-AR', 'es-CO', 'es-PE',
            'it-IT', 'it-CH', 'it-SM', 'it-VA',
            'pt-PT', 'pt-BR', 'pt-AO', 'pt-MZ',
            'nl-NL', 'nl-BE', 'nl-SR',
            'sv-SE', 'sv-FI', 'sv-NO',
            'da-DK', 'da-GL',
            'no-NO', 'no-SJ',
            'fi-FI',
            'pl-PL',
            'cs-CZ',
            'sk-SK',
            'hu-HU',
            'ro-RO',
            'bg-BG',
            'hr-HR',
            'sl-SI',
            'et-EE',
            'lv-LV',
            'lt-LT',
            'mt-MT',
            'ga-IE'
        ];

        // Define expected translations for specific locales to verify we get the right data
        const expectedTranslations = {
            'es-ES': { region: 'Región', postalCode: 'Código Postal', country: 'País' },
            'it-IT': { region: 'Regione', postalCode: 'CAP', country: 'Paese' },
            'nl-NL': { region: 'Provincie', postalCode: 'Postcode', country: 'Land' },
            'pt-PT': { region: 'Região', postalCode: 'CEP', country: 'País' },
            'sv-SE': { region: 'Län', postalCode: 'Postnummer', country: 'Land' },
            'pl-PL': { region: 'Województwo', postalCode: 'Kod Pocztowy', country: 'Kraj' },
            'cs-CZ': { region: 'Kraj', postalCode: 'PSČ', country: 'Země' },
            'hu-HU': { region: 'Megye', postalCode: 'Irányítószám', country: 'Ország' }
        };

        // Run the test 1000 times to catch any intermittent race conditions
        for (let iteration = 0; iteration < 1000; iteration++) {
            // Clear cache before each iteration
            LocaleData.clearCache();

            // Load all 50+ locales concurrently
            const ensurePromises = testLocales.map(locale => LocaleData.ensureLocale(locale));
            const results = await Promise.all(ensurePromises);

            // All results should be true since we have data for all locales
            results.forEach((result, index) => {
                expect(result).toBe(true);
            });

            // Immediately after ensureLocale completes, verify that data is actually available
            // This is the critical part that was failing in the race condition
            const testLocalesToVerify = Object.keys(expectedTranslations);

            // Test that we can load data for each locale individually
            // Use a single LocaleData instance for all tests
            const locData = new LocaleData({
                path: "./test/files3"
            });

            for (const locale of testLocalesToVerify) {
                // Use the language part of the locale since that's where the data is stored
                const languageLocale = locale.split('-')[0];

                // First, ensure the locale is loaded
                await LocaleData.ensureLocale(languageLocale);

                // Then try to load the data
                const data = await locData.loadData({
                    sync: false,
                    locale: languageLocale,
                    basename: "address"
                });

                // Data should be available
                expect(data).toBeDefined();
                expect(typeof data).toBe("object");

                // Verify we got the correct translations for this locale
                const expected = expectedTranslations[locale];
                expect(data.region).toBe(expected.region);
                expect(data.postalCode).toBe(expected.postalCode);
                expect(data.country).toBe(expected.country);

                // Verify we did NOT get the English fallback values
                expect(data.region).not.toBe("Province");
                expect(data.postalCode).not.toBe("Postal Code");
                expect(data.country).not.toBe("Country");
            }
        }
    }, 300000);
});