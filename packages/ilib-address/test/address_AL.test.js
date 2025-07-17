/*
 * address_AL.test.js - Albania address parsing and formatting tests for ilib-address
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

describe('address_AL', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("sq-AL");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Albania address with all components',
                address: "Rr 'Aleksander Moisiu', P. 15, Sh. 1, 1001-TIRANE, ALBANIA",
                locale: 'sq-AL',
                expected: {
                    streetAddress: "Rr 'Aleksander Moisiu', P. 15, Sh. 1",
                    locality: "TIRANE",
                    region: undefined,
                    postalCode: "1001",
                    country: "ALBANIA",
                    countryCode: "AL"
                }
            },
            {
                name: 'should parse Albania address without postal code',
                address: "Rr 'Aleksander Moisiu', P. 15, Sh. 1, TIRANE, ALBANIA",
                locale: 'sq-AL',
                expected: {
                    streetAddress: "Rr 'Aleksander Moisiu', P. 15, Sh. 1",
                    locality: "TIRANE",
                    region: undefined,
                    postalCode: undefined,
                    country: "ALBANIA",
                    countryCode: "AL"
                }
            },
            {
                name: 'should parse Albania address with multiple lines',
                address: "Rr 'Aleksander Moisiu'\nP. 15, Sh. 1\n1001-TIRANE\nALBANIA",
                locale: 'sq-AL',
                expected: {
                    streetAddress: "Rr 'Aleksander Moisiu', P. 15, Sh. 1",
                    locality: "TIRANE",
                    region: undefined,
                    postalCode: "1001",
                    country: "ALBANIA",
                    countryCode: "AL"
                }
            },
            {
                name: 'should parse Albania address in single line format',
                address: "Rr 'Aleksander Moisiu', P. 15, Sh. 1, 1001-TIRANE, ALBANIA",
                locale: 'sq-AL',
                expected: {
                    streetAddress: "Rr 'Aleksander Moisiu', P. 15, Sh. 1",
                    locality: "TIRANE",
                    region: undefined,
                    postalCode: "1001",
                    country: "ALBANIA",
                    countryCode: "AL"
                }
            },
            {
                name: 'should parse Albania address with superfluous whitespace',
                address: "Rr 'Aleksander Moisiu', P. 15, Sh. 1  \n\t\n 1001-TIRANE\t\n\n ALBANIA  \n  \t\t\t",
                locale: 'sq-AL',
                expected: {
                    streetAddress: "Rr 'Aleksander Moisiu', P. 15, Sh. 1",
                    locality: "TIRANE",
                    region: undefined,
                    postalCode: "1001",
                    country: "ALBANIA",
                    countryCode: "AL"
                }
            },
            {
                name: 'should parse Albania address without delimiters',
                address: "Rr 'Aleksander Moisiu' P. 15 Sh. 1 1001-TIRANE ALBANIA",
                locale: 'sq-AL',
                expected: {
                    streetAddress: "Rr 'Aleksander Moisiu' P. 15 Sh. 1",
                    locality: "TIRANE",
                    region: undefined,
                    postalCode: "1001",
                    country: "ALBANIA",
                    countryCode: "AL"
                }
            },
            {
                name: 'should parse Albania address with special characters',
                address: "Rr 'Aleksander Moisiu', P. 15, Sh. 1, 1001-TIRANE, ALBANIA",
                locale: 'sq-AL',
                expected: {
                    streetAddress: "Rr 'Aleksander Moisiu', P. 15, Sh. 1",
                    locality: "TIRANE",
                    region: undefined,
                    postalCode: "1001",
                    country: "ALBANIA",
                    countryCode: "AL"
                }
            },
            {
                name: 'should parse Albania address from US locale',
                address: "Rr 'Aleksander Moisiu', P. 15, Sh. 1, 1001-TIRANE, ALBANIA",
                locale: 'en-US',
                expected: {
                    streetAddress: "Rr 'Aleksander Moisiu', P. 15, Sh. 1",
                    locality: "TIRANE",
                    region: undefined,
                    postalCode: "1001",
                    country: "ALBANIA",
                    countryCode: "AL"
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
                name: 'should format Albania address in Albanian locale',
                address: {
                    streetAddress: "Rr 'Aleksander Moisiu', P. 15, Sh. 1",
                    locality: "TIRANE",
                    postalCode: "1001",
                    country: "ALBANIA",
                    countryCode: "AL"
                },
                locale: 'sq-AL',
                expected: "Rr 'Aleksander Moisiu', P. 15, Sh. 1\n1001-TIRANE\nALBANIA"
            },
            {
                name: 'should format Albania address in US locale',
                address: {
                    streetAddress: "Rr 'Aleksander Moisiu', P. 15, Sh. 1",
                    postalCode: "1001",
                    locality: "TIRANE",
                    country: "ALBANIA",
                    countryCode: "AL"
                },
                locale: 'en-US',
                expected: "Rr 'Aleksander Moisiu', P. 15, Sh. 1\n1001-TIRANE\nALBANIA"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 