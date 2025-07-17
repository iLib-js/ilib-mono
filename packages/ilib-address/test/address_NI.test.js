/*
 * address_NI.test.js - Nicaragua address parsing and formatting tests for ilib-address
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

describe('address_NI', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("es-NI");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Nicaragua address with all components',
                address: "Sr. Juan Manuel Nurinda Del Hotel Granada 1c. arriba 75 vrs. alsur. Reparto Santa Isabel\n050-008-4\nGRANADA, GRANADA\nNICARAGUA",
                locale: 'es-NI',
                expected: {
                    streetAddress: "Sr. Juan Manuel Nurinda Del Hotel Granada 1c. arriba 75 vrs. alsur. Reparto Santa Isabel",
                    locality: "GRANADA",
                    region: "GRANADA",
                    postalCode: "050-008-4",
                    country: "NICARAGUA",
                    countryCode: "NI"
                }
            },
            {
                name: 'should parse Nicaragua address without postal code',
                address: "Sr. Juan Manuel Nurinda Del Hotel Granada 1c. arriba 75 vrs. alsur. Reparto Santa Isabel\nGRANADA, GRANADA\nNICARAGUA",
                locale: 'es-NI',
                expected: {
                    streetAddress: "Sr. Juan Manuel Nurinda Del Hotel Granada 1c. arriba 75 vrs. alsur. Reparto Santa Isabel",
                    locality: "GRANADA",
                    region: "GRANADA",
                    postalCode: undefined,
                    country: "NICARAGUA",
                    countryCode: "NI"
                }
            },
            {
                name: 'should parse Nicaragua address without country',
                address: "Sr. Juan Manuel Nurinda    \nDel Hotel Granada 1c.\narriba 75\nvrs. alsur. Reparto\nSanta Isabel\n050-008-4\nGranada, Masaya",
                locale: 'es-NI',
                expected: {
                    streetAddress: "Sr. Juan Manuel Nurinda, Del Hotel Granada 1c., arriba 75, vrs. alsur. Reparto, Santa Isabel",
                    locality: "Granada",
                    region: "Masaya",
                    postalCode: "050-008-4",
                    country: undefined,
                    countryCode: "NI"
                }
            },
            {
                name: 'should parse Nicaragua address with multiple lines',
                address: "Sr. Juan Manuel Nurinda\nDel Hotel Granada 1c.\narriba 75\nvrs. alsur. Reparto\nSanta Isabel\n050-008-4\nGRANADA, GRANADA\nNICARAGUA",
                locale: 'es-NI',
                expected: {
                    streetAddress: "Sr. Juan Manuel Nurinda, Del Hotel Granada 1c., arriba 75, vrs. alsur. Reparto, Santa Isabel",
                    locality: "GRANADA",
                    region: "GRANADA",
                    postalCode: "050-008-4",
                    country: "NICARAGUA",
                    countryCode: "NI"
                }
            },
            {
                name: 'should parse Nicaragua address in single line format',
                address: "Sr. Juan Manuel Nurinda , Del Hotel Granada 1c. , arriba 75 , vrs. alsur. Reparto , Santa Isabel , 050-008-4 , GRANADA , GRANADA , NICARAGUA",
                locale: 'es-NI',
                expected: {
                    streetAddress: "Sr. Juan Manuel Nurinda, Del Hotel Granada 1c., arriba 75, vrs. alsur. Reparto, Santa Isabel",
                    locality: "GRANADA",
                    region: "GRANADA",
                    postalCode: "050-008-4",
                    country: "NICARAGUA",
                    countryCode: "NI"
                }
            },
            {
                name: 'should parse Nicaragua address with superfluous whitespace',
                address: "Sr. Juan Manuel Nurinda\n\n\t\rDel Hotel Granada 1c.\t\t\rarriba 75\r\r\rvrs. alsur. Reparto\t\t\rSanta Isabel\n\n\n050-008-4\t\t\rGRANADA\r\r\rGRANADA\t\t\rNICARAGUA",
                locale: 'es-NI',
                expected: {
                    streetAddress: "Sr. Juan Manuel Nurinda, Del Hotel Granada 1c. arriba 75 vrs. alsur. Reparto Santa Isabel",
                    locality: "GRANADA",
                    region: "GRANADA",
                    postalCode: "050-008-4",
                    country: "NICARAGUA",
                    countryCode: "NI"
                }
            },
            {
                name: 'should parse Nicaragua address without delimiters',
                address: "Sr. Juan Manuel Nurinda Del Hotel Granada 1c. arriba 75 vrs. alsur. Reparto Santa Isabel 050-008-4\nGRANADA, GRANADA NICARAGUA",
                locale: 'es-NI',
                expected: {
                    streetAddress: "Sr. Juan Manuel Nurinda Del Hotel Granada 1c. arriba 75 vrs. alsur. Reparto Santa Isabel",
                    locality: "GRANADA",
                    region: "GRANADA",
                    postalCode: "050-008-4",
                    country: "NICARAGUA",
                    countryCode: "NI"
                }
            },
            {
                name: 'should parse Nicaragua address from US locale',
                address: "Mr. JOSE PEREZ AV. Del Hotel Granada 1c. arriba 75, vrs. alsur. Reparto Santa Isabel\n050-008-4\nGRANADA, GRANADA\nNICARAGUA",
                locale: 'es-NI',
                expected: {
                    streetAddress: "Mr. JOSE PEREZ AV. Del Hotel Granada 1c. arriba 75, vrs. alsur. Reparto Santa Isabel",
                    locality: "GRANADA",
                    region: "GRANADA",
                    postalCode: "050-008-4",
                    country: "NICARAGUA",
                    countryCode: "NI"
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
                name: 'should format Nicaragua address in Spanish locale',
                address: {
                    streetAddress: "Sr. Juan Manuel Nurinda Del Hotel Granada 1c. arriba 75 vrs. alsur. Reparto Santa Isabel",
                    locality: "GRANADA",
                    postalCode: "050-008-4",
                    region: "GRANADA",
                    country: "NICARAGUA",
                    countryCode: "NI"
                },
                locale: 'es-NI',
                expected: "Sr. Juan Manuel Nurinda Del Hotel Granada 1c. arriba 75 vrs. alsur. Reparto Santa Isabel\n050-008-4\nGRANADA, GRANADA\nNICARAGUA"
            },
            {
                name: 'should format Nicaragua address in US locale',
                address: {
                    streetAddress: "Mr. JOSE PEREZ AV. Del Hotel Granada 1c. arriba 75, vrs. alsur. Reparto Santa Isabel",
                    locality: "GRANADA",
                    postalCode: "050-008-4",
                    region: "GRANADA",
                    country: "NICARAGUA",
                    countryCode: "NI"
                },
                locale: 'en-US',
                expected: "Mr. JOSE PEREZ AV. Del Hotel Granada 1c. arriba 75, vrs. alsur. Reparto Santa Isabel\n050-008-4\nGRANADA, GRANADA\nNICARAGUA"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 