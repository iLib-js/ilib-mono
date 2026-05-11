/*
 * address_LR.test.js - test the address parsing and formatting routines for Liberia
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

describe('Address parsing and formatting for Liberia', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("en-LR");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Liberian address',
                input: "Ministry of Posts and Telecommunications Postal Operations GPO\n1000 MONROVIA 10\nLiberia",
                locale: 'en-LR',
                expected: {
                    streetAddress: "Ministry of Posts and Telecommunications Postal Operations GPO",
                    locality: "MONROVIA 10",
                    postalCode: "1000",
                    country: "Liberia",
                    countryCode: "LR"
                }
            },
            {
                name: 'should parse Liberian address without postal code',
                input: "Ministry of Posts and Telecommunications Postal Operations GPO\nMONROVIA 10\nLiberia",
                locale: 'en-LR',
                expected: {
                    streetAddress: "Ministry of Posts and Telecommunications Postal Operations GPO",
                    locality: "MONROVIA 10",
                    country: "Liberia",
                    countryCode: "LR"
                }
            },
            {
                name: 'should parse Liberian address without country',
                input: "Ministry of Posts and Telecommunications Postal Operations GPO\n1000 MONROVIA 10",
                locale: 'en-LR',
                expected: {
                    streetAddress: "Ministry of Posts and Telecommunications Postal Operations GPO",
                    locality: "MONROVIA 10",
                    postalCode: "1000",
                    countryCode: "LR"
                }
            },
            {
                name: 'should parse Liberian address with multiple lines',
                input: "Ministry of Posts and Telecommunications\nPostal Operations\nGPO\n\n1000\n\nMONROVIA 10\n\n\nLiberia\n\n\n",
                locale: 'en-LR',
                expected: {
                    streetAddress: "Ministry of Posts and Telecommunications, Postal Operations, GPO",
                    locality: "MONROVIA 10",
                    postalCode: "1000",
                    country: "Liberia",
                    countryCode: "LR"
                }
            },
            {
                name: 'should parse Liberian address in single line format',
                input: "Ministry of Posts and Telecommunications , Postal Operations , GPO , 1000 , MONROVIA 10 , Liberia",
                locale: 'en-LR',
                expected: {
                    streetAddress: "Ministry of Posts and Telecommunications, Postal Operations, GPO",
                    locality: "MONROVIA 10",
                    postalCode: "1000",
                    country: "Liberia",
                    countryCode: "LR"
                }
            },
            {
                name: 'should parse Liberian address with superfluous whitespace',
                input: "\t\t\tMinistry of Posts and Telecommunications\t\t\rPostal Operations\t\t\rGPO\n\n1000\n\nMONROVIA 10\n\t Liberia\n\n\n",
                locale: 'en-LR',
                expected: {
                    streetAddress: "Ministry of Posts and Telecommunications Postal Operations GPO",
                    locality: "MONROVIA 10",
                    postalCode: "1000",
                    country: "Liberia",
                    countryCode: "LR"
                }
            },
            {
                name: 'should parse Liberian address without delimiters',
                input: "Ministry of Posts and Telecommunications Postal Operations GPO 1000 MONROVIA 10 Liberia",
                locale: 'en-LR',
                expected: {
                    streetAddress: "Ministry of Posts and Telecommunications Postal Operations GPO",
                    locality: "MONROVIA 10",
                    postalCode: "1000",
                    country: "Liberia",
                    countryCode: "LR"
                }
            },
            {
                name: 'should parse Liberian address from US locale context',
                input: "Ministry of Posts and Telecommunications Postal Operations GPO\n1000 MONROVIA 10\nLiberia",
                locale: 'en-US',
                expected: {
                    streetAddress: "Ministry of Posts and Telecommunications Postal Operations GPO",
                    locality: "MONROVIA 10",
                    postalCode: "1000",
                    country: "Liberia",
                    countryCode: "LR"
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
        test('should format Liberian address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Ministry of Posts and Telecommunications Postal Operations GPO",
                locality: "MONROVIA 10",
                postalCode: "1000",
                country: "Liberia",
                countryCode: "LR"
            }, { locale: 'en-LR' });

            const expected = "Ministry of Posts and Telecommunications Postal Operations GPO\n1000 MONROVIA 10\nLiberia";
            const formatter = new AddressFmt({ locale: 'en-LR' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Liberian address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Ministry of Posts and Telecommunications Postal Operations GPO",
                locality: "MONROVIA 10",
                postalCode: "1000",
                country: "Liberia",
                countryCode: "LR"
            }, { locale: 'en-US' });

            const expected = "Ministry of Posts and Telecommunications Postal Operations GPO\n1000 MONROVIA 10\nLiberia";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 