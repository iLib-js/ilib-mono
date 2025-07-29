/*
 * address_PL.test.js - test the address parsing and formatting routines for Poland
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

describe('Address parsing and formatting for Poland', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("pl-PL");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Polish address',
                input: "Adrian Kieślowski ul. Łączności 1\n82-300 ELBLAG\nPoland",
                locale: 'pl-PL',
                expected: {
                    streetAddress: "Adrian Kieślowski ul. Łączności 1",
                    locality: "ELBLAG",
                    postalCode: "82-300",
                    country: "Poland",
                    countryCode: "PL"
                }
            },
            {
                name: 'should parse Polish address without postal code',
                input: "Adrian Kieślowski ul. Łączności 1\nELBLAG\nPoland",
                locale: 'pl-PL',
                expected: {
                    streetAddress: "Adrian Kieślowski ul. Łączności 1",
                    locality: "ELBLAG",
                    country: "Poland",
                    countryCode: "PL"
                }
            },
            {
                name: 'should parse Polish address without country',
                input: "Adrian Kieślowski ul. Łączności 1\n82-300 ELBLAG",
                locale: 'pl-PL',
                expected: {
                    streetAddress: "Adrian Kieślowski ul. Łączności 1",
                    locality: "ELBLAG",
                    postalCode: "82-300",
                    countryCode: "PL"
                }
            },
            {
                name: 'should parse Polish address with multiple lines',
                input: "Adrian Kieślowski\nul. Łączności 1\n\n82-300\nELBLAG\nPoland\n\n\n",
                locale: 'pl-PL',
                expected: {
                    streetAddress: "Adrian Kieślowski, ul. Łączności 1",
                    locality: "ELBLAG",
                    postalCode: "82-300",
                    country: "Poland",
                    countryCode: "PL"
                }
            },
            {
                name: 'should parse Polish address in single line format',
                input: "Adrian Kieślowski , ul. Łączności 1 , 82-300 , ELBLAG , Poland",
                locale: 'pl-PL',
                expected: {
                    streetAddress: "Adrian Kieślowski, ul. Łączności 1",
                    locality: "ELBLAG",
                    postalCode: "82-300",
                    country: "Poland",
                    countryCode: "PL"
                }
            },
            {
                name: 'should parse Polish address with superfluous whitespace',
                input: "\t\t\tAdrian Kieślowski\n\t\t\tul. Łączności 1\n\t\n82-300\t\nELBLAG\n\t Poland\n\n\n",
                locale: 'pl-PL',
                expected: {
                    streetAddress: "Adrian Kieślowski, ul. Łączności 1",
                    locality: "ELBLAG",
                    postalCode: "82-300",
                    country: "Poland",
                    countryCode: "PL"
                }
            },
            {
                name: 'should parse Polish address without delimiters',
                input: "Adrian Kieślowski ul. Łączności 1 82-300 ELBLAG Poland",
                locale: 'pl-PL',
                expected: {
                    streetAddress: "Adrian Kieślowski ul. Łączności 1",
                    locality: "ELBLAG",
                    postalCode: "82-300",
                    country: "Poland",
                    countryCode: "PL"
                }
            },
            {
                name: 'should parse Polish address from US locale context',
                input: "Adrian Kieślowski ul. Łączności 1\n82-300 ELBLAG\nPoland",
                locale: 'en-US',
                expected: {
                    streetAddress: "Adrian Kieślowski ul. Łączności 1",
                    locality: "ELBLAG",
                    postalCode: "82-300",
                    country: "Poland",
                    countryCode: "PL"
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
        test('should format Polish address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Adrian Kieślowski ul. Łączności 1",
                locality: "ELBLAG",
                postalCode: "82-300",
                country: "Poland",
                countryCode: "PL"
            }, { locale: 'pl-PL' });

            const expected = "Adrian Kieślowski ul. Łączności 1\n82-300 ELBLAG\nPoland";
            const formatter = new AddressFmt({ locale: 'pl-PL' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Polish address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Adrian Kieślowski ul. Łączności 1",
                locality: "ELBLAG",
                postalCode: "82-300",
                country: "Poland",
                countryCode: "PL"
            }, { locale: 'en-US' });

            const expected = "Adrian Kieślowski ul. Łączności 1\n82-300 ELBLAG\nPoland";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 