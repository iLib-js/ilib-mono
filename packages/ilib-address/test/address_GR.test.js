/*
 * address_GR.test.js - test the address parsing and formatting routines for Greece
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

beforeAll(async () => {
    if (getPlatform() === "browser" && !setUpPerformed) {
        setUpPerformed = true;
        await LocaleData.ensureLocale("el-GR");
    }
});

describe('Address parsing for Greece (GR)', () => {
    const testCases = [
        {
            name: 'should parse normal Greek address with street, locality, postal code and country',
            input: "18, Heracleous St., Kifissia, 145 64 Athens,GREECE",
            expected: {
                streetAddress: "18, Heracleous St., Kifissia",
                region: undefined,
                locality: "Athens",
                postalCode: "145 64",
                country: "GREECE",
                countryCode: "GR"
            }
        },
        {
            name: 'should parse Greek address without postal code',
            input: "18, Heracleous St., Kifissia, Athens,GREECE",
            expected: {
                streetAddress: "18, Heracleous St., Kifissia",
                region: undefined,
                locality: "Athens",
                country: "GREECE",
                countryCode: "GR",
                postalCode: undefined
            }
        },
        {
            name: 'should parse Greek address with multiple lines',
            input: "18, Heracleous St., Kifissia, 145 64 Athens,GREECE",
            expected: {
                streetAddress: "18, Heracleous St., Kifissia",
                region: undefined,
                locality: "Athens",
                postalCode: "145 64",
                country: "GREECE",
                countryCode: "GR"
            }
        },
        {
            name: 'should parse Greek address in single line format',
            input: "18, Heracleous St., Kifissia, 145 64 Athens,GREECE",
            expected: {
                streetAddress: "18, Heracleous St., Kifissia",
                region: undefined,
                locality: "Athens",
                postalCode: "145 64",
                country: "GREECE",
                countryCode: "GR"
            }
        },
        {
            name: 'should parse Greek address with superfluous whitespace',
            input: "18, Heracleous St., Kifissia, 145 64 Athens,GREECE",
            expected: {
                streetAddress: "18, Heracleous St., Kifissia",
                region: undefined,
                locality: "Athens",
                postalCode: "145 64",
                country: "GREECE",
                countryCode: "GR"
            }
        },
        {
            name: 'should parse Greek address without delimiters',
            input: "18, Heracleous St., Kifissia, 145 64 Athens,GREECE",
            expected: {
                streetAddress: "18, Heracleous St., Kifissia",
                region: undefined,
                locality: "Athens",
                postalCode: "145 64",
                country: "GREECE",
                countryCode: "GR"
            }
        },
        {
            name: 'should parse Greek address from US locale',
            input: "18, Heracleous St., Kifissia, 145 64 Athens,GREECE",
            expected: {
                streetAddress: "18, Heracleous St., Kifissia",
                region: undefined,
                locality: "Athens",
                postalCode: "145 64",
                country: "GREECE",
                countryCode: "GR"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
        const parsedAddress = new Address(input, { locale: 'el-GR' });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Greece (GR)', () => {
    test('should format Greek address with all components', () => {
        const parsedAddress = new Address({
            streetAddress: "18, Heracleous St.,Kifissia",
            locality: "Athens",
            postalCode: "145 64",
            country: "GREECE",
            countryCode: "GR"
        }, { locale: 'el-GR' });

        const expected = "18, Heracleous St.,Kifissia\n145 64 Athens\nGREECE";
        const formatter = new AddressFmt({ locale: 'el-GR' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Greek address from US locale', () => {
        const parsedAddress = new Address({
            streetAddress: "18, Heracleous St.,Kifissia",
            postalCode: "145 64",
            locality: "Athens",
            country: "Greece",
            countryCode: "GR"
        }, { locale: 'en-US' });

        const expected = "18, Heracleous St.,Kifissia\n145 64 Athens\nGreece";
        const formatter = new AddressFmt({ locale: 'en-US' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 