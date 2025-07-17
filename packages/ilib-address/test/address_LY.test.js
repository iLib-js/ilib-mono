/*
 * address_LY.test.js - test the address parsing and formatting routines for Libya
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

describe('Address parsing and formatting for Libya', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("ar-LY");
        }
    });

    describe('Address parsing tests - Arabic format', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Libyan address in Arabic format',
                input: "السيد محمد علي خليفة, الغزالي ١٢, طرابلس, ليبيا",
                locale: 'ar-LY',
                expected: {
                    streetAddress: "السيد محمد علي خليفة, الغزالي ١٢",
                    locality: "طرابلس",
                    country: "ليبيا",
                    countryCode: "LY"
                }
            },
            {
                name: 'should parse Libyan address without postal code in Arabic format',
                input: "السيد محمد علي خليفة, الغزالي ١٢, طرابلس, ليبيا",
                locale: 'ar-LY',
                expected: {
                    streetAddress: "السيد محمد علي خليفة, الغزالي ١٢",
                    locality: "طرابلس",
                    country: "ليبيا",
                    countryCode: "LY"
                }
            },
            {
                name: 'should parse Libyan address with multiple lines in Arabic format',
                input: "السيد محمد علي خليفة, الغزالي ١٢\nطرابلس\n ليبيا",
                locale: 'ar-LY',
                expected: {
                    streetAddress: "السيد محمد علي خليفة, الغزالي ١٢",
                    locality: "طرابلس",
                    country: "ليبيا",
                    countryCode: "LY"
                }
            },
            {
                name: 'should parse Libyan address in single line Arabic format',
                input: "السيد محمد علي خليفة, الغزالي ١٢,طرابلس, ليبيا",
                locale: 'ar-LY',
                expected: {
                    streetAddress: "السيد محمد علي خليفة, الغزالي ١٢",
                    locality: "طرابلس",
                    country: "ليبيا",
                    countryCode: "LY"
                }
            },
            {
                name: 'should parse Libyan address with superfluous whitespace in Arabic format',
                input: "السيد محمد علي خليفة, الغزالي ١٢   \n\t\n طرابلس\t\n\n  ليبيا  \n  \t\t\t",
                locale: 'ar-LY',
                expected: {
                    streetAddress: "السيد محمد علي خليفة, الغزالي ١٢",
                    locality: "طرابلس",
                    country: "ليبيا",
                    countryCode: "LY"
                }
            },
            {
                name: 'should parse Libyan address with special characters in Arabic format',
                input: "السيد محمد علي خليفة, الغزالي ١٢,طرابلس, ليبيا",
                locale: 'ar-LY',
                expected: {
                    streetAddress: "السيد محمد علي خليفة, الغزالي ١٢",
                    locality: "طرابلس",
                    country: "ليبيا",
                    countryCode: "LY"
                }
            },
            {
                name: 'should parse Libyan address from US locale context in Arabic format',
                input: "السيد محمد علي خليفة, الغزالي ١٢,طرابلس, Libya",
                locale: 'en-US',
                expected: {
                    streetAddress: "السيد محمد علي خليفة, الغزالي ١٢",
                    locality: "طرابلس",
                    country: "Libya",
                    countryCode: "LY"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.region).toBeUndefined();
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Libyan address in Arabic format', () => {
            const parsedAddress = new Address({
                streetAddress: "السيد محمد علي خليفة, الغزالي ١٢",
                locality: "طرابلس",
                country: "ليبيا",
                countryCode: "LY"
            }, { locale: 'ar-LY' });

            const expected = "السيد محمد علي خليفة, الغزالي ١٢\nطرابلس\nليبيا";
            const formatter = new AddressFmt({ locale: 'ar-LY' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Libyan address from US locale context in Arabic format', () => {
            const parsedAddress = new Address({
                streetAddress: "السيد محمد علي خليفة, الغزالي ١٢",
                locality: "طرابلس",
                country: "Libya",
                countryCode: "LY"
            }, { locale: 'en-US' });

            const expected = "السيد محمد علي خليفة, الغزالي ١٢\nطرابلس\nLibya";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 