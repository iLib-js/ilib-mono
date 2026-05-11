/*
 * address_DJ.test.js - test the address parsing and formatting routines for Djibouti
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
        await LocaleData.ensureLocale("ar-DJ");
        await LocaleData.ensureLocale("fr-DJ");
    }
});

describe('Address parsing for Djibouti (French locale)', () => {
    const testCases = [
        {
            name: 'should parse normal Djiboutian address with French locale',
            input: "Mr. Farah Ismaël, BP 32, DJIBOUTI, DJIBOUTI",
            locale: 'fr-DJ',
            expected: {
                streetAddress: "Mr. Farah Ismaël, BP 32",
                region: undefined,
                locality: "DJIBOUTI",
                postalCode: undefined,
                country: "DJIBOUTI",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address without zip code (French)',
            input: "Mr. Farah Ismaël, BP 32, DJIBOUTI, DJIBOUTI",
            locale: 'fr-DJ',
            expected: {
                streetAddress: "Mr. Farah Ismaël, BP 32",
                region: undefined,
                locality: "DJIBOUTI",
                postalCode: undefined,
                country: "DJIBOUTI",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address with multiple lines (French)',
            input: "Mr. Farah Ismaël\nBP 32\nDJIBOUTI\n DJIBOUTI",
            locale: 'fr-DJ',
            expected: {
                streetAddress: "Mr. Farah Ismaël, BP 32",
                region: undefined,
                locality: "DJIBOUTI",
                postalCode: undefined,
                country: "DJIBOUTI",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address in one line (French)',
            input: "Mr. Farah Ismaël, BP 32,DJIBOUTI, DJIBOUTI",
            locale: 'fr-DJ',
            expected: {
                streetAddress: "Mr. Farah Ismaël, BP 32",
                region: undefined,
                locality: "DJIBOUTI",
                postalCode: undefined,
                country: "DJIBOUTI",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address with superfluous whitespace (French)',
            input: "Mr. Farah Ismaël \n BP 32   \n\t\n DJIBOUTI\t\n\n  DJIBOUTI  \n  \t\t\t",
            locale: 'fr-DJ',
            expected: {
                streetAddress: "Mr. Farah Ismaël, BP 32",
                region: undefined,
                locality: "DJIBOUTI",
                postalCode: undefined,
                country: "DJIBOUTI",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address without delimiters (French)',
            input: "Mr. Farah Ismaël 2  BP 32 DJIBOUTI  DJIBOUTI",
            locale: 'fr-DJ',
            expected: {
                streetAddress: "Mr. Farah Ismaël 2 BP 32",
                region: undefined,
                locality: "DJIBOUTI",
                postalCode: undefined,
                country: "DJIBOUTI",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address with special characters (French)',
            input: "Mr. Farah Ismaël,BP 32,DJIBOUTI, DJIBOUTI",
            locale: 'fr-DJ',
            expected: {
                streetAddress: "Mr. Farah Ismaël, BP 32",
                region: undefined,
                locality: "DJIBOUTI",
                postalCode: undefined,
                country: "DJIBOUTI",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address from US locale (French)',
            input: "Mr. Farah Ismaël,BP 32,DJIBOUTI, DJIBOUTI",
            locale: 'en-US',
            expected: {
                streetAddress: "Mr. Farah Ismaël, BP 32",
                region: undefined,
                locality: "DJIBOUTI",
                postalCode: undefined,
                country: "DJIBOUTI",
                countryCode: "DJ"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address parsing for Djibouti (Arabic locale)', () => {
    const testCases = [
        {
            name: 'should parse normal Djiboutian address with Arabic locale',
            input: "السيد فرح إسماعيل, جيبوتي, جيبوتي",
            locale: 'ar-DJ',
            expected: {
                streetAddress: "السيد فرح إسماعيل",
                region: undefined,
                locality: "جيبوتي",
                postalCode: undefined,
                country: "جيبوتي",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address without zip code (Arabic)',
            input: "السيد فرح إسماعيل, جيبوتي, جيبوتي",
            locale: 'ar-DJ',
            expected: {
                streetAddress: "السيد فرح إسماعيل",
                region: undefined,
                locality: "جيبوتي",
                postalCode: undefined,
                country: "جيبوتي",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address with multiple lines (Arabic)',
            input: "السيد فرح إسماعيل\nجيبوتي\n جيبوتي",
            locale: 'ar-DJ',
            expected: {
                streetAddress: "السيد فرح إسماعيل",
                region: undefined,
                locality: "جيبوتي",
                postalCode: undefined,
                country: "جيبوتي",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address in one line (Arabic)',
            input: "السيد فرح إسماعيل,جيبوتي, جيبوتي",
            locale: 'ar-DJ',
            expected: {
                streetAddress: "السيد فرح إسماعيل",
                region: undefined,
                locality: "جيبوتي",
                postalCode: undefined,
                country: "جيبوتي",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address with superfluous whitespace (Arabic)',
            input: "السيد فرح إسماعيل   \n\t\n جيبوتي\t\n\n  جيبوتي  \n  \t\t\t",
            locale: 'ar-DJ',
            expected: {
                streetAddress: "السيد فرح إسماعيل",
                region: undefined,
                locality: "جيبوتي",
                postalCode: undefined,
                country: "جيبوتي",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address without delimiters (Arabic)',
            input: "السيد فرح إسماعيل  ٢ شارع الاستقلال جيبوتي  جيبوتي",
            locale: 'ar-DJ',
            expected: {
                streetAddress: "السيد فرح إسماعيل ٢ شارع الاستقلال",
                region: undefined,
                locality: "جيبوتي",
                postalCode: undefined,
                country: "جيبوتي",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address with special characters (Arabic)',
            input: "السيد فرح إسماعيل,جيبوتي, جيبوتي",
            locale: 'ar-DJ',
            expected: {
                streetAddress: "السيد فرح إسماعيل",
                region: undefined,
                locality: "جيبوتي",
                postalCode: undefined,
                country: "جيبوتي",
                countryCode: "DJ"
            }
        },
        {
            name: 'should parse Djiboutian address from US locale (Arabic)',
            input: "السيد فرح إسماعيل,جيبوتي, DJIBOUTI",
            locale: 'en-US',
            expected: {
                streetAddress: "السيد فرح إسماعيل",
                region: undefined,
                locality: "جيبوتي",
                postalCode: undefined,
                country: "DJIBOUTI",
                countryCode: "DJ"
            }
        }
    ];

    test.each(testCases)('$name', ({ input, locale, expected }) => {
        const parsedAddress = new Address(input, { locale });
        
        expect(parsedAddress).toBeDefined();
        expect(parsedAddress.streetAddress).toBe(expected.streetAddress);
        expect(parsedAddress.region).toBe(expected.region);
        expect(parsedAddress.locality).toBe(expected.locality);
        expect(parsedAddress.postalCode).toBe(expected.postalCode);
        expect(parsedAddress.country).toBe(expected.country);
        expect(parsedAddress.countryCode).toBe(expected.countryCode);
    });
});

describe('Address formatting for Djibouti (French locale)', () => {
    const testCases = [
        {
            name: 'should format Djiboutian address with French locale',
            address: {
                streetAddress: "Mr. Farah Ismaël\nBP 32",
                locality: "DJIBOUTI",
                country: " DJIBOUTI",
                countryCode: "DJ"
            },
            locale: 'fr-DJ',
            expected: "Mr. Farah Ismaël\nBP 32\nDJIBOUTI\nDJIBOUTI"
        },
        {
            name: 'should format Djiboutian address with US locale (French)',
            address: {
                streetAddress: "Mr. Farah Ismaël\nBP 32",
                locality: "DJIBOUTI",
                country: " DJIBOUTI",
                countryCode: "DJ"
            },
            locale: 'en-US',
            expected: "Mr. Farah Ismaël\nBP 32\nDJIBOUTI\nDJIBOUTI"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
});

describe('Address formatting for Djibouti (Arabic locale)', () => {
    const testCases = [
        {
            name: 'should format Djiboutian address with Arabic locale',
            address: {
                streetAddress: "السيد فرح إسماعيل",
                locality: "جيبوتي",
                country: " جيبوتي",
                countryCode: "DJ"
            },
            locale: 'ar-DJ',
            expected: "السيد فرح إسماعيل\nجيبوتي\nجيبوتي"
        },
        {
            name: 'should format Djiboutian address with US locale (Arabic)',
            address: {
                streetAddress: "السيد فرح إسماعيل",
                locality: "جيبوتي",
                country: "DJIBOUTI",
                countryCode: "DJ"
            },
            locale: 'en-US',
            expected: "السيد فرح إسماعيل\nجيبوتي\nDJIBOUTI"
        }
    ];

    test.each(testCases)('$name', ({ address, locale, expected }) => {
        const parsedAddress = new Address(address, { locale });
        const formatter = new AddressFmt({ locale });
        expect(formatter.format(parsedAddress)).toBe(expected);
    });
}); 