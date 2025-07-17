/*
 * address_ET.test.js - test the address parsing and formatting routines for Ethiopia
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
        await LocaleData.ensureLocale("en-ET");
    }
});

describe('Address parsing for Ethiopia (ET)', () => {
    const testCases = [
        {
            name: 'should parse normal Ethiopian address with name, PO box, locality and country',
            input: "Mr. Abebe Bekele, P.O. Box 1519, ADDIS ABABA, ETHIOPIA",
            expected: {
                streetAddress: "Mr. Abebe Bekele, P.O. Box 1519",
                region: undefined,
                locality: "ADDIS ABABA",
                country: "ETHIOPIA",
                countryCode: "ET"
            }
        },
        {
            name: 'should parse Ethiopian address without postal code',
            input: "Mr. Abebe Bekele, P.O. Box 1519, ADDIS ABABA, ETHIOPIA",
            expected: {
                streetAddress: "Mr. Abebe Bekele, P.O. Box 1519",
                region: undefined,
                locality: "ADDIS ABABA",
                country: "ETHIOPIA",
                countryCode: "ET",
                postalCode: undefined
            }
        },
        {
            name: 'should parse Ethiopian address with multiple lines',
            input: "Mr. Abebe Bekele\nP.O. Box 1519\nADDIS ABABA\nETHIOPIA",
            expected: {
                streetAddress: "Mr. Abebe Bekele, P.O. Box 1519",
                region: undefined,
                locality: "ADDIS ABABA",
                country: "ETHIOPIA",
                countryCode: "ET"
            }
        },
        {
            name: 'should parse Ethiopian address in single line format',
            input: "Mr. Abebe Bekele, P.O. Box 1519, ADDIS ABABA, ETHIOPIA",
            expected: {
                streetAddress: "Mr. Abebe Bekele, P.O. Box 1519",
                region: undefined,
                locality: "ADDIS ABABA",
                country: "ETHIOPIA",
                countryCode: "ET"
            }
        },
        {
            name: 'should parse Ethiopian address with superfluous whitespace',
            input: "Mr. Abebe Bekele\n\tP.O. Box 1519  \n\t\n ADDIS ABABA\t\n\n ETHIOPIA  \n  \t\t\t",
            expected: {
                streetAddress: "Mr. Abebe Bekele, P.O. Box 1519",
                region: undefined,
                locality: "ADDIS ABABA",
                country: "ETHIOPIA",
                countryCode: "ET"
            }
        },
        {
            name: 'should parse Ethiopian address without delimiters',
            input: "Mr. Abebe Bekele P.O. Box 1519 ADDIS ABABA ETHIOPIA",
            expected: {
                streetAddress: "Mr. Abebe Bekele P.O. Box 1519",
                region: undefined,
                locality: "ADDIS ABABA",
                country: "ETHIOPIA",
                countryCode: "ET"
            }
        },
        {
            name: 'should parse Ethiopian address with special characters',
            input: "Post Office Headquarters, P.O. Box 5555, ADDIS ABABA, ETHIOPIA",
            expected: {
                streetAddress: "Post Office Headquarters, P.O. Box 5555",
                region: undefined,
                locality: "ADDIS ABABA",
                country: "ETHIOPIA",
                countryCode: "ET"
            }
        },
        {
            name: 'should parse Ethiopian address from US locale',
            input: "Mr. Abebe Bekele, P.O. Box 1519, ADDIS ABABA, ETHIOPIA",
            expected: {
                streetAddress: "Mr. Abebe Bekele, P.O. Box 1519",
                region: undefined,
                locality: "ADDIS ABABA",
                country: "ETHIOPIA",
                countryCode: "ET"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
        const parsedAddress = new Address(input, { locale: 'en-ET' });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
        if (expected.postalCode !== undefined) {
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
        }
    });
});

describe('Address formatting for Ethiopia (ET)', () => {
    test('should format Ethiopian address with all components', () => {
        const parsedAddress = new Address({
            streetAddress: "Mr. Abebe Bekele\nP.O. Box 1519",
            locality: "ADDIS ABABA",
            country: "ETHIOPIA",
            countryCode: "ET"
        }, { locale: 'en-ET' });

        const expected = "Mr. Abebe Bekele\nP.O. Box 1519\nADDIS ABABA\nETHIOPIA";
        const formatter = new AddressFmt({ locale: 'en-ET' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Ethiopian address from US locale', () => {
        const parsedAddress = new Address({
            streetAddress: "Mr. Abebe Bekele\nP.O. Box 1519",
            locality: "ADDIS ABABA",
            country: "ETHIOPIA",
            countryCode: "ET"
        }, { locale: 'en-US' });

        const expected = "Mr. Abebe Bekele\nP.O. Box 1519\nADDIS ABABA\nETHIOPIA";
        const formatter = new AddressFmt({ locale: 'en-US' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 