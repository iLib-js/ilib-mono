/*
 * address_DK.test.js - test the address parsing and formatting routines for Denmark
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

describe('ilib-address Denmark', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("da-DK");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Danish address',
                input: "Hr. Niels Henriksen, Kastanievej 15, DK-8660 SKANDERBORG, DENMARK",
                options: { locale: 'da-DK' },
                expected: {
                    streetAddress: "Hr. Niels Henriksen, Kastanievej 15",
                    locality: "SKANDERBORG",
                    region: undefined,
                    postalCode: "DK-8660",
                    country: "DENMARK",
                    countryCode: "DK"
                }
            },
            {
                name: 'should parse Danish address without postal code',
                input: "Hr. Niels Henriksen, Kastanievej 15, SKANDERBORG, DENMARK",
                options: { locale: 'da-DK' },
                expected: {
                    streetAddress: "Hr. Niels Henriksen, Kastanievej 15",
                    locality: "SKANDERBORG",
                    region: undefined,
                    postalCode: undefined,
                    country: "DENMARK",
                    countryCode: "DK"
                }
            },
            {
                name: 'should parse Danish address with short postal code',
                input: "Hr. Niels Henriksen, Kastanievej 15, 8660 SKANDERBORG, DENMARK",
                options: { locale: 'da-DK' },
                expected: {
                    streetAddress: "Hr. Niels Henriksen, Kastanievej 15",
                    locality: "SKANDERBORG",
                    region: undefined,
                    postalCode: "8660",
                    country: "DENMARK",
                    countryCode: "DK"
                }
            },
            {
                name: 'should parse Danish address with multiple lines',
                input: "Hr. Niels Henriksen\nKastanievej 15\nDK-8660 SKANDERBORG\nDENMARK",
                options: { locale: 'da-DK' },
                expected: {
                    streetAddress: "Hr. Niels Henriksen, Kastanievej 15",
                    locality: "SKANDERBORG",
                    region: undefined,
                    postalCode: "DK-8660",
                    country: "DENMARK",
                    countryCode: "DK"
                }
            },
            {
                name: 'should parse Danish address in one line format',
                input: "Hr. Niels Henriksen, Kastanievej 15, DK-8660 SKANDERBORG DENMARK",
                options: { locale: 'da-DK' },
                expected: {
                    streetAddress: "Hr. Niels Henriksen, Kastanievej 15",
                    locality: "SKANDERBORG",
                    region: undefined,
                    postalCode: "DK-8660",
                    country: "DENMARK",
                    countryCode: "DK"
                }
            },
            {
                name: 'should parse Danish address with superfluous whitespace',
                input: "Hr. Niels Henriksen,          Kastanievej 15   \n\t\n DK-8660      \t SKANDERBORG\t\n\n DENMARK  \n  \t\t\t",
                options: { locale: 'da-DK' },
                expected: {
                    streetAddress: "Hr. Niels Henriksen, Kastanievej 15",
                    locality: "SKANDERBORG",
                    region: undefined,
                    postalCode: "DK-8660",
                    country: "DENMARK",
                    countryCode: "DK"
                }
            },
            {
                name: 'should parse Danish address without delimiters',
                input: "Hr. Niels Henriksen Kastanievej 15 DK-8660 SKANDERBORG DENMARK",
                options: { locale: 'da-DK' },
                expected: {
                    streetAddress: "Hr. Niels Henriksen Kastanievej 15",
                    locality: "SKANDERBORG",
                    region: undefined,
                    postalCode: "DK-8660",
                    country: "DENMARK",
                    countryCode: "DK"
                }
            },
            {
                name: 'should parse Danish address with special characters',
                input: "Botanisk Centralbibliotek, Sølvgade 83, opg. S, DK-1307 København, DENMARK",
                options: { locale: 'da-DK' },
                expected: {
                    streetAddress: "Botanisk Centralbibliotek, Sølvgade 83, opg. S",
                    locality: "København",
                    region: undefined,
                    postalCode: "DK-1307",
                    country: "DENMARK",
                    countryCode: "DK"
                }
            },
            {
                name: 'should parse Danish address with post office',
                input: "Botanisk Centralbibliotek, Sølvgade 83, opg. S, DK-1307 København K, DENMARK",
                options: { locale: 'da-DK' },
                expected: {
                    streetAddress: "Botanisk Centralbibliotek, Sølvgade 83, opg. S",
                    locality: "København",
                    region: undefined,
                    postalCode: "DK-1307",
                    postOffice: "K",
                    country: "DENMARK",
                    countryCode: "DK"
                }
            },
            {
                name: 'should parse Danish address with post office with dot',
                input: "Botanisk Centralbibliotek, Sølvgade 83, opg. S, DK-1307 København K., DENMARK",
                options: { locale: 'da-DK' },
                expected: {
                    streetAddress: "Botanisk Centralbibliotek, Sølvgade 83, opg. S",
                    locality: "København",
                    region: undefined,
                    postalCode: "DK-1307",
                    postOffice: "K.",
                    country: "DENMARK",
                    countryCode: "DK"
                }
            },
            {
                name: 'should parse Danish address from US locale',
                input: "Hr. Niels Henriksen, Kastanievej 15, DK-8660 SKANDERBORG, DENMARK",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Hr. Niels Henriksen, Kastanievej 15",
                    locality: "SKANDERBORG",
                    region: undefined,
                    postalCode: "DK-8660",
                    country: "DENMARK",
                    countryCode: "DK"
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
            if (expected.postOffice !== undefined) {
                expect(parsedAddress.postOffice).toBe(expected.postOffice);
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
                name: 'should format Danish address in Danish locale',
                address: {
                    streetAddress: "Hr. Niels Henriksen,Kastanievej 15",
                    locality: "SKANDERBORG",
                    postalCode: "DK-8660",
                    country: "DENMARK",
                    countryCode: "DK"
                },
                options: { locale: 'da-DK' },
                expected: "Hr. Niels Henriksen,Kastanievej 15\nDK-8660 SKANDERBORG\nDENMARK"
            },
            {
                name: 'should format Danish address with post office',
                address: {
                    streetAddress: "Hr. Niels Henriksen, Kastanievej 15",
                    locality: "SKANDERBORG",
                    postalCode: "DK-8660",
                    postOffice: "K.",
                    country: "DENMARK",
                    countryCode: "DK"
                },
                options: { locale: 'da-DK' },
                expected: "Hr. Niels Henriksen, Kastanievej 15\nDK-8660 SKANDERBORG K.\nDENMARK"
            },
            {
                name: 'should format Danish address in US locale',
                address: {
                    streetAddress: "Hr. Niels Henriksen,Kastanievej 15",
                    postalCode: "DK-8660",
                    locality: "SKANDERBORG",
                    country: "DENMARK",
                    countryCode: "DK"
                },
                options: { locale: 'en-US' },
                expected: "Hr. Niels Henriksen,Kastanievej 15\nDK-8660 SKANDERBORG\nDENMARK"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 