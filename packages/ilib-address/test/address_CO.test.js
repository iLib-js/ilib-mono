/*
 * address_CO.test.js - test the address parsing and formatting routines for Colombia
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

describe('ilib-address Colombia', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("es-CO");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Colombian address',
                input: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702, ARACATACA–MAGDALENA, COLOMBIA",
                options: { locale: 'es-CO' },
                expected: {
                    streetAddress: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702",
                    locality: "ARACATACA–MAGDALENA",
                    region: undefined,
                    postalCode: undefined,
                    country: "COLOMBIA",
                    countryCode: "CO"
                }
            },
            {
                name: 'should parse Colombian address without postal code',
                input: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702, ARACATACA–MAGDALENA, COLOMBIA",
                options: { locale: 'es-CO' },
                expected: {
                    streetAddress: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702",
                    locality: "ARACATACA–MAGDALENA",
                    region: undefined,
                    postalCode: undefined,
                    country: "COLOMBIA",
                    countryCode: "CO"
                }
            },
            {
                name: 'should parse Colombian address with multiple lines',
                input: "SEÑOR\nFEDERICO TERRAZAS ARIAS, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702\nARACATACA–MAGDALENA\nCOLOMBIA",
                options: { locale: 'es-CO' },
                expected: {
                    streetAddress: "SEÑOR, FEDERICO TERRAZAS ARIAS, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702",
                    locality: "ARACATACA–MAGDALENA",
                    region: undefined,
                    postalCode: undefined,
                    country: "COLOMBIA",
                    countryCode: "CO"
                }
            },
            {
                name: 'should parse Colombian address in one line format',
                input: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702, ARACATACA–MAGDALENA, COLOMBIA",
                options: { locale: 'es-CO' },
                expected: {
                    streetAddress: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702",
                    locality: "ARACATACA–MAGDALENA",
                    region: undefined,
                    postalCode: undefined,
                    country: "COLOMBIA",
                    countryCode: "CO"
                }
            },
            {
                name: 'should parse Colombian address with superfluous whitespace',
                input: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702  \n\t\n ARACATACA–MAGDALENA\t\n\n COLOMBIA  \n  \t\t\t",
                options: { locale: 'es-CO' },
                expected: {
                    streetAddress: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702",
                    locality: "ARACATACA–MAGDALENA",
                    region: undefined,
                    postalCode: undefined,
                    country: "COLOMBIA",
                    countryCode: "CO"
                }
            },
            {
                name: 'should parse Colombian address without delimiters',
                input: "SEÑOR Gabriel Garcia Marquez SOCIEDAD DE ESCRITORES COLOMBIANOS Av. 15 no 80–13 oficina 702 ARACATACA–MAGDALENA COLOMBIA",
                options: { locale: 'es-CO' },
                expected: {
                    streetAddress: "SEÑOR Gabriel Garcia Marquez SOCIEDAD DE ESCRITORES COLOMBIANOS Av. 15 no 80–13 oficina 702",
                    locality: "ARACATACA–MAGDALENA",
                    region: undefined,
                    postalCode: undefined,
                    country: "COLOMBIA",
                    countryCode: "CO"
                }
            },
            {
                name: 'should parse Colombian address with special characters',
                input: "SEÑOR, Gabriel García Márquez, SOCIEDAD DE ESCRITORES, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702, ARACATACA–MAGDALENA, COLOMBIA",
                options: { locale: 'es-CO' },
                expected: {
                    streetAddress: "SEÑOR, Gabriel García Márquez, SOCIEDAD DE ESCRITORES, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702",
                    locality: "ARACATACA–MAGDALENA",
                    region: undefined,
                    postalCode: undefined,
                    country: "COLOMBIA",
                    countryCode: "CO"
                }
            },
            {
                name: 'should parse Colombian address from US locale',
                input: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702, ARACATACA–MAGDALENA, COLOMBIA",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702",
                    locality: "ARACATACA–MAGDALENA",
                    region: undefined,
                    postalCode: undefined,
                    country: "COLOMBIA",
                    countryCode: "CO"
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
                name: 'should format Colombian address in Colombian locale',
                address: {
                    streetAddress: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702",
                    locality: "ARACATACA–MAGDALENA",
                    country: "COLOMBIA",
                    countryCode: "CO"
                },
                options: { locale: 'es-CO' },
                expected: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702\nARACATACA–MAGDALENA\nCOLOMBIA"
            },
            {
                name: 'should format Colombian address in US locale',
                address: {
                    streetAddress: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702",
                    country: "COLOMBIA",
                    locality: "ARACATACA–MAGDALENA",
                    countryCode: "CO"
                },
                options: { locale: 'en-US' },
                expected: "SEÑOR, Gabriel Garcia Marquez, SOCIEDAD DE ESCRITORES COLOMBIANOS, Av. 15 no 80–13 oficina 702\nARACATACA–MAGDALENA\nCOLOMBIA"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 