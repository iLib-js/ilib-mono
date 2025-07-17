/*
 * address_LB.test.js - test the address parsing and formatting routines for Lebanon
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

describe('Address parsing and formatting for Lebanon', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("ar-LB");
        }
    });

    describe('Address parsing tests - French format', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Lebanese address in French format',
                input: "Banque du Liban, P.O. Box 11–5544, RIAD EL SOLH BEIRUT 1107 2810, Liban",
                locale: 'fr-LB',
                expected: {
                    streetAddress: "Banque du Liban, P.O. Box 11–5544",
                    locality: "RIAD EL SOLH BEIRUT",
                    postalCode: "1107 2810",
                    country: "Liban",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address without postal code in French format',
                input: "Banque du Liban, P.O. Box 11–5544, RIAD EL SOLH BEIRUT, Liban",
                locale: 'fr-LB',
                expected: {
                    streetAddress: "Banque du Liban, P.O. Box 11–5544",
                    locality: "RIAD EL SOLH BEIRUT",
                    country: "Liban",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address with multiple lines in French format',
                input: "Banque du Liban\nP.O. Box 11–5544\nRIAD EL SOLH BEIRUT 1107 2810\n Liban",
                locale: 'fr-LB',
                expected: {
                    streetAddress: "Banque du Liban, P.O. Box 11–5544",
                    locality: "RIAD EL SOLH BEIRUT",
                    postalCode: "1107 2810",
                    country: "Liban",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address in single line French format',
                input: "Banque du Liban, P.O. Box 11–5544,RIAD EL SOLH BEIRUT 1107 2810, Liban",
                locale: 'fr-LB',
                expected: {
                    streetAddress: "Banque du Liban, P.O. Box 11–5544",
                    locality: "RIAD EL SOLH BEIRUT",
                    postalCode: "1107 2810",
                    country: "Liban",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address with superfluous whitespace in French format',
                input: "Banque du Liban \n P.O. Box 11–5544\t\n\n  RIAD EL SOLH BEIRUT 1107 2810  \nLiban  \t\t\t",
                locale: 'fr-LB',
                expected: {
                    streetAddress: "Banque du Liban, P.O. Box 11–5544",
                    locality: "RIAD EL SOLH BEIRUT",
                    postalCode: "1107 2810",
                    country: "Liban",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address without delimiters in French format',
                input: "Banque du Liban 2  P.O. Box 11–5544 RIAD EL SOLH BEIRUT 1107 2810  Liban",
                locale: 'fr-LB',
                expected: {
                    streetAddress: "Banque du Liban 2 P.O. Box 11–5544",
                    locality: "RIAD EL SOLH BEIRUT",
                    postalCode: "1107 2810",
                    country: "Liban",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address with special characters in French format',
                input: "Banque du Liban,P.O. Box 11–5544,RIAD EL SOLH BEIRUT 1107 2810, Liban",
                locale: 'fr-LB',
                expected: {
                    streetAddress: "Banque du Liban, P.O. Box 11–5544",
                    locality: "RIAD EL SOLH BEIRUT",
                    postalCode: "1107 2810",
                    country: "Liban",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address from US locale context in French format',
                input: "Banque du Liban,P.O. Box 11–5544,RIAD EL SOLH BEIRUT 1107 2810, Lebanon",
                locale: 'en-US',
                expected: {
                    streetAddress: "Banque du Liban, P.O. Box 11–5544",
                    locality: "RIAD EL SOLH BEIRUT",
                    postalCode: "1107 2810",
                    country: "Lebanon",
                    countryCode: "LB"
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
            
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address parsing tests - Arabic format', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Lebanese address in Arabic format',
                input: "مركز الفرز بيروت, مطار بيروت الدولي, بيروت ١٠٠٠, لبنان",
                locale: 'ar-LB',
                expected: {
                    streetAddress: "مركز الفرز بيروت, مطار بيروت الدولي",
                    locality: "بيروت",
                    postalCode: "١٠٠٠",
                    country: "لبنان",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address without postal code in Arabic format',
                input: "مركز الفرز بيروت, مطار بيروت الدولي, بيروت , لبنان",
                locale: 'ar-LB',
                expected: {
                    streetAddress: "مركز الفرز بيروت, مطار بيروت الدولي",
                    locality: "بيروت",
                    country: "لبنان",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address with multiple lines in Arabic format',
                input: "مركز الفرز بيروت, مطار بيروت الدولي\nبيروت ١٠٠٠\n لبنان",
                locale: 'ar-LB',
                expected: {
                    streetAddress: "مركز الفرز بيروت, مطار بيروت الدولي",
                    locality: "بيروت",
                    postalCode: "١٠٠٠",
                    country: "لبنان",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address in single line Arabic format',
                input: "مركز الفرز بيروت, مطار بيروت الدولي,بيروت ١٠٠٠, لبنان",
                locale: 'ar-LB',
                expected: {
                    streetAddress: "مركز الفرز بيروت, مطار بيروت الدولي",
                    locality: "بيروت",
                    postalCode: "١٠٠٠",
                    country: "لبنان",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address with superfluous whitespace in Arabic format',
                input: "مركز الفرز بيروت, مطار بيروت الدولي   \n\t\n   بيروت ١٠٠٠  \n  \t\t\tلبنان",
                locale: 'ar-LB',
                expected: {
                    streetAddress: "مركز الفرز بيروت, مطار بيروت الدولي",
                    locality: "بيروت",
                    postalCode: "١٠٠٠",
                    country: "لبنان",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address with special characters in Arabic format',
                input: "مركز الفرز بيروت, مطار بيروت الدولي,بيروت ١٠٠٠, لبنان",
                locale: 'ar-LB',
                expected: {
                    streetAddress: "مركز الفرز بيروت, مطار بيروت الدولي",
                    locality: "بيروت",
                    postalCode: "١٠٠٠",
                    country: "لبنان",
                    countryCode: "LB"
                }
            },
            {
                name: 'should parse Lebanese address from US locale context in Arabic format',
                input: "مركز الفرز بيروت , مطار بيروت الدولي ,بيروت ١٠٠٠, Lebanon",
                locale: 'en-US',
                expected: {
                    streetAddress: "مركز الفرز بيروت, مطار بيروت الدولي",
                    locality: "بيروت",
                    postalCode: "١٠٠٠",
                    country: "Lebanon",
                    countryCode: "LB"
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
            
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Lebanese address in French format', () => {
            const parsedAddress = new Address({
                streetAddress: "Banque du Liban\nP.O. Box 11–5544",
                locality: "RIAD EL SOLH BEIRUT",
                country: "Liban",
                countryCode: "LB"
            }, { locale: 'fr-LB' });

            const expected = "Banque du Liban\nP.O. Box 11–5544\nRIAD EL SOLH BEIRUT\nLiban";
            const formatter = new AddressFmt({ locale: 'fr-LB' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Lebanese address from US locale context in French format', () => {
            const parsedAddress = new Address({
                streetAddress: "Banque du Liban\nP.O. Box 11–5544",
                locality: "RIAD EL SOLH BEIRUT",
                country: "Lebanon",
                countryCode: "LB"
            }, { locale: 'en-US' });

            const expected = "Banque du Liban\nP.O. Box 11–5544\nRIAD EL SOLH BEIRUT\nLebanon";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Lebanese address in Arabic format', () => {
            const parsedAddress = new Address({
                streetAddress: "مركز الفرز بيروت, مطار بيروت الدولي",
                locality: "لبنان",
                country: "لبنان",
                countryCode: "LB"
            }, { locale: 'ar-LB' });

            const expected = "مركز الفرز بيروت, مطار بيروت الدولي\nلبنان\nلبنان";
            const formatter = new AddressFmt({ locale: 'ar-LB' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Lebanese address from US locale context in Arabic format', () => {
            const parsedAddress = new Address({
                streetAddress: "مركز الفرز بيروت, مطار بيروت الدولي",
                locality: "لبنان",
                country: "Lebanon",
                countryCode: "LB"
            }, { locale: 'en-US' });

            const expected = "مركز الفرز بيروت, مطار بيروت الدولي\nلبنان\nLebanon";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 