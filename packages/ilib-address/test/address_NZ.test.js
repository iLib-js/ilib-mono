/*
 * address_NZ.test.js - test the address parsing and formatting routines for New Zealand
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

describe('Address parsing and formatting for New Zealand', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-NZ");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal New Zealand address',
                input: "PO Box 10362\nWellington 6143\nNew Zealand",
                locale: 'en-NZ',
                expected: {
                    streetAddress: "PO Box 10362",
                    locality: "Wellington",
                    postalCode: "6143",
                    country: "New Zealand",
                    countryCode: "NZ"
                }
            },
            {
                name: 'should parse New Zealand address without postal code',
                input: "23 Kate Sheppard Place,\nThorndon\nWellington\nNew Zealand",
                locale: 'en-NZ',
                expected: {
                    streetAddress: "23 Kate Sheppard Place, Thorndon",
                    locality: "Wellington",
                    country: "New Zealand",
                    countryCode: "NZ"
                }
            },
            {
                name: 'should parse New Zealand address without country',
                input: "45a Clevedon-Takanini Rd\nArdmore\nAuckland 2582",
                locale: 'en-NZ',
                expected: {
                    streetAddress: "45a Clevedon-Takanini Rd, Ardmore",
                    locality: "Auckland",
                    postalCode: "2582",
                    countryCode: "NZ"
                }
            },
            {
                name: 'should parse New Zealand address with multiple lines',
                input: "Level 6\nTower Centre\n45 Queen Street\nAuckland\n1010\nNew Zealand\n\n\n",
                locale: 'en-NZ',
                expected: {
                    streetAddress: "Level 6, Tower Centre, 45 Queen Street",
                    locality: "Auckland",
                    postalCode: "1010",
                    country: "New Zealand",
                    countryCode: "NZ"
                }
            },
            {
                name: 'should parse New Zealand address in single line format',
                input: "70 Falsgrave St, Waltham, Christchurch 8011, New Zealand",
                locale: 'en-NZ',
                expected: {
                    streetAddress: "70 Falsgrave St, Waltham",
                    locality: "Christchurch",
                    postalCode: "8011",
                    country: "New Zealand",
                    countryCode: "NZ"
                }
            },
            {
                name: 'should parse New Zealand address with superfluous whitespace',
                input: "\t\t\t29b Bolt Rd\n\n\r\r\t\n   Tahuna\n\t\r\rNelson\r5678\r\r\n\r\n\tNew\tZealand\n\n\n",
                locale: 'en-NZ',
                expected: {
                    streetAddress: "29b Bolt Rd, Tahuna",
                    locality: "Nelson",
                    postalCode: "5678",
                    country: "New Zealand",
                    countryCode: "NZ"
                }
            },
            {
                name: 'should parse New Zealand address without delimiters',
                input: "70 Falsgrave St Waltham Christchurch 8011 New Zealand",
                locale: 'en-NZ',
                expected: {
                    streetAddress: "70 Falsgrave St Waltham",
                    locality: "Christchurch",
                    postalCode: "8011",
                    country: "New Zealand",
                    countryCode: "NZ"
                }
            },
            {
                name: 'should parse New Zealand address from US locale context',
                input: "70 Falsgrave St\nWaltham\nChristchurch 8011\nNew Zealand",
                locale: 'en-US',
                expected: {
                    streetAddress: "70 Falsgrave St, Waltham",
                    locality: "Christchurch",
                    postalCode: "8011",
                    country: "New Zealand",
                    countryCode: "NZ"
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
        test('should format New Zealand address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "70 Falsgrave St, Waltham",
                locality: "Christchurch",
                postalCode: "8011",
                country: "New Zealand",
                countryCode: "NZ"
            }, { locale: 'en-NZ' });

            const expected = "70 Falsgrave St, Waltham\nChristchurch 8011\nNew Zealand";
            const formatter = new AddressFmt({ locale: 'en-NZ' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format New Zealand address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "70 Falsgrave St, Waltham",
                locality: "Christchurch",
                postalCode: "8011",
                country: "New Zealand",
                countryCode: "NZ"
            }, { locale: 'en-US' });

            const expected = "70 Falsgrave St, Waltham\nChristchurch 8011\nNew Zealand";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 