/*
 * address_SK.test.js - test the address parsing and formatting routines for Slovakia
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
        await LocaleData.ensureLocale("sk-SK");
    }
});

describe('Address parsing for Slovakia', () => {
    const testCases = [
        {
            name: 'should parse normal address with name, street, postal code, city and country',
            address: 'Pawel Opatovský Gazdova 4\n010 01 ŽILINA 1\nSLOVAKIA',
            locale: 'sk-SK',
            expected: {
                streetAddress: 'Pawel Opatovský Gazdova 4',
                locality: 'ŽILINA 1',
                postalCode: '010 01',
                country: 'SLOVAKIA',
                countryCode: 'SK'
            }
        },
        {
            name: 'should parse address with company name',
            address: 'Slovenská Pošta, š.p. Partizánska Cesta 9\n975 99 BANSKÁ BYSTRICA 1\nSLOVAKIA',
            locale: 'sk-SK',
            expected: {
                streetAddress: 'Slovenská Pošta, š.p. Partizánska Cesta 9',
                locality: 'BANSKÁ BYSTRICA 1',
                postalCode: '975 99',
                country: 'SLOVAKIA',
                countryCode: 'SK'
            }
        },
        {
            name: 'should parse address without postal code',
            address: 'Pawel Opatovský Gazdova 4\nŽILINA 1\nSLOVAKIA',
            locale: 'sk-SK',
            expected: {
                streetAddress: 'Pawel Opatovský Gazdova 4',
                locality: 'ŽILINA 1',
                country: 'SLOVAKIA',
                countryCode: 'SK'
            }
        },
        {
            name: 'should parse address without country',
            address: 'Pawel Opatovský Gazdova 4\n010 01 ŽILINA 1',
            locale: 'sk-SK',
            expected: {
                streetAddress: 'Pawel Opatovský Gazdova 4',
                locality: 'ŽILINA 1',
                postalCode: '010 01',
                countryCode: 'SK'
            }
        },
        {
            name: 'should parse multi-line address',
            address: 'Pawel Opatovský\nGazdova 4\n010 01\nŽILINA 1\nSLOVAKIA',
            locale: 'sk-SK',
            expected: {
                streetAddress: 'Pawel Opatovský, Gazdova 4',
                locality: 'ŽILINA 1',
                postalCode: '010 01',
                country: 'SLOVAKIA',
                countryCode: 'SK'
            }
        },
        {
            name: 'should parse address without delimiters',
            address: 'Pawel Opatovský Gazdova 4 010 01 ŽILINA 1 SLOVAKIA',
            locale: 'sk-SK',
            expected: {
                streetAddress: 'Pawel Opatovský Gazdova 4',
                locality: 'ŽILINA 1',
                postalCode: '010 01',
                country: 'SLOVAKIA',
                countryCode: 'SK'
            }
        },
        {
            name: 'should parse address from US locale',
            address: 'Pawel Opatovský Gazdova 4\n010 01 ŽILINA 1\nSLOVAKIA',
            locale: 'en-US',
            expected: {
                streetAddress: 'Pawel Opatovský Gazdova 4',
                locality: 'ŽILINA 1',
                postalCode: '010 01',
                country: 'SLOVAKIA',
                countryCode: 'SK'
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

describe('Address formatting for Slovakia', () => {
    const testCases = [
        {
            name: 'should format address for Slovak locale',
            addressData: {
                streetAddress: 'Pawel Opatovský Gazdova 4',
                locality: 'ŽILINA 1',
                region: null,
                postalCode: '010 01',
                country: 'SLOVAKIA',
                countryCode: 'SK'
            },
            locale: 'sk-SK',
            expected: 'Pawel Opatovský Gazdova 4\n010 01 ŽILINA 1\nSLOVAKIA'
        },
        {
            name: 'should format address for US locale',
            addressData: {
                streetAddress: 'Pawel Opatovský Gazdova 4',
                locality: 'ŽILINA 1',
                region: null,
                postalCode: '010 01',
                country: 'SLOVAKIA',
                countryCode: 'SK'
            },
            locale: 'en-US',
            expected: 'Pawel Opatovský Gazdova 4\n010 01 ŽILINA 1\nSLOVAKIA'
        }
    ];

    test.each(testCases)('$name', ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 