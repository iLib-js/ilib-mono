/*
 * address_CG.test.js - test the address parsing and formatting routines for Republic of Congo
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
        await LocaleData.ensureLocale("fr-CG");
    }
});

describe('Address parsing for Republic of Congo', () => {
    const testCases = [
        {
            name: 'should parse normal Congolese address with all components',
            input: "M. Joseph Mbemba 12, rue Kakamoueka\nBRAZZAVILLE\nCongo-Brazzaville",
            locale: 'fr-CG',
            expected: {
                streetAddress: "M. Joseph Mbemba 12, rue Kakamoueka",
                locality: "BRAZZAVILLE",
                region: undefined,
                postalCode: undefined,
                country: "Congo-Brazzaville",
                countryCode: "CG"
            }
        },
        {
            name: 'should parse Congolese address without zip code',
            input: "M. Joseph Mbemba 12, rue Kakamoueka\nBRAZZAVILLE\nCongo-Brazzaville",
            locale: 'fr-CG',
            expected: {
                streetAddress: "M. Joseph Mbemba 12, rue Kakamoueka",
                locality: "BRAZZAVILLE",
                region: undefined,
                postalCode: undefined,
                country: "Congo-Brazzaville",
                countryCode: "CG"
            }
        },
        {
            name: 'should parse Congolese address without country',
            input: "M. Joseph Mbemba 12, rue Kakamoueka\nBRAZZAVILLE",
            locale: 'fr-CG',
            expected: {
                streetAddress: "M. Joseph Mbemba 12, rue Kakamoueka",
                locality: "BRAZZAVILLE",
                region: undefined,
                postalCode: undefined,
                country: undefined,
                countryCode: "CG"
            }
        },
        {
            name: 'should parse Congolese address with multiple lines',
            input: "M. Joseph Mbemba 12\nrue Kakamoueka\nBRAZZAVILLE\nCongo-Brazzaville\n\n\n",
            locale: 'fr-CG',
            expected: {
                streetAddress: "M. Joseph Mbemba 12, rue Kakamoueka",
                locality: "BRAZZAVILLE",
                region: undefined,
                postalCode: undefined,
                country: "Congo-Brazzaville",
                countryCode: "CG"
            }
        },
        {
            name: 'should parse Congolese address in one line',
            input: "M. Joseph Mbemba 12 , rue Kakamoueka , BRAZZAVILLE , Congo-Brazzaville",
            locale: 'fr-CG',
            expected: {
                streetAddress: "M. Joseph Mbemba 12, rue Kakamoueka",
                locality: "BRAZZAVILLE",
                region: undefined,
                postalCode: undefined,
                country: "Congo-Brazzaville",
                countryCode: "CG"
            }
        },
        {
            name: 'should parse Congolese address with superfluous whitespace',
            input: "\t\t\t\tM. Joseph Mbemba 12\t\t\true Kakamoueka\n\t\nBRAZZAVILLE\n\tCongo-Brazzaville\n\n\n",
            locale: 'fr-CG',
            expected: {
                streetAddress: "M. Joseph Mbemba 12 rue Kakamoueka",
                locality: "BRAZZAVILLE",
                region: undefined,
                postalCode: undefined,
                country: "Congo-Brazzaville",
                countryCode: "CG"
            }
        },
        {
            name: 'should parse Congolese address without delimiters',
            input: "M. Joseph Mbemba 12 rue Kakamoueka BRAZZAVILLE Congo-Brazzaville",
            locale: 'fr-CG',
            expected: {
                streetAddress: "M. Joseph Mbemba 12 rue Kakamoueka",
                locality: "BRAZZAVILLE",
                region: undefined,
                postalCode: undefined,
                country: "Congo-Brazzaville",
                countryCode: "CG"
            }
        },
        {
            name: 'should parse Congolese address from US locale',
            input: "M. Joseph Mbemba 12, rue Kakamoueka\nBRAZZAVILLE\nCongo - Brazzaville",
            locale: 'en-US',
            expected: {
                streetAddress: "M. Joseph Mbemba 12, rue Kakamoueka",
                locality: "BRAZZAVILLE",
                region: undefined,
                postalCode: undefined,
                country: "Congo - Brazzaville",
                countryCode: "CG"
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

describe('Address formatting for Republic of Congo', () => {
    const testCases = [
        {
            name: 'should format Congolese address with French locale',
            address: {
                streetAddress: "M. Joseph Mbemba 12, rue Kakamoueka",
                locality: "BRAZZAVILLE",
                country: "Congo-Brazzaville",
                countryCode: "CG"
            },
            locale: 'fr-CG',
            expected: "M. Joseph Mbemba 12, rue Kakamoueka\nBRAZZAVILLE\nCongo-Brazzaville"
        },
        {
            name: 'should format Congolese address with US locale',
            address: {
                streetAddress: "M. Joseph Mbemba 12, rue Kakamoueka",
                locality: "BRAZZAVILLE",
                country: "Congo - Brazzaville",
                countryCode: "CG"
            },
            locale: 'en-US',
            expected: "M. Joseph Mbemba 12, rue Kakamoueka\nBRAZZAVILLE\nCongo - Brazzaville"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 