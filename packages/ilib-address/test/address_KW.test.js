/*
 * address_KW.test.js - test the address parsing and formatting routines for Kuwait
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

let setUpPerformed = false;

describe('Address parsing and formatting for Kuwait', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("ar-KW");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Kuwaiti address with postal code',
                input: "حمد عبد الله حسن\n آل الصباح ١٠٠٨٤\n١٥٥٤٥ الكويت\n\nالكويت\n\n\n",
                locale: 'ar-KW',
                expected: {
                    streetAddress: "حمد عبد الله حسن, آل الصباح ١٠٠٨٤",
                    locality: "الكويت",
                    postalCode: "١٥٥٤٥",
                    country: "الكويت",
                    countryCode: "KW"
                }
            },
            {
                name: 'should parse Kuwaiti address without postal code',
                input: "حمد عبد الله حسن آل الصباح ١٠٠٨٤\nالكويت\nالكويت",
                locale: 'ar-KW',
                expected: {
                    streetAddress: "حمد عبد الله حسن آل الصباح ١٠٠٨٤",
                    locality: "الكويت",
                    country: "الكويت",
                    countryCode: "KW"
                }
            },
            {
                name: 'should parse Kuwaiti address without country specified',
                input: "حمد عبد الله حسن آل الصباح ١٠٠٨٤\n١٥٥٤٥ الجهرا",
                locale: 'ar-KW',
                expected: {
                    streetAddress: "حمد عبد الله حسن آل الصباح ١٠٠٨٤",
                    locality: "الجهرا",
                    postalCode: "١٥٥٤٥",
                    countryCode: "KW"
                }
            },
            {
                name: 'should parse Kuwaiti address with multiple lines',
                input: "حمد عبد الله حسن\n آل الصباح ١٠٠٨٤\n١٥٥٤٥\nالكويت\n\nالكويت\n\n\n",
                locale: 'ar-KW',
                expected: {
                    streetAddress: "حمد عبد الله حسن, آل الصباح ١٠٠٨٤",
                    locality: "الكويت",
                    postalCode: "١٥٥٤٥",
                    country: "الكويت",
                    countryCode: "KW"
                }
            },
            {
                name: 'should parse Kuwaiti address with superfluous whitespace',
                input: "\t\t\tحمد عبد الله حسن\n\n\t آل الصباح ١٠٠٨٤\n\n\t١٥٥٤٥\n\n\tالكويت\n\n\tالكويت\n\n\n",
                locale: 'ar-KW',
                expected: {
                    streetAddress: "حمد عبد الله حسن, آل الصباح ١٠٠٨٤",
                    locality: "الكويت",
                    postalCode: "١٥٥٤٥",
                    country: "الكويت",
                    countryCode: "KW"
                }
            },
            {
                name: 'should parse Kuwaiti address from US locale context',
                input: "حمد عبد الله حسن آل الصباح ١٠٠٨٤\n١٥٥٤٥\nالكويت\nKuwait",
                locale: 'en-US',
                expected: {
                    streetAddress: "حمد عبد الله حسن آل الصباح ١٠٠٨٤",
                    locality: "الكويت",
                    postalCode: "١٥٥٤٥",
                    country: "Kuwait",
                    countryCode: "KW"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.region).toBeUndefined();
            expect(parsedAddress.locality).toBe(expected.locality);
            
            if (expected.postalCode !== undefined) {
                expect(parsedAddress.postalCode).toBe(expected.postalCode);
            } else {
                expect(parsedAddress.postalCode).toBeUndefined();
            }
            
            if (expected.country !== undefined) {
                expect(parsedAddress.country).toBe(expected.country);
            } else {
                expect(parsedAddress.country).toBeUndefined();
            }
            
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Kuwaiti address with postal code', () => {
            const parsedAddress = new Address({
                streetAddress: "حمد عبد الله حسن آل الصباح ١٠٠٨٤",
                locality: "الكويت",
                postalCode: "١٥٥٤٥",
                country: "الكويت",
                countryCode: "KW"
            }, { locale: 'ar-KW' });

            const expected = "حمد عبد الله حسن آل الصباح ١٠٠٨٤\n١٥٥٤٥ الكويت\nالكويت";
            const formatter = new AddressFmt({ locale: 'ar-KW' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Kuwaiti address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "حمد عبد الله حسن آل الصباح ١٠٠٨٤",
                locality: "الكويت",
                postalCode: "١٥٥٤٥",
                country: "Kuwait",
                countryCode: "KW"
            }, { locale: 'en-US' });

            const expected = "حمد عبد الله حسن آل الصباح ١٠٠٨٤\n١٥٥٤٥ الكويت\nKuwait";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 