/*
 * address_BE.test.js - test the address parsing and formatting routines for Belgium
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

describe('ilib-address Belgium', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("fr-BE");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Belgian address in Dutch',
                input: "31, Place de Brouckere\n1000 Brussels\nBelgium",
                options: { locale: 'nl-BE' },
                expected: {
                    streetAddress: "31, Place de Brouckere",
                    locality: "Brussels",
                    region: undefined,
                    postalCode: "1000",
                    country: "Belgium",
                    countryCode: "BE"
                }
            },
            {
                name: 'should parse normal Belgian address in French',
                input: "31, Place de Brouckère\n1000 Bruxelles\nBelgium",
                options: { locale: 'fr-BE' },
                expected: {
                    streetAddress: "31, Place de Brouckère",
                    locality: "Bruxelles",
                    region: undefined,
                    postalCode: "1000",
                    country: "Belgium",
                    countryCode: "BE"
                }
            },
            {
                name: 'should parse Belgian address without postal code',
                input: "31, Place de Brouckère\nBruxelles\nBelgium",
                options: { locale: 'fr-BE' },
                expected: {
                    streetAddress: "31, Place de Brouckère",
                    locality: "Bruxelles",
                    region: undefined,
                    postalCode: undefined,
                    country: "Belgium",
                    countryCode: "BE"
                }
            },
            {
                name: 'should parse Belgian address with multiple lines',
                input: "31\nPlace\nde Brouckere\n1000\nBrussels\nBelgium",
                options: { locale: 'nl-BE' },
                expected: {
                    streetAddress: "31, Place, de Brouckere",
                    locality: "Brussels",
                    region: undefined,
                    postalCode: "1000",
                    country: "Belgium",
                    countryCode: "BE"
                }
            },
            {
                name: 'should parse Belgian address in one line format',
                input: "31, Place de Brouckere , 1000 Brussels , Belgium",
                options: { locale: 'nl-BE' },
                expected: {
                    streetAddress: "31, Place de Brouckere",
                    locality: "Brussels",
                    region: undefined,
                    postalCode: "1000",
                    country: "Belgium",
                    countryCode: "BE"
                }
            },
            {
                name: 'should parse Belgian address without delimiters',
                input: "31 Place de Brouckere 1000 Brussels Belgium",
                options: { locale: 'nl-BE' },
                expected: {
                    streetAddress: "31 Place de Brouckere",
                    locality: "Brussels",
                    region: undefined,
                    postalCode: "1000",
                    country: "Belgium",
                    countryCode: "BE"
                }
            },
            {
                name: 'should parse Belgian address from US locale',
                input: "31, Place de Brouckere , 1000 Brussels , Belgium",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "31, Place de Brouckere",
                    locality: "Brussels",
                    region: undefined,
                    postalCode: "1000",
                    country: "Belgium",
                    countryCode: "BE"
                }
            }
        ];

        test.each(parseTestCases)('$name', ({ input, options, expected }) => {
            const parsedAddress = new Address(input, options);
            
            expect(parsedAddress).toBeDefined();
            
            if (expected.streetAddress !== undefined) {
                expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
            }
            if (expected.locality !== undefined) {
                expect(parsedAddress.locality).toBe(expected.locality);
            }
            if (expected.region !== undefined) {
                expect(parsedAddress.region).toBe(expected.region);
            }
            if (expected.postalCode !== undefined) {
                expect(parsedAddress.postalCode).toBe(expected.postalCode);
            }
            if (expected.country !== undefined) {
                expect(parsedAddress.country).toBe(expected.country);
            }
            if (expected.countryCode !== undefined) {
                expect(parsedAddress.countryCode).toBe(expected.countryCode);
            }
        });
    });

    describe('Address formatting', () => {
        const formatTestCases = [
            {
                name: 'should format Belgian address in Dutch locale',
                address: {
                    streetAddress: "31, Place de Brouckere",
                    locality: "Brussels",
                    postalCode: "1000",
                    country: "Belgium",
                    countryCode: "BE"
                },
                options: { locale: 'nl-BE' },
                expected: "31, Place de Brouckere\n1000 Brussels\nBelgium"
            },
            {
                name: 'should format Belgian address in US locale',
                address: {
                    streetAddress: "31, Place de Brouckere",
                    locality: "Brussels",
                    postalCode: "1000",
                    country: "Belgium",
                    countryCode: "BE"
                },
                options: { locale: 'en-US' },
                expected: "31, Place de Brouckere\n1000 Brussels\nBelgium"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 