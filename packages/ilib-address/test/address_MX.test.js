/*
 * address_MX.test.js - test the address parsing and formatting routines for Mexico
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

describe('Address parsing and formatting for Mexico', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("es-MX");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Mexican address',
                input: "Paseo de la Reforma #115, Piso 22\nCol. Lomas de Chapultepec\n11000 México D.F.\nMéxico",
                locale: 'es-MX',
                expected: {
                    streetAddress: "Paseo de la Reforma #115, Piso 22, Col. Lomas de Chapultepec",
                    locality: "México",
                    region: "D.F.",
                    postalCode: "11000",
                    country: "México",
                    countryCode: "MX"
                }
            },
            {
                name: 'should parse Mexican address without postal code',
                input: "20 de Noviembre 855 Sur\nObispado\nMonterrey, NL\nMéxico",
                locale: 'es-MX',
                expected: {
                    streetAddress: "20 de Noviembre 855 Sur, Obispado",
                    locality: "Monterrey",
                    region: "NL",
                    country: "México",
                    countryCode: "MX"
                }
            },
            {
                name: 'should parse Mexican address without country',
                input: "AV RIO MIXCOAC N° 125 , INSURGENTES MIXCOAC , C.P 03920 , BENITO JUAREZ , DF",
                locale: 'es-MX',
                expected: {
                    streetAddress: "AV RIO MIXCOAC N° 125, INSURGENTES MIXCOAC",
                    locality: "BENITO JUAREZ",
                    region: "DF",
                    postalCode: "C.P 03920",
                    countryCode: "MX"
                }
            },
            {
                name: 'should parse Mexican address with multiple lines',
                input: "Colegio Niños de México\nQueretaro 151\nRoma\nC.P 06700\nCuauhtemoc\nDF\nMéxico",
                locale: 'es-MX',
                expected: {
                    streetAddress: "Colegio Niños de México, Queretaro 151, Roma",
                    locality: "Cuauhtemoc",
                    region: "DF",
                    postalCode: "C.P 06700",
                    country: "México",
                    countryCode: "MX"
                }
            },
            {
                name: 'should parse Mexican address in single line format',
                input: "Vicente Guerrero S/N , Centro , C.P 23450 , Cabo San Lucas , BCS , México",
                locale: 'es-MX',
                expected: {
                    streetAddress: "Vicente Guerrero S/N, Centro",
                    locality: "Cabo San Lucas",
                    region: "BCS",
                    postalCode: "C.P 23450",
                    country: "México",
                    countryCode: "MX"
                }
            },
            {
                name: 'should parse Mexican address with superfluous whitespace',
                input: "\t\t\tVicente     Guerrero \tS/N\n\t\tCentro\t\n C.P\t\r 23450\n\t\t\r Cabo   \t\r San Lucas\n\n\n\tBCS\r\t\nMéxico\n\n\n",
                locale: 'es-MX',
                expected: {
                    streetAddress: "Vicente Guerrero S/N, Centro",
                    locality: "Cabo San Lucas",
                    region: "BCS",
                    postalCode: "C.P 23450",
                    country: "México",
                    countryCode: "MX"
                }
            },
            {
                name: 'should parse Mexican address without delimiters',
                input: "Vicente Guerrero S/N Centro C.P 23450 Cabo San Lucas BCS México",
                locale: 'es-MX',
                expected: {
                    streetAddress: "Vicente Guerrero S/N Centro",
                    locality: "Cabo San Lucas",
                    region: "BCS",
                    postalCode: "C.P 23450",
                    country: "México",
                    countryCode: "MX"
                }
            },
            {
                name: 'should parse Mexican address with special characters',
                input: "Calle Yucatán No. 45\nC.P 97751 Chichén Itzá, Yucatán\nMéxico",
                locale: 'es-MX',
                expected: {
                    streetAddress: "Calle Yucatán No. 45",
                    locality: "Chichén Itzá",
                    region: "Yucatán",
                    postalCode: "C.P 97751",
                    country: "México",
                    countryCode: "MX"
                }
            },
            {
                name: 'should parse Mexican address from US locale context',
                input: "Vicente Guerrero S/N , Centro\nC.P 23450 Cabo San Lucas, BCS\nMexico",
                locale: 'en-US',
                expected: {
                    streetAddress: "Vicente Guerrero S/N, Centro",
                    locality: "Cabo San Lucas",
                    region: "BCS",
                    postalCode: "C.P 23450",
                    country: "Mexico",
                    countryCode: "MX"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            
            if (expected.region !== undefined) {
                expect(parsedAddress.region).toBe(expected.region);
            } else {
                expect(parsedAddress.region).toBeUndefined();
            }
            
            if (expected.postalCode !== undefined) {
                expect(parsedAddress.postalCode).toBe(expected.postalCode);
            } else {
                expect(parsedAddress.postalCode).toBeUndefined();
            }
            
            if (expected.country !== undefined) {
                expect(parsedAddress.country).toBe(expected.country);
            } else {
                expect(parsedAddress.country).toBeUndefined();
            }
            
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting tests', () => {
        test('should format Mexican address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Vicente Guerrero S/N, Centro",
                locality: "Cabo San Lucas",
                region: "BCS",
                postalCode: "C.P 23450",
                country: "México",
                countryCode: "MX"
            }, { locale: 'es-MX' });

            const expected = "Vicente Guerrero S/N, Centro\nC.P 23450 Cabo San Lucas, BCS\nMéxico";
            const formatter = new AddressFmt({ locale: 'es-MX' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Mexican address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Vicente Guerrero S/N, Centro",
                locality: "Cabo San Lucas",
                region: "BCS",
                postalCode: "C.P 23450",
                country: "Mexico",
                countryCode: "MX"
            }, { locale: 'en-US' });

            const expected = "Vicente Guerrero S/N, Centro\nC.P 23450 Cabo San Lucas, BCS\nMexico";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 