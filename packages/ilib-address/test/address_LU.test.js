/*
 * address_LU.test.js - test the address parsing and formatting routines for Luxembourg
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

describe('Address parsing and formatting for Luxembourg', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("fr-LU");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Luxembourg address',
                input: "M. Andrée TROMMER BP 501\nL-1050 Luxembourg\nLUXEMBOURG",
                locale: 'fr-LU',
                expected: {
                    streetAddress: "M. Andrée TROMMER BP 501",
                    locality: "Luxembourg",
                    postalCode: "L-1050",
                    country: "LUXEMBOURG",
                    countryCode: "LU"
                }
            },
            {
                name: 'should parse another normal Luxembourg address',
                input: "M. Jacques Muller 71, route de Longwy\nL-4750 PETANGE\nLUXEMBOURG",
                locale: 'fr-LU',
                expected: {
                    streetAddress: "M. Jacques Muller 71, route de Longwy",
                    locality: "PETANGE",
                    postalCode: "L-4750",
                    country: "LUXEMBOURG",
                    countryCode: "LU"
                }
            },
            {
                name: 'should parse Luxembourg address without postal code',
                input: "M. Andrée TROMMER BP 5019\nLuxembourg\nLUXEMBOURG",
                locale: 'fr-LU',
                expected: {
                    streetAddress: "M. Andrée TROMMER BP 5019",
                    locality: "Luxembourg",
                    country: "LUXEMBOURG",
                    countryCode: "LU"
                }
            },
            {
                name: 'should parse Luxembourg address with multiple lines',
                input: "M. Jacques Muller 71\nroute\nde\nLongwy\nL-4750\nPETANGE\nLUXEMBOURG\n\n\n",
                locale: 'fr-LU',
                expected: {
                    streetAddress: "M. Jacques Muller 71, route, de, Longwy",
                    locality: "PETANGE",
                    postalCode: "L-4750",
                    country: "LUXEMBOURG",
                    countryCode: "LU"
                }
            },
            {
                name: 'should parse Luxembourg address in single line format',
                input: "M. Jacques Muller 71, route, de, Longwy, L-4750, PETANGE, LUXEMBOURG",
                locale: 'fr-LU',
                expected: {
                    streetAddress: "M. Jacques Muller 71, route, de, Longwy",
                    locality: "PETANGE",
                    postalCode: "L-4750",
                    country: "LUXEMBOURG",
                    countryCode: "LU"
                }
            },
            {
                name: 'should parse Luxembourg address with superfluous whitespace',
                input: "M. Jacques Muller 71\n\troute\n\tde\tLongwy\t\nL-4750\n\tPETANGE\n\tLUXEMBOURG\n\t",
                locale: 'fr-LU',
                expected: {
                    streetAddress: "M. Jacques Muller 71, route, de Longwy",
                    locality: "PETANGE",
                    postalCode: "L-4750",
                    country: "LUXEMBOURG",
                    countryCode: "LU"
                }
            },
            {
                name: 'should parse Luxembourg address without delimiters',
                input: "M. Andrée TROMMER BP 5019 L-1050 Luxembourg LUXEMBOURG",
                locale: 'fr-LU',
                expected: {
                    streetAddress: "M. Andrée TROMMER BP 5019",
                    locality: "Luxembourg",
                    postalCode: "L-1050",
                    country: "LUXEMBOURG",
                    countryCode: "LU"
                }
            },
            {
                name: 'should parse Luxembourg address from US locale context',
                input: "M. Andrée TROMMER BP 501\nL-1050 Luxembourg\nLUXEMBOURG",
                locale: 'en-US',
                expected: {
                    streetAddress: "M. Andrée TROMMER BP 501",
                    locality: "Luxembourg",
                    postalCode: "L-1050",
                    country: "LUXEMBOURG",
                    countryCode: "LU"
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
        test('should format Luxembourg address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "M. Andrée TROMMER BP 5019",
                locality: "Luxembourg",
                postalCode: "L-1050",
                country: "LUXEMBOURG",
                countryCode: "LU"
            }, { locale: 'fr-LU' });

            const expected = "M. Andrée TROMMER BP 5019\nL-1050 Luxembourg\nLUXEMBOURG";
            const formatter = new AddressFmt({ locale: 'fr-LU' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Luxembourg address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "M. Andrée TROMMER BP 5019",
                locality: "Luxembourg",
                postalCode: "L-1050",
                country: "LUXEMBOURG",
                countryCode: "LU"
            }, { locale: 'en-US' });

            const expected = "M. Andrée TROMMER BP 5019\nL-1050 Luxembourg\nLUXEMBOURG";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 