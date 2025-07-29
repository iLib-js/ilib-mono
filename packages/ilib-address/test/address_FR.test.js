/*
 * address_FR.test.js - test the address parsing and formatting routines for France
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
        await LocaleData.ensureLocale("fr-FR");
    }
});

describe('Address parsing for France', () => {
    const testCases = [
        {
            name: 'should parse normal French address',
            input: "38 avenue de l'Opéra\n75002 Paris\nFrance",
            locale: 'fr-FR',
            expected: {
                streetAddress: "38 avenue de l'Opéra",
                locality: "Paris",
                region: undefined,
                postalCode: "75002",
                country: "France",
                countryCode: "FR"
            }
        },
        {
            name: 'should parse French address without zip code',
            input: "80 rue Camille Desmoulins\nIssy-les-Moulineaux\nFrance",
            locale: 'fr-FR',
            expected: {
                streetAddress: "80 rue Camille Desmoulins",
                locality: "Issy-les-Moulineaux",
                region: undefined,
                postalCode: undefined,
                country: "France",
                countryCode: "FR"
            }
        },
        {
            name: 'should parse French address without country',
            input: "38 avenue de l'Opéra\n75002 Paris",
            locale: 'fr-FR',
            expected: {
                streetAddress: "38 avenue de l'Opéra",
                locality: "Paris",
                region: undefined,
                postalCode: "75002",
                country: undefined,
                countryCode: "FR"
            }
        },
        {
            name: 'should parse French address with cedex',
            input: "38 avenue de l'Opéra\n75002 Paris cedex 9\nFrance",
            locale: 'fr-FR',
            expected: {
                streetAddress: "38 avenue de l'Opéra",
                locality: "Paris",
                region: undefined,
                postalCode: "75002",
                postOffice: "cedex 9",
                country: "France",
                countryCode: "FR"
            }
        },
        {
            name: 'should parse French address with multiple lines',
            input: "Technoparc de l'Aubinière\n3, avenie des Améthystes\n44300\nNantes\nFrance",
            locale: 'fr-FR',
            expected: {
                streetAddress: "Technoparc de l'Aubinière, 3, avenie des Améthystes",
                locality: "Nantes",
                region: undefined,
                postalCode: "44300",
                country: "France",
                countryCode: "FR"
            }
        },
        {
            name: 'should parse French address in one line',
            input: "4, Avenue Pablo Picasso, 92024 Nanterre, France",
            locale: 'fr-FR',
            expected: {
                streetAddress: "4, Avenue Pablo Picasso",
                locality: "Nanterre",
                region: undefined,
                postalCode: "92024",
                country: "France",
                countryCode: "FR"
            }
        },
        {
            name: 'should parse French address with superfluous whitespace',
            input: "\t\t\tTechnoparc de l'Aubinière\n  \t \t \t  3, avenie des Améthystes\n\n\t \t \n44300 \t\r \n       Nantes\t\nFrance \r\r\t \t \n\n\n",
            locale: 'fr-FR',
            expected: {
                streetAddress: "Technoparc de l'Aubinière, 3, avenie des Améthystes",
                locality: "Nantes",
                region: undefined,
                postalCode: "44300",
                country: "France",
                countryCode: "FR"
            }
        },
        {
            name: 'should parse French address without delimiters',
            input: "4 Avenue Pablo Picasso 92024 Nanterre France",
            locale: 'fr-FR',
            expected: {
                streetAddress: "4 Avenue Pablo Picasso",
                locality: "Nanterre",
                region: undefined,
                postalCode: "92024",
                country: "France",
                countryCode: "FR"
            }
        },
        {
            name: 'should parse French address from US locale',
            input: "Z.I. de Courtaboeuf\n1, avenue du Canada\n91947 Les Ulis\nFrance",
            locale: 'en-US',
            expected: {
                streetAddress: "Z.I. de Courtaboeuf, 1, avenue du Canada",
                locality: "Les Ulis",
                region: undefined,
                postalCode: "91947",
                country: "France",
                countryCode: "FR"
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
        if (expected.postOffice !== undefined) {
            expect(parsedAddress.postOffice).toBe(expected.postOffice);
        }
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for France', () => {
    const testCases = [
        {
            name: 'should format French address with French locale',
            address: {
                streetAddress: "38 avenue de l'Opéra",
                locality: "Paris",
                postalCode: "75002",
                country: "France",
                countryCode: "FR"
            },
            locale: 'fr-FR',
            expected: "38 avenue de l'Opéra\n75002 Paris\nFrance"
        },
        {
            name: 'should format French address with US locale',
            address: {
                streetAddress: "38 avenue de l'Opéra",
                locality: "Paris",
                postalCode: "75002",
                country: "France",
                countryCode: "FR"
            },
            locale: 'en-US',
            expected: "38 avenue de l'Opéra\n75002 Paris\nFrance"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 