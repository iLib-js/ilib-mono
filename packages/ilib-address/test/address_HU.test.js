/*
 * address_HU.test.js - test the address parsing and formatting routines for Hungary
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

describe('ilib-address Hungary', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("hu-HU");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Hungarian address',
                input: "Budapest, Fiktív utca 82., IV. em./28. - or - Pf. 184, 2806, HUNGARY",
                options: { locale: 'hu-HU' },
                expected: {
                    streetAddress: "Fiktív utca 82., IV. em./28. - or - Pf. 184",
                    locality: "Budapest",
                    region: undefined,
                    postalCode: "2806",
                    country: "HUNGARY",
                    countryCode: "HU"
                }
            },
            {
                name: 'should parse Hungarian address without postal code',
                input: "Budapest, Fiktív utca 82., IV. em./28. - or - Pf. 184, HUNGARY",
                options: { locale: 'hu-HU' },
                expected: {
                    streetAddress: "Fiktív utca 82., IV. em./28. - or - Pf. 184",
                    locality: "Budapest",
                    region: undefined,
                    postalCode: undefined,
                    country: "HUNGARY",
                    countryCode: "HU"
                }
            },
            {
                name: 'should parse Hungarian address with multiple lines',
                input: "Budapest\nHonvéd utca 13-15\n1055\nHUNGARY",
                options: { locale: 'hu-HU' },
                expected: {
                    streetAddress: "Honvéd utca 13-15",
                    locality: "Budapest",
                    region: undefined,
                    postalCode: "1055",
                    country: "HUNGARY",
                    countryCode: "HU"
                }
            },
            {
                name: 'should parse Hungarian address in one line format',
                input: "Budapest, Honvéd utca 13-15, 1055, HUNGARY",
                options: { locale: 'hu-HU' },
                expected: {
                    streetAddress: "Honvéd utca 13-15",
                    locality: "Budapest",
                    region: undefined,
                    postalCode: "1055",
                    country: "HUNGARY",
                    countryCode: "HU"
                }
            },
            {
                name: 'should parse Hungarian address with superfluous whitespace',
                input: "Budapest   \n\t\n Honvéd utca 13-15\t\n\n 1055\n\nHUNGARY  \n  \t\t\t",
                options: { locale: 'hu-HU' },
                expected: {
                    streetAddress: "Honvéd utca 13-15",
                    locality: "Budapest",
                    region: undefined,
                    postalCode: "1055",
                    country: "HUNGARY",
                    countryCode: "HU"
                }
            },
            {
                name: 'should parse Hungarian address without delimiters',
                input: "Budapest Honvéd utca 13-15 1055 HUNGARY",
                options: { locale: 'hu-HU' },
                expected: {
                    streetAddress: "Honvéd utca 13-15",
                    locality: "Budapest",
                    region: undefined,
                    postalCode: "1055",
                    country: "HUNGARY",
                    countryCode: "HU"
                }
            },
            {
                name: 'should parse Hungarian address with special characters',
                input: "Győr, Arató utca 7 fsz. 2, 9028, HUNGARY",
                options: { locale: 'hu-HU' },
                expected: {
                    streetAddress: "Arató utca 7 fsz. 2",
                    locality: "Győr",
                    region: undefined,
                    postalCode: "9028",
                    country: "HUNGARY",
                    countryCode: "HU"
                }
            },
            {
                name: 'should parse Hungarian address from US locale',
                input: "Győr, Arató utca 7 fsz. 2, 9028, Hungary",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Arató utca 7 fsz. 2",
                    locality: "Győr",
                    region: undefined,
                    postalCode: "9028",
                    country: "Hungary",
                    countryCode: "HU"
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
                name: 'should format Hungarian address in Hungarian locale',
                address: {
                    streetAddress: "Fiktív utca 82., IV. em./28. - or - Pf. 184.",
                    locality: "Budapest",
                    postalCode: "2806",
                    country: "HUNGARY",
                    countryCode: "HU"
                },
                options: { locale: 'hu-HU' },
                expected: "Budapest\nFiktív utca 82., IV. em./28. - or - Pf. 184.\n2806\nHUNGARY"
            },
            {
                name: 'should format Hungarian address in US locale',
                address: {
                    streetAddress: "Fiktív utca 82., IV. em./28. - or - Pf. 184.",
                    locality: "Budapest",
                    postalCode: "2806",
                    country: "Hungary",
                    countryCode: "HU"
                },
                options: { locale: 'en-US' },
                expected: "Budapest\nFiktív utca 82., IV. em./28. - or - Pf. 184.\n2806\nHungary"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 