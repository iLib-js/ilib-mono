/*
 * address_IE.test.js - test the address parsing and formatting routines for Ireland
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

describe('Address parsing and formatting for Ireland', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-IE");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Irish address with postal code',
                input: "Gordon House\nBarrow Street\nDublin 4\nIreland",
                locale: 'en-IE',
                expected: {
                    streetAddress: "Gordon House, Barrow Street",
                    locality: "Dublin",
                    postalCode: "4",
                    country: "Ireland",
                    countryCode: "IE"
                }
            },
            {
                name: 'should parse Irish address without postal code but with county',
                input: "Metro Park\nCloughfern Avenue\nNewtownabbey\nCo. Antrim\nIreland",
                locale: 'en-IE',
                expected: {
                    streetAddress: "Metro Park, Cloughfern Avenue",
                    locality: "Newtownabbey",
                    region: "Co. Antrim",
                    country: "Ireland",
                    countryCode: "IE"
                }
            },
            {
                name: 'should parse Irish address without country specified',
                input: "Liffey Park Technology Campus\nBarnhall Road\nLeixlip\nCo Kildare",
                locale: 'en-IE',
                expected: {
                    streetAddress: "Liffey Park Technology Campus, Barnhall Road",
                    locality: "Leixlip",
                    region: "Co Kildare",
                    countryCode: "IE"
                }
            },
            {
                name: 'should parse Irish address with Dublin postal code format',
                input: "Gordon House\nBarrow Street\nDublin D6W\nIreland",
                locale: 'en-IE',
                expected: {
                    streetAddress: "Gordon House, Barrow Street",
                    locality: "Dublin",
                    postalCode: "D6W",
                    country: "Ireland",
                    countryCode: "IE"
                }
            },
            {
                name: 'should parse Irish address with multiple lines and extra whitespace',
                input: "Belfield Office Park\nBeaver Row\nClonskeagh\nDublin 4\nIreland\n\n",
                locale: 'en-IE',
                expected: {
                    streetAddress: "Belfield Office Park, Beaver Row, Clonskeagh",
                    locality: "Dublin",
                    postalCode: "4",
                    country: "Ireland",
                    countryCode: "IE"
                }
            },
            {
                name: 'should parse Irish address in single line format with county',
                input: "Swords Business Campus, Balheary Road, Swords, County: Dublin, Ireland",
                locale: 'en-IE',
                expected: {
                    streetAddress: "Swords Business Campus, Balheary Road",
                    locality: "Swords",
                    region: "County: Dublin",
                    country: "Ireland",
                    countryCode: "IE"
                }
            },
            {
                name: 'should parse Irish address with superfluous whitespace',
                input: "\t\t\tSwords Business Campus\n\t\r Balheary Road\n\t\n\tSwords\   \t \t \t   County:    Dublin   \n\n\t Ireland  \n\n\n",
                locale: 'en-IE',
                expected: {
                    streetAddress: "Swords Business Campus, Balheary Road",
                    locality: "Swords",
                    region: "County: Dublin",
                    country: "Ireland",
                    countryCode: "IE"
                }
            },
            {
                name: 'should parse Irish address without delimiters',
                input: "Swords Business Campus Balheary Road Swords County: Dublin Ireland",
                locale: 'en-IE',
                expected: {
                    streetAddress: "Swords Business Campus Balheary Road",
                    locality: "Swords",
                    region: "County: Dublin",
                    country: "Ireland",
                    countryCode: "IE"
                }
            },
            {
                name: 'should parse Irish address with special characters (Irish language)',
                input: "Teach Ceilteach, Sráid Doire, Cill Iníon Léinín, Tamhlacht, Contae Átha Cliath, Éire",
                locale: 'en-IE',
                expected: {
                    streetAddress: "Teach Ceilteach, Sráid Doire, Cill Iníon Léinín",
                    locality: "Tamhlacht",
                    region: "Contae Átha Cliath",
                    country: "Éire",
                    countryCode: "IE"
                }
            },
            {
                name: 'should parse Irish address from German locale context',
                input: "Metro Park\nCloughfern Avenue\nNewtownabbey\nCo. Antrim\nIrland",
                locale: 'de-DE',
                expected: {
                    streetAddress: "Metro Park, Cloughfern Avenue",
                    locality: "Newtownabbey",
                    region: "Co. Antrim",
                    country: "Irland",
                    countryCode: "IE"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            
            if (expected.region !== undefined) {
                expect(parsedAddress.region).toBe(expected.region);
            } else {
                expect(parsedAddress.region).toBeUndefined();
            }
            
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
        test('should format Irish address with postal code', () => {
            const parsedAddress = new Address({
                streetAddress: "Gordon House, Barrow Street",
                locality: "Dublin",
                postalCode: "4",
                country: "Ireland",
                countryCode: "IE"
            }, { locale: 'en-IE' });

            const expected = "Gordon House, Barrow Street\nDublin 4\nIreland";
            const formatter = new AddressFmt({ locale: 'en-IE' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Irish address with county', () => {
            const parsedAddress = new Address({
                streetAddress: "Gordon House, Barrow Street",
                locality: "Galway",
                region: "County Galway",
                country: "Ireland",
                countryCode: "IE"
            }, { locale: 'en-IE' });

            const expected = "Gordon House, Barrow Street\nGalway\nCounty Galway\nIreland";
            const formatter = new AddressFmt({ locale: 'en-IE' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Irish address from French locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Gordon House, Barrow Street",
                locality: "Dublin",
                postalCode: "4",
                country: "Irlande",
                countryCode: "IE"
            }, { locale: 'fr-FR' });

            const expected = "Gordon House, Barrow Street\nDublin 4\nIrlande";
            const formatter = new AddressFmt({ locale: 'fr-FR' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 