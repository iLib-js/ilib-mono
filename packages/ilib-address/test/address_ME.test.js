/*
 * address_ME.test.js - Montenegro address parsing and formatting tests for ilib-address
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

describe('address_ME', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("hr-ME");
        }
    });

    describe('Address parsing - Croatian locale', () => {
        const testCases = [
            {
                name: 'should parse normal Montenegro address in Croatian with all components',
                address: "G. Petar Petrović Ul. Slobode br. 1\n81000 Podgorica\nCrna Gora",
                locale: 'hr-ME',
                expected: {
                    streetAddress: "G. Petar Petrović Ul. Slobode br. 1",
                    locality: "Podgorica",
                    region: undefined,
                    postalCode: "81000",
                    country: "Crna Gora",
                    countryCode: "ME"
                }
            },
            {
                name: 'should parse Montenegro address in Croatian without postal code',
                address: "G. Petar Petrović Ul. Slobode br. 1\nPodgorica\nCrna Gora",
                locale: 'hr-ME',
                expected: {
                    streetAddress: "G. Petar Petrović Ul. Slobode br. 1",
                    locality: "Podgorica",
                    region: undefined,
                    postalCode: undefined,
                    country: "Crna Gora",
                    countryCode: "ME"
                }
            },
            {
                name: 'should parse Montenegro address in Croatian without country',
                address: "G. Petar Petrović Ul. Slobode br. 1\n81000 Podgorica",
                locale: 'hr-ME',
                expected: {
                    streetAddress: "G. Petar Petrović Ul. Slobode br. 1",
                    locality: "Podgorica",
                    region: undefined,
                    postalCode: "81000",
                    country: undefined,
                    countryCode: "ME"
                }
            },
            {
                name: 'should parse Montenegro address in Croatian with multiple lines',
                address: "G. Petar Petrović Ul.\nSlobode br. 1\n\n81000 Podgorica\n\nCrna Gora\n\n\n",
                locale: 'hr-ME',
                expected: {
                    streetAddress: "G. Petar Petrović Ul., Slobode br. 1",
                    locality: "Podgorica",
                    region: undefined,
                    postalCode: "81000",
                    country: "Crna Gora",
                    countryCode: "ME"
                }
            },
            {
                name: 'should parse Montenegro address in Croatian in single line format',
                address: "G. Petar Petrović Ul. , Slobode br. 1 , Podgorica , 81000 , Crna Gora",
                locale: 'hr-ME',
                expected: {
                    streetAddress: "G. Petar Petrović Ul., Slobode br. 1",
                    locality: "Podgorica",
                    region: undefined,
                    postalCode: "81000",
                    country: "Crna Gora",
                    countryCode: "ME"
                }
            },
            {
                name: 'should parse Montenegro address in Croatian with superfluous whitespace',
                address: "\t\t\tG. Petar Petrović Ul.\t\t\rSlobode br. 1\t\n\n\nPodgorica\n\t\n81000\n\n\tCrna Gora\n\n\n",
                locale: 'hr-ME',
                expected: {
                    streetAddress: "G. Petar Petrović Ul. Slobode br. 1",
                    locality: "Podgorica",
                    region: undefined,
                    postalCode: "81000",
                    country: "Crna Gora",
                    countryCode: "ME"
                }
            },
            {
                name: 'should parse Montenegro address in Croatian without delimiters',
                address: "G. Petar Petrović Ul. Slobode br. 1 81000 Podgorica Crna Gora",
                locale: 'hr-ME',
                expected: {
                    streetAddress: "G. Petar Petrović Ul. Slobode br. 1",
                    locality: "Podgorica",
                    region: undefined,
                    postalCode: "81000",
                    country: "Crna Gora",
                    countryCode: "ME"
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

    describe('Address parsing - Serbian locale', () => {
        const testCases = [
            {
                name: 'should parse Montenegro address in Serbian with all components',
                address: "Петар Петровић Ул. Слобода бр. 1\n81000 Подгорица\nЦрна Гора",
                locale: 'sr-ME',
                expected: {
                    streetAddress: "Петар Петровић Ул. Слобода бр. 1",
                    locality: "Подгорица",
                    region: undefined,
                    postalCode: "81000",
                    country: "Црна Гора",
                    countryCode: "ME"
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

    describe('Address parsing - Albanian locale', () => {
        const testCases = [
            {
                name: 'should parse Montenegro address in Albanian with all components',
                address: "Z. Petar Petroviq Ul. Ka liri. 1\n81000 Podgorica\nMontenegro",
                locale: 'sq-ME',
                expected: {
                    streetAddress: "Z. Petar Petroviq Ul. Ka liri. 1",
                    locality: "Podgorica",
                    region: undefined,
                    postalCode: "81000",
                    country: "Montenegro",
                    countryCode: "ME"
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

    describe('Address parsing - Bosnian locale', () => {
        const testCases = [
            {
                name: 'should parse Montenegro address in Bosnian with all components',
                address: "Petar Petrović Ul. Sloboda ne. 1\n81000 Podgorica\nCrna Gora",
                locale: 'sq-ME',
                expected: {
                    streetAddress: "Petar Petrović Ul. Sloboda ne. 1",
                    locality: "Podgorica",
                    region: undefined,
                    postalCode: "81000",
                    country: "Crna Gora",
                    countryCode: "ME"
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

    describe('Address parsing - US locale', () => {
        const testCases = [
            {
                name: 'should parse Montenegro address from US locale',
                address: "G. Petar Petrović Ul. Slobode br. 1\n81000 Podgorica\nMontenegro",
                locale: 'en-US',
                expected: {
                    streetAddress: "G. Petar Petrović Ul. Slobode br. 1",
                    locality: "Podgorica",
                    region: undefined,
                    postalCode: "81000",
                    country: "Montenegro",
                    countryCode: "ME"
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
                name: 'should format Montenegro address in Croatian locale',
                address: {
                    streetAddress: "G. Petar Petrović Ul. Slobode br. 1",
                    locality: "Podgorica",
                    postalCode: "81000",
                    country: "Crna Gora",
                    countryCode: "ME"
                },
                locale: 'hr-ME',
                expected: "G. Petar Petrović Ul. Slobode br. 1\n81000 Podgorica\nCrna Gora"
            },
            {
                name: 'should format Montenegro address in US locale',
                address: {
                    streetAddress: "G. Petar Petrović Ul. Slobode br. 1",
                    locality: "Podgorica",
                    postalCode: "81000",
                    country: "Montenegro",
                    countryCode: "ME"
                },
                locale: 'en-US',
                expected: "G. Petar Petrović Ul. Slobode br. 1\n81000 Podgorica\nMontenegro"
            }
        ];

        test.each(testCases)('$name', ({ address, locale, expected }) => {
            const parsedAddress = new Address(address, { locale });
            const formatter = new AddressFmt({ locale });
            
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 