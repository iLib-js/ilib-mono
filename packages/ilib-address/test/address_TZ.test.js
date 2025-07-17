/*
 * address_TZ.test.js - test the address parsing and formatting routines for Tanzania
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
        await LocaleData.ensureLocale("en-TZ");
    }
});

describe('Address parsing for Tanzania', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, PO box, city and country',
            address: 'Mr. Abel H.H. Bilia P.O. Box 10084\nDAR ES SALAAM\nTanzania',
            locale: 'en-TZ',
            expected: {
                streetAddress: 'Mr. Abel H.H. Bilia P.O. Box 10084',
                locality: 'DAR ES SALAAM',
                country: 'Tanzania',
                countryCode: 'TZ'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'Mr. Abel H.H. Bilia P.O. Box 10084\nDAR ES SALAAM\nTanzania',
            locale: 'en-TZ',
            expected: {
                streetAddress: 'Mr. Abel H.H. Bilia P.O. Box 10084',
                locality: 'DAR ES SALAAM',
                country: 'Tanzania',
                countryCode: 'TZ'
            }
        },
        {
            name: 'should parse address without country',
            address: 'Mr. Abel H.H. Bilia P.O. Box 10084\nDAR ES SALAAM',
            locale: 'en-TZ',
            expected: {
                streetAddress: 'Mr. Abel H.H. Bilia P.O. Box 10084',
                locality: 'DAR ES SALAAM',
                countryCode: 'TZ'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Mr. Abel H.H. Bilia\nP.O. Box 10084\nDAR ES SALAAM\nTanzania\n\n\n',
            locale: 'en-TZ',
            expected: {
                streetAddress: 'Mr. Abel H.H. Bilia, P.O. Box 10084',
                locality: 'DAR ES SALAAM',
                country: 'Tanzania',
                countryCode: 'TZ'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: 'Mr. Abel H.H. Bilia , P.O. Box 10084 , DAR ES SALAAM , Tanzania',
            locale: 'en-TZ',
            expected: {
                streetAddress: 'Mr. Abel H.H. Bilia, P.O. Box 10084',
                locality: 'DAR ES SALAAM',
                country: 'Tanzania',
                countryCode: 'TZ'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '\t\t\t\tMr. Abel H.H. Bilia\t\t\tP.O. Box\t\r\r10084\t\nDAR ES SALAAM\n\t Tanzania\n\n\n',
            locale: 'en-TZ',
            expected: {
                streetAddress: 'Mr. Abel H.H. Bilia P.O. Box 10084',
                locality: 'DAR ES SALAAM',
                country: 'Tanzania',
                countryCode: 'TZ'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Mr. Abel H.H. Bilia P.O. Box 10084 DAR ES SALAAM Tanzania',
            locale: 'en-TZ',
            expected: {
                streetAddress: 'Mr. Abel H.H. Bilia P.O. Box 10084',
                locality: 'DAR ES SALAAM',
                country: 'Tanzania',
                countryCode: 'TZ'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Mr. Abel H.H. Bilia P.O. Box 10084\nDAR ES SALAAM\nTanzania',
            locale: 'en-US',
            expected: {
                streetAddress: 'Mr. Abel H.H. Bilia P.O. Box 10084',
                locality: 'DAR ES SALAAM',
                country: 'Tanzania',
                countryCode: 'TZ'
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

describe('Address formatting for Tanzania', () => {
    const testCases = [
        {
            name: 'should format address for Tanzania locale',
            addressData: {
                streetAddress: 'Mr. Abel H.H. Bilia P.O. Box 10084',
                locality: 'DAR ES SALAAM',
                country: 'Tanzania',
                countryCode: 'TZ'
            },
            locale: 'en-TZ',
            expected: 'Mr. Abel H.H. Bilia P.O. Box 10084\nDAR ES SALAAM\nTanzania'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Mr. Abel H.H. Bilia P.O. Box 10084',
                locality: 'DAR ES SALAAM',
                country: 'Tanzania',
                countryCode: 'TZ'
            },
            locale: 'en-US',
            expected: 'Mr. Abel H.H. Bilia P.O. Box 10084\nDAR ES SALAAM\nTanzania'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 