/*
 * address.test.js - test the address parsing and formatting routines
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
import { localeList } from './locales.cjs';

function searchRegions(array, regionCode) {
    return array.find((region) => {
        return region.code === regionCode;
    });
}

let setUpPerformed = false;

beforeAll(async () => {
    if (getPlatform() === "browser" && !setUpPerformed) {
        // does not support sync, so we have to ensure the locale
        // data is loaded before we can do all these sync tests
        setUpPerformed = true;
        LocaleData.clearCache();
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            let promise = Promise.resolve(true);
            for (const locale of localeList.locales) {
                promise = promise.then(() => {
                    return LocaleData.ensureLocale(locale);
                });
            }
            await promise;
            setUpPerformed = true;
        } else {
            setUpPerformed = true;
        }
    }
});

describe('Address Parsing', () => {
    describe('Simple US Addresses', () => {
        test('should parse basic US address with street, city, state, zip, and country', () => {
            const parsedAddress = new Address("950 W Maude Ave.\nSunnyvale, CA 94085\nUSA", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("950 W Maude Ave.");
            expect(parsedAddress.locality).toBe("Sunnyvale");
            expect(parsedAddress.region).toBe("CA");
            expect(parsedAddress.postalCode).toBe("94085");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse another basic US address format', () => {
            const parsedAddress = new Address("20 Main St.\nMyTown, NY 11530\nUSA", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("NY");
            expect(parsedAddress.postalCode).toBe("11530");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse Japanese address format', () => {
            const parsedAddress = new Address("5-2-1 Ginza, Chuo-ku\nTokyo 170-3293\nJapan", {locale: 'en-JP'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("5-2-1 Ginza");
            expect(parsedAddress.locality).toBe("Chuo-ku");
            expect(parsedAddress.region).toBe("Tokyo");
            expect(parsedAddress.postalCode).toBe("170-3293");
            expect(parsedAddress.country).toBe("Japan");
            expect(parsedAddress.countryCode).toBe("JP");
        });
    });

    describe('Complex US Addresses', () => {
        test('should parse address with apartment number', () => {
            const parsedAddress = new Address("950 W 21st Ave, Apt 45\nNY, NY 10234", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("950 W 21st Ave, Apt 45");
            expect(parsedAddress.locality).toBe("NY");
            expect(parsedAddress.region).toBe("NY");
            expect(parsedAddress.postalCode).toBe("10234");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse address with spelled out state name', () => {
            const parsedAddress = new Address("20 Main St.\nMyTown, Arizona 11530\nUSA", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("Arizona");
            expect(parsedAddress.postalCode).toBe("11530");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse address with spelled out state name containing spaces', () => {
            const parsedAddress = new Address("20 Main St.\nMyTown, New York 11530\nUSA", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("New York");
            expect(parsedAddress.postalCode).toBe("11530");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse address with spelled out state name with prefix', () => {
            const parsedAddress = new Address("20 Main St.\nMyTown, Arkansas 11530\nUSA", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("Arkansas");
            expect(parsedAddress.postalCode).toBe("11530");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });
    });

    describe('Address Format Variations', () => {
        test('should parse address without postal code', () => {
            const parsedAddress = new Address("20 Main St.\nMyTown, NY\nUSA", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("NY");
            expect(typeof(parsedAddress.postalCode)).toBe("undefined");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse address with multiple lines', () => {
            const parsedAddress = new Address("950 W 21st Ave\nApt 45\nNY\nNY\n10234", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("950 W 21st Ave, Apt 45");
            expect(parsedAddress.locality).toBe("NY");
            expect(parsedAddress.region).toBe("NY");
            expect(parsedAddress.postalCode).toBe("10234");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse address on single line', () => {
            const parsedAddress = new Address("950 W Maude Ave., Sunnyvale, CA 94085 USA", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("950 W Maude Ave.");
            expect(parsedAddress.locality).toBe("Sunnyvale");
            expect(parsedAddress.region).toBe("CA");
            expect(parsedAddress.postalCode).toBe("94085");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse address with excessive whitespace', () => {
            const parsedAddress = new Address("950 W 21st Ave\n\n   Apt 45      \n NY,    NY   10234\n\n   \n\n", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("950 W 21st Ave, Apt 45");
            expect(parsedAddress.locality).toBe("NY");
            expect(parsedAddress.region).toBe("NY");
            expect(parsedAddress.postalCode).toBe("10234");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse address with minimal delimiters', () => {
            const parsedAddress = new Address("950 W Maude Ave., Sunnyvale CA 94085 USA", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("950 W Maude Ave.");
            expect(parsedAddress.locality).toBe("Sunnyvale");
            expect(parsedAddress.region).toBe("CA");
            expect(parsedAddress.postalCode).toBe("94085");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });
    });

    describe('Special Address Types', () => {
        test('should parse address with street number that looks like a zip code', () => {
            const parsedAddress = new Address("15672 W 156st St #45\nSeattle, WA 98765", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("15672 W 156st St #45");
            expect(parsedAddress.locality).toBe("Seattle");
            expect(parsedAddress.region).toBe("WA");
            expect(parsedAddress.postalCode).toBe("98765");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse PO Box address', () => {
            const parsedAddress = new Address("P.O. Box 350\nMinneapolis MN 45678-2234", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("P.O. Box 350");
            expect(parsedAddress.locality).toBe("Minneapolis");
            expect(parsedAddress.region).toBe("MN");
            expect(parsedAddress.postalCode).toBe("45678-2234");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse Hawaiian address with special characters', () => {
            const parsedAddress = new Address("20 Hawai'i Oe Lane\nKa'anapali, HI 99232", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("20 Hawai'i Oe Lane");
            expect(parsedAddress.locality).toBe("Ka'anapali");
            expect(parsedAddress.region).toBe("HI");
            expect(parsedAddress.postalCode).toBe("99232");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("US");
        });
    });

    describe('International Addresses', () => {
        test('should parse South African address', () => {
            const parsedAddress = new Address("123 Main Street, Pretoria 5678, South Africa", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("123 Main Street");
            expect(parsedAddress.locality).toBe("Pretoria");
            expect(typeof(parsedAddress.region)).toBe("undefined");
            expect(parsedAddress.postalCode).toBe("5678");
            expect(parsedAddress.country).toBe("South Africa");
            expect(parsedAddress.countryCode).toBe("ZA");
        });

        test('should parse Dutch address', () => {
            const parsedAddress = new Address("Achterberglaan 23, 2345 GD Uithoorn, Netherlands", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("Achterberglaan 23");
            expect(parsedAddress.locality).toBe("Uithoorn");
            expect(typeof(parsedAddress.region)).toBe("undefined");
            expect(parsedAddress.postalCode).toBe("2345 GD");
            expect(parsedAddress.country).toBe("Netherlands");
            expect(parsedAddress.countryCode).toBe("NL");
        });

        test('should parse non-standard lowercase address', () => {
            const parsedAddress = new Address("123 mcdonald ave, apt 234, sunnyvale, CA 34567", {locale: 'en-US'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("123 mcdonald ave, apt 234");
            expect(parsedAddress.locality).toBe("sunnyvale");
            expect(parsedAddress.region).toBe("CA");
            expect(parsedAddress.postalCode).toBe("34567");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("US");
        });
    });

    describe('Unknown Locale Handling', () => {
        test('should parse address with unknown locale zxx-XX', () => {
            const parsedAddress = new Address("123 mcdonald ave, apt 234, sunnyvale, CA 34567", {locale: 'zxx-XX'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("123 mcdonald ave, apt 234, sunnyvale");
            expect(typeof(parsedAddress.region)).toBe("undefined");
            expect(parsedAddress.locality).toBe("CA");
            expect(parsedAddress.postalCode).toBe("34567");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("XX");
        });

        test('should parse address with unknown locale en-QQ', () => {
            const parsedAddress = new Address("123 mcdonald ave, apt 234, sunnyvale, CA 34567", {locale: 'en-QQ'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("123 mcdonald ave, apt 234, sunnyvale");
            expect(typeof(parsedAddress.region)).toBe("undefined");
            expect(parsedAddress.locality).toBe("CA");
            expect(parsedAddress.postalCode).toBe("34567");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("QQ");
        });

        test('should parse address with unknown locale en-HK', () => {
            const parsedAddress = new Address("123 mcdonald ave, apt 234, sunnyvale, CA 34567", {locale: 'en-HK'});

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("123 mcdonald ave, apt 234, sunnyvale, CA 34567");
            expect(typeof(parsedAddress.region)).toBe("undefined");
            expect(typeof(parsedAddress.locality)).toBe("undefined");
            expect(typeof(parsedAddress.postalCode)).toBe("undefined");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("HK");
        });
    });
});

describe('Address Formatting', () => {
    describe('US Address Formatting', () => {
        test('should format US address with default formatter', () => {
            const parsedAddress = new Address({
                streetAddress: "1234 Any Street",
                locality: "Anytown",
                region: "CA",
                postalCode: "94085",
                country: "United States of America",
                countryCode: "US"
            }, {locale: 'en-US'});

            const expected = "1234 Any Street\nAnytown CA 94085\nUnited States of America";
            const formatter = new AddressFmt();
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format US address with explicit US locale', () => {
            const parsedAddress = new Address({
                streetAddress: "1234 Any Street",
                locality: "Anytown",
                region: "CA",
                postalCode: "94085",
                country: "United States of America",
                countryCode: "US"
            }, {locale: 'en-US'});

            const expected = "1234 Any Street\nAnytown CA 94085\nUnited States of America";
            const formatter = new AddressFmt({locale: 'en-US'});
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format US address in domestic style without country', () => {
            const parsedAddress = new Address({
                streetAddress: "1234 Any Street",
                locality: "Anytown",
                region: "CA",
                postalCode: "94085",
                country: "United States of America",
                countryCode: "US"
            }, {locale: 'en-US'});

            const expected = "1234 Any Street\nAnytown CA 94085";
            const formatter = new AddressFmt({locale: 'en-US', style: 'nocountry'});
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });

    describe('Unknown Country Formatting', () => {
        test('should format address with unknown country', () => {
            const parsedAddress = new Address({
                streetAddress: "1234 Any Street",
                locality: "Anytown",
                region: "CA",
                postalCode: "94085",
                country: "Unknown",
                countryCode: "XY"
            }, {locale: 'en-XY'});

            const expected = "1234 Any Street\nAnytown CA 94085\nUnknown";
            const formatter = new AddressFmt({locale: 'en-XY', style: 'nocountry'});
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format address with unknown locale QQ', () => {
            const parsedAddress = new Address({
                streetAddress: "123 mcdonald ave, apt 234",
                locality: "Sunnyvale",
                region: "CA",
                postalCode: "94086",
                locale: 'en-QQ'
            });

            const expected = "123 mcdonald ave, apt 234\nSunnyvale CA 94086";
            const formatter = new AddressFmt({locale: 'en-QQ', style: 'nocountry'});
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format address with unknown locale HK', () => {
            const parsedAddress = new Address("123 mcdonald ave, apt 234, sunnyvale, CA 34567", {locale: 'en-HK'});

            const expected = "123 mcdonald ave, apt 234, sunnyvale, CA 34567";
            const formatter = new AddressFmt({locale: 'en-HK', style: 'nocountry'});
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });

    describe('International Address Formatting', () => {
        test('should format Hong Kong address with default formatter', () => {
            const parsedAddress = new Address({
                country: "Hong Kong",
                countryCode: "HK",
                locality: "North Point",
                streetAddress: "5F, 633 King's Road"
            });

            const expected = "5F, 633 King's Road\nNorth Point\nHong Kong";
            const formatter = new AddressFmt();
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
}); 