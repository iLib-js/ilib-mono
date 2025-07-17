/*
 * address_KE.test.js - test the address parsing and formatting routines for Kenya
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

describe('Address parsing and formatting for Kenya', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-KE");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Kenyan address with postal code',
                input: "Paul Makeba P.O. Box 3120\nNAKURU\n20100\nKENYA",
                locale: 'en-KE',
                expected: {
                    streetAddress: "Paul Makeba P.O. Box 3120",
                    locality: "NAKURU",
                    postalCode: "20100",
                    country: "KENYA",
                    countryCode: "KE"
                }
            },
            {
                name: 'should parse Kenyan address without postal code',
                input: "Paul Makeba P.O. Box 3120\nNAKURU\nKENYA",
                locale: 'en-KE',
                expected: {
                    streetAddress: "Paul Makeba P.O. Box 3120",
                    locality: "NAKURU",
                    country: "KENYA",
                    countryCode: "KE"
                }
            },
            {
                name: 'should parse Kenyan address without country specified',
                input: "Paul Makeba P.O. Box 3120\nNAKURU\n20100",
                locale: 'en-KE',
                expected: {
                    streetAddress: "Paul Makeba P.O. Box 3120",
                    locality: "NAKURU",
                    postalCode: "20100",
                    countryCode: "KE"
                }
            },
            {
                name: 'should parse Kenyan address with multiple lines and extra whitespace',
                input: "Paul Makeba\nP.O. Box 3120\n\n\n\n\nNAKURU\n\n20100\n\nKENYA\n\n\n",
                locale: 'en-KE',
                expected: {
                    streetAddress: "Paul Makeba, P.O. Box 3120",
                    locality: "NAKURU",
                    postalCode: "20100",
                    country: "KENYA",
                    countryCode: "KE"
                }
            },
            {
                name: 'should parse Kenyan address in single line format',
                input: "Paul Makeba , P.O. Box 3120 , NAKURU , 20100 , KENYA",
                locale: 'en-KE',
                expected: {
                    streetAddress: "Paul Makeba, P.O. Box 3120",
                    locality: "NAKURU",
                    postalCode: "20100",
                    country: "KENYA",
                    countryCode: "KE"
                }
            },
            {
                name: 'should parse Kenyan address with superfluous whitespace',
                input: "\t\t\tPaul Makeba\t\t\rP.O. Box 3120\t\t\r\n\n\n\nNAKURU\n\t20100\n\nKENYA\n\n\n",
                locale: 'en-KE',
                expected: {
                    streetAddress: "Paul Makeba P.O. Box 3120",
                    locality: "NAKURU",
                    postalCode: "20100",
                    country: "KENYA",
                    countryCode: "KE"
                }
            },
            {
                name: 'should parse Kenyan address without delimiters',
                input: "Paul Makeba P.O. Box 3120 NAKURU\n20100 KENYA",
                locale: 'en-KE',
                expected: {
                    streetAddress: "Paul Makeba P.O. Box 3120",
                    locality: "NAKURU",
                    postalCode: "20100",
                    country: "KENYA",
                    countryCode: "KE"
                }
            },
            {
                name: 'should parse Kenyan address from US locale context',
                input: "Paul Makeba P.O. Box 3120\nNAKURU\n20100\nKENYA",
                locale: 'en-US',
                expected: {
                    streetAddress: "Paul Makeba P.O. Box 3120",
                    locality: "NAKURU",
                    postalCode: "20100",
                    country: "KENYA",
                    countryCode: "KE"
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
        test('should format Kenyan address with postal code', () => {
            const parsedAddress = new Address({
                streetAddress: "Paul Makeba P.O. Box 3120",
                locality: "NAKURU",
                postalCode: "20100",
                country: "KENYA",
                countryCode: "KE"
            }, { locale: 'en-KE' });

            const expected = "Paul Makeba P.O. Box 3120\nNAKURU\n20100\nKENYA";
            const formatter = new AddressFmt({ locale: 'en-KE' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Kenyan address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Paul Makeba P.O. Box 3120",
                locality: "NAKURU",
                postalCode: "20100",
                country: "KENYA",
                countryCode: "KE"
            }, { locale: 'en-US' });

            const expected = "Paul Makeba P.O. Box 3120\nNAKURU\n20100\nKENYA";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 