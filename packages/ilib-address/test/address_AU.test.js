/*
 * address_AU.test.js - test the address parsing and formatting routines for Australia
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

describe('ilib-address Australia', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("en-AU");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Australian address',
                input: "Level 5, 48 Pirrama Road,\nPyrmont, NSW 2009\nAustralia",
                options: { locale: 'en-AU' },
                expected: {
                    streetAddress: "Level 5, 48 Pirrama Road",
                    locality: "Pyrmont",
                    region: "NSW",
                    postalCode: "2009",
                    country: "Australia",
                    countryCode: "AU"
                }
            },
            {
                name: 'should parse Australian address without postal code',
                input: "Canberra Nara Centre,\n1 Constitution Ave\nCanberra City, Australia",
                options: { locale: 'en-AU' },
                expected: {
                    streetAddress: "Canberra Nara Centre, 1 Constitution Ave",
                    locality: "Canberra City",
                    region: undefined,
                    postalCode: undefined,
                    country: "Australia",
                    countryCode: "AU"
                }
            },
            {
                name: 'should parse Australian address without country',
                input: "Trevarrick Rd\nSevenhill SA 5453",
                options: { locale: 'en-AU' },
                expected: {
                    streetAddress: "Trevarrick Rd",
                    locality: "Sevenhill",
                    region: "SA",
                    postalCode: "5453",
                    country: undefined,
                    countryCode: "AU"
                }
            },
            {
                name: 'should parse Australian address with multiple lines',
                input: "Dept of Treasury\nLangton Crs\nParkes\nACT 2600\nAustralia\n\n\n",
                options: { locale: 'en-AU' },
                expected: {
                    streetAddress: "Dept of Treasury, Langton Crs",
                    locality: "Parkes",
                    region: "ACT",
                    postalCode: "2600",
                    country: "Australia",
                    countryCode: "AU"
                }
            },
            {
                name: 'should parse Australian address in one line format',
                input: "630 Beaufort St, Mt Lawley, WA 6050, Australia",
                options: { locale: 'en-AU' },
                expected: {
                    streetAddress: "630 Beaufort St",
                    locality: "Mt Lawley",
                    region: "WA",
                    postalCode: "6050",
                    country: "Australia",
                    countryCode: "AU"
                }
            },
            {
                name: 'should parse Australian address with superfluous whitespace',
                input: "\t\t\tPiccadilly\t\t\r  Lot 6B Spring \r\r\tGully Rd\nPiccadilly \n\t\rSA \r\t\n5151\nAustralia    \n\n\n",
                options: { locale: 'en-AU' },
                expected: {
                    streetAddress: "Piccadilly Lot 6B Spring Gully Rd",
                    locality: "Piccadilly",
                    region: "SA",
                    postalCode: "5151",
                    country: "Australia",
                    countryCode: "AU"
                }
            },
            {
                name: 'should parse Australian address without delimiters',
                input: "630 Beaufort St Mt Lawley WA 6050 Australia",
                options: { locale: 'en-AU' },
                expected: {
                    streetAddress: "630 Beaufort St",
                    locality: "Mt Lawley",
                    region: "WA",
                    postalCode: "6050",
                    country: "Australia",
                    countryCode: "AU"
                }
            },
            {
                name: 'should parse Australian address from US locale',
                input: "Shp1/ Wanneroo Rd\nLandsdale WA 6065\nAustralia",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Shp1/ Wanneroo Rd",
                    locality: "Landsdale",
                    region: "WA",
                    postalCode: "6065",
                    country: "Australia",
                    countryCode: "AU"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, options, expected }) => {
            const parsedAddress = new Address(input, options);
            
            expect(parsedAddress).toBeDefined();
            
            if (expected.streetAddress !== undefined) {
                expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            }
            if (expected.locality !== undefined) {
                expect(parsedAddress.locality).toBe(expected.locality);
            }
            if (expected.region !== undefined) {
                expect(parsedAddress.region).toBe(expected.region);
            }
            if (expected.postalCode !== undefined) {
                expect(parsedAddress.postalCode).toBe(expected.postalCode);
            }
            if (expected.country !== undefined) {
                expect(parsedAddress.country).toBe(expected.country);
            }
            if (expected.countryCode !== undefined) {
                expect(parsedAddress.countryCode).toBe(expected.countryCode);
            }
        });
    });

    describe('Address formatting', () => {
        const formatTestCases = [
            {
                name: 'should format Australian address in Australian locale',
                address: {
                    streetAddress: "Shp1/ Wanneroo Rd",
                    locality: "Landsdale",
                    region: "WA",
                    postalCode: "6065",
                    country: "Australia",
                    countryCode: "AU"
                },
                options: { locale: 'en-AU' },
                expected: "Shp1/ Wanneroo Rd\nLandsdale WA 6065\nAustralia"
            },
            {
                name: 'should format Australian address in US locale',
                address: {
                    streetAddress: "Shp1/ Wanneroo Rd",
                    locality: "Landsdale",
                    region: "WA",
                    postalCode: "6065",
                    country: "Australia",
                    countryCode: "AU"
                },
                options: { locale: 'en-US' },
                expected: "Shp1/ Wanneroo Rd\nLandsdale WA 6065\nAustralia"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 