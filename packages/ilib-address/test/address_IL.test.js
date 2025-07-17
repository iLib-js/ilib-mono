/*
 * address_IL.test.js - test the address parsing and formatting routines for Israel
 *
 * Copyright © 2025 JEDLSoft
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

describe('Address parsing for Israel', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("he-IL");
        }
    });

    const addressParseTestCases = [
        {
            name: 'should parse normal Israeli address with postal code',
            input: "Yisrael Yisraeli\nHaDoar 1\nJerusalem 12345\nIsrael",
            locale: 'he-IL',
            expected: {
                streetAddress: "Yisrael Yisraeli, HaDoar 1",
                locality: "Jerusalem",
                region: undefined,
                postalCode: "12345",
                country: "Israel",
                countryCode: "IL"
            }
        },
        {
            name: 'should parse Israeli address without country',
            input: "Yisrael Yisraeli, HaDoar 1\nJerusalem 12345",
            locale: 'he-IL',
            expected: {
                streetAddress: "Yisrael Yisraeli, HaDoar 1",
                locality: "Jerusalem",
                region: undefined,
                postalCode: "12345",
                country: undefined,
                countryCode: "IL"
            }
        },
        {
            name: 'should parse Israeli address on one line',
            input: "R.O.Y. International , PO Box 13056, TEL-AVIV ISL-61130, Israel",
            locale: 'he-IL',
            expected: {
                streetAddress: "R.O.Y. International, PO Box 13056",
                locality: "TEL-AVIV",
                region: undefined,
                postalCode: "ISL-61130",
                country: "Israel",
                countryCode: "IL"
            }
        },
        {
            name: 'should parse Israeli address with superfluous whitespace',
            input: "\t\t\tR.O.Y. International\n\t\nPO Box 13056\n \r\n\r\rTEL-AVIV    ISL-61130\r\r\n    Israel\t\n\n\n",
            locale: 'he-IL',
            expected: {
                streetAddress: "R.O.Y. International, PO Box 13056",
                locality: "TEL-AVIV",
                region: undefined,
                postalCode: "ISL-61130",
                country: "Israel",
                countryCode: "IL"
            }
        },
        {
            name: 'should parse Israeli address without delimiters',
            input: "R.O.Y. International PO Box 13056 TEL-AVIV ISL-61130 Israel",
            locale: 'he-IL',
            expected: {
                streetAddress: "R.O.Y. International PO Box 13056",
                locality: "TEL-AVIV",
                region: undefined,
                postalCode: "ISL-61130",
                country: "Israel",
                countryCode: "IL"
            }
        },
        {
            name: 'should parse Israeli address from US locale',
            input: "R.O.Y. International\nPO Box 13056\nTEL-AVIV, Israel",
            locale: 'en-US',
            expected: {
                streetAddress: "R.O.Y. International, PO Box 13056",
                locality: "TEL-AVIV",
                region: undefined,
                postalCode: undefined,
                country: "Israel",
                countryCode: "IL"
            }
        }
    ];

    test.each(addressParseTestCases)("$name", ({ input, locale, expected }) => {
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

describe('Address formatting for Israel', () => {
    beforeAll(async () => {
        if (getPlatform() === "browser" && !setUpPerformed) {
            setUpPerformed = true;
            await LocaleData.ensureLocale("he-IL");
        }
    });

    const addressFormatTestCases = [
        {
            name: 'should format Israeli address with Hebrew locale',
            addressData: {
                streetAddress: "R.O.Y. International, PO Box 13056",
                locality: "TEL-AVIV",
                country: "Israel",
                countryCode: "IL"
            },
            locale: 'he-IL',
            expected: "R.O.Y. International, PO Box 13056\nTEL-AVIV\nIsrael"
        },
        {
            name: 'should format Israeli address from US locale',
            addressData: {
                streetAddress: "R.O.Y. International, PO Box 13056, Albertinkatu 36 B",
                locality: "TEL-AVIV",
                country: "Israel",
                countryCode: "IL"
            },
            locale: 'en-US',
            expected: "R.O.Y. International, PO Box 13056, Albertinkatu 36 B\nTEL-AVIV\nIsrael"
        }
    ];

    test.each(addressFormatTestCases)("$name", ({ addressData, locale, expected }) => {
        const parsedAddress = new Address(addressData, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 