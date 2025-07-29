/*
 * address_UY.test.js - test the address parsing and formatting routines for Uruguay
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

describe('ilib-address Uruguay', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("es-UY");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Uruguayan address',
                input: "Florencio Agustini Eduardo Acevedo Diaz 1753\n11801 Montevideo\nUruguay",
                options: { locale: 'es-UY' },
                expected: {
                    streetAddress: "Florencio Agustini Eduardo Acevedo Diaz 1753",
                    locality: "Montevideo",
                    region: undefined,
                    postalCode: "11801",
                    country: "Uruguay",
                    countryCode: "UY"
                }
            },
            {
                name: 'should parse Uruguayan address without postal code',
                input: "Florencio Agustini Eduardo Acevedo Diaz 1753\nMontevideo\nUruguay",
                options: { locale: 'es-UY' },
                expected: {
                    streetAddress: "Florencio Agustini Eduardo Acevedo Diaz 1753",
                    locality: "Montevideo",
                    region: undefined,
                    postalCode: undefined,
                    country: "Uruguay",
                    countryCode: "UY"
                }
            },
            {
                name: 'should parse Uruguayan address without country',
                input: "Florencio Agustini Eduardo Acevedo Diaz 1753\n11801 Montevideo",
                options: { locale: 'es-UY' },
                expected: {
                    streetAddress: "Florencio Agustini Eduardo Acevedo Diaz 1753",
                    locality: "Montevideo",
                    region: undefined,
                    postalCode: "11801",
                    country: undefined,
                    countryCode: "UY"
                }
            },
            {
                name: 'should parse Uruguayan address with multiple lines',
                input: "Mr. Richard Chanda\n10\nNyimba\nRoad\n11801\nMontevideo\nUruguay\n\n\n",
                options: { locale: 'es-UY' },
                expected: {
                    streetAddress: "Mr. Richard Chanda, 10, Nyimba, Road",
                    locality: "Montevideo",
                    region: undefined,
                    postalCode: "11801",
                    country: "Uruguay",
                    countryCode: "UY"
                }
            },
            {
                name: 'should parse Uruguayan address in one line format',
                input: "Mr. Richard Chanda , 10 , Nyimba , Road , 11801 , Montevideo , Uruguay",
                options: { locale: 'es-UY' },
                expected: {
                    streetAddress: "Mr. Richard Chanda, 10, Nyimba, Road",
                    locality: "Montevideo",
                    region: undefined,
                    postalCode: "11801",
                    country: "Uruguay",
                    countryCode: "UY"
                }
            },
            {
                name: 'should parse Uruguayan address with superfluous whitespace',
                input: "\t\t\tMr. Richard Chanda\n\t\t\t10 \t\t\t\r\r Nyimba \n \r \tRoad \n\t\n11801\t\nMontevideo\n\t Uruguay\n\n\n",
                options: { locale: 'es-UY' },
                expected: {
                    streetAddress: "Mr. Richard Chanda, 10 Nyimba, Road",
                    locality: "Montevideo",
                    region: undefined,
                    postalCode: "11801",
                    country: "Uruguay",
                    countryCode: "UY"
                }
            },
            {
                name: 'should parse Uruguayan address without delimiters',
                input: "Florencio Agustini Eduardo Acevedo Diaz 1753 11801 Montevideo Uruguay",
                options: { locale: 'es-UY' },
                expected: {
                    streetAddress: "Florencio Agustini Eduardo Acevedo Diaz 1753",
                    locality: "Montevideo",
                    region: undefined,
                    postalCode: "11801",
                    country: "Uruguay",
                    countryCode: "UY"
                }
            },
            {
                name: 'should parse Uruguayan address from US locale',
                input: "Florencio Agustini Eduardo Acevedo Diaz 1753\n56001 Montevideo\nUruguay",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Florencio Agustini Eduardo Acevedo Diaz 1753",
                    locality: "Montevideo",
                    region: undefined,
                    postalCode: "56001",
                    country: "Uruguay",
                    countryCode: "UY"
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
                name: 'should format Uruguayan address in Spanish locale',
                address: {
                    streetAddress: "Florencio Agustini Eduardo Acevedo Diaz 1753",
                    locality: "Montevideo",
                    postalCode: "56001",
                    country: "Uruguay",
                    countryCode: "UY"
                },
                options: { locale: 'es-UY' },
                expected: "Florencio Agustini Eduardo Acevedo Diaz 1753\n56001 Montevideo\nUruguay"
            },
            {
                name: 'should format Uruguayan address in US locale',
                address: {
                    streetAddress: "Florencio Agustini Eduardo Acevedo Diaz 1753",
                    locality: "Montevideo",
                    postalCode: "56001",
                    country: "Uruguay",
                    countryCode: "UY"
                },
                options: { locale: 'en-US' },
                expected: "Florencio Agustini Eduardo Acevedo Diaz 1753\n56001 Montevideo\nUruguay"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 