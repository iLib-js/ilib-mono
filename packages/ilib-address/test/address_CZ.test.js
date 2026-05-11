/*
 * address_CZ.test.js - test the address parsing and formatting routines for Czech Republic
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

describe('ilib-address Czech Republic', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("cs-CZ");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Czech address',
                input: "Prujezdna 320/62, 100 00 PRAHA 10, česká republika",
                options: { locale: 'cs-CZ' },
                expected: {
                    streetAddress: "Prujezdna 320/62",
                    locality: "PRAHA 10",
                    region: undefined,
                    postalCode: "100 00",
                    country: "česká republika",
                    countryCode: "CZ"
                }
            },
            {
                name: 'should parse Czech address without postal code',
                input: "Prujezdna 320/62, PRAHA, česká republika",
                options: { locale: 'cs-CZ' },
                expected: {
                    streetAddress: "Prujezdna 320/62",
                    locality: "PRAHA",
                    region: undefined,
                    postalCode: undefined,
                    country: "česká republika",
                    countryCode: "CZ"
                }
            },
            {
                name: 'should parse Czech address with multiple lines',
                input: "Jaromir Jagr\nPrujezdna 320/62\n100 00 Praha 10\nčeská republika",
                options: { locale: 'cs-CZ' },
                expected: {
                    streetAddress: "Jaromir Jagr, Prujezdna 320/62",
                    locality: "Praha 10",
                    region: undefined,
                    postalCode: "100 00",
                    country: "česká republika",
                    countryCode: "CZ"
                }
            },
            {
                name: 'should parse Czech address in one line format',
                input: "Prujezdna 320/62 100 00 PRAHA 10 česká republika",
                options: { locale: 'cs-CZ' },
                expected: {
                    streetAddress: "Prujezdna 320/62",
                    locality: "PRAHA 10",
                    region: undefined,
                    postalCode: "100 00",
                    country: "česká republika",
                    countryCode: "CZ"
                }
            },
            {
                name: 'should parse Czech address with superfluous whitespace',
                input: "\n\t\t\rPrujezdna 320/62\t   \t\n   \r100 00 Praha 10    \t\n \n\n    česká republika              \t\t",
                options: { locale: 'cs-CZ' },
                expected: {
                    streetAddress: "Prujezdna 320/62",
                    locality: "Praha 10",
                    region: undefined,
                    postalCode: "100 00",
                    country: "česká republika",
                    countryCode: "CZ"
                }
            },
            {
                name: 'should parse Czech address with special characters',
                input: "Tyršova 1000, 592 31 Nové Město na Moravě 1000, Česká republika",
                options: { locale: 'cs-CZ' },
                expected: {
                    streetAddress: "Tyršova 1000",
                    locality: "Nové Město na Moravě 1000",
                    region: undefined,
                    postalCode: "592 31",
                    country: "Česká republika",
                    countryCode: "CZ"
                }
            },
            {
                name: 'should parse Czech address from US locale',
                input: "Tyršova 1000, 592 31 Nové Město na Moravě 1000, Czech Republic",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Tyršova 1000",
                    locality: "Nové Město na Moravě 1000",
                    region: undefined,
                    postalCode: "592 31",
                    country: "Czech Republic",
                    countryCode: "CZ"
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
                name: 'should format Czech address in Czech locale',
                address: {
                    streetAddress: "Kostel svatého Šimona a Judy, Dušní",
                    locality: "Praha 1",
                    postalCode: "110 00",
                    country: "Česká republika",
                    countryCode: "CZ"
                },
                options: { locale: 'cs-CZ' },
                expected: "Kostel svatého Šimona a Judy, Dušní\n110 00 Praha 1\nČeská republika"
            },
            {
                name: 'should format Czech address in US locale',
                address: {
                    streetAddress: "Kostel svatého Šimona a Judy, Dušní",
                    locality: "Praha 1",
                    postalCode: "110 00",
                    country: "Czech Republic",
                    countryCode: "CZ"
                },
                options: { locale: 'en-US' },
                expected: "Kostel svatého Šimona a Judy, Dušní\n110 00 Praha 1\nCzech Republic"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 