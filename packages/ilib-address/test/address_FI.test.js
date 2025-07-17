/*
 * address_FI.test.js - test the address parsing and formatting routines for Finland
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
 * See the License for the Specific language governing permissions and
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
        await LocaleData.ensureLocale("fi-FI");
        await LocaleData.ensureLocale("sv-FI");
    }
});

describe('Address parsing for Finland (Finnish locale)', () => {
    const testCases = [
        {
            name: 'should parse normal Finnish address with Finnish locale',
            input: "Eduskunta\nMatti Mallikainen\nMannerheimintie 30 as 5\nFI-00102 Eduskunta\nFinland",
            locale: 'fi-FI',
            expected: {
                streetAddress: "Eduskunta, Matti Mallikainen, Mannerheimintie 30 as 5",
                locality: "Eduskunta",
                region: undefined,
                postalCode: "FI-00102",
                country: "Finland",
                countryCode: "FI"
            }
        },
        {
            name: 'should parse Finnish address without country (Finnish)',
            input: "Eduskunta, Matti Mallikainen\nMannerheimintie 30 as 5\nFI-00102 Eduskunta",
            locale: 'fi-FI',
            expected: {
                streetAddress: "Eduskunta, Matti Mallikainen, Mannerheimintie 30 as 5",
                locality: "Eduskunta",
                region: undefined,
                postalCode: "FI-00102",
                country: undefined,
                countryCode: "FI"
            }
        },
        {
            name: 'should parse Finnish address in one line (Finnish)',
            input: "Saga Matkat OY, Saga Tours Ltd, Albertinkatu 36 B, 00180 HELSINKI, Finland",
            locale: 'fi-FI',
            expected: {
                streetAddress: "Saga Matkat OY, Saga Tours Ltd, Albertinkatu 36 B",
                locality: "HELSINKI",
                region: undefined,
                postalCode: "00180",
                country: "Finland",
                countryCode: "FI"
            }
        },
        {
            name: 'should parse Finnish address with superfluous whitespace (Finnish)',
            input: "\t\t\tMs. Aulikki Laasko\n\t\nVesakkotic 1399\n \r\n\r\rFI-00630    HELSINKI\r\r\n    Finland\t\n\n\n",
            locale: 'fi-FI',
            expected: {
                streetAddress: "Ms. Aulikki Laasko, Vesakkotic 1399",
                locality: "HELSINKI",
                region: undefined,
                postalCode: "FI-00630",
                country: "Finland",
                countryCode: "FI"
            }
        },
        {
            name: 'should parse Finnish address without delimiters (Finnish)',
            input: "Ms. Aulikki Laasko Vesakkotic 1399 HELSINKI Finland",
            locale: 'fi-FI',
            expected: {
                streetAddress: "Ms. Aulikki Laasko Vesakkotic 1399",
                locality: "HELSINKI",
                region: undefined,
                postalCode: undefined,
                country: "Finland",
                countryCode: "FI"
            }
        },
        {
            name: 'should parse Finnish address with special characters (Finnish)',
            input: "Työpajankatu 13,FI-00580 Helsinki, Finland",
            locale: 'fi-FI',
            expected: {
                streetAddress: "Työpajankatu 13",
                locality: "Helsinki",
                region: undefined,
                postalCode: "FI-00580",
                country: "Finland",
                countryCode: "FI"
            }
        },
        {
            name: 'should parse Finnish address from US locale (Finnish)',
            input: "Saga Matkat OY\nSaga Tours Ltd\nAlbertinkatu 36 B\nHELSINKI, Finland",
            locale: 'en-US',
            expected: {
                streetAddress: "Saga Matkat OY, Saga Tours Ltd, Albertinkatu 36 B",
                locality: "HELSINKI",
                region: undefined,
                postalCode: undefined,
                country: "Finland",
                countryCode: "FI"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address parsing for Finland (Swedish locale)', () => {
    const testCases = [
        {
            name: 'should parse normal Finnish address with Swedish locale',
            input: "Kalevankatu 12, 1st floor, FI-60100 Seinäjoki,Finland",
            locale: 'sv-FI',
            expected: {
                streetAddress: "Kalevankatu 12, 1st floor",
                locality: "Seinäjoki",
                region: undefined,
                postalCode: "FI-60100",
                country: "Finland",
                countryCode: "FI"
            }
        },
        {
            name: 'should parse Finnish address without country (Swedish)',
            input: "Kalevankatu 12, 1st floor, FI-60100 Seinäjoki",
            locale: 'sv-FI',
            expected: {
                streetAddress: "Kalevankatu 12, 1st floor",
                locality: "Seinäjoki",
                region: undefined,
                postalCode: "FI-60100",
                country: undefined,
                countryCode: "FI"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Finland (Finnish locale)', () => {
    const testCases = [
        {
            name: 'should format Finnish address with Finnish locale',
            address: {
                streetAddress: "Saga Matkat OY, Saga Tours Ltd, Albertinkatu 36 B",
                locality: "HELSINKI",
                country: "Finland",
                countryCode: "FI"
            },
            locale: 'fi-FI',
            expected: "Saga Matkat OY, Saga Tours Ltd, Albertinkatu 36 B\nHELSINKI\nFinland"
        },
        {
            name: 'should format Finnish address with Swedish locale',
            address: {
                streetAddress: "Työpajankatu 13",
                locality: "Helsinki",
                country: "Finland",
                countryCode: "FI"
            },
            locale: 'fi-FI',
            expected: "Työpajankatu 13\nHelsinki\nFinland"
        },
        {
            name: 'should format Finnish address with US locale (Finnish)',
            address: {
                streetAddress: "Saga Matkat OY, Saga Tours Ltd, Albertinkatu 36 B",
                locality: "HELSINKI",
                country: "Finland",
                countryCode: "FI"
            },
            locale: 'en-US',
            expected: "Saga Matkat OY, Saga Tours Ltd, Albertinkatu 36 B\nHELSINKI\nFinland"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 