/*
 * address_TR.test.js - test the address parsing and formatting routines for Turkey
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

describe('ilib-address Turkey', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("tr-TR");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Turkish address',
                input: "Orhaniye Street No 14\nSirkeci Istanbul 34120\nTurkey",
                options: { locale: 'tr-TR' },
                expected: {
                    streetAddress: "Orhaniye Street No 14",
                    locality: "Sirkeci",
                    region: "Istanbul",
                    postalCode: "34120",
                    country: "Turkey",
                    countryCode: "TR"
                }
            },
            {
                name: 'should parse Turkish address without postal code',
                input: "Teyfikhane Sok No 1\nSultanahmet Istanbul\nTurkey",
                options: { locale: 'tr-TR' },
                expected: {
                    streetAddress: "Teyfikhane Sok No 1",
                    locality: "Sultanahmet",
                    region: "Istanbul",
                    postalCode: undefined,
                    country: "Turkey",
                    countryCode: "TR"
                }
            },
            {
                name: 'should parse Turkish address without country',
                input: "Orhaniye Street No 14\nSirkeci Istanbul 34120",
                options: { locale: 'tr-TR' },
                expected: {
                    streetAddress: "Orhaniye Street No 14",
                    locality: "Sirkeci",
                    region: "Istanbul",
                    postalCode: "34120",
                    country: undefined,
                    countryCode: "TR"
                }
            },
            {
                name: 'should parse Turkish address without delimiters',
                input: "Orhaniye Street No 14 Sirkeci Istanbul 34120 Turkey",
                options: { locale: 'tr-TR' },
                expected: {
                    streetAddress: "Orhaniye Street No 14",
                    locality: "Sirkeci",
                    region: "Istanbul",
                    postalCode: "34120",
                    country: "Turkey",
                    countryCode: "TR"
                }
            },
            {
                name: 'should parse Turkish address in one line format',
                input: "Orhaniye Street , No 14 , Sirkeci , Istanbul , 34120 , Turkey",
                options: { locale: 'tr-TR' },
                expected: {
                    streetAddress: "Orhaniye Street, No 14",
                    locality: "Sirkeci",
                    region: "Istanbul",
                    postalCode: "34120",
                    country: "Turkey",
                    countryCode: "TR"
                }
            },
            {
                name: 'should parse Turkish address with different format',
                input: "Alemdag Cad. Yanyol Sok. No 6-8\nÜSKÜDAR  ISTANBUL 34692\nTURKEY",
                options: { locale: 'tr-TR' },
                expected: {
                    streetAddress: "Alemdag Cad. Yanyol Sok. No 6-8",
                    locality: "ÜSKÜDAR",
                    region: "ISTANBUL",
                    postalCode: "34692",
                    country: "TURKEY",
                    countryCode: "TR"
                }
            },
            {
                name: 'should parse Turkish address with multiple lines from different locale',
                input: "Orhaniye Street\nNo 14\nSirkeci Istanbul 34120\nTurkey",
                options: { locale: 'sl-SI' },
                expected: {
                    streetAddress: "Orhaniye Street, No 14",
                    locality: "Sirkeci",
                    region: "Istanbul",
                    postalCode: "34120",
                    country: "Turkey",
                    countryCode: "TR"
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
                name: 'should format Turkish address in Turkish locale',
                address: {
                    streetAddress: "Alemdag Cad. Yanyol Sok. No 6-8",
                    locality: "ÜSKÜDAR",
                    postalCode: "34692",
                    region: "ISTANBUL",
                    country: "TURKEY",
                    countryCode: "TR"
                },
                options: { locale: 'tr-TR' },
                expected: "Alemdag Cad. Yanyol Sok. No 6-8\nÜSKÜDAR ISTANBUL 34692\nTURKEY"
            },
            {
                name: 'should format Turkish address in US locale',
                address: {
                    streetAddress: "Orhaniye Street No 14",
                    locality: "Sirkeci",
                    region: "Istanbul",
                    postalCode: "34120",
                    country: "Turkey",
                    countryCode: "TR"
                },
                options: { locale: 'en-US' },
                expected: "Orhaniye Street No 14\nSirkeci Istanbul 34120\nTurkey"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 