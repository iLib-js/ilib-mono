/*
 * address_MY.test.js - test the address parsing and formatting routines for Malaysia
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

describe('Address parsing and formatting for Malaysia', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-MY");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Malaysian address (Latin)',
                input: "11 Jalan Budi 1\nTaman Budiman\n42700 BANTING\nSELANGOR\nMalaysia",
                locale: 'en-MY',
                expected: {
                    streetAddress: "11 Jalan Budi 1, Taman Budiman",
                    locality: "BANTING",
                    region: "SELANGOR",
                    postalCode: "42700",
                    country: "Malaysia",
                    countryCode: "MY"
                }
            },
            {
                name: 'should parse Malaysian address without postal code (Latin)',
                input: "Capital Shipping Bhd, Lot 323, 1st Floor, Bintang Commercial Centre,29 Jalan Sekilau\nJOHOR BAHRU\nJohor\nMalaysia",
                locale: 'en-MY',
                expected: {
                    streetAddress: "Capital Shipping Bhd, Lot 323, 1st Floor, Bintang Commercial Centre, 29 Jalan Sekilau",
                    locality: "JOHOR BAHRU",
                    region: "Johor",
                    country: "Malaysia",
                    countryCode: "MY"
                }
            },
            {
                name: 'should parse Malaysian address without country (Latin)',
                input: "11 Jalan Budi 1\nTaman Budiman\n42700 BANTING\nSELANGOR",
                locale: 'en-MY',
                expected: {
                    streetAddress: "11 Jalan Budi 1, Taman Budiman",
                    locality: "BANTING",
                    region: "SELANGOR",
                    postalCode: "42700",
                    countryCode: "MY"
                }
            },
            {
                name: 'should parse Malaysian address with multiple lines (Latin)',
                input: "11 Jalan Budi 1\nTaman Budiman\n42700 BANTING\nSELANGOR\nMalaysia",
                locale: 'en-MY',
                expected: {
                    streetAddress: "11 Jalan Budi 1, Taman Budiman",
                    locality: "BANTING",
                    region: "SELANGOR",
                    postalCode: "42700",
                    country: "Malaysia",
                    countryCode: "MY"
                }
            },
            {
                name: 'should parse Malaysian address in single line format (Latin)',
                input: "Capital Shipping Bhd, Lot 323, 1st Floor, Bintang Commercial Centre,29 Jalan Sekilau,JOHOR BAHRU,Johor,Malaysia",
                locale: 'en-MY',
                expected: {
                    streetAddress: "Capital Shipping Bhd, Lot 323, 1st Floor, Bintang Commercial Centre, 29 Jalan Sekilau",
                    locality: "JOHOR BAHRU",
                    region: "Johor",
                    country: "Malaysia",
                    countryCode: "MY"
                }
            },
            {
                name: 'should parse Malaysian address with superfluous whitespace (Latin)',
                input: "\t\t\t11 Jalan Budi 1\t\t\r\n\t42700 BANTING\r\t SELANGOR\t\nMalaysia\r\t\n",
                locale: 'en-MY',
                expected: {
                    streetAddress: "11 Jalan Budi 1",
                    locality: "BANTING",
                    region: "SELANGOR",
                    postalCode: "42700",
                    country: "Malaysia",
                    countryCode: "MY"
                }
            },
            {
                name: 'should parse Malaysian address without delimiters (Latin)',
                input: "11 Jalan Budi 1 Taman Budiman 42700 BANTING SELANGOR Malaysia",
                locale: 'en-MY',
                expected: {
                    streetAddress: "11 Jalan Budi 1 Taman Budiman",
                    locality: "BANTING",
                    region: "SELANGOR",
                    postalCode: "42700",
                    country: "Malaysia",
                    countryCode: "MY"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            if (expected.region !== undefined) {
                expect(parsedAddress.region).toBe(expected.region);
            } else {
                expect(parsedAddress.region).toBeUndefined();
            }
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
        test('should format Malaysian address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "11 Jalan Budi 1, Taman Budiman",
                locality: "BANTING",
                postalCode: "42700",
                country: "Malaysia",
                countryCode: "MY",
                format: "latin"
            }, { locale: 'en-MY' });

            const expected = "11 Jalan Budi 1, Taman Budiman\nBANTING 42700\nMalaysia";
            const formatter = new AddressFmt({ locale: 'en-MY' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Malaysian address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "11 Jalan Budi 1, Taman Budiman",
                locality: "BANTING",
                postalCode: "42700",
                country: "Malaysia",
                countryCode: "MY",
                format: "latin"
            }, { locale: 'en-US' });

            const expected = "11 Jalan Budi 1, Taman Budiman\nBANTING 42700\nMalaysia";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 