/*
 * address_BF.test.js - test the address parsing and formatting routines for Burkina Faso
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
        await LocaleData.ensureLocale("fr-BF");
    }
});

describe('Address parsing for Burkina Faso', () => {
    const testCases = [
        {
            name: 'should parse normal address with BP format',
            address: '03 B.P. 7021, Ouagadougou 03, Burkina Faso',
            locale: 'fr-BF',
            expected: {
                streetAddress: '03 B.P. 7021',
                locality: 'Ouagadougou 03',
                country: 'Burkina Faso',
                countryCode: 'BF'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'BP 621, BOBO-DIOULASSO, BURKINA FASO',
            locale: 'fr-BF',
            expected: {
                streetAddress: 'BP 621',
                locality: 'BOBO-DIOULASSO',
                country: 'BURKINA FASO',
                countryCode: 'BF'
            }
        },
        {
            name: 'should parse multi-line address',
            address: '01 BP 621\nBOBO-DIOULASSO 01\nBURKINA FASO',
            locale: 'fr-BF',
            expected: {
                streetAddress: '01 BP 621',
                locality: 'BOBO-DIOULASSO 01',
                country: 'BURKINA FASO',
                countryCode: 'BF'
            }
        },
        {
            name: 'should parse single-line address with commas',
            address: '01 BP 621, BOBO-DIOULASSO 01, BURKINA FASO',
            locale: 'fr-BF',
            expected: {
                streetAddress: '01 BP 621',
                locality: 'BOBO-DIOULASSO 01',
                country: 'BURKINA FASO',
                countryCode: 'BF'
            }
        },
        {
            name: 'should parse address with superfluous whitespace',
            address: '01 BP 621  \n\t\n BOBO-DIOULASSO 01\t\n\n BURKINA FASO  \n  \t\t\t',
            locale: 'fr-BF',
            expected: {
                streetAddress: '01 BP 621',
                locality: 'BOBO-DIOULASSO 01',
                country: 'BURKINA FASO',
                countryCode: 'BF'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: '01 BP 621 BOBO-DIOULASSO 01 BURKINA FASO',
            locale: 'fr-BF',
            expected: {
                streetAddress: '01 BP 621',
                locality: 'BOBO-DIOULASSO 01',
                country: 'BURKINA FASO',
                countryCode: 'BF'
            }
        },
        {
            name: 'should parse address with special characters',
            address: 'Société nationale des postes, 01 BP 6000, BOBO-DIOULASSO 01, BURKINA FASO',
            locale: 'fr-BF',
            expected: {
                streetAddress: 'Société nationale des postes, 01 BP 6000',
                locality: 'BOBO-DIOULASSO 01',
                country: 'BURKINA FASO',
                countryCode: 'BF'
            }
        },
        {
            name: 'should parse address from US locale',
            address: '01 BP 621, BOBO-DIOULASSO 01, BURKINA FASO',
            locale: 'en-US',
            expected: {
                streetAddress: '01 BP 621',
                locality: 'BOBO-DIOULASSO 01',
                country: 'BURKINA FASO',
                countryCode: 'BF'
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
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Burkina Faso', () => {
    const testCases = [
        {
            name: 'should format address for French locale',
            addressData: {
                streetAddress: '01 BP 621',
                locality: 'BOBO-DIOULASSO 01',
                country: 'BURKINA FASO',
                countryCode: 'BF'
            },
            locale: 'fr-BF',
            expected: '01 BP 621\nBOBO-DIOULASSO 01\nBURKINA FASO'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: '01 BP 621',
                country: 'BURKINA FASO',
                locality: 'BOBO-DIOULASSO 01',
                countryCode: 'BF'
            },
            locale: 'en-US',
            expected: '01 BP 621\nBOBO-DIOULASSO 01\nBURKINA FASO'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 