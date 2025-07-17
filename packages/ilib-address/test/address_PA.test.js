/*
 * address_PA.test.js - Panama address parsing and formatting tests for ilib-address
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

describe('address_PA', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("es-PA");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Panama address with all components',
                address: "Calle 52 y Ricardo Arias.\nArea Bancaria\nPanama City\nPanama",
                locale: 'es-PA',
                expected: {
                    streetAddress: "Calle 52 y Ricardo Arias.",
                    locality: "Area Bancaria",
                    region: "Panama City",
                    postalCode: undefined,
                    country: "Panama",
                    countryCode: "PA"
                }
            },
            {
                name: 'should parse Panama address without postal code',
                address: "Calle 52 y Ricardo Arias.\nArea Bancaria\nPanama City\nPanama",
                locale: 'es-PA',
                expected: {
                    streetAddress: "Calle 52 y Ricardo Arias.",
                    locality: "Area Bancaria",
                    region: "Panama City",
                    postalCode: undefined,
                    country: "Panama",
                    countryCode: "PA"
                }
            },
            {
                name: 'should parse Panama address without country',
                address: "Calle 52 y Ricardo Arias.\nArea Bancaria\nPanama City",
                locale: 'es-PA',
                expected: {
                    streetAddress: "Calle 52 y Ricardo Arias.",
                    locality: "Area Bancaria",
                    region: "Panama City",
                    postalCode: undefined,
                    country: undefined,
                    countryCode: "PA"
                }
            },
            {
                name: 'should parse Panama address with multiple lines',
                address: "Calle 52 y\nRicardo Arias.\nArea Bancaria\nPanama City\nPanama",
                locale: 'es-PA',
                expected: {
                    streetAddress: "Calle 52 y, Ricardo Arias.",
                    locality: "Area Bancaria",
                    region: "Panama City",
                    postalCode: undefined,
                    country: "Panama",
                    countryCode: "PA"
                }
            },
            {
                name: 'should parse Panama address in single line format',
                address: "Calle 52 y , Ricardo Arias. , Area Bancaria , Panama City , Panama",
                locale: 'es-PA',
                expected: {
                    streetAddress: "Calle 52 y, Ricardo Arias.",
                    locality: "Area Bancaria",
                    region: "Panama City",
                    postalCode: undefined,
                    country: "Panama",
                    countryCode: "PA"
                }
            },
            {
                name: 'should parse Panama address with superfluous whitespace',
                address: "Calle 52 y\n\n\t\r\t\t\rRicardo Arias.\r\r\r\t\t\r\n\n\nArea Bancaria\t\r\r\rPanama City\t\t\rPanama",
                locale: 'es-PA',
                expected: {
                    streetAddress: "Calle 52 y, Ricardo Arias.",
                    locality: "Area Bancaria",
                    region: "Panama City",
                    postalCode: undefined,
                    country: "Panama",
                    countryCode: "PA"
                }
            },
            {
                name: 'should parse Panama address from US locale',
                address: "Calle 52 y Ricardo Arias.\nArea Bancaria\nPanama City\nPanama",
                locale: 'es-PA',
                expected: {
                    streetAddress: "Calle 52 y Ricardo Arias.",
                    locality: "Area Bancaria",
                    region: "Panama City",
                    postalCode: undefined,
                    country: "Panama",
                    countryCode: "PA"
                }
            },
            {
                name: 'should parse Panama address with postal code in street address',
                address: "MARTÍN GUTIERREZ,Via Israel 3,0424,VOLCÁN,Chiriquí,PANAMA",
                locale: 'es-PA',
                expected: {
                    streetAddress: "MARTÍN GUTIERREZ, Via Israel 3, 0424",
                    locality: "VOLCÁN",
                    region: "Chiriquí",
                    postalCode: undefined,
                    country: "PANAMA",
                    countryCode: "PA"
                }
            },
            {
                name: 'should parse Panama address with city and province',
                address: "Parque Industrial Milla 8,Ciudad de Panamá,Panamá,PANAMA",
                locale: 'es-PA',
                expected: {
                    streetAddress: "Parque Industrial Milla 8",
                    locality: "Ciudad de Panamá",
                    region: "Panamá",
                    postalCode: undefined,
                    country: "PANAMA",
                    countryCode: "PA"
                }
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.locality).toBe(expected.locality);
            expect(parsedAddress.region).toBe(expected.region);
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
            expect(parsedAddress.country).toBe(expected.country);
            expect(parsedAddress.countryCode).toBe(expected.countryCode);
        });
    });

    describe('Address formatting', () => {
        const testCases = [
            {
                name: 'should format Panama address in Spanish locale',
                address: {
                    streetAddress: "Calle 52 y Ricardo Arias.",
                    locality: "Area Bancaria",
                    postalCode: "1010",
                    region: "Panama City",
                    country: "Panama",
                    countryCode: "PA"
                },
                locale: 'es-PA',
                expected: "Calle 52 y Ricardo Arias.\nArea Bancaria\nPanama City\nPanama"
            },
            {
                name: 'should format Panama address in US locale',
                address: {
                    streetAddress: "Calle 52 y Ricardo Arias.",
                    locality: "Area Bancaria",
                    postalCode: "1010",
                    region: "Panama City",
                    country: "Panama",
                    countryCode: "PA"
                },
                locale: 'en-US',
                expected: "Calle 52 y Ricardo Arias.\nArea Bancaria\nPanama City\nPanama"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 