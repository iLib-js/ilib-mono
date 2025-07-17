/*
 * address_AT.test.js - test the address parsing and formatting routines for Austria
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

describe('ilib-address Austria', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("de-AT");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Austrian address',
                input: "R. Fellner, Pazmaniteng 24-9, A-1020 Wien, Österreich",
                options: { locale: 'de-AT' },
                expected: {
                    streetAddress: "R. Fellner, Pazmaniteng 24-9",
                    locality: "Wien",
                    region: undefined,
                    postalCode: "A-1020",
                    country: "Österreich",
                    countryCode: "AT"
                }
            },
            {
                name: 'should parse Austrian address without postal code',
                input: "R. Fellner, Pazmaniteng 24-9, Wien, Österreich",
                options: { locale: 'de-AT' },
                expected: {
                    streetAddress: "R. Fellner, Pazmaniteng 24-9",
                    locality: "Wien",
                    region: undefined,
                    postalCode: undefined,
                    country: "Österreich",
                    countryCode: "AT"
                }
            },
            {
                name: 'should parse Austrian address without country',
                input: "R. Fellner, Pazmaniteng 24-9, A-1020 Wien",
                options: { locale: 'de-AT' },
                expected: {
                    streetAddress: "R. Fellner, Pazmaniteng 24-9",
                    locality: "Wien",
                    region: undefined,
                    postalCode: "A-1020",
                    country: undefined,
                    countryCode: "AT"
                }
            },
            {
                name: 'should parse Austrian address with multiple lines',
                input: "Wolfgang Schüssel\nLiebiggasse 5\n1010 Wien\nÖsterreich\n\n\n",
                options: { locale: 'de-AT' },
                expected: {
                    streetAddress: "Wolfgang Schüssel, Liebiggasse 5",
                    locality: "Wien",
                    region: undefined,
                    postalCode: "1010",
                    country: "Österreich",
                    countryCode: "AT"
                }
            },
            {
                name: 'should parse Austrian address in one line format',
                input: "R. Fellner, Pazmaniteng 24-9, A-1020 Wien, Österreich",
                options: { locale: 'de-AT' },
                expected: {
                    streetAddress: "R. Fellner, Pazmaniteng 24-9",
                    locality: "Wien",
                    region: undefined,
                    postalCode: "A-1020",
                    country: "Österreich",
                    countryCode: "AT"
                }
            },
            {
                name: 'should parse Austrian address with superfluous whitespace',
                input: "  \t  \r  Wolfgang Schüssel,\n\t    Liebiggasse 5,\n\n\n\n\t 1010 Wien\r\t  ,\n\t Österreich       ",
                options: { locale: 'de-AT' },
                expected: {
                    streetAddress: "Wolfgang Schüssel, Liebiggasse 5",
                    locality: "Wien",
                    region: undefined,
                    postalCode: "1010",
                    country: "Österreich",
                    countryCode: "AT"
                }
            },
            {
                name: 'should parse Austrian address without delimiters',
                input: "Wolfgang Schüssel Liebiggasse 5 1010 Wien Österreich",
                options: { locale: 'de-AT' },
                expected: {
                    streetAddress: "Wolfgang Schüssel Liebiggasse 5",
                    locality: "Wien",
                    region: undefined,
                    postalCode: "1010",
                    country: "Österreich",
                    countryCode: "AT"
                }
            },
            {
                name: 'should parse Austrian address with special characters',
                input: "Wolfgang Schüssel, Liebiggasse 5, 1010 Wien, Österreich",
                options: { locale: 'de-AT' },
                expected: {
                    streetAddress: "Wolfgang Schüssel, Liebiggasse 5",
                    locality: "Wien",
                    region: undefined,
                    postalCode: "1010",
                    country: "Österreich",
                    countryCode: "AT"
                }
            },
            {
                name: 'should parse Austrian address from US locale',
                input: "Wolfgang Schüssel, Liebiggasse 5, 1010 Wien, Austria",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Wolfgang Schüssel, Liebiggasse 5",
                    locality: "Wien",
                    region: undefined,
                    postalCode: "1010",
                    country: "Austria",
                    countryCode: "AT"
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
                name: 'should format Austrian address in Austrian locale',
                address: {
                    streetAddress: "Wolfgang Schüssel, Liebiggasse 5",
                    locality: "Wien",
                    postalCode: "1010",
                    country: "Österreich",
                    countryCode: "AT"
                },
                options: { locale: 'de-AT' },
                expected: "Wolfgang Schüssel, Liebiggasse 5\n1010 Wien\nÖsterreich"
            },
            {
                name: 'should format Austrian address in US locale',
                address: {
                    streetAddress: "Wolfgang Schüssel, Liebiggasse 5",
                    locality: "Vienna",
                    postalCode: "1010",
                    country: "Austria",
                    countryCode: "AT"
                },
                options: { locale: 'en-US' },
                expected: "Wolfgang Schüssel, Liebiggasse 5\n1010 Vienna\nAustria"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 