/*
 * address_PH.test.js - test the address parsing and formatting routines for Philippines
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
        await LocaleData.ensureLocale("es-PH");
    }
});

describe('Address parsing for Philippines', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, room, street, city, region, postal code and country',
            address: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan\n2900 Laoag City Ilocos Norte\nPhilippines',
            locale: 'es-PH',
            expected: {
                streetAddress: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan',
                locality: 'Laoag City',
                region: 'Ilocos Norte',
                postalCode: '2900',
                country: 'Philippines',
                countryCode: 'PH'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan\nLaoag City Ilocos Norte\nPhilippines',
            locale: 'es-PH',
            expected: {
                streetAddress: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan',
                locality: 'Laoag City',
                region: 'Ilocos Norte',
                country: 'Philippines',
                countryCode: 'PH'
            }
        },
        {
            name: 'should parse address without country',
            address: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan\n2900 Laoag City Ilocos Norte',
            locale: 'es-PH',
            expected: {
                streetAddress: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan',
                locality: 'Laoag City',
                region: 'Ilocos Norte',
                postalCode: '2900',
                countryCode: 'PH'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Juan dela Cruz Rm 107\n1901 Airport Road\nCabungaan\n2900 Laoag City Ilocos Norte\nPhilippines',
            locale: 'es-PH',
            expected: {
                streetAddress: 'Juan dela Cruz Rm 107, 1901 Airport Road, Cabungaan',
                locality: 'Laoag City',
                region: 'Ilocos Norte',
                postalCode: '2900',
                country: 'Philippines',
                countryCode: 'PH'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'Juan dela Cruz Rm 107 , 1901 Airport Road , Cabungaan , 2900 , Laoag City , Ilocos Norte , Philippines',
            locale: 'es-PH',
            expected: {
                streetAddress: 'Juan dela Cruz Rm 107, 1901 Airport Road, Cabungaan',
                locality: 'Laoag City',
                region: 'Ilocos Norte',
                postalCode: '2900',
                country: 'Philippines',
                countryCode: 'PH'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: 'Juan dela Cruz Rm 107\n\n\t\r1901 Airport Road\t\t\rCabungaan\n\n\t\r2900\r\n\nLaoag City\t\rIlocos Norte\t\t\rPhilippines',
            locale: 'es-PH',
            expected: {
                streetAddress: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan',
                locality: 'Laoag City',
                region: 'Ilocos Norte',
                postalCode: '2900',
                country: 'Philippines',
                countryCode: 'PH'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Juan dela Cruz Rm 107 1901 Airport Road Cabungaan 2900 Laoag City Ilocos Norte Philippines',
            locale: 'es-PH',
            expected: {
                streetAddress: 'Juan dela Cruz Rm 107 1901 Airport Road Cabungaan',
                locality: 'Laoag City',
                region: 'Ilocos Norte',
                postalCode: '2900',
                country: 'Philippines',
                countryCode: 'PH'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan\n2900 Laoag City Ilocos Norte\nPhilippines',
            locale: 'es-PH',
            expected: {
                streetAddress: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan',
                locality: 'Laoag City',
                region: 'Ilocos Norte',
                postalCode: '2900',
                country: 'Philippines',
                countryCode: 'PH'
            }
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });

        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
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

describe('Address formatting for Philippines', () => {
    const testCases = [
        {
            name: 'should format address for Spanish locale',
            addressData: {
                streetAddress: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan',
                locality: 'Laoag City',
                postalCode: '2900',
                region: 'Ilocos Norte',
                country: 'Philippines',
                countryCode: 'PH'
            },
            locale: 'es-PH',
            expected: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan\n2900 Laoag City Ilocos Norte\nPhilippines'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan',
                locality: 'Laoag City',
                postalCode: '2900',
                region: 'Ilocos Norte',
                country: 'Philippines',
                countryCode: 'PH'
            },
            locale: 'en-US',
            expected: 'Juan dela Cruz Rm 107, 1901 Airport Road Cabungaan\n2900 Laoag City Ilocos Norte\nPhilippines'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 