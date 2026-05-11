/*
 * address_AZ.test.js - test the address parsing and formatting routines for Azerbaijan
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
        await LocaleData.ensureLocale("en-AZ");
    }
});

describe('Address parsing for Azerbaijan (AZ)', () => {
    const testCases = [
        {
            name: 'should parse normal Azerbaijani address with name, street, postal code, locality and country',
            input: "ILHAZ SHAHRIAR, 45 Hatai Str., 2012 GÄNCÄ, AZERBAIJAN",
            expected: {
                streetAddress: "ILHAZ SHAHRIAR, 45 Hatai Str.",
                region: undefined,
                locality: "GÄNCÄ",
                postalCode: "2012",
                country: "AZERBAIJAN",
                countryCode: "AZ"
            }
        },
        {
            name: 'should parse Azerbaijani address without postal code',
            input: "ILHAZ SHAHRIAR, 45 Hatai Str.,GÄNCÄ, AZERBAIJAN",
            expected: {
                streetAddress: "ILHAZ SHAHRIAR, 45 Hatai Str.",
                region: undefined,
                locality: "GÄNCÄ",
                country: "AZERBAIJAN",
                countryCode: "AZ",
                postalCode: undefined
            }
        },
        {
            name: 'should parse Azerbaijani address with multiple lines',
            input: "ILHAZ SHAHRIAR\n45 Hatai Str.\n2012 GÄNCÄ\nAZERBAIJAN",
            expected: {
                streetAddress: "ILHAZ SHAHRIAR, 45 Hatai Str.",
                region: undefined,
                locality: "GÄNCÄ",
                postalCode: "2012",
                country: "AZERBAIJAN",
                countryCode: "AZ"
            }
        },
        {
            name: 'should parse Azerbaijani address in single line format',
            input: "ILHAZ SHAHRIAR, 45 Hatai Str., 2012 GÄNCÄ, AZERBAIJAN",
            expected: {
                streetAddress: "ILHAZ SHAHRIAR, 45 Hatai Str.",
                region: undefined,
                locality: "GÄNCÄ",
                postalCode: "2012",
                country: "AZERBAIJAN",
                countryCode: "AZ"
            }
        },
        {
            name: 'should parse Azerbaijani address with superfluous whitespace',
            input: "ILHAZ SHAHRIAR, 45 Hatai Str.  \n\t\n 2012 GÄNCÄ\t\n\n AZERBAIJAN  \n  \t\t\t",
            expected: {
                streetAddress: "ILHAZ SHAHRIAR, 45 Hatai Str.",
                region: undefined,
                locality: "GÄNCÄ",
                postalCode: "2012",
                country: "AZERBAIJAN",
                countryCode: "AZ"
            }
        },
        {
            name: 'should parse Azerbaijani address without delimiters',
            input: "ILHAZ SHAHRIAR 45 Hatai Str. 2012 GÄNCÄ AZERBAIJAN",
            expected: {
                streetAddress: "ILHAZ SHAHRIAR 45 Hatai Str.",
                region: undefined,
                locality: "GÄNCÄ",
                postalCode: "2012",
                country: "AZERBAIJAN",
                countryCode: "AZ"
            }
        },
        {
            name: 'should parse Azerbaijani address with special characters',
            input: "ILHAZ SHAHRIAR, 45 Hatai Str., 2012 GÄNCÄ, AZERBAIJAN",
            expected: {
                streetAddress: "ILHAZ SHAHRIAR, 45 Hatai Str.",
                region: undefined,
                locality: "GÄNCÄ",
                postalCode: "2012",
                country: "AZERBAIJAN",
                countryCode: "AZ"
            }
        },
        {
            name: 'should parse Azerbaijani address from US locale',
            input: "ILHAZ SHAHRIAR, 45 Hatai Str., 2012 GÄNCÄ, AZERBAIJAN",
            expected: {
                streetAddress: "ILHAZ SHAHRIAR, 45 Hatai Str.",
                region: undefined,
                locality: "GÄNCÄ",
                postalCode: "2012",
                country: "AZERBAIJAN",
                countryCode: "AZ"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, expected }) => {
        const parsedAddress = new Address(input, { locale: 'en-AZ' });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Azerbaijan (AZ)', () => {
    test('should format Azerbaijani address with all components', () => {
        const parsedAddress = new Address({
            streetAddress: "ILHAZ SHAHRIAR, 45 Hatai Str.",
            locality: "GÄNCÄ",
            postalCode: "2012",
            country: "AZERBAIJAN",
            countryCode: "AZ"
        }, { locale: 'en-AZ' });

        const expected = "ILHAZ SHAHRIAR, 45 Hatai Str.\n2012 GÄNCÄ\nAZERBAIJAN";
        const formatter = new AddressFmt({ locale: 'en-AZ' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });

    test('should format Azerbaijani address from US locale', () => {
        const parsedAddress = new Address({
            streetAddress: "ILHAZ SHAHRIAR, 45 Hatai Str.",
            postalCode: "2012",
            country: "AZERBAIJAN",
            locality: "GÄNCÄ",
            countryCode: "AZ"
        }, { locale: 'en-US' });

        const expected = "ILHAZ SHAHRIAR, 45 Hatai Str.\n2012 GÄNCÄ\nAZERBAIJAN";
        const formatter = new AddressFmt({ locale: 'en-US' });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 