/*
 * address_PR.test.js - test the address parsing and formatting routines for Puerto Rico
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
        await LocaleData.ensureLocale("en-PR");
    }
});

describe('Address parsing for Puerto Rico', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, urbanization, street, city, region, postal code and country',
            address: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150\nCALLE A\nSAN JUAN, PR 00926-3232\nPuerto Rico',
            locale: 'en-PR',
            expected: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926-3232',
                country: 'Puerto Rico',
                countryCode: 'PR'
            }
        },
        {
            name: 'should parse address with Spanish locale',
            address: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150\nCALLE A\nSAN JUAN, PR 00926-3232\nPuerto Rico',
            locale: 'es-PR',
            expected: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926-3232',
                country: 'Puerto Rico',
                countryCode: 'PR'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A\nSAN JUAN, PR\nPuerto Rico',
            locale: 'en-PR',
            expected: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                country: 'Puerto Rico',
                countryCode: 'PR'
            }
        },
        {
            name: 'should parse address with short postal code',
            address: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A\nSAN JUAN, PR 00926\nPuerto Rico',
            locale: 'en-PR',
            expected: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926',
                country: 'Puerto Rico',
                countryCode: 'PR'
            }
        },
        {
            name: 'should parse address without country',
            address: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A\nSAN JUAN, PR 00926-3232',
            locale: 'en-PR',
            expected: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926-3232',
                countryCode: 'PR'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'MRS MARÍA SUÁREZ\nURB LAS GLADIOLAS\n150\nCALLE A\nSAN JUAN, PR 00926-3232\nPuerto Rico',
            locale: 'en-PR',
            expected: {
                streetAddress: 'MRS MARÍA SUÁREZ, URB LAS GLADIOLAS, 150, CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926-3232',
                country: 'Puerto Rico',
                countryCode: 'PR'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150 CALLE A, SAN JUAN, PR 00926-3232, Puerto Rico',
            locale: 'en-PR',
            expected: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150 CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926-3232',
                country: 'Puerto Rico',
                countryCode: 'PR'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150 CALLE A SAN JUAN PR 00926-3232 Puerto Rico',
            locale: 'en-PR',
            expected: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150 CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926-3232',
                country: 'Puerto Rico',
                countryCode: 'PR'
            }
        },
        {
            name: 'should parse address from US locale without country',
            address: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A\nSAN JUAN, PR 00926-3232',
            locale: 'en-US',
            expected: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926-3232',
                countryCode: 'US'
            }
        },
        {
            name: 'should parse address from US locale with country',
            address: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A\nSAN JUAN, PR 00926-3232\nPuerto Rico',
            locale: 'en-US',
            expected: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926-3232',
                country: 'Puerto Rico',
                countryCode: 'PR'
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

describe('Address formatting for Puerto Rico', () => {
    const testCases = [
        {
            name: 'should format address for English locale',
            addressData: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926-3232',
                country: 'Puerto Rico',
                countryCode: 'PR'
            },
            locale: 'en-PR',
            expected: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A\nSAN JUAN, PR 00926-3232\nPuerto Rico'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A',
                locality: 'SAN JUAN',
                region: 'PR',
                postalCode: '00926-3232',
                country: 'Puerto Rico',
                countryCode: 'PR'
            },
            locale: 'en-US',
            expected: 'MRS MARÍA SUÁREZ URB LAS GLADIOLAS 150, CALLE A\nSAN JUAN, PR 00926-3232\nPuerto Rico'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 