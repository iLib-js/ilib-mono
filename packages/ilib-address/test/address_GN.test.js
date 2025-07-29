/*
 * address_GN.test.js - Guinea address parsing and formatting tests for ilib-address
 *
 * Copyright © 2013-2015, 2017, 2022, 2025 JEDLSoft
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

describe('address_GN', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("fr-GN");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Guinea address with all components',
                address: "Office de la poste guinéenne Direction générale 001 BP 2984 CONAKRY\nguinée",
                locale: 'fr-GN',
                expected: {
                    streetAddress: "Office de la poste guinéenne Direction générale 001 BP 2984",
                    locality: undefined,
                    region: "CONAKRY",
                    postalCode: undefined,
                    country: "guinée",
                    countryCode: "GN"
                }
            },
            {
                name: 'should parse Guinea address without postal code',
                address: "Office de la poste guinéenne Direction générale 001 BP 2984\nCONAKRY\nguinée",
                locale: 'fr-GN',
                expected: {
                    streetAddress: "Office de la poste guinéenne Direction générale 001 BP 2984",
                    locality: undefined,
                    region: "CONAKRY",
                    postalCode: undefined,
                    country: "guinée",
                    countryCode: "GN"
                }
            },
            {
                name: 'should parse Guinea address without country name',
                address: "Office de la poste guinéenne Direction générale 001 BP 2984\nCONAKRY",
                locale: 'fr-GN',
                expected: {
                    streetAddress: "Office de la poste guinéenne Direction générale 001 BP 2984",
                    locality: undefined,
                    region: "CONAKRY",
                    postalCode: undefined,
                    country: undefined,
                    countryCode: "GN"
                }
            },
            {
                name: 'should parse Guinea address with multiple lines',
                address: "Office de la poste guinéenne\nDirection générale\n001 BP 2984\nCONAKRY\nguinée",
                locale: 'fr-GN',
                expected: {
                    streetAddress: "Office de la poste guinéenne, Direction générale, 001 BP 2984",
                    locality: undefined,
                    region: "CONAKRY",
                    postalCode: undefined,
                    country: "guinée",
                    countryCode: "GN"
                }
            },
            {
                name: 'should parse Guinea address in single line format',
                address: "Office de la poste guinéenne , Direction générale , 001 BP 2984 , CONAKRY , guinée",
                locale: 'fr-GN',
                expected: {
                    streetAddress: "Office de la poste guinéenne, Direction générale, 001 BP 2984",
                    locality: undefined,
                    region: "CONAKRY",
                    postalCode: undefined,
                    country: "guinée",
                    countryCode: "GN"
                }
            },
            {
                name: 'should parse Guinea address with superfluous whitespace',
                address: "Office de la poste guinéenne\n\n\t\r\t\t\rDirection générale\r\r\t001 BP 2984\r\r\n\nCONAKRY\t\r\n\t\rguinée",
                locale: 'fr-GN',
                expected: {
                    streetAddress: "Office de la poste guinéenne, Direction générale 001 BP 2984",
                    locality: undefined,
                    region: "CONAKRY",
                    postalCode: undefined,
                    country: "guinée",
                    countryCode: "GN"
                }
            },
            {
                name: 'should parse Guinea address without delimiters',
                address: "Office de la poste guinéenne Direction générale 001 BP 2984 CONAKRY guinée",
                locale: 'fr-GN',
                expected: {
                    streetAddress: "Office de la poste guinéenne Direction générale 001 BP 2984",
                    locality: undefined,
                    region: "CONAKRY",
                    postalCode: undefined,
                    country: "guinée",
                    countryCode: "GN"
                }
            },
            {
                name: 'should parse Guinea address from US locale',
                address: "Office de la poste guinéenne Direction générale 001 BP 2984\nCONAKRY\nguinée",
                locale: 'fr-GN',
                expected: {
                    streetAddress: "Office de la poste guinéenne Direction générale 001 BP 2984",
                    locality: undefined,
                    region: "CONAKRY",
                    postalCode: undefined,
                    country: "guinée",
                    countryCode: "GN"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting', () => {
        const testCases = [
            {
                name: 'should format Guinea address in French locale',
                address: {
                    streetAddress: "Office de la poste guinéenne Direction générale 001 BP 2984",
                    region: "CONAKRY",
                    postalCode: "1010",
                    country: "guinée",
                    countryCode: "GN"
                },
                locale: 'fr-GN',
                expected: "Office de la poste guinéenne Direction générale 001 BP 2984 CONAKRY\nguinée"
            },
            {
                name: 'should format Guinea address in US locale',
                address: {
                    streetAddress: "Office de la poste guinéenne Direction générale 001 BP 2984",
                    region: "CONAKRY",
                    postalCode: "1010",
                    country: "guinée",
                    countryCode: "GN"
                },
                locale: 'fr-GN',
                expected: "Office de la poste guinéenne Direction générale 001 BP 2984 CONAKRY\nguinée"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 