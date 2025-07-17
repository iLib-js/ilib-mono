/*
 * address_UA.test.js - test the address parsing and formatting routines for Ukraine
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

describe('ilib-address Ukraine', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("uk-UA");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Ukrainian address',
                input: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5\nКИЇВ\n03127\nУКРАЇНА",
                options: { locale: 'uk-UA' },
                expected: {
                    streetAddress: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5",
                    locality: "КИЇВ",
                    region: undefined,
                    postalCode: "03127",
                    country: "УКРАЇНА",
                    countryCode: "UA"
                }
            },
            {
                name: 'should parse Ukrainian address without postal code',
                input: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5\nКИЇВ\nУКРАЇНА",
                options: { locale: 'uk-UA' },
                expected: {
                    streetAddress: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5",
                    locality: "КИЇВ",
                    region: undefined,
                    postalCode: undefined,
                    country: "УКРАЇНА",
                    countryCode: "UA"
                }
            },
            {
                name: 'should parse Ukrainian address without country',
                input: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5\nКИЇВ\n03127",
                options: { locale: 'uk-UA' },
                expected: {
                    streetAddress: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5",
                    locality: "КИЇВ",
                    region: undefined,
                    postalCode: "03127",
                    country: undefined,
                    countryCode: "UA"
                }
            },
            {
                name: 'should parse Ukrainian address with multiple lines',
                input: "Володимир Свідерський\nВУЛ ДУБІНІНА Володя 5\n\nКИЇВ\n\n03127\nУКРАЇНА\n\n\n",
                options: { locale: 'uk-UA' },
                expected: {
                    streetAddress: "Володимир Свідерський, ВУЛ ДУБІНІНА Володя 5",
                    locality: "КИЇВ",
                    region: undefined,
                    postalCode: "03127",
                    country: "УКРАЇНА",
                    countryCode: "UA"
                }
            },
            {
                name: 'should parse Ukrainian address in one line format',
                input: "Володимир Свідерський , ВУЛ ДУБІНІНА Володя 5 , КИЇВ , 03127 , УКРАЇНА",
                options: { locale: 'uk-UA' },
                expected: {
                    streetAddress: "Володимир Свідерський, ВУЛ ДУБІНІНА Володя 5",
                    locality: "КИЇВ",
                    region: undefined,
                    postalCode: "03127",
                    country: "УКРАЇНА",
                    countryCode: "UA"
                }
            },
            {
                name: 'should parse Ukrainian address with superfluous whitespace',
                input: "\t\t\tВолодимир Свідерський\n\t\t\rВУЛ ДУБІНІНА\t\t\rВолодя\t\t5\n\n\nКИЇВ\n\n03127\n\t УКРАЇНА\n\n\n",
                options: { locale: 'uk-UA' },
                expected: {
                    streetAddress: "Володимир Свідерський, ВУЛ ДУБІНІНА Володя 5",
                    locality: "КИЇВ",
                    region: undefined,
                    postalCode: "03127",
                    country: "УКРАЇНА",
                    countryCode: "UA"
                }
            },
            {
                name: 'should parse Ukrainian address without delimiters',
                input: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5 КИЇВ 03127 УКРАЇНА",
                options: { locale: 'uk-UA' },
                expected: {
                    streetAddress: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5",
                    locality: "КИЇВ",
                    region: undefined,
                    postalCode: "03127",
                    country: "УКРАЇНА",
                    countryCode: "UA"
                }
            },
            {
                name: 'should parse Ukrainian address from US locale',
                input: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5\nКИЇВ\n03127\nУКРАЇНА",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5",
                    locality: "КИЇВ",
                    region: undefined,
                    postalCode: "03127",
                    country: "УКРАЇНА",
                    countryCode: "UA"
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
                name: 'should format Ukrainian address in Ukrainian locale',
                address: {
                    streetAddress: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5",
                    locality: "КИЇВ",
                    postalCode: "03127",
                    country: "УКРАЇНА",
                    countryCode: "UA"
                },
                options: { locale: 'uk-UA' },
                expected: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5\nКИЇВ\n03127\nУКРАЇНА"
            },
            {
                name: 'should format Ukrainian address in US locale',
                address: {
                    streetAddress: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5",
                    locality: "КИЇВ",
                    postalCode: "03127",
                    country: "УКРАЇНА",
                    countryCode: "UA"
                },
                options: { locale: 'en-US' },
                expected: "Володимир Свідерський ВУЛ ДУБІНІНА Володя 5\nКИЇВ\n03127\nУКРАЇНА"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 