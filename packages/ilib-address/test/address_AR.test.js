/*
 * address_AR.test.js - test the address parsing and formatting routines for Argentina
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
        let promise = Promise.resolve(true);
        ["es-AR", "en-US"].forEach(locale => {
            promise = promise.then(() => {
                return LocaleData.ensureLocale(locale);
            });
        });
        await promise;
    }
});

describe('Address parsing for Argentina (AR)', () => {
    const testCases = [
        {
            name: 'should parse normal Argentine address with name, street, floor, apartment, postal code, locality and country',
            input: "Luis Escala Piedras 623\nPiso 2, depto 4\nC1070AAM Capital Federa\nARGENTINA",
            expected: {
                streetAddress: "Luis Escala Piedras 623, Piso 2, depto 4",
                locality: "Capital Federa",
                region: undefined,
                postalCode: "C1070AAM",
                country: "ARGENTINA",
                countryCode: "AR"
            }
        },
        {
            name: 'should parse Argentine address without postal code',
            input: "Luis Escala Piedras 623\nPiso 2, depto 4\nCapital Federa\nARGENTINA",
            expected: {
                streetAddress: "Luis Escala Piedras 623, Piso 2, depto 4",
                locality: "Capital Federa",
                region: undefined,
                country: "ARGENTINA",
                countryCode: "AR",
                postalCode: undefined
            }
        },
        {
            name: 'should parse Argentine address without country name',
            input: "Juana Aguirre, Piedras No 623, Piso2 Dto.4\nC1070AAM Capital Federal",
            expected: {
                streetAddress: "Juana Aguirre, Piedras No 623, Piso2 Dto.4",
                locality: "Capital Federal",
                region: undefined,
                postalCode: "C1070AAM",
                country: undefined,
                countryCode: "AR"
            }
        },
        {
            name: 'should parse Argentine address with multiple lines',
            input: "Juana Aguirre\nEscuela Rural 45 \nPiedras No 623\nPiso2 Dto.4\nC1070AAM Capital Federal\nARGENTINA\n\n\n",
            expected: {
                streetAddress: "Juana Aguirre, Escuela Rural 45, Piedras No 623, Piso2 Dto.4",
                locality: "Capital Federal",
                region: undefined,
                postalCode: "C1070AAM",
                country: "ARGENTINA",
                countryCode: "AR"
            }
        },
        {
            name: 'should parse Argentine address in single line format',
            input: "Juana Aguirre, Piedras No 623, Piso2 Dto.4, C1070AAM Capital Federal, ARGENTINA",
            expected: {
                streetAddress: "Juana Aguirre, Piedras No 623, Piso2 Dto.4",
                locality: "Capital Federal",
                region: undefined,
                postalCode: "C1070AAM",
                country: "ARGENTINA",
                countryCode: "AR"
            }
        },
        {
            name: 'should parse Argentine address with superfluous whitespace',
            input: "\t\t\tLuis Escala Piedras 623\n\n\nPiso 2, depto 4\n   \t\nC1070AAM Capital Federa\n   \r\t\t \t \t ARGENTINA\n\n\n",
            expected: {
                streetAddress: "Luis Escala Piedras 623, Piso 2, depto 4",
                locality: "Capital Federa",
                region: undefined,
                postalCode: "C1070AAM",
                country: "ARGENTINA",
                countryCode: "AR"
            }
        },
        {
            name: 'should parse Argentine address without delimiters',
            input: "Luis Escala Piedras 623 Piso 2, depto 4 C1070AAM  Capital Federa ARGENTINA",
            expected: {
                streetAddress: "Luis Escala Piedras 623 Piso 2, depto 4",
                locality: "Capital Federa",
                region: undefined,
                postalCode: "C1070AAM",
                country: "ARGENTINA",
                countryCode: "AR"
            }
        },
        {
            name: 'should parse Argentine address with special characters',
            input: "At. Sr. Hiro Gordo-Globo\nSumo Informática S.A.\nCalle 39 No 1540\nB1000TBU San Sebastian\nARGENTINA",
            expected: {
                streetAddress: "At. Sr. Hiro Gordo-Globo, Sumo Informática S.A., Calle 39 No 1540",
                locality: "San Sebastian",
                region: undefined,
                postalCode: "B1000TBU",
                country: "ARGENTINA",
                countryCode: "AR"
            }
        },
        {
            name: 'should parse Argentine address from US locale',
            input: "At. Sr. Hiro Gordo-Globo, Sumo Informática S.A., Calle 39 No 1540\nB1000TBU San Sebastian\nArgentina",
            expected: {
                streetAddress: "At. Sr. Hiro Gordo-Globo, Sumo Informática S.A., Calle 39 No 1540",
                locality: "San Sebastian",
                region: undefined,
                postalCode: "B1000TBU",
                country: "Argentina",
                countryCode: "AR"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
        const parsedAddress = new Address(input, { locale: 'es-AR' });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Argentina (AR)', () => {
    test('should format Argentine address with all components', () => {
        const parsedAddress = new Address({
            streetAddress: "At. Sr. Hiro Gordo-Globo, Sumo Informática S.A., Calle 39 No 1540",
            locality: "San Sebastian",
            postalCode: "B1000TBU",
            country: "ARGENTINA",
            countryCode: "AR"
        }, { locale: 'es-AR' });

        const expected = "At. Sr. Hiro Gordo-Globo, Sumo Informática S.A., Calle 39 No 1540\nB1000TBU San Sebastian\nARGENTINA";
        const formatter = new AddressFmt({ locale: 'es-AR' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Argentine address from US locale', () => {
        const parsedAddress = new Address({
            streetAddress: "At. Sr. Hiro Gordo-Globo, Sumo Informática S.A., Calle 39 No 1540",
            locality: "San Sebastian",
            postalCode: "B1000TBU",
            country: "Argentina",
            countryCode: "AR"
        }, { locale: 'en-US' });

        const expected = "At. Sr. Hiro Gordo-Globo, Sumo Informática S.A., Calle 39 No 1540\nB1000TBU San Sebastian\nArgentina";
        const formatter = new AddressFmt({ locale: 'en-US' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 