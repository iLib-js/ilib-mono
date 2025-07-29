/*
 * address_TG.test.js - test the address parsing and formatting routines for Togo
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
        await LocaleData.ensureLocale("fr-TG");
    }
});

describe('Address parsing for Togo', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, PO box, city and country',
            address: 'M. Nicolas Ayi Patatu B.P. 526\nLome\nTogo',
            locale: 'fr-TG',
            expected: {
                streetAddress: 'M. Nicolas Ayi Patatu B.P. 526',
                locality: 'Lome',
                country: 'Togo',
                countryCode: 'TG'
            }
        },
        {
            name: 'should parse address without country',
            address: 'M. Nicolas Ayi Patatu B.P. 526\nLome',
            locale: 'fr-TG',
            expected: {
                streetAddress: 'M. Nicolas Ayi Patatu B.P. 526',
                locality: 'Lome',
                countryCode: 'TG'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'M. Nicolas Ayi Patatu\nB.P. 526\nLome\nTogo\n\n\n',
            locale: 'fr-TG',
            expected: {
                streetAddress: 'M. Nicolas Ayi Patatu, B.P. 526',
                locality: 'Lome',
                country: 'Togo',
                countryCode: 'TG'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'M. Nicolas Ayi Patatu , B.P. 526 , Lome , Togo',
            locale: 'fr-TG',
            expected: {
                streetAddress: 'M. Nicolas Ayi Patatu, B.P. 526',
                locality: 'Lome',
                country: 'Togo',
                countryCode: 'TG'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\t\tM. Nicolas Ayi Patatu\t\t\tB.P.\t\r\r526\t\nLome\n\tTogo\n\n\n',
            locale: 'fr-TG',
            expected: {
                streetAddress: 'M. Nicolas Ayi Patatu B.P. 526',
                locality: 'Lome',
                country: 'Togo',
                countryCode: 'TG'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'M. Nicolas Ayi Patatu B.P. 526 Lome Togo',
            locale: 'fr-TG',
            expected: {
                streetAddress: 'M. Nicolas Ayi Patatu B.P. 526',
                locality: 'Lome',
                country: 'Togo',
                countryCode: 'TG'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'M. Nicolas Ayi Patatu B.P. 526\nLome\nTogo',
            locale: 'en-US',
            expected: {
                streetAddress: 'M. Nicolas Ayi Patatu B.P. 526',
                locality: 'Lome',
                country: 'Togo',
                countryCode: 'TG'
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

describe('Address formatting for Togo', () => {
    const testCases = [
        {
            name: 'should format address for French Togo locale',
            addressData: {
                streetAddress: 'M. Nicolas Ayi Patatu B.P. 526',
                locality: 'Lome',
                country: 'Togo',
                countryCode: 'TG'
            },
            locale: 'fr-TG',
            expected: 'M. Nicolas Ayi Patatu B.P. 526\nLome\nTogo'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'M. Nicolas Ayi Patatu B.P. 526',
                locality: 'Lome',
                country: 'Togo',
                countryCode: 'TG'
            },
            locale: 'en-US',
            expected: 'M. Nicolas Ayi Patatu B.P. 526\nLome\nTogo'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 