/*
 * address_SL.test.js - test the address parsing and formatting routines for Sierra Leone
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
        await LocaleData.ensureLocale("en-SL");
    }
});

describe('Address parsing for Sierra Leone', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, street, city and country',
            address: 'Mr. John Kamara 7A Ross Road Cline\nFreetown\nSierra Leone',
            locale: 'en-SL',
            expected: {
                streetAddress: 'Mr. John Kamara 7A Ross Road Cline',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'Mr. John Kamara 7A Ross Road Cline\nFreetown\nSierra Leone',
            locale: 'en-SL',
            expected: {
                streetAddress: 'Mr. John Kamara 7A Ross Road Cline',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            }
        },
        {
            name: 'should parse address without country',
            address: 'Mr. John Kamara 7A Ross Road Cline\nFreetown',
            locale: 'en-SL',
            expected: {
                streetAddress: 'Mr. John Kamara 7A Ross Road Cline',
                locality: 'Freetown',
                countryCode: 'SL'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Mr. John Kamara\n7A Ross Road Cline\nFreetown\nSierra Leone\n\n\n',
            locale: 'en-SL',
            expected: {
                streetAddress: 'Mr. John Kamara, 7A Ross Road Cline',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'Mr. John Kamara , 7A Ross Road Cline , Freetown , Sierra Leone',
            locale: 'en-SL',
            expected: {
                streetAddress: 'Mr. John Kamara, 7A Ross Road Cline',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\t\tMr. John Kamara\t\t\t7A Ross Road Cline\t\nFreetown\n\t Sierra Leone\n\n\n',
            locale: 'en-SL',
            expected: {
                streetAddress: 'Mr. John Kamara 7A Ross Road Cline',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Mr. John Kamara 7A Ross Road Cline, Freetown Sierra Leone',
            locale: 'en-SL',
            expected: {
                streetAddress: 'Mr. John Kamara 7A Ross Road Cline',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Mr. John Kamara 7A Ross Road Cline\nFreetown\nSierra Leone',
            locale: 'en-US',
            expected: {
                streetAddress: 'Mr. John Kamara 7A Ross Road Cline',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            }
        },
        {
            name: 'should parse address with apostrophe in street name',
            address: 'Mr. Simon Hunter 87 Florence\'s, Peninsula Road\nFreetown\nSierra Leone',
            locale: 'en-SL',
            expected: {
                streetAddress: 'Mr. Simon Hunter 87 Florence\'s, Peninsula Road',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
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

describe('Address formatting for Sierra Leone', () => {
    const testCases = [
        {
            name: 'should format address for Sierra Leone locale',
            addressData: {
                streetAddress: 'Mr. John Kamara 7A Ross Road Cline',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            },
            locale: 'en-SL',
            expected: 'Mr. John Kamara 7A Ross Road Cline\nFreetown\nSierra Leone'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Mr. John Kamara 7A Ross Road Cline',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            },
            locale: 'en-US',
            expected: 'Mr. John Kamara 7A Ross Road Cline\nFreetown\nSierra Leone'
        },
        {
            name: 'should format address with apostrophe in street name for US locale',
            addressData: {
                streetAddress: 'Mr. Simon Hunter 87 Florence\'s, Peninsula Road',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            },
            locale: 'en-US',
            expected: 'Mr. Simon Hunter 87 Florence\'s, Peninsula Road\nFreetown\nSierra Leone'
        },
        {
            name: 'should format address with apostrophe in street name for Sierra Leone locale',
            addressData: {
                streetAddress: 'Mr. Simon Hunter 87 Florence\'s, Peninsula Road',
                locality: 'Freetown',
                country: 'Sierra Leone',
                countryCode: 'SL'
            },
            locale: 'en-SL',
            expected: 'Mr. Simon Hunter 87 Florence\'s, Peninsula Road\nFreetown\nSierra Leone'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 