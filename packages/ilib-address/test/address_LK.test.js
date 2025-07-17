/*
 * address_LK.test.js - test the address parsing and formatting routines for Sri Lanka
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

describe('Address parsing and formatting for Sri Lanka', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-LK");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Sri Lankan address',
                input: "Marvan Sangakkara 25/1, Cyril Jansz Mawatha\nPANADURA 12500\nSri Lanka",
                locale: 'en-LK',
                expected: {
                    streetAddress: "Marvan Sangakkara 25/1, Cyril Jansz Mawatha",
                    locality: "PANADURA",
                    postalCode: "12500",
                    country: "Sri Lanka",
                    countryCode: "LK"
                }
            },
            {
                name: 'should parse Sri Lankan address without postal code',
                input: "Marvan Sangakkara 25/1, Cyril Jansz Mawatha\nPANADURA\nSri Lanka",
                locale: 'en-LK',
                expected: {
                    streetAddress: "Marvan Sangakkara 25/1, Cyril Jansz Mawatha",
                    locality: "PANADURA",
                    country: "Sri Lanka",
                    countryCode: "LK"
                }
            },
            {
                name: 'should parse Sri Lankan address without country',
                input: "Marvan Sangakkara 25/1, Cyril Jansz Mawatha\nPANADURA 12500",
                locale: 'en-LK',
                expected: {
                    streetAddress: "Marvan Sangakkara 25/1, Cyril Jansz Mawatha",
                    locality: "PANADURA",
                    postalCode: "12500",
                    countryCode: "LK"
                }
            },
            {
                name: 'should parse Sri Lankan address with multiple lines',
                input: "Marvan Sangakkara\n25/1\nCyril Jansz\nMawatha\nPANADURA\n12500\nSri Lanka\n\n\n",
                locale: 'en-LK',
                expected: {
                    streetAddress: "Marvan Sangakkara, 25/1, Cyril Jansz, Mawatha",
                    locality: "PANADURA",
                    postalCode: "12500",
                    country: "Sri Lanka",
                    countryCode: "LK"
                }
            },
            {
                name: 'should parse Sri Lankan address in single line format',
                input: "Marvan Sangakkara , 25/1 , Cyril Jansz , Mawatha ,  PANADURA , 12500 , Sri Lanka",
                locale: 'en-LK',
                expected: {
                    streetAddress: "Marvan Sangakkara, 25/1, Cyril Jansz, Mawatha",
                    locality: "PANADURA",
                    postalCode: "12500",
                    country: "Sri Lanka",
                    countryCode: "LK"
                }
            },
            {
                name: 'should parse Sri Lankan address with superfluous whitespace',
                input: "\t\t\tMarvan Sangakkara\n\t\t\t25/1,\t\t\t\r\r Cyril Jansz \n \r \tMawatha \n\t\nPANADURA\n\t 12500\t\nSri Lanka\n\n\n",
                locale: 'en-LK',
                expected: {
                    streetAddress: "Marvan Sangakkara, 25/1, Cyril Jansz, Mawatha",
                    locality: "PANADURA",
                    postalCode: "12500",
                    country: "Sri Lanka",
                    countryCode: "LK"
                }
            },
            {
                name: 'should parse Sri Lankan address without delimiters',
                input: "Marvan Sangakkara 25/1 Cyril Jansz Mawatha\nPANADURA 12500 Sri Lanka",
                locale: 'en-LK',
                expected: {
                    streetAddress: "Marvan Sangakkara 25/1 Cyril Jansz Mawatha",
                    locality: "PANADURA",
                    postalCode: "12500",
                    country: "Sri Lanka",
                    countryCode: "LK"
                }
            },
            {
                name: 'should parse Sri Lankan address from US locale context',
                input: "Marvan Sangakkara 25/1, Cyril Jansz Mawatha\nPANADURA 56001\nSri Lanka",
                locale: 'en-US',
                expected: {
                    streetAddress: "Marvan Sangakkara 25/1, Cyril Jansz Mawatha",
                    locality: "PANADURA",
                    postalCode: "56001",
                    country: "Sri Lanka",
                    countryCode: "LK"
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
        test('should format Sri Lankan address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Marvan Sangakkara 25/1, Cyril Jansz Mawatha",
                locality: "PANADURA",
                postalCode: "56001",
                country: "Sri Lanka",
                countryCode: "LK"
            }, { locale: 'en-LK' });

            const expected = "Marvan Sangakkara 25/1, Cyril Jansz Mawatha\nPANADURA 56001\nSri Lanka";
            const formatter = new AddressFmt({ locale: 'en-LK' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Sri Lankan address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Marvan Sangakkara 25/1, Cyril Jansz Mawatha",
                locality: "PANADURA",
                postalCode: "56001",
                country: "Sri Lanka",
                countryCode: "LK"
            }, { locale: 'en-US' });

            const expected = "Marvan Sangakkara 25/1, Cyril Jansz Mawatha\nPANADURA 56001\nSri Lanka";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 