/*
 * address_SN.test.js - Senegal address parsing and formatting tests for ilib-address
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

describe('address_SN', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("fr-SN");
        }
    });

    describe('Address parsing', () => {
        const testCases = [
            {
                name: 'should parse normal Senegal address with all components',
                address: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE\n10000 DAKAR\nSenegal",
                locale: 'fr-SN',
                expected: {
                    streetAddress: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE",
                    locality: "DAKAR",
                    region: undefined,
                    postalCode: "10000",
                    country: "Senegal",
                    countryCode: "SN"
                }
            },
            {
                name: 'should parse Senegal address without postal code',
                address: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE\nDAKAR\nSenegal",
                locale: 'fr-SN',
                expected: {
                    streetAddress: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE",
                    locality: "DAKAR",
                    region: undefined,
                    postalCode: undefined,
                    country: "Senegal",
                    countryCode: "SN"
                }
            },
            {
                name: 'should parse Senegal address without country name',
                address: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE\n10000 DAKAR",
                locale: 'fr-SN',
                expected: {
                    streetAddress: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE",
                    locality: "DAKAR",
                    region: undefined,
                    postalCode: "10000",
                    country: undefined,
                    countryCode: "SN"
                }
            },
            {
                name: 'should parse Senegal address with multiple lines',
                address: "La Poste\nDirection de la production\npostale 6 RUE ABDOULAYE SECK MARIE PÉRSINE\n10000\nDAKAR\nSenegal\n\n\n",
                locale: 'fr-SN',
                expected: {
                    streetAddress: "La Poste, Direction de la production, postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE",
                    locality: "DAKAR",
                    region: undefined,
                    postalCode: "10000",
                    country: "Senegal",
                    countryCode: "SN"
                }
            },
            {
                name: 'should parse Senegal address in single line format',
                address: "La Poste , Direction de la production , postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE , 10000, DAKAR , Senegal",
                locale: 'fr-SN',
                expected: {
                    streetAddress: "La Poste, Direction de la production, postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE",
                    locality: "DAKAR",
                    region: undefined,
                    postalCode: "10000",
                    country: "Senegal",
                    countryCode: "SN"
                }
            },
            {
                name: 'should parse Senegal address with superfluous whitespace',
                address: "\t\t\t\tLa Poste\t\t\tDirection de la production postale\t\t\r6 RUE ABDOULAYE SECK MARIE PÉRSINE\t\n10000\n\tDAKAR\n\t Senegal\n\n\n",
                locale: 'fr-SN',
                expected: {
                    streetAddress: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE",
                    locality: "DAKAR",
                    region: undefined,
                    postalCode: "10000",
                    country: "Senegal",
                    countryCode: "SN"
                }
            },
            {
                name: 'should parse Senegal address without delimiters',
                address: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE 12500 DAKAR Senegal",
                locale: 'fr-SN',
                expected: {
                    streetAddress: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE",
                    locality: "DAKAR",
                    region: undefined,
                    postalCode: "12500",
                    country: "Senegal",
                    countryCode: "SN"
                }
            },
            {
                name: 'should parse Senegal address from US locale',
                address: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE\n10000 DAKAR\nSenegal",
                locale: 'en-US',
                expected: {
                    streetAddress: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE",
                    locality: "DAKAR",
                    region: undefined,
                    postalCode: "10000",
                    country: "Senegal",
                    countryCode: "SN"
                }
            },
            {
                name: 'should parse Senegal address with person name and apartment',
                address: "Monsieur Amadou Diop, Résidence Fallou Ndiaye, Appartement 12, 12 Avenue Cheikh Anta Diop, 12500 Dakar, SENEGAL",
                locale: 'fr-SN',
                expected: {
                    streetAddress: "Monsieur Amadou Diop, Résidence Fallou Ndiaye, Appartement 12, 12 Avenue Cheikh Anta Diop",
                    locality: "Dakar",
                    region: undefined,
                    postalCode: "12500",
                    country: "SENEGAL",
                    countryCode: "SN"
                }
            },
            {
                name: 'should parse Senegal embassy address',
                address: "American Embassy Dakar, Route des Almadies, Dakar, Senegal",
                locale: 'fr-SN',
                expected: {
                    streetAddress: "American Embassy Dakar, Route des Almadies",
                    locality: "Dakar",
                    region: undefined,
                    postalCode: undefined,
                    country: "Senegal",
                    countryCode: "SN"
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
                name: 'should format Senegal address in French locale',
                address: {
                    streetAddress: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE",
                    locality: "DAKAR",
                    country: "Senegal",
                    countryCode: "SN"
                },
                locale: 'fr-SN',
                expected: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE\nDAKAR\nSenegal"
            },
            {
                name: 'should format Senegal address in US locale',
                address: {
                    streetAddress: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE",
                    locality: "DAKAR",
                    country: "Senegal",
                    countryCode: "SN"
                },
                locale: 'en-US',
                expected: "La Poste Direction de la production postale 6 RUE ABDOULAYE SECK MARIE PÉRSINE\nDAKAR\nSenegal"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 