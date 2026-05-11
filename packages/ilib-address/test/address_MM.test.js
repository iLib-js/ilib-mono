/*
 * address_MM.test.js - test the address parsing and formatting routines for Myanmar
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

describe('Address parsing and formatting for Myanmar', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-MM");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Myanmar address',
                input: "Posts and Telecommunications No 43 Bo Aung Gyaw Street\nYANGON, 11181\n\nMyanmar",
                locale: 'en-MM',
                expected: {
                    streetAddress: "Posts and Telecommunications No 43 Bo Aung Gyaw Street",
                    locality: "YANGON",
                    postalCode: "11181",
                    country: "Myanmar",
                    countryCode: "MM"
                }
            },
            {
                name: 'should parse Myanmar address without postal code',
                input: "Posts and Telecommunications No 43 Bo Aung Gyaw Street\nYANGON\nMyanmar",
                locale: 'en-MM',
                expected: {
                    streetAddress: "Posts and Telecommunications No 43 Bo Aung Gyaw Street",
                    locality: "YANGON",
                    country: "Myanmar",
                    countryCode: "MM"
                }
            },
            {
                name: 'should parse Myanmar address without country',
                input: "Posts and Telecommunications No 43 Bo Aung Gyaw Street\nYANGON, 11181",
                locale: 'en-MM',
                expected: {
                    streetAddress: "Posts and Telecommunications No 43 Bo Aung Gyaw Street",
                    locality: "YANGON",
                    postalCode: "11181",
                    countryCode: "MM"
                }
            },
            {
                name: 'should parse Myanmar address with multiple lines',
                input: "Posts and Telecommunications\nNo 43 Bo Aung Gyaw Street\n\nYANGON\n\n11181\nMyanmar\n\n\n",
                locale: 'en-MM',
                expected: {
                    streetAddress: "Posts and Telecommunications, No 43 Bo Aung Gyaw Street",
                    locality: "YANGON",
                    postalCode: "11181",
                    country: "Myanmar",
                    countryCode: "MM"
                }
            },
            {
                name: 'should parse Myanmar address in single line format',
                input: "Posts and Telecommunications , No 43 Bo Aung Gyaw Street , YANGON , 11181 , Myanmar",
                locale: 'en-MM',
                expected: {
                    streetAddress: "Posts and Telecommunications, No 43 Bo Aung Gyaw Street",
                    locality: "YANGON",
                    postalCode: "11181",
                    country: "Myanmar",
                    countryCode: "MM"
                }
            },
            {
                name: 'should parse Myanmar address with superfluous whitespace',
                input: "\t\t\tPosts and Telecommunications\n\t\t\rNo 43 Bo\t\t\rAung Gyaw Street\t\n\n\nYANGON\n\n11181\n\t Myanmar\n\n\n",
                locale: 'en-MM',
                expected: {
                    streetAddress: "Posts and Telecommunications, No 43 Bo Aung Gyaw Street",
                    locality: "YANGON",
                    postalCode: "11181",
                    country: "Myanmar",
                    countryCode: "MM"
                }
            },
            {
                name: 'should parse Myanmar address without delimiters',
                input: "Posts and Telecommunications No 43 Bo Aung Gyaw Street YANGON, 11181 Myanmar",
                locale: 'en-MM',
                expected: {
                    streetAddress: "Posts and Telecommunications No 43 Bo Aung Gyaw Street",
                    locality: "YANGON",
                    postalCode: "11181",
                    country: "Myanmar",
                    countryCode: "MM"
                }
            },
            {
                name: 'should parse Myanmar address from US locale context',
                input: "Posts and Telecommunications No 43 Bo Aung Gyaw Street\nYANGON, 11181\nMyanmar",
                locale: 'en-US',
                expected: {
                    streetAddress: "Posts and Telecommunications No 43 Bo Aung Gyaw Street",
                    locality: "YANGON",
                    postalCode: "11181",
                    country: "Myanmar",
                    countryCode: "MM"
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
        test('should format Myanmar address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Posts and Telecommunications No 43 Bo Aung Gyaw Street",
                locality: "YANGON",
                postalCode: "11181",
                country: "Myanmar",
                countryCode: "MM"
            }, { locale: 'en-MM' });

            const expected = "Posts and Telecommunications No 43 Bo Aung Gyaw Street\nYANGON, 11181\nMyanmar";
            const formatter = new AddressFmt({ locale: 'en-MM' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Myanmar address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Posts and Telecommunications No 43 Bo Aung Gyaw Street",
                locality: "YANGON",
                postalCode: "11181",
                country: "Myanmar",
                countryCode: "MM"
            }, { locale: 'en-US' });

            const expected = "Posts and Telecommunications No 43 Bo Aung Gyaw Street\nYANGON, 11181\nMyanmar";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 