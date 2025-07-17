/*
 * address_CI.test.js - test the address parsing and formatting routines for Ivory Coast
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
        await LocaleData.ensureLocale("fr-CI");
    }
});

describe('Address parsing for Ivory Coast', () => {
    const testCases = [
        {
            name: 'should parse normal Ivorian address with all components',
            input: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37 ABIDJAN 06\ncôte d'ivoire",
            locale: 'fr-CI',
            expected: {
                streetAddress: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37",
                locality: "ABIDJAN 06",
                region: undefined,
                postalCode: undefined,
                country: "côte d'ivoire",
                countryCode: "CI"
            }
        },
        {
            name: 'should parse Ivorian address without zip code',
            input: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37 ABIDJAN 06\ncôte d'ivoire",
            locale: 'fr-CI',
            expected: {
                streetAddress: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37",
                locality: "ABIDJAN 06",
                region: undefined,
                postalCode: undefined,
                country: "côte d'ivoire",
                countryCode: "CI"
            }
        },
        {
            name: 'should parse Ivorian address without country',
            input: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37\nABIDJAN 06",
            locale: 'fr-CI',
            expected: {
                streetAddress: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37",
                locality: "ABIDJAN 06",
                region: undefined,
                postalCode: undefined,
                country: undefined,
                countryCode: "CI"
            }
        },
        {
            name: 'should parse Ivorian address with multiple lines',
            input: "Madame KOUAME AKISSI\nCOMMERCANTE 06 B.P. 37\nABIDJAN 06\ncôte d'ivoire",
            locale: 'fr-CI',
            expected: {
                streetAddress: "Madame KOUAME AKISSI, COMMERCANTE 06 B.P. 37",
                locality: "ABIDJAN 06",
                region: undefined,
                postalCode: undefined,
                country: "côte d'ivoire",
                countryCode: "CI"
            }
        },
        {
            name: 'should parse Ivorian address in one line',
            input: "Madame KOUAME AKISSI , COMMERCANTE 06 B.P. 37 , ABIDJAN 06 , côte d'ivoire",
            locale: 'fr-CI',
            expected: {
                streetAddress: "Madame KOUAME AKISSI, COMMERCANTE 06 B.P. 37",
                locality: "ABIDJAN 06",
                region: undefined,
                postalCode: undefined,
                country: "côte d'ivoire",
                countryCode: "CI"
            }
        },
        {
            name: 'should parse Ivorian address with superfluous whitespace',
            input: "Madame KOUAME AKISSI\n\n\t\r\t\t\rCOMMERCANTE 06 B.P. 37\r\r\n\nABIDJAN 06\t\r\n\t\rcôte d'ivoire",
            locale: 'fr-CI',
            expected: {
                streetAddress: "Madame KOUAME AKISSI, COMMERCANTE 06 B.P. 37",
                locality: "ABIDJAN 06",
                region: undefined,
                postalCode: undefined,
                country: "côte d'ivoire",
                countryCode: "CI"
            }
        },
        {
            name: 'should parse Ivorian address without delimiters',
            input: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37 ABIDJAN 06 côte d'ivoire",
            locale: 'fr-CI',
            expected: {
                streetAddress: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37",
                locality: "ABIDJAN 06",
                region: undefined,
                postalCode: undefined,
                country: "côte d'ivoire",
                countryCode: "CI"
            }
        },
        {
            name: 'should parse Ivorian address from US locale',
            input: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37\nABIDJAN 06\ncôte d'ivoire",
            locale: 'fr-CI',
            expected: {
                streetAddress: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37",
                locality: "ABIDJAN 06",
                region: undefined,
                postalCode: undefined,
                country: "côte d'ivoire",
                countryCode: "CI"
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

describe('Address formatting for Ivory Coast', () => {
    const testCases = [
        {
            name: 'should format Ivorian address with French locale',
            address: {
                streetAddress: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37",
                locality: "ABIDJAN 06",
                postalCode: "1010",
                country: "côte d'ivoire",
                countryCode: "CI"
            },
            locale: 'fr-CI',
            expected: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37 ABIDJAN 06\ncôte d'ivoire"
        },
        {
            name: 'should format Ivorian address with US locale',
            address: {
                streetAddress: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37",
                locality: "ABIDJAN 06",
                postalCode: "1010",
                country: "côte d'ivoire",
                countryCode: "CI"
            },
            locale: 'en-US',
            expected: "Madame KOUAME AKISSI COMMERCANTE 06 B.P. 37 ABIDJAN 06\ncôte d'ivoire"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 