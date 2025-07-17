/*
 * address_CF.test.js - test the address parsing and formatting routines for Central African Republic
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
        await LocaleData.ensureLocale("fr-CF");
    }
});

describe('Address parsing for Central African Republic', () => {
    const testCases = [
        {
            name: 'should parse normal Central African address with all components',
            input: "Evangelical Church Elim Bangui – M'Poko, BP 729, BANGUI, CENTRAL AFRICAN REPUBLIC",
            locale: 'fr-CF',
            expected: {
                streetAddress: "Evangelical Church Elim Bangui – M'Poko, BP 729",
                region: undefined,
                locality: "BANGUI",
                postalCode: undefined,
                country: "CENTRAL AFRICAN REPUBLIC",
                countryCode: "CF"
            }
        },
        {
            name: 'should parse Central African address without zip code',
            input: "Evangelical Church Elim Bangui – M'Poko, BP 729, BANGUI, CENTRAL AFRICAN REPUBLIC",
            locale: 'fr-CF',
            expected: {
                streetAddress: "Evangelical Church Elim Bangui – M'Poko, BP 729",
                region: undefined,
                locality: "BANGUI",
                postalCode: undefined,
                country: "CENTRAL AFRICAN REPUBLIC",
                countryCode: "CF"
            }
        },
        {
            name: 'should parse Central African address with multiple lines',
            input: "Evangelical Church Elim Bangui – M'Poko\nBP 729, BANGUI\nCENTRAL AFRICAN REPUBLIC",
            locale: 'fr-CF',
            expected: {
                streetAddress: "Evangelical Church Elim Bangui – M'Poko, BP 729",
                region: undefined,
                locality: "BANGUI",
                postalCode: undefined,
                country: "CENTRAL AFRICAN REPUBLIC",
                countryCode: "CF"
            }
        },
        {
            name: 'should parse Central African address in one line',
            input: "Evangelical Church Elim Bangui – M'Poko, BP 729, BANGUI, CENTRAL AFRICAN REPUBLIC",
            locale: 'fr-CF',
            expected: {
                streetAddress: "Evangelical Church Elim Bangui – M'Poko, BP 729",
                region: undefined,
                locality: "BANGUI",
                postalCode: undefined,
                country: "CENTRAL AFRICAN REPUBLIC",
                countryCode: "CF"
            }
        },
        {
            name: 'should parse Central African address with superfluous whitespace',
            input: "Evangelical Church Elim Bangui – M'Poko  \n\t\n BP 729\nBANGUI\t\n\n CENTRAL AFRICAN REPUBLIC  \n  \t\t\t",
            locale: 'fr-CF',
            expected: {
                streetAddress: "Evangelical Church Elim Bangui – M'Poko, BP 729",
                region: undefined,
                locality: "BANGUI",
                postalCode: undefined,
                country: "CENTRAL AFRICAN REPUBLIC",
                countryCode: "CF"
            }
        },
        {
            name: 'should parse Central African address without delimiters',
            input: "Evangelical Church Elim Bangui – M'Poko BP 729 BANGUI CENTRAL AFRICAN REPUBLIC",
            locale: 'fr-CF',
            expected: {
                streetAddress: "Evangelical Church Elim Bangui – M'Poko BP 729",
                region: undefined,
                locality: "BANGUI",
                postalCode: undefined,
                country: "CENTRAL AFRICAN REPUBLIC",
                countryCode: "CF"
            }
        },
        {
            name: 'should parse Central African address with special characters',
            input: "Avenue des Martyrs Boîte postale 344, BANGUI, République centrafricaine",
            locale: 'fr-CF',
            expected: {
                streetAddress: "Avenue des Martyrs Boîte postale 344",
                region: undefined,
                locality: "BANGUI",
                postalCode: undefined,
                country: "République centrafricaine",
                countryCode: "CF"
            }
        },
        {
            name: 'should parse Central African address from US locale',
            input: "Evangelical Church Elim Bangui – M'Poko, BP 729, BANGUI, CENTRAL AFRICAN REPUBLIC",
            locale: 'en-US',
            expected: {
                streetAddress: "Evangelical Church Elim Bangui – M'Poko, BP 729",
                region: undefined,
                locality: "BANGUI",
                postalCode: undefined,
                country: "CENTRAL AFRICAN REPUBLIC",
                countryCode: "CF"
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

describe('Address formatting for Central African Republic', () => {
    const testCases = [
        {
            name: 'should format Central African address with French locale',
            address: {
                streetAddress: "Evangelical Church Elim Bangui – M'Poko\nBP 729",
                locality: "BANGUI",
                country: "CENTRAL AFRICAN REPUBLIC",
                countryCode: "AM"
            },
            locale: 'fr-CF',
            expected: "Evangelical Church Elim Bangui – M'Poko\nBP 729\nBANGUI\nCENTRAL AFRICAN REPUBLIC"
        },
        {
            name: 'should format Central African address with US locale',
            address: {
                streetAddress: "Evangelical Church Elim Bangui – M'Poko\nBP 729",
                country: "CENTRAL AFRICAN REPUBLIC",
                locality: "BANGUI",
                countryCode: "AM"
            },
            locale: 'en-US',
            expected: "Evangelical Church Elim Bangui – M'Poko\nBP 729\nBANGUI\nCENTRAL AFRICAN REPUBLIC"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 