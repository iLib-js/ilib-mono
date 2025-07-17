/*
 * address_ZA.test.js - test the address parsing and formatting routines for South Africa
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

describe('ilib-address South Africa', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("en-ZA");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal South African address',
                input: "Customer Services 497 Jacob Mare Street\nPretoria 0001\nSouth Africa",
                options: { locale: 'en-ZA' },
                expected: {
                    streetAddress: "Customer Services 497 Jacob Mare Street",
                    locality: "Pretoria",
                    region: undefined,
                    postalCode: "0001",
                    country: "South Africa",
                    countryCode: "ZA"
                }
            },
            {
                name: 'should parse South African address without postal code',
                input: "Mr. J. Public 1234 Church Street Colloyn\nPRETORIA\nSOUTH AFRICA",
                options: { locale: 'en-ZA' },
                expected: {
                    streetAddress: "Mr. J. Public 1234 Church Street Colloyn",
                    locality: "PRETORIA",
                    region: undefined,
                    postalCode: undefined,
                    country: "SOUTH AFRICA",
                    countryCode: "ZA"
                }
            },
            {
                name: 'should parse South African address without country',
                input: "Customer Services 497 Jacob Mare Street\nPretoria 0001",
                options: { locale: 'en-ZA' },
                expected: {
                    streetAddress: "Customer Services 497 Jacob Mare Street",
                    locality: "Pretoria",
                    region: undefined,
                    postalCode: "0001",
                    country: undefined,
                    countryCode: "ZA"
                }
            },
            {
                name: 'should parse South African address with multiple lines',
                input: "Customer Services 497\nJacob Mare Street\nPretoria 0001\nSOUTH AFRICA\n\n\n",
                options: { locale: 'en-ZA' },
                expected: {
                    streetAddress: "Customer Services 497, Jacob Mare Street",
                    locality: "Pretoria",
                    region: undefined,
                    postalCode: "0001",
                    country: "SOUTH AFRICA",
                    countryCode: "ZA"
                }
            },
            {
                name: 'should parse South African address in one line format',
                input: "Customer Services 497 ,Jacob Mare Street , Pretoria 0001 , SOUTH AFRICA",
                options: { locale: 'en-ZA' },
                expected: {
                    streetAddress: "Customer Services 497, Jacob Mare Street",
                    locality: "Pretoria",
                    region: undefined,
                    postalCode: "0001",
                    country: "SOUTH AFRICA",
                    countryCode: "ZA"
                }
            },
            {
                name: 'should parse South African address without delimiters',
                input: "Customer Services 497 Jacob Mare Street Pretoria 0001 SOUTH AFRICA",
                options: { locale: 'en-ZA' },
                expected: {
                    streetAddress: "Customer Services 497 Jacob Mare Street",
                    locality: "Pretoria",
                    region: undefined,
                    postalCode: "0001",
                    country: "SOUTH AFRICA",
                    countryCode: "ZA"
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
                name: 'should format South African address',
                address: {
                    streetAddress: "Customer Services 497 Jacob Mare Street",
                    locality: "Pretoria",
                    region: null,
                    postalCode: "0001",
                    country: "SOUTH AFRICA",
                    countryCode: "ZA"
                },
                options: { locale: 'en-ZA' },
                expected: "Customer Services 497 Jacob Mare Street\nPretoria 0001\nSOUTH AFRICA"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 