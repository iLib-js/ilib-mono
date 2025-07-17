/*
 * address_NL.test.js - test the address parsing and formatting routines for Netherlands
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

describe('ilib-address Netherlands', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("nl-NL");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Dutch address',
                input: "Achterberglaan 23, 2345 GD Uithoorn, Nederland",
                options: { locale: 'nl-NL' },
                expected: {
                    streetAddress: "Achterberglaan 23",
                    locality: "Uithoorn",
                    region: undefined,
                    postalCode: "2345 GD",
                    country: "Nederland",
                    countryCode: "NL"
                }
            },
            {
                name: 'should parse Dutch address without postal code',
                input: "Achterberglaan 23, Uithoorn, Nederland",
                options: { locale: 'nl-NL' },
                expected: {
                    streetAddress: "Achterberglaan 23",
                    locality: "Uithoorn",
                    region: undefined,
                    postalCode: undefined,
                    country: "Nederland",
                    countryCode: "NL"
                }
            },
            {
                name: 'should parse Dutch address with multiple lines',
                input: "Claude Debussylaan 34\nVinoly Mahler 4\nToren B\n15th Floor\n1082 MD\nAmsterdam\nNederland",
                options: { locale: 'nl-NL' },
                expected: {
                    streetAddress: "Claude Debussylaan 34, Vinoly Mahler 4, Toren B, 15th Floor",
                    locality: "Amsterdam",
                    region: undefined,
                    postalCode: "1082 MD",
                    country: "Nederland",
                    countryCode: "NL"
                }
            },
            {
                name: 'should parse Dutch address in one line format',
                input: "Startbaan 16, 1187 XR Amstelveen, Nederland",
                options: { locale: 'nl-NL' },
                expected: {
                    streetAddress: "Startbaan 16",
                    locality: "Amstelveen",
                    region: undefined,
                    postalCode: "1187 XR",
                    country: "Nederland",
                    countryCode: "NL"
                }
            },
            {
                name: 'should parse Dutch address with superfluous whitespace',
                input: "Startbaan 16,   \n\t\n 1187 XR \t\t Amstelveen,\n\n\n Nederland  \n  \t\t\t",
                options: { locale: 'nl-NL' },
                expected: {
                    streetAddress: "Startbaan 16",
                    locality: "Amstelveen",
                    region: undefined,
                    postalCode: "1187 XR",
                    country: "Nederland",
                    countryCode: "NL"
                }
            },
            {
                name: 'should parse Dutch address without delimiters',
                input: "Startbaan 16 1187 XR Amstelveen Nederland",
                options: { locale: 'nl-NL' },
                expected: {
                    streetAddress: "Startbaan 16",
                    locality: "Amstelveen",
                    region: undefined,
                    postalCode: "1187 XR",
                    country: "Nederland",
                    countryCode: "NL"
                }
            },
            {
                name: 'should parse Dutch address with special characters',
                input: "Óók 16, 1187 XR s'Hertogen-bósch, Nederland",
                options: { locale: 'nl-NL' },
                expected: {
                    streetAddress: "Óók 16",
                    locality: "s'Hertogen-bósch",
                    region: undefined,
                    postalCode: "1187 XR",
                    country: "Nederland",
                    countryCode: "NL"
                }
            },
            {
                name: 'should parse Dutch address from US locale',
                input: "Achterberglaan 23, 2345 GD Uithoorn, Netherlands",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Achterberglaan 23",
                    locality: "Uithoorn",
                    region: undefined,
                    postalCode: "2345 GD",
                    country: "Netherlands",
                    countryCode: "NL"
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
                name: 'should format Dutch address in Dutch locale',
                address: {
                    streetAddress: "Achterberglaan 23",
                    locality: "Uithoorn",
                    postalCode: "2345 GD",
                    country: "Nederland",
                    countryCode: "NL"
                },
                options: { locale: 'nl-NL' },
                expected: "Achterberglaan 23\n2345 GD Uithoorn\nNederland"
            },
            {
                name: 'should format Dutch address in US locale',
                address: {
                    streetAddress: "Achterberglaan 23",
                    locality: "Uithoorn",
                    postalCode: "2345 GD",
                    country: "Netherlands",
                    countryCode: "NL"
                },
                options: { locale: 'en-US' },
                expected: "Achterberglaan 23\n2345 GD Uithoorn\nNetherlands"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 