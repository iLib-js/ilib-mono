/*
 * address_SE.test.js - test the address parsing and formatting routines for Sweden
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

describe('ilib-address Sweden', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("sv-SE");
        }
    });

    describe('Address parsing', () => {
        const parseTestCases = [
            {
                name: 'should parse normal Swedish address',
                input: "Martin Rebas Gyllenkrooksgatan 1\n412 84 GÖTEBORG\nSWEDEN",
                options: { locale: 'sv-SE' },
                expected: {
                    streetAddress: "Martin Rebas Gyllenkrooksgatan 1",
                    locality: "GÖTEBORG",
                    region: undefined,
                    postalCode: "412 84",
                    country: "SWEDEN",
                    countryCode: "SE"
                }
            },
            {
                name: 'should parse Swedish address without postal code',
                input: "Martin Rebas Gyllenkrooksgatan 1\nGÖTEBORG\nSWEDEN",
                options: { locale: 'sv-SE' },
                expected: {
                    streetAddress: "Martin Rebas Gyllenkrooksgatan 1",
                    locality: "GÖTEBORG",
                    region: undefined,
                    postalCode: undefined,
                    country: "SWEDEN",
                    countryCode: "SE"
                }
            },
            {
                name: 'should parse Swedish address without country',
                input: "Martin Rebas Gyllenkrooksgatan 1 , 412 84 , GÖTEBORG",
                options: { locale: 'sv-SE' },
                expected: {
                    streetAddress: "Martin Rebas Gyllenkrooksgatan 1",
                    locality: "GÖTEBORG",
                    region: undefined,
                    postalCode: "412 84",
                    country: undefined,
                    countryCode: "SE"
                }
            },
            {
                name: 'should parse Swedish address with multiple lines',
                input: "Ms. Hypothetical\nc/o Jon Wätte Hagagatan 1\nvi\n113 49\nStockholm\nSWEDEN",
                options: { locale: 'sv-SE' },
                expected: {
                    streetAddress: "Ms. Hypothetical, c/o Jon Wätte Hagagatan 1, vi",
                    locality: "Stockholm",
                    region: undefined,
                    postalCode: "113 49",
                    country: "SWEDEN",
                    countryCode: "SE"
                }
            },
            {
                name: 'should parse Swedish address in one line format',
                input: "Ms. Hypothetical , c/o Jon Wätte Hagagatan 1 , 113 49 , Stockholm , SWEDEN",
                options: { locale: 'sv-SE' },
                expected: {
                    streetAddress: "Ms. Hypothetical, c/o Jon Wätte Hagagatan 1",
                    locality: "Stockholm",
                    region: undefined,
                    postalCode: "113 49",
                    country: "SWEDEN",
                    countryCode: "SE"
                }
            },
            {
                name: 'should parse Swedish address without delimiters',
                input: "Ms. Hypothetical c/o Jon Wätte Hagagatan 113 49 Stockholm SWEDEN",
                options: { locale: 'sv-SE' },
                expected: {
                    streetAddress: "Ms. Hypothetical c/o Jon Wätte Hagagatan",
                    locality: "Stockholm",
                    region: undefined,
                    postalCode: "113 49",
                    country: "SWEDEN",
                    countryCode: "SE"
                }
            },
            {
                name: 'should parse Swedish address from US locale',
                input: "Martin Rebas Gyllenkrooksgatan 1\nGÖTEBORG 412 84\nSWEDEN",
                options: { locale: 'en-US' },
                expected: {
                    streetAddress: "Martin Rebas Gyllenkrooksgatan 1",
                    locality: "GÖTEBORG",
                    region: undefined,
                    postalCode: "412 84",
                    country: "SWEDEN",
                    countryCode: "SE"
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
                name: 'should format Swedish address in Swedish locale',
                address: {
                    streetAddress: "Martin Rebas Gyllenkrooksgatan 1",
                    locality: "GÖTEBORG",
                    region: null,
                    postalCode: "412 84",
                    country: "SWEDEN",
                    countryCode: "SE"
                },
                options: { locale: 'sv-SE' },
                expected: "Martin Rebas Gyllenkrooksgatan 1\n412 84 GÖTEBORG\nSWEDEN"
            },
            {
                name: 'should format Swedish address in US locale',
                address: {
                    streetAddress: "Martin Rebas Gyllenkrooksgatan",
                    locality: "GÖTEBORG",
                    region: null,
                    postalCode: "412 84",
                    country: "SWEDEN",
                    countryCode: "SE"
                },
                options: { locale: 'en-US' },
                expected: "Martin Rebas Gyllenkrooksgatan\n412 84 GÖTEBORG\nSWEDEN"
            }
        ];

        test.each(formatTestCases)('$name', ({ address, options, expected }) => {
            const parsedAddress = new Address(address, options);
            const formatter = new AddressFmt(options);
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 