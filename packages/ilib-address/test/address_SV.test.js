/*
 * address_SV.test.js - El Salvador address parsing and formatting tests for ilib-address
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

describe('address_SV', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("es-SV");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal El Salvador address with all components',
                address: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29, CP 1120 - MEJICANOS, SAN SALVADOR, EL SALVADOR",
                locale: 'es-SV',
                expected: {
                    streetAddress: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29",
                    region: "SAN SALVADOR",
                    locality: "MEJICANOS",
                    postalCode: "CP 1120",
                    country: "EL SALVADOR",
                    countryCode: "SV"
                }
            },
            {
                name: 'should parse El Salvador address without postal code',
                address: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29, MEJICANOS, SAN SALVADOR, EL SALVADOR",
                locale: 'es-SV',
                expected: {
                    streetAddress: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29",
                    region: "SAN SALVADOR",
                    locality: "MEJICANOS",
                    postalCode: undefined,
                    country: "EL SALVADOR",
                    countryCode: "SV"
                }
            },
            {
                name: 'should parse El Salvador address with multiple lines',
                address: "Señora Rina Isabel Peña Borja\nColonia Universitaria Norte #2\nCalle Alcaine #29\nCP 1120 - MEJICANOS\nSAN SALVADOR\nEL SALVADOR",
                locale: 'es-SV',
                expected: {
                    streetAddress: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29",
                    region: "SAN SALVADOR",
                    locality: "MEJICANOS",
                    postalCode: "CP 1120",
                    country: "EL SALVADOR",
                    countryCode: "SV"
                }
            },
            {
                name: 'should parse El Salvador address in single line format',
                address: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29, CP 1120 - MEJICANOS, SAN SALVADOR, EL SALVADOR",
                locale: 'es-SV',
                expected: {
                    streetAddress: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29",
                    region: "SAN SALVADOR",
                    locality: "MEJICANOS",
                    postalCode: "CP 1120",
                    country: "EL SALVADOR",
                    countryCode: "SV"
                }
            },
            {
                name: 'should parse El Salvador address with superfluous whitespace',
                address: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29  \n\t\n CP 1120 - MEJICANOS, SAN SALVADOR\t\n\n EL SALVADOR  \n  \t\t\t",
                locale: 'es-SV',
                expected: {
                    streetAddress: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29",
                    region: "SAN SALVADOR",
                    locality: "MEJICANOS",
                    postalCode: "CP 1120",
                    country: "EL SALVADOR",
                    countryCode: "SV"
                }
            },
            {
                name: 'should parse El Salvador address without delimiters',
                address: "Señora Rina Isabel Peña Borja Colonia Universitaria Norte #2 Calle Alcaine #29 CP 1120 - MEJICANOS SAN SALVADOR EL SALVADOR",
                locale: 'es-SV',
                expected: {
                    streetAddress: "Señora Rina Isabel Peña Borja Colonia Universitaria Norte #2 Calle Alcaine #29",
                    region: "SAN SALVADOR",
                    locality: "MEJICANOS",
                    postalCode: "CP 1120",
                    country: "EL SALVADOR",
                    countryCode: "SV"
                }
            },
            {
                name: 'should parse El Salvador address with special characters',
                address: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29, CP 1120 - MEJICANOS, SAN SALVADOR, EL SALVADOR",
                locale: 'es-SV',
                expected: {
                    streetAddress: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29",
                    region: "SAN SALVADOR",
                    locality: "MEJICANOS",
                    postalCode: "CP 1120",
                    country: "EL SALVADOR",
                    countryCode: "SV"
                }
            },
            {
                name: 'should parse El Salvador address from US locale',
                address: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29, CP 1120 - MEJICANOS, SAN SALVADOR, EL SALVADOR",
                locale: 'en-US',
                expected: {
                    streetAddress: "Señora Rina Isabel Peña Borja, Colonia Universitaria Norte #2, Calle Alcaine #29",
                    region: "SAN SALVADOR",
                    locality: "MEJICANOS",
                    postalCode: "CP 1120",
                    country: "EL SALVADOR",
                    countryCode: "SV"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting', () => {
        const testCases = [
            {
                name: 'should format El Salvador address in Spanish locale',
                address: {
                    streetAddress: "Señora Rina Isabel Peña Borja\nColonia Universitaria Norte #2\nCalle Alcaine #29",
                    region: "SAN SALVADOR",
                    locality: "MEJICANOS",
                    postalCode: "CP 1120",
                    country: "EL SALVADOR",
                    countryCode: "SV"
                },
                locale: 'es-SV',
                expected: "Señora Rina Isabel Peña Borja\nColonia Universitaria Norte #2\nCalle Alcaine #29\nCP 1120 - MEJICANOS\nSAN SALVADOR\nEL SALVADOR"
            },
            {
                name: 'should format El Salvador address in US locale',
                address: {
                    streetAddress: "Señora Rina Isabel Peña Borja\nColonia Universitaria Norte #2\nCalle Alcaine #29",
                    region: "SAN SALVADOR",
                    locality: "MEJICANOS",
                    postalCode: "CP 1120",
                    country: "EL SALVADOR",
                    countryCode: "SV"
                },
                locale: 'es-SV',
                expected: "Señora Rina Isabel Peña Borja\nColonia Universitaria Norte #2\nCalle Alcaine #29\nCP 1120 - MEJICANOS\nSAN SALVADOR\nEL SALVADOR"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 