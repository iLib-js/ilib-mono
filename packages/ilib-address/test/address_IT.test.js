/*
 * address_IT.test.js - test the address parsing and formatting routines for Italy
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

describe('Address parsing and formatting for Italy', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("it-IT");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Italian address with postal code',
                input: "Corso Europa 2\n20122 Milan\nItalia",
                locale: 'it-IT',
                expected: {
                    streetAddress: "Corso Europa 2",
                    locality: "Milan",
                    postalCode: "20122",
                    country: "Italia",
                    countryCode: "IT"
                }
            },
            {
                name: 'should parse Italian address without postal code',
                input: "C.so Trapani 16\nTorino\nItalia",
                locale: 'it-IT',
                expected: {
                    streetAddress: "C.so Trapani 16",
                    locality: "Torino",
                    country: "Italia",
                    countryCode: "IT"
                }
            },
            {
                name: 'should parse Italian address without country specified',
                input: "Corso Europa 2\n20122 Milan",
                locale: 'it-IT',
                expected: {
                    streetAddress: "Corso Europa 2",
                    locality: "Milan",
                    postalCode: "20122",
                    countryCode: "IT"
                }
            },
            {
                name: 'should parse Italian address with region code',
                input: "via Paná, 56\n35027 Noventa Padovana (PD)",
                locale: 'it-IT',
                expected: {
                    streetAddress: "via Paná, 56",
                    locality: "Noventa Padovana",
                    region: "(PD)",
                    postalCode: "35027",
                    countryCode: "IT"
                }
            },
            {
                name: 'should parse Italian address with region code and country',
                input: "via Napoli 45\n96017 Noto (SR)\nItalia",
                locale: 'it-IT',
                expected: {
                    streetAddress: "via Napoli 45",
                    locality: "Noto",
                    region: "(SR)",
                    postalCode: "96017",
                    country: "Italia",
                    countryCode: "IT"
                }
            },
            {
                name: 'should parse Italian address with multiple lines',
                input: "Centro Direzionale\nFab. 1 G/7\n80143\nNapoli\nItalia\n",
                locale: 'it-IT',
                expected: {
                    streetAddress: "Centro Direzionale, Fab. 1 G/7",
                    locality: "Napoli",
                    postalCode: "80143",
                    country: "Italia",
                    countryCode: "IT"
                }
            },
            {
                name: 'should parse Italian address in single line format',
                input: "Via Achille Campanile 85, 00144 ROMA, Italia",
                locale: 'it-IT',
                expected: {
                    streetAddress: "Via Achille Campanile 85",
                    locality: "ROMA",
                    postalCode: "00144",
                    country: "Italia",
                    countryCode: "IT"
                }
            },
            {
                name: 'should parse Italian address with superfluous whitespace',
                input: "\t\t\tVia Achille   \t\t\t Campanile 85,\n\n\t\r\t00144\t\t\t\n ROMA\t\t\n\r\r Italia\n\n\n",
                locale: 'it-IT',
                expected: {
                    streetAddress: "Via Achille Campanile 85",
                    locality: "ROMA",
                    postalCode: "00144",
                    country: "Italia",
                    countryCode: "IT"
                }
            },
            {
                name: 'should parse Italian address without delimiters',
                input: "Via Achille Campanile 85 00144 ROMA Italia",
                locale: 'it-IT',
                expected: {
                    streetAddress: "Via Achille Campanile 85",
                    locality: "ROMA",
                    postalCode: "00144",
                    country: "Italia",
                    countryCode: "IT"
                }
            },
            {
                name: 'should parse Italian address from US locale context',
                input: "Via Achille Campanile 85\n00144 ROMA\nItaly",
                locale: 'en-US',
                expected: {
                    streetAddress: "Via Achille Campanile 85",
                    locality: "ROMA",
                    postalCode: "00144",
                    country: "Italy",
                    countryCode: "IT"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            
            if (expected.region !== undefined) {
                expect(parsedAddress.region).toBe(expected.region);
            } else {
                expect(parsedAddress.region).toBeUndefined();
            }
            
            expect(parsedAddress.locality).toBe(expected.locality);
            
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
        test('should format Italian address with postal code', () => {
            const parsedAddress = new Address({
                streetAddress: "Corso Europa 2",
                locality: "Milan",
                postalCode: "20122",
                country: "Italia",
                countryCode: "IT"
            }, { locale: 'it-IT' });

            const expected = "Corso Europa 2\n20122 Milan\nItalia";
            const formatter = new AddressFmt({ locale: 'it-IT' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Italian address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Corso Europa 2",
                locality: "Milan",
                postalCode: "20122",
                country: "Italia",
                countryCode: "IT"
            }, { locale: 'en-US' });

            const expected = "Corso Europa 2\n20122 Milan\nItalia";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 