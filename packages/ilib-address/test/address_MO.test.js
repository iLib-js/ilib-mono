/*
 * address_MO.test.js - test the address parsing and formatting routines for Macau
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

describe('Address parsing and formatting for Macau', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("pt-MO");
        }
    });

    describe('Address parsing tests - Latin format', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Macau address in Latin format',
                input: "Rua Cidade de Lisboa N.o 130\n Lisboa Gardens, Tower B3\n 14th Floor D,\n Macau 999078\n Macau",
                locale: 'pt-MO',
                expected: {
                    streetAddress: "Rua Cidade de Lisboa N.o 130, Lisboa Gardens, Tower B3, 14th Floor D",
                    region: "Macau",
                    postalCode: "999078",
                    country: "Macau",
                    countryCode: "MO"
                }
            },
            {
                name: 'should parse Macau address without postal code in Latin format',
                input: "Rua Cidade de Lisboa N.o 130\n Lisboa Gardens, Tower B3\n 14th Floor D,\n Macau \n Macau",
                locale: 'pt-MO',
                expected: {
                    streetAddress: "Rua Cidade de Lisboa N.o 130, Lisboa Gardens, Tower B3, 14th Floor D",
                    region: "Macau",
                    country: "Macau",
                    countryCode: "MO"
                }
            },
            {
                name: 'should parse Macau address without country in Latin format',
                input: "Rua Cidade de Lisboa N.o 130\n Lisboa Gardens, Tower B3\n 14th Floor D,\n Macau 999078",
                locale: 'pt-MO',
                expected: {
                    streetAddress: "Rua Cidade de Lisboa N.o 130, Lisboa Gardens, Tower B3, 14th Floor D",
                    region: "Macau",
                    postalCode: "999078",
                    countryCode: "MO"
                }
            },
            {
                name: 'should parse Macau address with multiple lines in Latin format',
                input: "Rua Cidade de Lisboa N.o 130\n\n Lisboa Gardens, Tower B3\n\n 14th Floor D,\n\n\n Macau 999078\n\n Macau",
                locale: 'pt-MO',
                expected: {
                    streetAddress: "Rua Cidade de Lisboa N.o 130, Lisboa Gardens, Tower B3, 14th Floor D",
                    region: "Macau",
                    postalCode: "999078",
                    country: "Macau",
                    countryCode: "MO"
                }
            },
            {
                name: 'should parse Macau address in single line Latin format',
                input: "Rua Cidade de Lisboa N.o 130 Lisboa Gardens, Tower B3 14th Floor D, Macau 999078 Macau",
                locale: 'pt-MO',
                expected: {
                    streetAddress: "Rua Cidade de Lisboa N.o 130 Lisboa Gardens, Tower B3 14th Floor D",
                    region: "Macau",
                    postalCode: "999078",
                    country: "Macau",
                    countryCode: "MO"
                }
            },
            {
                name: 'should parse Macau address with superfluous whitespace in Latin format',
                input: "\t\t\tRua Cidade de Lisboa N.o 130\r\t Lisboa Gardens,\r\t   \tTower B3 14th Floor D,\t\t\n\t Macau \r\t999078 \n\t\t\r\rMacau\t\n\n\n",
                locale: 'pt-MO',
                expected: {
                    streetAddress: "Rua Cidade de Lisboa N.o 130 Lisboa Gardens, Tower B3 14th Floor D",
                    region: "Macau",
                    postalCode: "999078",
                    country: "Macau",
                    countryCode: "MO"
                }
            },
            {
                name: 'should parse Macau address without delimiters in Latin format',
                input: "Rua Cidade de Lisboa N.o 130 Lisboa Gardens Tower B3 14th Floor D Macau 999078 Macau",
                locale: 'pt-MO',
                expected: {
                    streetAddress: "Rua Cidade de Lisboa N.o 130 Lisboa Gardens Tower B3 14th Floor D",
                    region: "Macau",
                    postalCode: "999078",
                    country: "Macau",
                    countryCode: "MO"
                }
            },
            {
                name: 'should parse Macau address from US locale context in Latin format',
                input: "Rua Cidade de Lisboa N.o 130\n Lisboa Gardens, Tower B3\n 14th Floor D,\n Macau 999078\n Macau",
                locale: 'en-US',
                expected: {
                    streetAddress: "Rua Cidade de Lisboa N.o 130, Lisboa Gardens, Tower B3, 14th Floor D",
                    region: "Macau",
                    postalCode: "999078",
                    country: "Macau",
                    countryCode: "MO"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.locality).toBeUndefined();
            
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

    describe('Address parsing tests - Asian format', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Macau address in Asian format',
                input: "澳門999078商業大馬路251A-301號\n這是一個友善博祚20樓\n行政中心",
                locale: 'zh-MO',
                expected: {
                    streetAddress: "商業大馬路251A-301號這是一個友善博祚20樓行政中心",
                    country: "澳門",
                    postalCode: "999078",
                    countryCode: "MO"
                }
            },
            {
                name: 'should parse Macau address without postal code in Asian format',
                input: "澳門商業大馬路251A-301號\n這是一個友善博祚20樓\n行政中心",
                locale: 'zh-MO',
                expected: {
                    streetAddress: "商業大馬路251A-301號這是一個友善博祚20樓行政中心",
                    country: "澳門",
                    countryCode: "MO"
                }
            },
            {
                name: 'should parse Macau address without country in Asian format',
                input: "999078商業大馬路251A-301號\n這是一個友善博祚20樓\n行政中心",
                locale: 'zh-MO',
                expected: {
                    streetAddress: "商業大馬路251A-301號這是一個友善博祚20樓行政中心",
                    postalCode: "999078",
                    countryCode: "MO"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.region).toBeUndefined();
            expect(parsedAddress.locality).toBeUndefined();
            
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
        test('should format Macau address in Latin format', () => {
            const parsedAddress = new Address({
                streetAddress: "Rua Cidade de Lisboa N.o 130, Lisboa Gardens, Tower B3, 14th Floor D",
                region: "Macau",
                postalCode: "999078",
                country: "Macau",
                countryCode: "MO",
                format: "latin"
            }, { locale: 'pt-MO' });

            const expected = "Rua Cidade de Lisboa N.o 130, Lisboa Gardens, Tower B3, 14th Floor D\nMacau 999078\nMacau";
            const formatter = new AddressFmt({ locale: 'pt-MO' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Macau address from US locale context in Latin format', () => {
            const parsedAddress = new Address({
                streetAddress: "Rua Cidade de Lisboa N.o 130, Lisboa Gardens, Tower B3, 14th Floor D",
                region: "Macau",
                postalCode: "999078",
                country: "Macau",
                countryCode: "MO",
                format: "latin"
            }, { locale: 'en-US' });

            const expected = "Rua Cidade de Lisboa N.o 130, Lisboa Gardens, Tower B3, 14th Floor D\nMacau 999078\nMacau";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 