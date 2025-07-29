/*
 * address_GQ.test.js - Equatorial Guinea address parsing and formatting tests for ilib-address
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

describe('address_GQ', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("es-GQ");
        }
    });

    describe('Address parsing - Spanish locale', () => {
        const testCases = [
            {
                name: 'should parse normal Equatorial Guinea address with all components',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO\nGuinea Ecuatorial",
                locale: 'es-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guinea Ecuatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address without postal code',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO\nGuinea Ecuatorial",
                locale: 'es-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guinea Ecuatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address without country name',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO",
                locale: 'es-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: undefined,
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address with multiple lines',
                address: "Mr. Ignacio Nguema\nApartado 36\nMALABO\nGuinea Ecuatorial",
                locale: 'es-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema, Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guinea Ecuatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address in single line format',
                address: "Mr. Ignacio Nguema , Apartado 36 , MALABO , Guinea Ecuatorial",
                locale: 'es-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema, Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guinea Ecuatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address with superfluous whitespace',
                address: "Mr. Ignacio Nguema\n\n\t\r\t\t\rApartado 36\r\r\n\nMALABO\t\r\n\t\rGuinea Ecuatorial",
                locale: 'es-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema, Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guinea Ecuatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address without delimiters',
                address: "Mr. Ignacio Nguema Apartado 36 MALABO Guinea Ecuatorial",
                locale: 'es-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guinea Ecuatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address from US locale',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO\nGuinea Ecuatorial",
                locale: 'en-US',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guinea Ecuatorial",
                    countryCode: "GQ"
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

    describe('Address parsing - French locale', () => {
        const testCases = [
            {
                name: 'should parse normal Equatorial Guinea address in French',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO\nguinée équatoriale",
                locale: 'fr-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "guinée équatoriale",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address without postal code in French',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO\nguinée équatoriale",
                locale: 'fr-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "guinée équatoriale",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address without country in French',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO",
                locale: 'fr-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: undefined,
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address with multiple lines in French',
                address: "Mr. Ignacio Nguema\nApartado 36\nMALABO\nguinée équatoriale",
                locale: 'fr-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema, Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "guinée équatoriale",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address in single line format in French',
                address: "Mr. Ignacio Nguema , Apartado 36 , MALABO , guinée équatoriale",
                locale: 'fr-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema, Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "guinée équatoriale",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address with superfluous whitespace in French',
                address: "Mr. Ignacio Nguema\n\n\t\r\t\t\rApartado 36\r\r\n\nMALABO\t\r\n\t\rguinée équatoriale",
                locale: 'fr-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema, Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "guinée équatoriale",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address without delimiters in French',
                address: "Mr. Ignacio Nguema Apartado 36 MALABO guinée équatoriale",
                locale: 'fr-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "guinée équatoriale",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address from US locale in French',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO\nguinée équatoriale",
                locale: 'en-US',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "guinée équatoriale",
                    countryCode: "GQ"
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

    describe('Address parsing - Portuguese locale', () => {
        const testCases = [
            {
                name: 'should parse normal Equatorial Guinea address in Portuguese',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO\nGuiné Equatorial",
                locale: 'pt-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guiné Equatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address without postal code in Portuguese',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO\nGuiné Equatorial",
                locale: 'pt-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guiné Equatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address without country in Portuguese',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO",
                locale: 'pt-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: undefined,
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address with multiple lines in Portuguese',
                address: "Mr. Ignacio Nguema\nApartado 36\nMALABO\nGuiné Equatorial",
                locale: 'pt-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema, Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guiné Equatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address in single line format in Portuguese',
                address: "Mr. Ignacio Nguema , Apartado 36 , MALABO , Guiné Equatorial",
                locale: 'pt-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema, Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guiné Equatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address with superfluous whitespace in Portuguese',
                address: "Mr. Ignacio Nguema\n\n\t\r\t\t\rApartado 36\r\r\n\nMALABO\t\r\n\t\rGuiné Equatorial",
                locale: 'pt-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema, Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guiné Equatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address without delimiters in Portuguese',
                address: "Mr. Ignacio Nguema Apartado 36 MALABO Guiné Equatorial",
                locale: 'pt-GQ',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    region: undefined,
                    postalCode: undefined,
                    country: "Guiné Equatorial",
                    countryCode: "GQ"
                }
            },
            {
                name: 'should parse Equatorial Guinea address from US locale in Portuguese',
                address: "Mr. Ignacio Nguema Apartado 36\nMALABO\nGuiné Equatorial",
                locale: 'en-US',
                expected: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36, MALABO",
                    locality: "Guiné Equatorial",
                    region: undefined,
                    postalCode: undefined,
                    country: undefined,
                    countryCode: "US"
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
                name: 'should format Equatorial Guinea address in Spanish locale',
                address: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    postalCode: "1010",
                    country: "Guinea Ecuatorial",
                    countryCode: "GQ"
                },
                locale: 'es-GQ',
                expected: "Mr. Ignacio Nguema Apartado 36\nMALABO\nGuinea Ecuatorial"
            },
            {
                name: 'should format Equatorial Guinea address in US locale',
                address: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    postalCode: "1010",
                    country: "Guinea Ecuatorial",
                    countryCode: "GQ"
                },
                locale: 'en-US',
                expected: "Mr. Ignacio Nguema Apartado 36\nMALABO\nGuinea Ecuatorial"
            },
            {
                name: 'should format Equatorial Guinea address in French locale',
                address: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    postalCode: "1010",
                    country: "guinée équatoriale",
                    countryCode: "GQ"
                },
                locale: 'fr-GQ',
                expected: "Mr. Ignacio Nguema Apartado 36\nMALABO\nguinée équatoriale"
            },
            {
                name: 'should format Equatorial Guinea address in Portuguese locale',
                address: {
                    streetAddress: "Mr. Ignacio Nguema Apartado 36",
                    locality: "MALABO",
                    postalCode: "1010",
                    country: "guinée équatoriale",
                    countryCode: "GQ"
                },
                locale: 'en-US',
                expected: "Mr. Ignacio Nguema Apartado 36\nMALABO\nguinée équatoriale"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 