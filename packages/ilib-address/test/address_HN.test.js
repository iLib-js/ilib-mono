/*
 * address_HN.test.js - test the address parsing and formatting routines for Honduras
 *
 * Copyright © 2025 JEDLSoft
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

describe('Address parsing for Honduras', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("es-HN");
        }
    });

    const addressParseTestCases = [
        {
            name: 'should parse normal Honduran address with postal code',
            input: "Sr. Juan C. Martel\nCM1102 LAS LAJAS, Comayagua\nHONDURAS",
            locale: 'es-HN',
            expected: {
                streetAddress: "Sr. Juan C. Martel",
                locality: "LAS LAJAS",
                region: "Comayagua",
                postalCode: "CM1102",
                country: "HONDURAS",
                countryCode: "HN"
            }
        },
        {
            name: 'should parse Honduran address without postal code',
            input: "Sr. Juan C. Martel\nLAS LAJAS, Comayagua\nHONDURAS",
            locale: 'es-HN',
            expected: {
                streetAddress: "Sr. Juan C. Martel",
                locality: "LAS LAJAS",
                region: "Comayagua",
                postalCode: undefined,
                country: "HONDURAS",
                countryCode: "HN"
            }
        },
        {
            name: 'should parse Honduran address without country',
            input: "Sr. Juan C. Martel\nCM1102 LAS LAJAS, Comayagua",
            locale: 'es-HN',
            expected: {
                streetAddress: "Sr. Juan C. Martel",
                locality: "LAS LAJAS",
                region: "Comayagua",
                postalCode: "CM1102",
                country: undefined,
                countryCode: "HN"
            }
        },
        {
            name: 'should parse Honduran address with many lines',
            input: "Sr. Juan C. Martel\nCM1102 LAS LAJAS, Comayagua\nHONDURAS",
            locale: 'es-HN',
            expected: {
                streetAddress: "Sr. Juan C. Martel",
                locality: "LAS LAJAS",
                region: "Comayagua",
                postalCode: "CM1102",
                country: "HONDURAS",
                countryCode: "HN"
            }
        },
        {
            name: 'should parse Honduran address on one line',
            input: "Sr. Juan C. Martel , CM1102 , LAS LAJAS , Comayagua , HONDURAS",
            locale: 'es-HN',
            expected: {
                streetAddress: "Sr. Juan C. Martel",
                locality: "LAS LAJAS",
                region: "Comayagua",
                postalCode: "CM1102",
                country: "HONDURAS",
                countryCode: "HN"
            }
        },
        {
            name: 'should parse Honduran address with superfluous whitespace',
            input: "Sr. Juan C. Martel\n\n\n\rCM1102\r\nLAS LAJAS\r\r\rComayagua\t\t\rHONDURAS",
            locale: 'es-HN',
            expected: {
                streetAddress: "Sr. Juan C. Martel",
                locality: "LAS LAJAS",
                region: "Comayagua",
                postalCode: "CM1102",
                country: "HONDURAS",
                countryCode: "HN"
            }
        },
        {
            name: 'should parse Honduran address without delimiters',
            input: "Sr. Juan C. Martel CM1102 LAS LAJAS Comayagua HONDURAS",
            locale: 'es-HN',
            expected: {
                streetAddress: "Sr. Juan C. Martel",
                locality: "LAS LAJAS",
                region: "Comayagua",
                postalCode: "CM1102",
                country: "HONDURAS",
                countryCode: "HN"
            }
        },
        {
            name: 'should parse Honduran address from US locale',
            input: "Sr. Juan C. Martel\nCM1102 LAS LAJAS, Comayagua\nHONDURAS",
            locale: 'en-US',
            expected: {
                streetAddress: "Sr. Juan C. Martel",
                locality: "LAS LAJAS",
                region: "Comayagua",
                postalCode: "CM1102",
                country: "HONDURAS",
                countryCode: "HN"
            }
        }
    ];

    test.each(addressParseTestCases)("$name", ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Honduras', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("es-HN");
        }
    });

    const addressFormatTestCases = [
        {
            name: 'should format Honduran address with Spanish locale',
            addressData: {
                streetAddress: "Sr. Juan C. Martel",
                locality: "LAS LAJAS",
                postalCode: "CM1102",
                region: "Comayagua",
                country: "HONDURAS",
                countryCode: "HN"
            },
            locale: 'es-HN',
            expected: "Sr. Juan C. Martel\nCM1102 LAS LAJAS, Comayagua\nHONDURAS"
        },
        {
            name: 'should format Honduran address from US locale',
            addressData: {
                streetAddress: "Sr. Juan C. Martel",
                locality: "LAS LAJAS",
                postalCode: "CM1102",
                region: "Comayagua",
                country: "HONDURAS",
                countryCode: "HN"
            },
            locale: 'en-US',
            expected: "Sr. Juan C. Martel\nCM1102 LAS LAJAS, Comayagua\nHONDURAS"
        }
    ];

    test.each(addressFormatTestCases)("$name", ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 