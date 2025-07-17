/*
 * address_AO.test.js - test the address parsing and formatting routines for Angola
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
        await LocaleData.ensureLocale("pt-AO");
    }
});

describe('Address parsing for Angola (AO)', () => {
    const testCases = [
        {
            name: 'should parse normal Angolan address with name, street, floor, locality and country',
            input: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o, LUANDA, ANGOLA",
            expected: {
                streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
                region: undefined,
                locality: "LUANDA",
                postalCode: undefined,
                country: "ANGOLA",
                countryCode: "AO"
            }
        },
        {
            name: 'should parse Angolan address without postal code',
            input: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o, LUANDA, ANGOLA",
            expected: {
                streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
                region: undefined,
                locality: "LUANDA",
                country: "ANGOLA",
                countryCode: "AO",
                postalCode: undefined
            }
        },
        {
            name: 'should parse Angolan address with multiple lines',
            input: "Sr. Jõao Pembele\nRua Frederik Engels 92 – 7 o\nLUANDA\nANGOLA",
            expected: {
                streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
                region: undefined,
                locality: "LUANDA",
                postalCode: undefined,
                country: "ANGOLA",
                countryCode: "AO"
            }
        },
        {
            name: 'should parse Angolan address in single line format',
            input: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o, LUANDA, ANGOLA",
            expected: {
                streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
                region: undefined,
                locality: "LUANDA",
                postalCode: undefined,
                country: "ANGOLA",
                countryCode: "AO"
            }
        },
        {
            name: 'should parse Angolan address with superfluous whitespace',
            input: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o  \n\t\n LUANDA\t\n\n ANGOLA  \n  \t\t\t",
            expected: {
                streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
                region: undefined,
                locality: "LUANDA",
                postalCode: undefined,
                country: "ANGOLA",
                countryCode: "AO"
            }
        },
        {
            name: 'should parse Angolan address without delimiters',
            input: "Sr. Jõao Pembele P. 15 Sh. 1 LUANDA ANGOLA",
            expected: {
                streetAddress: "Sr. Jõao Pembele P. 15 Sh. 1",
                region: undefined,
                locality: "LUANDA",
                postalCode: undefined,
                country: "ANGOLA",
                countryCode: "AO"
            }
        },
        {
            name: 'should parse Angolan address with special characters',
            input: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o, LUANDA, ANGOLA",
            expected: {
                streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
                region: undefined,
                locality: "LUANDA",
                postalCode: undefined,
                country: "ANGOLA",
                countryCode: "AO"
            }
        },
        {
            name: 'should parse Angolan address from US locale',
            input: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o, LUANDA, ANGOLA",
            expected: {
                streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
                region: undefined,
                locality: "LUANDA",
                postalCode: undefined,
                country: "ANGOLA",
                countryCode: "AO"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
        const parsedAddress = new Address(input, { locale: 'pt-AO' });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Angola (AO)', () => {
    test('should format Angolan address with all components', () => {
        const parsedAddress = new Address({
            streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
            locality: "LUANDA",
            country: "ANGOLA",
            countryCode: "AO"
        }, { locale: 'pt-AO' });

        const expected = "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o\nLUANDA\nANGOLA";
        const formatter = new AddressFmt({ locale: 'pt-AO' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Angolan address from US locale', () => {
        const parsedAddress = new Address({
            streetAddress: "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o",
            locality: "LUANDA",
            country: "ANGOLA",
            countryCode: "AO"
        }, { locale: 'en-US' });

        const expected = "Sr. Jõao Pembele, Rua Frederik Engels 92 – 7 o\nLUANDA\nANGOLA";
        const formatter = new AddressFmt({ locale: 'en-US' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 