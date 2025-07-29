/*
 * address_MK.test.js - test the address parsing and formatting routines for Macedonia
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

describe('Address parsing and formatting for Macedonia', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("mk-MK");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Macedonian address',
                input: "Сања Јанчевски ГРАДСКИ ПАЗАР 5\n6000 ОХРИД\nМАКЕДОНИЈА",
                locale: 'mk-MK',
                expected: {
                    streetAddress: "Сања Јанчевски ГРАДСКИ ПАЗАР 5",
                    locality: "ОХРИД",
                    postalCode: "6000",
                    country: "МАКЕДОНИЈА",
                    countryCode: "MK"
                }
            },
            {
                name: 'should parse Macedonian address without postal code',
                input: "Сања Јанчевски ГРАДСКИ ПАЗАР 5\nОХРИД\nМАКЕДОНИЈА",
                locale: 'mk-MK',
                expected: {
                    streetAddress: "Сања Јанчевски ГРАДСКИ ПАЗАР 5",
                    locality: "ОХРИД",
                    country: "МАКЕДОНИЈА",
                    countryCode: "MK"
                }
            },
            {
                name: 'should parse Macedonian address without country',
                input: "Сања Јанчевски ГРАДСКИ ПАЗАР 5\n6000 ОХРИД",
                locale: 'mk-MK',
                expected: {
                    streetAddress: "Сања Јанчевски ГРАДСКИ ПАЗАР 5",
                    locality: "ОХРИД",
                    postalCode: "6000",
                    countryCode: "MK"
                }
            },
            {
                name: 'should parse Macedonian address with multiple lines',
                input: "Сања Јанчевски\nГРАДСКИ\nПАЗАР 5\n\n6000\n\nОХРИД\n\n\nМАКЕДОНИЈА\n\n\n",
                locale: 'mk-MK',
                expected: {
                    streetAddress: "Сања Јанчевски, ГРАДСКИ, ПАЗАР 5",
                    locality: "ОХРИД",
                    postalCode: "6000",
                    country: "МАКЕДОНИЈА",
                    countryCode: "MK"
                }
            },
            {
                name: 'should parse Macedonian address in single line format',
                input: "Сања Јанчевски , ГРАДСКИ , ПАЗАР 5 , 6000 , ОХРИД , МАКЕДОНИЈА",
                locale: 'mk-MK',
                expected: {
                    streetAddress: "Сања Јанчевски, ГРАДСКИ, ПАЗАР 5",
                    locality: "ОХРИД",
                    postalCode: "6000",
                    country: "МАКЕДОНИЈА",
                    countryCode: "MK"
                }
            },
            {
                name: 'should parse Macedonian address with superfluous whitespace',
                input: "\t\t\tСања Јанчевски\t\t\rГРАДСКИ\t\t\rПАЗАР 5\n\n6000\n\nОХРИД\n\t МАКЕДОНИЈА\n\n\n",
                locale: 'mk-MK',
                expected: {
                    streetAddress: "Сања Јанчевски ГРАДСКИ ПАЗАР 5",
                    locality: "ОХРИД",
                    postalCode: "6000",
                    country: "МАКЕДОНИЈА",
                    countryCode: "MK"
                }
            },
            {
                name: 'should parse Macedonian address without delimiters',
                input: "Сања Јанчевски ГРАДСКИ ПАЗАР 5 6000 ОХРИД МАКЕДОНИЈА",
                locale: 'mk-MK',
                expected: {
                    streetAddress: "Сања Јанчевски ГРАДСКИ ПАЗАР 5",
                    locality: "ОХРИД",
                    postalCode: "6000",
                    country: "МАКЕДОНИЈА",
                    countryCode: "MK"
                }
            },
            {
                name: 'should parse Macedonian address from US locale context',
                input: "Сања Јанчевски ГРАДСКИ ПАЗАР 5\n6000 ОХРИД\nМАКЕДОНИЈА",
                locale: 'en-US',
                expected: {
                    streetAddress: "Сања Јанчевски ГРАДСКИ ПАЗАР 5",
                    locality: "ОХРИД",
                    postalCode: "6000",
                    country: "МАКЕДОНИЈА",
                    countryCode: "MK"
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
        test('should format Macedonian address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Сања Јанчевски ГРАДСКИ ПАЗАР 5",
                locality: "ОХРИД",
                postalCode: "6000",
                country: "МАКЕДОНИЈА",
                countryCode: "MK"
            }, { locale: 'mk-MK' });

            const expected = "Сања Јанчевски ГРАДСКИ ПАЗАР 5\n6000 ОХРИД\nМАКЕДОНИЈА";
            const formatter = new AddressFmt({ locale: 'mk-MK' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Macedonian address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Сања Јанчевски ГРАДСКИ ПАЗАР 5",
                locality: "ОХРИД",
                postalCode: "6000",
                country: "МАКЕДОНИЈА",
                countryCode: "MK"
            }, { locale: 'en-US' });

            const expected = "Сања Јанчевски ГРАДСКИ ПАЗАР 5\n6000 ОХРИД\nМАКЕДОНИЈА";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 