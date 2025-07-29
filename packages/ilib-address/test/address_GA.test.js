/*
 * address_GA.test.js - test the address parsing and formatting routines for Gabon
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
 * See the License for the Specific language governing permissions and
 * limitations under the License.
 */

import { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';
import Address from '../src/Address.js';
import AddressFmt from '../src/AddressFmt.js';

let setUpPerformed = false;

beforeAll(async () => {
    if (getPlatform() === "browser" && !setUpPerformed) {
        setUpPerformed = true;
        await LocaleData.ensureLocale("fr-GA");
    }
});

describe('Address parsing for Gabon', () => {
    const testCases = [
        {
            name: 'should parse normal Gabonese address',
            input: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000\nLIBREVILLE\nGABON",
            locale: 'fr-GA',
            expected: {
                streetAddress: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000",
                locality: "LIBREVILLE",
                region: undefined,
                postalCode: undefined,
                country: "GABON",
                countryCode: "GA"
            }
        },
        {
            name: 'should parse Gabonese address without zip code',
            input: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000\nLIBREVILLE\nGABON",
            locale: 'fr-GA',
            expected: {
                streetAddress: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000",
                locality: "LIBREVILLE",
                region: undefined,
                postalCode: undefined,
                country: "GABON",
                countryCode: "GA"
            }
        },
        {
            name: 'should parse Gabonese address without country',
            input: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000\nLIBREVILLE",
            locale: 'fr-GA',
            expected: {
                streetAddress: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000",
                locality: "LIBREVILLE",
                region: undefined,
                postalCode: undefined,
                country: undefined,
                countryCode: "GA"
            }
        },
        {
            name: 'should parse Gabonese address with multiple lines',
            input: "Direction de la Poste Service\nde l'organisation et\nde l'exploitation du réseau postal\nBP 20000\nLIBREVILLE\nGABON",
            locale: 'fr-GA',
            expected: {
                streetAddress: "Direction de la Poste Service, de l'organisation et, de l'exploitation du réseau postal, BP 20000",
                locality: "LIBREVILLE",
                region: undefined,
                postalCode: undefined,
                country: "GABON",
                countryCode: "GA"
            }
        },
        {
            name: 'should parse Gabonese address in one line',
            input: "Direction de la Poste Service , de l'organisation et , de l'exploitation du réseau postal , BP 20000 , LIBREVILLE , GABON",
            locale: 'fr-GA',
            expected: {
                streetAddress: "Direction de la Poste Service, de l'organisation et, de l'exploitation du réseau postal, BP 20000",
                locality: "LIBREVILLE",
                region: undefined,
                postalCode: undefined,
                country: "GABON",
                countryCode: "GA"
            }
        },
        {
            name: 'should parse Gabonese address with superfluous whitespace',
            input: "Direction de la Poste Service\r\r\tde l'organisation et\t\t\tde l'exploitation du réseau postal\t\t\rBP 20000\r\r\n\nLIBREVILLE\t\r\n\t\rGABON",
            locale: 'fr-GA',
            expected: {
                streetAddress: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000",
                locality: "LIBREVILLE",
                region: undefined,
                postalCode: undefined,
                country: "GABON",
                countryCode: "GA"
            }
        },
        {
            name: 'should parse Gabonese address without delimiters',
            input: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000 LIBREVILLE GABON",
            locale: 'fr-GA',
            expected: {
                streetAddress: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000",
                locality: "LIBREVILLE",
                region: undefined,
                postalCode: undefined,
                country: "GABON",
                countryCode: "GA"
            }
        },
        {
            name: 'should parse Gabonese address from US locale',
            input: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000\nLIBREVILLE\nGABON",
            locale: 'fr-GA',
            expected: {
                streetAddress: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000",
                locality: "LIBREVILLE",
                region: undefined,
                postalCode: undefined,
                country: "GABON",
                countryCode: "GA"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Gabon', () => {
    const testCases = [
        {
            name: 'should format Gabonese address with French locale',
            address: {
                streetAddress: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000",
                locality: "LIBREVILLE",
                postalCode: "1010",
                country: "GABON",
                countryCode: "GA"
            },
            locale: 'fr-GA',
            expected: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000\nLIBREVILLE\nGABON"
        },
        {
            name: 'should format Gabonese address with US locale',
            address: {
                streetAddress: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000",
                locality: "LIBREVILLE",
                postalCode: "1010",
                country: "GABON",
                countryCode: "GA"
            },
            locale: 'en-US',
            expected: "Direction de la Poste Service de l'organisation et de l'exploitation du réseau postal BP 20000\nLIBREVILLE\nGABON"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 