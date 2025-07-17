/*
 * address_SI.test.js - test the address parsing and formatting routines for Slovenia
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
        await LocaleData.ensureLocale("sl-SI");
    }
});

describe('Address parsing for Slovenia', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, street, postal code, city and country',
            address: 'Marija Borisek Prvomajska ulica 20\n1270 LITIJA\nSLOVENIA',
            locale: 'sl-SI',
            expected: {
                streetAddress: 'Marija Borisek Prvomajska ulica 20',
                locality: 'LITIJA',
                postalCode: '1270',
                country: 'SLOVENIA',
                countryCode: 'SI'
            }
        },
        {
            name: 'should parse address with different format',
            address: 'Prešernova 31\n1000 Ljubljana\nSlovenia',
            locale: 'sl-SI',
            expected: {
                streetAddress: 'Prešernova 31',
                locality: 'Ljubljana',
                postalCode: '1000',
                country: 'Slovenia',
                countryCode: 'SI'
            }
        },
        {
            name: 'should parse address without country',
            address: 'Marija Borisek , Prvomajska , ulica 20 , 1270 LITIJA',
            locale: 'sl-SI',
            expected: {
                streetAddress: 'Marija Borisek, Prvomajska, ulica 20',
                locality: 'LITIJA',
                postalCode: '1270',
                countryCode: 'SI'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Marija Borisek\nPrvomajska ulica 20\n1270 LITIJA\nSLOVENIA',
            locale: 'sl-SI',
            expected: {
                streetAddress: 'Marija Borisek, Prvomajska ulica 20',
                locality: 'LITIJA',
                postalCode: '1270',
                country: 'SLOVENIA',
                countryCode: 'SI'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'Marija Borisek , Prvomajska ulica 20 , 1270 , LITIJA , SLOVENIA',
            locale: 'sl-SI',
            expected: {
                streetAddress: 'Marija Borisek, Prvomajska ulica 20',
                locality: 'LITIJA',
                postalCode: '1270',
                country: 'SLOVENIA',
                countryCode: 'SI'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Marija Borisek Prvomajska ulica 20 1270 LITIJA SLOVENIA',
            locale: 'sl-SI',
            expected: {
                streetAddress: 'Marija Borisek Prvomajska ulica 20',
                locality: 'LITIJA',
                postalCode: '1270',
                country: 'SLOVENIA',
                countryCode: 'SI'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Marija Borisek Prvomajska ulica 20\nLITIJA 1270\nSLOVENIA',
            locale: 'en-US',
            expected: {
                streetAddress: 'Marija Borisek Prvomajska ulica 20',
                locality: 'LITIJA',
                postalCode: '1270',
                country: 'SLOVENIA',
                countryCode: 'SI'
            }
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });

        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBeUndefined();
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        if (expected.country) {
            expect(parsedAddress.country).toBe(expected.country);
        } else {
            expect(parsedAddress.country).toBeUndefined();
        }
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Slovenia', () => {
    const testCases = [
        {
            name: 'should format address for Slovenian locale',
            addressData: {
                streetAddress: 'Marija Borisek Prvomajska ulica 20',
                locality: 'LITIJA',
                region: null,
                postalCode: '1270',
                country: 'SLOVENIA',
                countryCode: 'SI'
            },
            locale: 'sl-SI',
            expected: 'Marija Borisek Prvomajska ulica 20\n1270 LITIJA\nSLOVENIA'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Marija Borisek Prvomajska ulica 20',
                locality: 'LITIJA',
                region: null,
                postalCode: '1270',
                country: 'SLOVENIA',
                countryCode: 'SI'
            },
            locale: 'en-US',
            expected: 'Marija Borisek Prvomajska ulica 20\n1270 LITIJA\nSLOVENIA'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 