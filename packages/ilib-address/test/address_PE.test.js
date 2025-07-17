/*
 * address_PE.test.js - test the address parsing and formatting routines for Peru
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
        await LocaleData.ensureLocale("es-PE");
    }
});

describe('Address parsing for Peru', () => {
    const testCases = [
        {
            name: 'should parse normal address with street, district and country',
            address: 'Catalina Huanca 110 San Isidro\nLima 27\nPERU',
            locale: 'es-PE',
            expected: {
                streetAddress: 'Catalina Huanca 110 San Isidro',
                locality: 'Lima 27',
                country: 'PERU',
                countryCode: 'PE'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'Catalina Huanca 110 San Isidro\nLima 27\nPERU',
            locale: 'es-PE',
            expected: {
                streetAddress: 'Catalina Huanca 110 San Isidro',
                locality: 'Lima 27',
                country: 'PERU',
                countryCode: 'PE'
            }
        },
        {
            name: 'should parse address without country',
            address: 'Catalina Huanca 110 San Isidro\nLima 27',
            locale: 'es-PE',
            expected: {
                streetAddress: 'Catalina Huanca 110 San Isidro',
                locality: 'Lima 27',
                countryCode: 'PE'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Catalina Huanca\n110 San Isidro\nLima 27\nPERU',
            locale: 'es-PE',
            expected: {
                streetAddress: 'Catalina Huanca, 110 San Isidro',
                locality: 'Lima 27',
                country: 'PERU',
                countryCode: 'PE'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'Catalina Huanca , 110 San Isidro , Lima 27 , PERU',
            locale: 'es-PE',
            expected: {
                streetAddress: 'Catalina Huanca, 110 San Isidro',
                locality: 'Lima 27',
                country: 'PERU',
                countryCode: 'PE'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: 'Catalina Huanca\n\n\t\r\t\t\r110 San Isidro\r\r\n\nLima 27\t\r\n\t\rPERU',
            locale: 'es-PE',
            expected: {
                streetAddress: 'Catalina Huanca, 110 San Isidro',
                locality: 'Lima 27',
                country: 'PERU',
                countryCode: 'PE'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Catalina Huanca 110 San Isidro Lima 27 PERU',
            locale: 'es-PE',
            expected: {
                streetAddress: 'Catalina Huanca 110 San Isidro',
                locality: 'Lima 27',
                country: 'PERU',
                countryCode: 'PE'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Catalina Huanca 110 San Isidro\nLima 27\nPERU',
            locale: 'es-PE',
            expected: {
                streetAddress: 'Catalina Huanca 110 San Isidro',
                locality: 'Lima 27',
                country: 'PERU',
                countryCode: 'PE'
            }
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });

        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBeUndefined();
        if (expected.country) {
            expect(parsedAddress.country).toBe(expected.country);
        } else {
            expect(parsedAddress.country).toBeUndefined();
        }
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Peru', () => {
    const testCases = [
        {
            name: 'should format address for Spanish locale',
            addressData: {
                streetAddress: 'Catalina Huanca 110 San Isidro',
                locality: 'Lima 27',
                postalCode: '1010',
                country: 'PERU',
                countryCode: 'PE'
            },
            locale: 'es-PE',
            expected: 'Catalina Huanca 110 San Isidro\nLima 27\nPERU'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Catalina Huanca 110 San Isidro',
                locality: 'Lima 27',
                postalCode: '1010',
                country: 'PERU',
                countryCode: 'PE'
            },
            locale: 'en-US',
            expected: 'Catalina Huanca 110 San Isidro\nLima 27\nPERU'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 