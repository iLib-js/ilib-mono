/*
 * address_ES.test.js - test the address parsing and formatting routines for Spain
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

let setUpPerformed = false;

beforeAll(async () => {
    if (getPlatform() === "browser" && !setUpPerformed) {
        setUpPerformed = true;
        await LocaleData.ensureLocale("es-ES");
    }
});

describe('Address parsing for Spain (ES)', () => {
    const testCases = [
        {
            name: 'should parse normal Spanish address with street, postal code, region and country',
            input: "Avda.General Avilés, 35-37, Bajo\n46015 - Valencia\nEspaña",
            expected: {
                streetAddress: "Avda.General Avilés, 35-37, Bajo",
                region: "Valencia",
                locality: undefined,
                postalCode: "46015",
                country: "España",
                countryCode: "ES"
            }
        },
        {
            name: 'should parse Spanish address without postal code',
            input: "Torre Picasso\nPlaza Pablo Ruiz Picasso 1\nMadrid\nEspaña",
            expected: {
                streetAddress: "Torre Picasso, Plaza Pablo Ruiz Picasso 1",
                region: "Madrid",
                locality: undefined,
                country: "España",
                countryCode: "ES",
                postalCode: undefined
            }
        },
        {
            name: 'should parse Spanish address without country name',
            input: "Isabel de Santo Domingo, 6\n50014 - Zaragoza",
            expected: {
                streetAddress: "Isabel de Santo Domingo, 6",
                region: "Zaragoza",
                locality: undefined,
                postalCode: "50014",
                country: undefined,
                countryCode: "ES"
            }
        },
        {
            name: 'should parse Spanish address with multiple lines including locality',
            input: "Cami de Can Graells\nno. 1-21\n08174\nSant Cugat del Valles\nBarcelona\nEspaña",
            expected: {
                streetAddress: "Cami de Can Graells, no. 1-21",
                locality: "Sant Cugat del Valles",
                region: "Barcelona",
                postalCode: "08174",
                country: "España",
                countryCode: "ES"
            }
        },
        {
            name: 'should parse Spanish address in single line format',
            input: "Calle José Echegaray, 8, Parque Empresarial Madrid-Las Rozas, 28232 - Las Rozas. Madrid, España",
            expected: {
                streetAddress: "Calle José Echegaray, 8, Parque Empresarial Madrid-Las Rozas",
                locality: "Las Rozas.",
                region: "Madrid",
                postalCode: "28232",
                country: "España",
                countryCode: "ES"
            }
        },
        {
            name: 'should parse Spanish address with superfluous whitespace',
            input: "\t\t\tAvda.General\t\t\r Avilés,\r 35-37,\r Bajo\n\t\t\t\r\r46015\r -\r\r \nValencia,\n,\t\tEspaña\n\n\n",
            expected: {
                streetAddress: "Avda.General Avilés, 35-37, Bajo",
                region: "Valencia",
                locality: undefined,
                postalCode: "46015",
                country: "España",
                countryCode: "ES"
            }
        },
        {
            name: 'should parse Spanish address without delimiters',
            input: "Calle José Echegaray, 8 Parque Empresarial Madrid-Las Rozas 28232 - Las Rozas Madrid España",
            expected: {
                streetAddress: "Calle José Echegaray, 8 Parque Empresarial Madrid-Las Rozas",
                locality: "Las Rozas",
                region: "Madrid",
                postalCode: "28232",
                country: "España",
                countryCode: "ES"
            }
        },
        {
            name: 'should parse Spanish address with special characters',
            input: "Avda.General Avilés, 35-37, Bajo\n46015 - Sedaví, València",
            expected: {
                streetAddress: "Avda.General Avilés, 35-37, Bajo",
                locality: "Sedaví",
                region: "València",
                postalCode: "46015",
                country: undefined,
                countryCode: "ES"
            }
        },
        {
            name: 'should parse Spanish address from US locale with English country name',
            input: "Avda.General Avilés, 35-37, Bajo\n46015 - Sedaví, València, Spain",
            expected: {
                streetAddress: "Avda.General Avilés, 35-37, Bajo",
                locality: "Sedaví",
                region: "València",
                postalCode: "46015",
                country: "Spain",
                countryCode: "ES"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
        const parsedAddress = new Address(input, { locale: 'es-ES' });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Spain (ES)', () => {
    test('should format Spanish address with all components', () => {
        const parsedAddress = new Address({
            streetAddress: "Avda.General Avilés, 35-37, Bajo",
            locality: "Sedaví",
            region: "València",
            postalCode: "46015",
            country: "España",
            countryCode: "ES"
        }, { locale: 'es-ES' });

        const expected = "Avda.General Avilés, 35-37, Bajo\n46015 - Sedaví València\nEspaña";
        const formatter = new AddressFmt({ locale: 'es-ES' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Spanish address from US locale with English country name', () => {
        const parsedAddress = new Address({
            streetAddress: "Avda.General Avilés, 35-37, Bajo",
            locality: "Sedaví",
            region: "València",
            postalCode: "46015",
            country: "Spain",
            countryCode: "ES"
        }, { locale: 'en-US' });

        const expected = "Avda.General Avilés, 35-37, Bajo\n46015 - Sedaví València\nSpain";
        const formatter = new AddressFmt({ locale: 'en-US' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 