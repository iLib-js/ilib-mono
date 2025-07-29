/*
 * address_DO.test.js - test the address parsing and formatting routines for Dominican Republic
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
        await LocaleData.ensureLocale("es-DO");
    }
});

describe('Address parsing for Dominican Republic', () => {
    const testCases = [
        {
            name: 'should parse normal Dominican address',
            input: "Dominica L. Hernandez, C/45 # 33, Katanga, Los Minas, 11903 SANTO DOMINGO, República Dominicana",
            locale: 'es-DO',
            expected: {
                streetAddress: "Dominica L. Hernandez, C/45 # 33, Katanga",
                region: "SANTO DOMINGO",
                locality: "Los Minas",
                postalCode: "11903",
                country: "República Dominicana",
                countryCode: "DO"
            }
        },
        {
            name: 'should parse Dominican address without zip code',
            input: "Dominica L. Hernandez, C/45 # 33, Katanga, Los Minas, 11903 SANTO DOMINGO, República Dominicana",
            locale: 'es-DO',
            expected: {
                streetAddress: "Dominica L. Hernandez, C/45 # 33, Katanga",
                region: "SANTO DOMINGO",
                locality: "Los Minas",
                postalCode: "11903",
                country: "República Dominicana",
                countryCode: "DO"
            }
        },
        {
            name: 'should parse Dominican address with multiple lines',
            input: "Dominica L. Hernandez\nC/45 # 33\nKatanga, Los Minas\n11903 SANTO DOMINGO\nRepública Dominicana",
            locale: 'es-DO',
            expected: {
                streetAddress: "Dominica L. Hernandez, C/45 # 33, Katanga",
                region: "SANTO DOMINGO",
                locality: "Los Minas",
                postalCode: "11903",
                country: "República Dominicana",
                countryCode: "DO"
            }
        },
        {
            name: 'should parse Dominican address in one line',
            input: "Dominica L. Hernandez, C/45 # 33, Katanga, Los Minas, 11903 SANTO DOMINGO, República Dominicana",
            locale: 'es-DO',
            expected: {
                streetAddress: "Dominica L. Hernandez, C/45 # 33, Katanga",
                region: "SANTO DOMINGO",
                locality: "Los Minas",
                postalCode: "11903",
                country: "República Dominicana",
                countryCode: "DO"
            }
        },
        {
            name: 'should parse Dominican address with superfluous whitespace',
            input: "Dominica L. Hernandez, C/45 # 33, Katanga, Los Minas  \n\t\n 11903 SANTO DOMINGO\t\n\n República Dominicana  \n  \t\t\t",
            locale: 'es-DO',
            expected: {
                streetAddress: "Dominica L. Hernandez, C/45 # 33, Katanga",
                region: "SANTO DOMINGO",
                locality: "Los Minas",
                postalCode: "11903",
                country: "República Dominicana",
                countryCode: "DO"
            }
        },
        {
            name: 'should parse Dominican address without delimiters',
            input: "Dominica L. Hernandez C/45 # 33 Katanga, Los Minas 11903 SANTO DOMINGO República Dominicana",
            locale: 'es-DO',
            expected: {
                streetAddress: "Dominica L. Hernandez C/45 # 33 Katanga",
                region: "SANTO DOMINGO",
                locality: "Los Minas",
                postalCode: "11903",
                country: "República Dominicana",
                countryCode: "DO"
            }
        },
        {
            name: 'should parse Dominican address with special characters',
            input: "Instituto Postal Dominicano, C/Héroes de Luperón esq. Rafael Damirón, Centro de los Héroes, 10101 SANTO DOMINGO, República Dominicana",
            locale: 'es-DO',
            expected: {
                streetAddress: "Instituto Postal Dominicano, C/Héroes de Luperón esq. Rafael Damirón",
                region: "SANTO DOMINGO",
                locality: "Centro de los Héroes",
                postalCode: "10101",
                country: "República Dominicana",
                countryCode: "DO"
            }
        },
        {
            name: 'should parse Dominican address from US locale',
            input: "Dominica L. Hernandez, C/45 # 33, Katanga, Los Minas, 11903 SANTO DOMINGO, Dominican Republic",
            locale: 'en-US',
            expected: {
                streetAddress: "Dominica L. Hernandez, C/45 # 33, Katanga",
                region: "SANTO DOMINGO",
                locality: "Los Minas",
                postalCode: "11903",
                country: "Dominican Republic",
                countryCode: "DO"
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

describe('Address formatting for Dominican Republic', () => {
    const testCases = [
        {
            name: 'should format Dominican address with Spanish locale',
            address: {
                streetAddress: "Dominica L. Hernandez, C/45 # 33",
                region: "SANTO DOMINGO",
                locality: "Katanga, Los Minas",
                postalCode: "11903",
                country: "República Dominicana",
                countryCode: "DO"
            },
            locale: 'es-DO',
            expected: "Dominica L. Hernandez, C/45 # 33\nKatanga, Los Minas\n11903 SANTO DOMINGO\nRepública Dominicana"
        },
        {
            name: 'should format Dominican address with US locale',
            address: {
                streetAddress: "Dominica L. Hernandez, C/45 # 33",
                region: "SANTO DOMINGO",
                locality: "Katanga, Los Minas",
                postalCode: "11903",
                country: "Dominican Republic",
                countryCode: "DO"
            },
            locale: 'en-US',
            expected: "Dominica L. Hernandez, C/45 # 33\nKatanga, Los Minas\n11903 SANTO DOMINGO\nDominican Republic"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 