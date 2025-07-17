/*
 * address_PT.test.js - test the address parsing and formatting routines for Portugal
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

describe('Address parsing and formatting for Portugal', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("pt-PT");
        }
    });

    describe('Address parsing tests', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Portuguese address',
                input: "Augusto Rodrigues Avenida António Arroio 5\n2775-153 Parede\nPortugal",
                locale: 'pt-PT',
                expected: {
                    streetAddress: "Augusto Rodrigues Avenida António Arroio 5",
                    locality: "Parede",
                    postalCode: "2775-153",
                    country: "Portugal",
                    countryCode: "PT"
                }
            },
            {
                name: 'should parse Portuguese address without postal code',
                input: "Augusto Rodrigues Avenida António Arroio 5\nParede\nPortugal",
                locale: 'pt-PT',
                expected: {
                    streetAddress: "Augusto Rodrigues Avenida António Arroio 5",
                    locality: "Parede",
                    country: "Portugal",
                    countryCode: "PT"
                }
            },
            {
                name: 'should parse Portuguese address without country',
                input: "Augusto Rodrigues Avenida António Arroio 5\n2775-153 Parede",
                locale: 'pt-PT',
                expected: {
                    streetAddress: "Augusto Rodrigues Avenida António Arroio 5",
                    locality: "Parede",
                    postalCode: "2775-153",
                    countryCode: "PT"
                }
            },
            {
                name: 'should parse Portuguese address with multiple lines',
                input: "Augusto Rodrigues\nAvenida António Arroio 5\n\n2775-153\nParede\nPortugal\n\n\n",
                locale: 'pt-PT',
                expected: {
                    streetAddress: "Augusto Rodrigues, Avenida António Arroio 5",
                    locality: "Parede",
                    postalCode: "2775-153",
                    country: "Portugal",
                    countryCode: "PT"
                }
            },
            {
                name: 'should parse Portuguese address in single line format',
                input: "Augusto Rodrigues , Avenida António Arroio 5 , 2775-153 , Parede , Portugal",
                locale: 'pt-PT',
                expected: {
                    streetAddress: "Augusto Rodrigues, Avenida António Arroio 5",
                    locality: "Parede",
                    postalCode: "2775-153",
                    country: "Portugal",
                    countryCode: "PT"
                }
            },
            {
                name: 'should parse Portuguese address with superfluous whitespace',
                input: "\t\t\tAugusto Rodrigues\n\t\t\tAvenida António Arroio 5\n\t\n2775-153\t\nParede\n\t Portugal\n\n\n",
                locale: 'pt-PT',
                expected: {
                    streetAddress: "Augusto Rodrigues, Avenida António Arroio 5",
                    locality: "Parede",
                    postalCode: "2775-153",
                    country: "Portugal",
                    countryCode: "PT"
                }
            },
            {
                name: 'should parse Portuguese address without delimiters',
                input: "Augusto Rodrigues Avenida António Arroio 5 2775-153 Parede Portugal",
                locale: 'pt-PT',
                expected: {
                    streetAddress: "Augusto Rodrigues Avenida António Arroio 5",
                    locality: "Parede",
                    postalCode: "2775-153",
                    country: "Portugal",
                    countryCode: "PT"
                }
            },
            {
                name: 'should parse Portuguese address from US locale context',
                input: "Augusto Rodrigues Avenida António Arroio 5\n2775-153 Parede\nPortugal",
                locale: 'en-US',
                expected: {
                    streetAddress: "Augusto Rodrigues Avenida António Arroio 5",
                    locality: "Parede",
                    postalCode: "2775-153",
                    country: "Portugal",
                    countryCode: "PT"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, locale, expected }) => {
            const parsedAddress = new Address(input, { locale });
            
            expect(parsedAddress).toBeDefined();
            expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            expect(parsedAddress.region).toBeUndefined();
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
        test('should format Portuguese address in local format', () => {
            const parsedAddress = new Address({
                streetAddress: "Augusto Rodrigues Avenida António Arroio 5",
                locality: "Parede",
                postalCode: "2775-153",
                country: "Portugal",
                countryCode: "PT"
            }, { locale: 'pt-PT' });

            const expected = "Augusto Rodrigues Avenida António Arroio 5\n2775-153 Parede\nPortugal";
            const formatter = new AddressFmt({ locale: 'pt-PT' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format Portuguese address from US locale context', () => {
            const parsedAddress = new Address({
                streetAddress: "Augusto Rodrigues Avenida António Arroio 5",
                locality: "Parede",
                postalCode: "2775-153",
                country: "Portugal",
                countryCode: "PT"
            }, { locale: 'en-US' });

            const expected = "Augusto Rodrigues Avenida António Arroio 5\n2775-153 Parede\nPortugal";
            const formatter = new AddressFmt({ locale: 'en-US' });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 