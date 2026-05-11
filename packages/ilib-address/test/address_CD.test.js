/*
 * address_CD.test.js - test the address parsing and formatting routines for Democratic Republic of Congo
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
        await LocaleData.ensureLocale("fr-CD");
    }
});

describe('Address parsing for Democratic Republic of Congo', () => {
    const testCases = [
        {
            name: 'should parse normal Congolese address with all components',
            input: "M. Mashala Kashama Kashele, B.P. 7948, KINSHASA 1, république démocratique du congo",
            locale: 'fr-CD',
            expected: {
                streetAddress: "M. Mashala Kashama Kashele, B.P. 7948",
                region: undefined,
                locality: "KINSHASA 1",
                postalCode: undefined,
                country: "république démocratique du congo",
                countryCode: "CD"
            }
        },
        {
            name: 'should parse Congolese address without zip code',
            input: "M. Mashala Kashama Kashele, B.P. 7948, KINSHASA 1, république démocratique du congo",
            locale: 'fr-CD',
            expected: {
                streetAddress: "M. Mashala Kashama Kashele, B.P. 7948",
                region: undefined,
                locality: "KINSHASA 1",
                postalCode: undefined,
                country: "république démocratique du congo",
                countryCode: "CD"
            }
        },
        {
            name: 'should parse Congolese address with multiple lines',
            input: "M. Mashala Kashama Kashele, B.P. 7948\nKINSHASA 1\nrépublique démocratique du congo",
            locale: 'fr-CD',
            expected: {
                streetAddress: "M. Mashala Kashama Kashele, B.P. 7948",
                region: undefined,
                locality: "KINSHASA 1",
                postalCode: undefined,
                country: "république démocratique du congo",
                countryCode: "CD"
            }
        },
        {
            name: 'should parse Congolese address in one line',
            input: "M. Mashala Kashama Kashele, B.P. 7948, KINSHASA 1, république démocratique du congo",
            locale: 'fr-CD',
            expected: {
                streetAddress: "M. Mashala Kashama Kashele, B.P. 7948",
                region: undefined,
                locality: "KINSHASA 1",
                postalCode: undefined,
                country: "république démocratique du congo",
                countryCode: "CD"
            }
        },
        {
            name: 'should parse Congolese address with superfluous whitespace',
            input: "M. Mashala Kashama Kashele, B.P. 7948  \n\t\n KINSHASA 1\t\n\n république démocratique du congo  \n  \t\t\t",
            locale: 'fr-CD',
            expected: {
                streetAddress: "M. Mashala Kashama Kashele, B.P. 7948",
                region: undefined,
                locality: "KINSHASA 1",
                postalCode: undefined,
                country: "république démocratique du congo",
                countryCode: "CD"
            }
        },
        {
            name: 'should parse Congolese address without delimiters',
            input: "M. Mashala Kashama Kashele B.P. 7948 KINSHASA 1 république démocratique du congo",
            locale: 'fr-CD',
            expected: {
                streetAddress: "M. Mashala Kashama Kashele B.P. 7948",
                region: undefined,
                locality: "KINSHASA 1",
                postalCode: undefined,
                country: "république démocratique du congo",
                countryCode: "CD"
            }
        },
        {
            name: 'should parse Congolese address with special characters',
            input: "Office congolais des postes, et télécommunications,B.P. 7948, KINSHASA 1, république démocratique du congo",
            locale: 'fr-CD',
            expected: {
                streetAddress: "Office congolais des postes, et télécommunications, B.P. 7948",
                region: undefined,
                locality: "KINSHASA 1",
                postalCode: undefined,
                country: "république démocratique du congo",
                countryCode: "CD"
            }
        },
        {
            name: 'should parse Congolese address from US locale',
            input: "M. Mashala Kashama Kashele, B.P. 7948, KINSHASA 1, république démocratique du congo",
            locale: 'en-US',
            expected: {
                streetAddress: "M. Mashala Kashama Kashele, B.P. 7948",
                region: undefined,
                locality: "KINSHASA 1",
                postalCode: undefined,
                country: "république démocratique du congo",
                countryCode: "CD"
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

describe('Address formatting for Democratic Republic of Congo', () => {
    const testCases = [
        {
            name: 'should format Congolese address with French locale',
            address: {
                streetAddress: "M. Mashala Kashama Kashele\nB.P. 7948",
                locality: "KINSHASA 1",
                country: "république démocratique du congo",
                countryCode: "AM"
            },
            locale: 'fr-CD',
            expected: "M. Mashala Kashama Kashele\nB.P. 7948\nKINSHASA 1\nrépublique démocratique du congo"
        },
        {
            name: 'should format Congolese address with US locale',
            address: {
                streetAddress: "M. Mashala Kashama Kashele\nB.P. 7948",
                country: "république démocratique du congo",
                locality: "KINSHASA 1",
                countryCode: "AM"
            },
            locale: 'en-US',
            expected: "M. Mashala Kashama Kashele\nB.P. 7948\nKINSHASA 1\nrépublique démocratique du congo"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 