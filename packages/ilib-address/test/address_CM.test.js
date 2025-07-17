/*
 * address_CM.test.js - test the address parsing and formatting routines for Cameroon
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

beforeAll(async () => {
    if (getPlatform() === "browser" && !setUpPerformed) {
        setUpPerformed = true;
        await LocaleData.ensureLocale("fr-CM");
    }
});

describe('Address parsing for Cameroon', () => {
    const testCases = [
        {
            name: 'should parse normal Cameroonian address with all components',
            input: "M. Pierre Marie, BP 6000, YAOUNDE, CAMEROON",
            locale: 'fr-CM',
            expected: {
                streetAddress: "M. Pierre Marie, BP 6000",
                region: undefined,
                locality: "YAOUNDE",
                postalCode: undefined,
                country: "CAMEROON",
                countryCode: "CM"
            }
        },
        {
            name: 'should parse Cameroonian address without zip code',
            input: "M. Pierre Marie, BP 6000, YAOUNDE, CAMEROON",
            locale: 'fr-CM',
            expected: {
                streetAddress: "M. Pierre Marie, BP 6000",
                region: undefined,
                locality: "YAOUNDE",
                postalCode: undefined,
                country: "CAMEROON",
                countryCode: "CM"
            }
        },
        {
            name: 'should parse Cameroonian address with multiple lines',
            input: "M. Pierre Marie\nBP 6000, YAOUNDE\nCAMEROON",
            locale: 'fr-CM',
            expected: {
                streetAddress: "M. Pierre Marie, BP 6000",
                region: undefined,
                locality: "YAOUNDE",
                postalCode: undefined,
                country: "CAMEROON",
                countryCode: "CM"
            }
        },
        {
            name: 'should parse Cameroonian address in one line',
            input: "M. Pierre Marie, BP 6000, YAOUNDE, CAMEROON",
            locale: 'fr-CM',
            expected: {
                streetAddress: "M. Pierre Marie, BP 6000",
                region: undefined,
                locality: "YAOUNDE",
                postalCode: undefined,
                country: "CAMEROON",
                countryCode: "CM"
            }
        },
        {
            name: 'should parse Cameroonian address with superfluous whitespace',
            input: "M. Pierre Marie  \n\t\n BP 6000, YAOUNDE\t\n\n CAMEROON  \n  \t\t\t",
            locale: 'fr-CM',
            expected: {
                streetAddress: "M. Pierre Marie, BP 6000",
                region: undefined,
                locality: "YAOUNDE",
                postalCode: undefined,
                country: "CAMEROON",
                countryCode: "CM"
            }
        },
        {
            name: 'should parse Cameroonian address without delimiters',
            input: "M. Pierre Marie BP 6000 YAOUNDE CAMEROON",
            locale: 'fr-CM',
            expected: {
                streetAddress: "M. Pierre Marie BP 6000",
                region: undefined,
                locality: "YAOUNDE",
                postalCode: undefined,
                country: "CAMEROON",
                countryCode: "CM"
            }
        },
        {
            name: 'should parse Cameroonian address with special characters',
            input: "Direction des postes ,Régulation des réseaux et services postaux, YAOUNDE, CAMEROON",
            locale: 'fr-CM',
            expected: {
                streetAddress: "Direction des postes, Régulation des réseaux et services postaux",
                region: undefined,
                locality: "YAOUNDE",
                postalCode: undefined,
                country: "CAMEROON",
                countryCode: "CM"
            }
        },
        {
            name: 'should parse Cameroonian address from US locale',
            input: "M. Pierre Marie, BP 6000, YAOUNDE, CAMEROON",
            locale: 'en-US',
            expected: {
                streetAddress: "M. Pierre Marie, BP 6000",
                region: undefined,
                locality: "YAOUNDE",
                postalCode: undefined,
                country: "CAMEROON",
                countryCode: "CM"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Cameroon', () => {
    const testCases = [
        {
            name: 'should format Cameroonian address with French locale',
            address: {
                streetAddress: "M. Pierre Marie\nBP 6000",
                locality: "YAOUNDE",
                country: "CAMEROON",
                countryCode: "AM"
            },
            locale: 'fr-CM',
            expected: "M. Pierre Marie\nBP 6000\nYAOUNDE\nCAMEROON"
        },
        {
            name: 'should format Cameroonian address with US locale',
            address: {
                streetAddress: "M. Pierre Marie\nBP 6000",
                country: "CAMEROON",
                locality: "YAOUNDE",
                countryCode: "AM"
            },
            locale: 'en-US',
            expected: "M. Pierre Marie\nBP 6000\nYAOUNDE\nCAMEROON"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 