/*
 * address_ID.test.js - test the address parsing and formatting routines for Indonesia
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

describe('Address parsing and formatting for Indonesia', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("id-ID");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Indonesian address with all components',
                input: "Gedung Balaikota DKI Jakarta, Jalan Medan Merdeka Selatan No. xx, Jakarta Selatan 10110,Jakarta,INDONESIA",
                locale: 'id-ID',
                expected: {
                    streetAddress: "Gedung Balaikota DKI Jakarta, Jalan Medan Merdeka Selatan No. xx",
                    region: "Jakarta",
                    locality: "Jakarta Selatan",
                    postalCode: "10110",
                    country: "INDONESIA",
                    countryCode: "ID"
                }
            },
            {
                name: 'should parse Indonesian address without postal code',
                input: "Gedung Balaikota DKI Jakarta,Jalan Medan Merdeka Selatan No. xx, Jakarta Selatan, INDONESIA",
                locale: 'id-ID',
                expected: {
                    streetAddress: "Gedung Balaikota DKI Jakarta, Jalan Medan Merdeka Selatan No. xx",
                    locality: "Jakarta Selatan",
                    country: "INDONESIA",
                    countryCode: "ID"
                }
            },
            {
                name: 'should parse Indonesian address with multiple lines',
                input: "Gedung Balaikota DKI Jakarta\nJalan Medan Merdeka Selatan No. xx\nJakarta Selatan 10110\nINDONESIA",
                locale: 'id-ID',
                expected: {
                    streetAddress: "Gedung Balaikota DKI Jakarta, Jalan Medan Merdeka Selatan No. xx",
                    locality: "Jakarta Selatan",
                    postalCode: "10110",
                    country: "INDONESIA",
                    countryCode: "ID"
                }
            },
            {
                name: 'should parse Indonesian address in single line format',
                input: "Gedung Balaikota DKI Jakarta,Jalan Medan Merdeka Selatan No. xx,Jakarta Selatan 10110 INDONESIA",
                locale: 'id-ID',
                expected: {
                    streetAddress: "Gedung Balaikota DKI Jakarta, Jalan Medan Merdeka Selatan No. xx",
                    locality: "Jakarta Selatan",
                    postalCode: "10110",
                    country: "INDONESIA",
                    countryCode: "ID"
                }
            },
            {
                name: 'should parse Indonesian address with superfluous whitespace',
                input: "Gedung Balaikota DKI Jakarta,Jalan Medan Merdeka Selatan No. xx   \n\t\n Jakarta Selatan 10110\t\n\n INDONESIA  \n  \t\t\t",
                locale: 'id-ID',
                expected: {
                    streetAddress: "Gedung Balaikota DKI Jakarta, Jalan Medan Merdeka Selatan No. xx",
                    locality: "Jakarta Selatan",
                    postalCode: "10110",
                    country: "INDONESIA",
                    countryCode: "ID"
                }
            },
            {
                name: 'should parse Indonesian address without delimiters',
                input: "Gedung Balaikota DKI Jakarta Jalan Medan Merdeka Selatan No. xx Jakarta Selatan 10110 INDONESIA",
                locale: 'id-ID',
                expected: {
                    streetAddress: "Gedung Balaikota DKI Jakarta Jalan Medan Merdeka Selatan No. xx",
                    locality: "Jakarta Selatan",
                    postalCode: "10110",
                    country: "INDONESIA",
                    countryCode: "ID"
                }
            },
            {
                name: 'should parse Indonesian address from US locale context',
                input: "Gedung Balaikota DKI Jakarta,Jalan Medan Merdeka Selatan No. xx,Jakarta Selatan 10110,INDONESIA",
                locale: 'en-US',
                expected: {
                    streetAddress: "Gedung Balaikota DKI Jakarta, Jalan Medan Merdeka Selatan No. xx",
                    locality: "Jakarta Selatan",
                    postalCode: "10110",
                    country: "INDONESIA",
                    countryCode: "ID"
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
            
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Indonesian address with all components', () => {
            const parsedAddress = new Address({
                streetAddress: "Gedung Balaikota DKI Jakarta,Jalan Medan Merdeka Selatan No. xx",
                locality: "Jakarta Selatan",
                postalCode: "10110",
                country: "INDONESIA",
                countryCode: "ID"
            }, { locale: 'id-ID' });

            const expected = "Gedung Balaikota DKI Jakarta,Jalan Medan Merdeka Selatan No. xx\nJakarta Selatan 10110\nINDONESIA";
            const formatter = new AddressFmt({ locale: 'id-ID' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Indonesian address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Gedung Balaikota DKI Jakarta,Jalan Medan Merdeka Selatan No. xx",
                postalCode: "10110",
                country: "Indonesia",
                countryCode: "ID"
            }, { locale: 'en-US' });

            const expected = "Gedung Balaikota DKI Jakarta,Jalan Medan Merdeka Selatan No. xx\n10110\nIndonesia";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 