/*
 * address_BA.test.js - test the address parsing and formatting routines for Bosnia and Herzegovina
 *
 * Copyright © 2013-2015, 2017, 2022-2025 JEDLSoft
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
        await LocaleData.ensureLocale("bs-Latn-BA");
    }
});

describe('Address parsing for Bosnia and Herzegovina (BA)', () => {
    const testCases = [
        {
            name: 'should parse normal Bosnian address with name, street, postal code, locality and country',
            input: "Nedim Marevac, ul. Skenderija 60, 71000 SARAJEVO, BOSNIA",
            expected: {
                streetAddress: "Nedim Marevac, ul. Skenderija 60",
                region: undefined,
                locality: "SARAJEVO",
                postalCode: "71000",
                country: "BOSNIA",
                countryCode: "BA"
            }
        },
        {
            name: 'should parse Bosnian address without postal code',
            input: "Nedim Marevac, ul. Skenderija 60, SARAJEVO, BOSNIA",
            expected: {
                streetAddress: "Nedim Marevac, ul. Skenderija 60",
                region: undefined,
                locality: "SARAJEVO",
                country: "BOSNIA",
                countryCode: "BA",
                postalCode: undefined
            }
        },
        {
            name: 'should parse Bosnian address with multiple lines',
            input: "Nedim Marevac\nul. Skenderija 60\n71000 SARAJEVO\nBOSNIA",
            expected: {
                streetAddress: "Nedim Marevac, ul. Skenderija 60",
                region: undefined,
                locality: "SARAJEVO",
                postalCode: "71000",
                country: "BOSNIA",
                countryCode: "BA"
            }
        },
        {
            name: 'should parse Bosnian address in single line format',
            input: "Nedim Marevac, ul. Skenderija 60, 71000 SARAJEVO, BOSNIA",
            expected: {
                streetAddress: "Nedim Marevac, ul. Skenderija 60",
                region: undefined,
                locality: "SARAJEVO",
                postalCode: "71000",
                country: "BOSNIA",
                countryCode: "BA"
            }
        },
        {
            name: 'should parse Bosnian address with superfluous whitespace',
            input: "Nedim Marevac, ul. Skenderija 60  \n\t\n 71000 SARAJEVO\t\n\n BOSNIA  \n  \t\t\t",
            expected: {
                streetAddress: "Nedim Marevac, ul. Skenderija 60",
                region: undefined,
                locality: "SARAJEVO",
                postalCode: "71000",
                country: "BOSNIA",
                countryCode: "BA"
            }
        },
        {
            name: 'should parse Bosnian address without delimiters',
            input: "Nedim Marevac FEDERICO TERRAZAS ARIAS CALLE ADELA ZAMUDIO 1716 PO BAX 580 71000 SARAJEVO BOSNIA",
            expected: {
                streetAddress: "Nedim Marevac FEDERICO TERRAZAS ARIAS CALLE ADELA ZAMUDIO 1716 PO BAX 580",
                region: undefined,
                locality: "SARAJEVO",
                postalCode: "71000",
                country: "BOSNIA",
                countryCode: "BA"
            }
        },
        {
            name: 'should parse Bosnian address with special characters',
            input: "Nedim Marevac, ul. Skenderija 60, 71000 SARAJEVO, BOSNIA",
            expected: {
                streetAddress: "Nedim Marevac, ul. Skenderija 60",
                region: undefined,
                locality: "SARAJEVO",
                postalCode: "71000",
                country: "BOSNIA",
                countryCode: "BA"
            }
        },
        {
            name: 'should parse Bosnian address from US locale',
            input: "Nedim Marevac, ul. Skenderija 60, 71000 SARAJEVO, BOSNIA",
            expected: {
                streetAddress: "Nedim Marevac, ul. Skenderija 60",
                region: undefined,
                locality: "SARAJEVO",
                postalCode: "71000",
                country: "BOSNIA",
                countryCode: "BA"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
        const parsedAddress = new Address(input, { locale: 'bs-Latn-BA' });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Bosnia and Herzegovina (BA)', () => {
    test('should format Bosnian address with all components', () => {
        const parsedAddress = new Address({
            streetAddress: "Nedim Marevac, ul. Skenderija 60",
            locality: "71000 SARAJEVO",
            country: "BOSNIA",
            countryCode: "BA"
        }, { locale: 'bs-Latn-BA' });

        const expected = "Nedim Marevac, ul. Skenderija 60\n71000 SARAJEVO\nBOSNIA";
        const formatter = new AddressFmt({ locale: 'bs-Latn-BA' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Bosnian address from US locale', () => {
        const parsedAddress = new Address({
            streetAddress: "Nedim Marevac, ul. Skenderija 60",
            country: "BOSNIA",
            locality: "71000 SARAJEVO",
            countryCode: "BA"
        }, { locale: 'en-US' });

        const expected = "Nedim Marevac, ul. Skenderija 60\n71000 SARAJEVO\nBOSNIA";
        const formatter = new AddressFmt({ locale: 'en-US' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 