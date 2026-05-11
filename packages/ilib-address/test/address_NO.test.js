/*
 * address_NO.test.js - test the address parsing and formatting routines for Norway
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

describe('Address parsing and formatting for Norway', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("nb-NO");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Norwegian address',
                input: "Norwegian Post and Telecommunications Authority\nPostboks 447 Sentrum\n0104 Trondheim\nNORWAY",
                locale: 'nb-NO',
                expected: {
                    streetAddress: "Norwegian Post and Telecommunications Authority, Postboks 447 Sentrum",
                    locality: "Trondheim",
                    postalCode: "0104",
                    country: "NORWAY",
                    countryCode: "NO"
                }
            },
            {
                name: 'should parse Norwegian address without postal code',
                input: "Norwegian Post and Telecommunications Authority\nBorgartun 34\nTrondheim",
                locale: 'nb-NO',
                expected: {
                    streetAddress: "Norwegian Post and Telecommunications Authority, Borgartun 34",
                    locality: "Trondheim",
                    countryCode: "NO"
                }
            },
            {
                name: 'should parse Norwegian address without country',
                input: "Storgata 6\nNO-7321 Trondheim",
                locale: 'nb-NO',
                expected: {
                    streetAddress: "Storgata 6",
                    locality: "Trondheim",
                    postalCode: "NO-7321",
                    countryCode: "NO"
                }
            },
            {
                name: 'should parse Norwegian address with multiple lines',
                input: "Stine Hansendd\nLeilighet 425\nStorgata 6\nNO-7321 Trondheim\nNORWAY",
                locale: 'nb-NO',
                expected: {
                    streetAddress: "Stine Hansendd, Leilighet 425, Storgata 6",
                    locality: "Trondheim",
                    postalCode: "NO-7321",
                    country: "NORWAY",
                    countryCode: "NO"
                }
            },
            {
                name: 'should parse Norwegian address in single line format',
                input: "Stine Hansendd, Leilighet 425, Storgata 634, NO-7321 Trondheim,NORWAY",
                locale: 'nb-NO',
                expected: {
                    streetAddress: "Stine Hansendd, Leilighet 425, Storgata 634",
                    locality: "Trondheim",
                    postalCode: "NO-7321",
                    country: "NORWAY",
                    countryCode: "NO"
                }
            },
            {
                name: 'should parse Norwegian address with superfluous whitespace',
                input: "\t\t\tStine Hansendd\n\t\t\tLeilighet 425, \t\t\t\r\r Storgata 634, \n\t\nNO-7321 Trondheim\t\n\t \n\nNORWAY\n",
                locale: 'nb-NO',
                expected: {
                    streetAddress: "Stine Hansendd, Leilighet 425, Storgata 634",
                    locality: "Trondheim",
                    postalCode: "NO-7321",
                    country: "NORWAY",
                    countryCode: "NO"
                }
            },
            {
                name: 'should parse Norwegian address without delimiters',
                input: "Stine Hansendd Leilighet 425 Storgata 634 NO-7321 Trondheim NORWAY",
                locale: 'nb-NO',
                expected: {
                    streetAddress: "Stine Hansendd Leilighet 425 Storgata 634",
                    locality: "Trondheim",
                    postalCode: "NO-7321",
                    country: "NORWAY",
                    countryCode: "NO"
                }
            },
            {
                name: 'should parse Norwegian address from US locale context',
                input: "Norwegian Post and Telecommunications Authority\nBorgartun 34\n0104 Trondheim\nNorway",
                locale: 'en-US',
                expected: {
                    streetAddress: "Norwegian Post and Telecommunications Authority, Borgartun 34",
                    locality: "Trondheim",
                    postalCode: "0104",
                    country: "Norway",
                    countryCode: "NO"
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
        test('should format Norwegian address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Norwegian Post and Telecommunications Authority, Borgartun 34",
                locality: "Trondheim",
                postalCode: "0104",
                country: "NORWAY",
                countryCode: "NO"
            }, { locale: 'nb-NO' });

            const expected = "Norwegian Post and Telecommunications Authority, Borgartun 34\n0104 Trondheim\nNORWAY";
            const formatter = new AddressFmt({ locale: 'nb-NO' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Norwegian address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Norwegian Post and Telecommunications Authority, Borgartun 34",
                locality: "Trondheim",
                postalCode: "0104",
                country: "Norway",
                countryCode: "NO"
            }, { locale: 'en-US' });

            const expected = "Norwegian Post and Telecommunications Authority, Borgartun 34\n0104 Trondheim\nNorway";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 