/*
 * address_TN.test.js - test the address parsing and formatting routines for Tunisia
 *
 * Copyright © 2013-2015, 2017, 2022-2025 JEDLSoft
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

import { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';
import Address from '../src/Address.js';
import AddressFmt from '../src/AddressFmt.js';

describe('ilib-address Tunisia', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("ar-TN");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Tunisian address in Arabic',
                input: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢\n٨١٢٩ ﻊﻴﻧ ﺩﺭﺎﻬﻣ\nتونس",
                options: { locale: 'ar-TN' },
                expected: {
                    streetAddress: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢",
                    locality: "ﻊﻴﻧ ﺩﺭﺎﻬﻣ",
                    region: undefined,
                    postalCode: "٨١٢٩",
                    country: "تونس",
                    countryCode: "TN"
                }
            },
            {
                name: 'should parse Tunisian address without postal code in Arabic',
                input: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢\nﻊﻴﻧ ﺩﺭﺎﻬﻣ\nتونس",
                options: { locale: 'ar-TN' },
                expected: {
                    streetAddress: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢",
                    locality: "ﻊﻴﻧ ﺩﺭﺎﻬﻣ",
                    region: undefined,
                    postalCode: undefined,
                    country: "تونس",
                    countryCode: "TN"
                }
            },
            {
                name: 'should parse Tunisian address without country in Arabic',
                input: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢\n٨١٢٩ ﻊﻴﻧ ﺩﺭﺎﻬﻣ",
                options: { locale: 'ar-TN' },
                expected: {
                    streetAddress: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢",
                    locality: "ﻊﻴﻧ ﺩﺭﺎﻬﻣ",
                    region: undefined,
                    postalCode: "٨١٢٩",
                    country: undefined,
                    countryCode: "TN"
                }
            },
            {
                name: 'should parse Tunisian address with multiple lines in Arabic',
                input: "ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢\nﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ\n٨١٢٩\nﻊﻴﻧ ﺩﺭﺎﻬﻣ\n\nتونس\n\n\n",
                options: { locale: 'ar-TN' },
                expected: {
                    streetAddress: "ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢, ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ",
                    locality: "ﻊﻴﻧ ﺩﺭﺎﻬﻣ",
                    region: undefined,
                    postalCode: "٨١٢٩",
                    country: "تونس",
                    countryCode: "TN"
                }
            },
            {
                name: 'should parse Tunisian address with superfluous whitespace in Arabic',
                input: "\t\t\tﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢\n\n\tﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ\n\n\t٨١٢٩\n\n\tﻊﻴﻧ ﺩﺭﺎﻬﻣ\n\n\tتونس\n\n\n",
                options: { locale: 'ar-TN' },
                expected: {
                    streetAddress: "ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢, ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ",
                    locality: "ﻊﻴﻧ ﺩﺭﺎﻬﻣ",
                    region: undefined,
                    postalCode: "٨١٢٩",
                    country: "تونس",
                    countryCode: "TN"
                }
            },
            {
                name: 'should parse Tunisian address from US locale with English country',
                input: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢\n٨١٢٩\nﻊﻴﻧ ﺩﺭﺎﻬﻣ\nTunisia",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢",
                    locality: "ﻊﻴﻧ ﺩﺭﺎﻬﻣ",
                    region: undefined,
                    postalCode: "٨١٢٩",
                    country: "Tunisia",
                    countryCode: "TN"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, options, expected }) => {
            const parsedAddress = new Address(input, options);
            
            expect(parsedAddress).toBeDefined();
            
            if (expected.streetAddress !== undefined) {
                expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            }
            if (expected.locality !== undefined) {
                expect(parsedAddress.locality).toBe(expected.locality);
            }
            if (expected.region !== undefined) {
                expect(parsedAddress.region).toBe(expected.region);
            }
            if (expected.postalCode !== undefined) {
                expect(parsedAddress.postalCode).toBe(expected.postalCode);
            }
            if (expected.country !== undefined) {
                expect(parsedAddress.country).toBe(expected.country);
            }
            if (expected.countryCode !== undefined) {
                expect(parsedAddress.countryCode).toBe(expected.countryCode);
            }
        });
    });

    describe('Address formatting', () => {
        const formatTestCases = [
            {
                name: 'should format Tunisian address in Arabic locale',
                address: {
                    streetAddress: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢",
                    locality: "ﻊﻴﻧ ﺩﺭﺎﻬﻣ",
                    postalCode: "٨١٢٩",
                    country: "تونس",
                    countryCode: "TN"
                },
                options: { locale: 'ar-TN' },
                expected: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢\n٨١٢٩ ﻊﻴﻧ ﺩﺭﺎﻬﻣ\nتونس"
            },
            {
                name: 'should format Tunisian address in US locale',
                address: {
                    streetAddress: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢",
                    locality: "ﻊﻴﻧ ﺩﺭﺎﻬﻣ",
                    postalCode: "٨١٢٩",
                    country: "Tunisia",
                    countryCode: "TN"
                },
                options: { locale: 'en-US' },
                expected: "ﻢﻴﻠﻴﻫ ﺭﺅﻮﻓ ﺲﻋﺍﺩ ﺏﻮﻴﺗ ﺏﺮﻴﻔﻳ ٧٢\n٨١٢٩ ﻊﻴﻧ ﺩﺭﺎﻬﻣ\nTunisia"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 