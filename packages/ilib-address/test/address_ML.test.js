/*
 * address_ML.test.js - Mali address parsing and formatting tests for ilib-address
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

describe('address_ML', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("fr-ML");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Mali address with all components',
                address: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou\nBAMAKO\nMALI",
                locale: 'fr-ML',
                expected: {
                    streetAddress: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou",
                    locality: "BAMAKO",
                    region: undefined,
                    postalCode: undefined,
                    country: "MALI",
                    countryCode: "ML"
                }
            },
            {
                name: 'should parse Mali address without postal code',
                address: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou\nBAMAKO\nMALI",
                locale: 'fr-ML',
                expected: {
                    streetAddress: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou",
                    locality: "BAMAKO",
                    region: undefined,
                    postalCode: undefined,
                    country: "MALI",
                    countryCode: "ML"
                }
            },
            {
                name: 'should parse Mali address without country name',
                address: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou\nBAMAKO",
                locale: 'fr-ML',
                expected: {
                    streetAddress: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou",
                    locality: "BAMAKO",
                    region: undefined,
                    postalCode: undefined,
                    country: undefined,
                    countryCode: "ML"
                }
            },
            {
                name: 'should parse Mali address with multiple lines and extra whitespace',
                address: "M. Kalilou Sissoko Rue\n406 - Porte 39\nMagnabougou\n\n\nBAMAKO\n\n\nMALI\n\n\n",
                locale: 'fr-ML',
                expected: {
                    streetAddress: "M. Kalilou Sissoko Rue, 406 - Porte 39, Magnabougou",
                    locality: "BAMAKO",
                    region: undefined,
                    postalCode: undefined,
                    country: "MALI",
                    countryCode: "ML"
                }
            },
            {
                name: 'should parse Mali address in single line format',
                address: "M. Kalilou Sissoko Rue , 406 - Porte 39 , Magnabougou , BAMAKO , MALI",
                locale: 'fr-ML',
                expected: {
                    streetAddress: "M. Kalilou Sissoko Rue, 406 - Porte 39, Magnabougou",
                    locality: "BAMAKO",
                    region: undefined,
                    postalCode: undefined,
                    country: "MALI",
                    countryCode: "ML"
                }
            },
            {
                name: 'should parse Mali address with superfluous whitespace',
                address: "\t\t\tM. Kalilou Sissoko Rue\t\t\r406 - Porte 39\t\t\rMagnabougou\n\n\n\nBAMAKO\n\t MALI\n\n\n",
                locale: 'fr-ML',
                expected: {
                    streetAddress: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou",
                    locality: "BAMAKO",
                    region: undefined,
                    postalCode: undefined,
                    country: "MALI",
                    countryCode: "ML"
                }
            },
            {
                name: 'should parse Mali address without delimiters',
                address: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou BAMAKO MALI",
                locale: 'fr-ML',
                expected: {
                    streetAddress: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou",
                    locality: "BAMAKO",
                    region: undefined,
                    postalCode: undefined,
                    country: "MALI",
                    countryCode: "ML"
                }
            },
            {
                name: 'should parse Mali address from US locale',
                address: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou\nBAMAKO\nMALI",
                locale: 'en-US',
                expected: {
                    streetAddress: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou",
                    locality: "BAMAKO",
                    region: undefined,
                    postalCode: undefined,
                    country: "MALI",
                    countryCode: "ML"
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
                name: 'should format Mali address in French locale',
                address: {
                    streetAddress: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou",
                    locality: "BAMAKO",
                    country: "MALI",
                    countryCode: "ML"
                },
                locale: 'fr-ML',
                expected: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou\nBAMAKO\nMALI"
            },
            {
                name: 'should format Mali address in US locale',
                address: {
                    streetAddress: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou",
                    locality: "BAMAKO",
                    country: "MALI",
                    countryCode: "ML"
                },
                locale: 'en-US',
                expected: "M. Kalilou Sissoko Rue 406 - Porte 39 Magnabougou\nBAMAKO\nMALI"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 