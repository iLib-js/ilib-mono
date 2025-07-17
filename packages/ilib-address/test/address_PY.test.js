/*
 * address_PY.test.js - test the address parsing and formatting routines for Paraguay
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

beforeAll(async () => {
    if (getPlatform() === "browser" && !setUpPerformed) {
        setUpPerformed = true;
        await LocaleData.ensureLocale("es-PY");
    }
});

describe('Address parsing for Paraguay', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, street, floor, postal code, city and country',
            address: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9\n1321 ASUNCIÓN\nPARAGUAY',
            locale: 'es-PY',
            expected: {
                streetAddress: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9',
                locality: 'ASUNCIÓN',
                postalCode: '1321',
                country: 'PARAGUAY',
                countryCode: 'PY'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9\nASUNCIÓN\nPARAGUAY',
            locale: 'es-PY',
            expected: {
                streetAddress: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9',
                locality: 'ASUNCIÓN',
                country: 'PARAGUAY',
                countryCode: 'PY'
            }
        },
        {
            name: 'should parse address without country',
            address: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9\n1321 ASUNCIÓN',
            locale: 'es-PY',
            expected: {
                streetAddress: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9',
                locality: 'ASUNCIÓN',
                postalCode: '1321',
                countryCode: 'PY'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811\n PISO 9\n\n1321\nASUNCIÓN\nPARAGUAY\n\n\n',
            locale: 'es-PY',
            expected: {
                streetAddress: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9',
                locality: 'ASUNCIÓN',
                postalCode: '1321',
                country: 'PARAGUAY',
                countryCode: 'PY'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811 , PISO 9 , 1321 , ASUNCIÓN , PARAGUAY',
            locale: 'es-PY',
            expected: {
                streetAddress: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9',
                locality: 'ASUNCIÓN',
                postalCode: '1321',
                country: 'PARAGUAY',
                countryCode: 'PY'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\tJOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811\n\t\t\t PISO 9\n\t\n1321\t\nASUNCIÓN\n\t PARAGUAY\n\n\n',
            locale: 'es-PY',
            expected: {
                streetAddress: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9',
                locality: 'ASUNCIÓN',
                postalCode: '1321',
                country: 'PARAGUAY',
                countryCode: 'PY'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9 1321 ASUNCIÓN PARAGUAY',
            locale: 'es-PY',
            expected: {
                streetAddress: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9',
                locality: 'ASUNCIÓN',
                postalCode: '1321',
                country: 'PARAGUAY',
                countryCode: 'PY'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9\n1321 ASUNCIÓN\nPARAGUAY',
            locale: 'en-US',
            expected: {
                streetAddress: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9',
                locality: 'ASUNCIÓN',
                postalCode: '1321',
                country: 'PARAGUAY',
                countryCode: 'PY'
            }
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });

        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.locality).toBe(expected.locality);
        if (expected.postalCode) {
            expect(parsedAddress.postalCode).toBe(expected.postalCode);
        } else {
            expect(parsedAddress.postalCode).toBeUndefined();
        }
        if (expected.country) {
            expect(parsedAddress.country).toBe(expected.country);
        } else {
            expect(parsedAddress.country).toBeUndefined();
        }
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Paraguay', () => {
    const testCases = [
        {
            name: 'should format address for Spanish locale',
            addressData: {
                streetAddress: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9',
                locality: 'ASUNCIÓN',
                postalCode: '1321',
                country: 'PARAGUAY',
                countryCode: 'PY'
            },
            locale: 'es-PY',
            expected: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9\n1321 ASUNCIÓN\nPARAGUAY'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9',
                locality: 'ASUNCIÓN',
                postalCode: '1321',
                country: 'PARAGUAY',
                countryCode: 'PY'
            },
            locale: 'en-US',
            expected: 'JOSÉ GONZÁLES WASMOSY INDEPENDENCIA NACIONAL811, PISO 9\n1321 ASUNCIÓN\nPARAGUAY'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 