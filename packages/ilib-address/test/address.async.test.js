/*
 * address.async.test.js - test the address parsing and formatting routines asynchronously
 *
 * Copyright © 2015, 2017-2018, 2025 JEDLSoft
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

function searchRegions(array, regionCode) {
    return array.find(function(region) {
        return region.code === regionCode;
    });
}

beforeAll(async () => {
    if (getPlatform() === "browser" && !setUpPerformed) {
        setUpPerformed = true;
        LocaleData.clearCache();
    }
});

describe('Async Address Parsing', () => {
    describe('Simple US Addresses', () => {
        test('should parse basic US address asynchronously', async () => {
            const parsedAddress = await Address.create("950 W Maude Ave.\nSunnyvale, CA 94085\nUSA", { locale: 'en-US' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("950 W Maude Ave.");
            expect(parsedAddress.locality).toBe("Sunnyvale");
            expect(parsedAddress.region).toBe("CA");
            expect(parsedAddress.postalCode).toBe("94085");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse another basic US address format asynchronously', async () => {
            const parsedAddress = await Address.create("20 Main St.\nMyTown, NY 11530\nUSA", { locale: 'en-US' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("NY");
            expect(parsedAddress.postalCode).toBe("11530");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse Japanese address format asynchronously', async () => {
            const parsedAddress = await Address.create("5-2-1 Ginza, Chuo-ku\nTokyo 170-3293\nJapan", { locale: 'en-US' });

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
        test('should parse address with apartment number asynchronously', async () => {
            const parsedAddress = await Address.create("950 W 21st Ave, Apt 45\nNY, NY 10234", { locale: 'en-US' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("950 W 21st Ave, Apt 45");
            expect(parsedAddress.locality).toBe("NY");
            expect(parsedAddress.region).toBe("NY");
            expect(parsedAddress.postalCode).toBe("10234");
            expect(typeof(parsedAddress.country)).toBe("undefined");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse address with spelled out state name asynchronously', async () => {
            const parsedAddress = await Address.create("20 Main St.\nMyTown, Arizona 11530\nUSA", { locale: 'en-US' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("Arizona");
            expect(parsedAddress.postalCode).toBe("11530");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });

        test('should parse address with spelled out state name containing spaces asynchronously', async () => {
            const parsedAddress = await Address.create("20 Main St.\nMyTown, New York 11530\nUSA", { locale: 'en-US' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("New York");
            expect(parsedAddress.postalCode).toBe("11530");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });
    });

    describe('International Addresses', () => {
        test('should parse South African address asynchronously', async () => {
            const parsedAddress = await Address.create("123 Main Street, Pretoria 5678, South Africa", { locale: 'en-US' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("123 Main Street");
            expect(parsedAddress.locality).toBe("Pretoria");
            expect(typeof(parsedAddress.region)).toBe("undefined");
            expect(parsedAddress.postalCode).toBe("5678");
            expect(parsedAddress.country).toBe("South Africa");
            expect(parsedAddress.countryCode).toBe("ZA");
        });

        test('should parse Dutch address asynchronously', async () => {
            const parsedAddress = await Address.create("Achterberglaan 23, 2345 GD Uithoorn, Netherlands", { locale: 'nl-NL' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("Achterberglaan 23");
            expect(parsedAddress.locality).toBe("Uithoorn");
            expect(typeof(parsedAddress.region)).toBe("undefined");
            expect(parsedAddress.postalCode).toBe("2345 GD");
            expect(parsedAddress.country).toBe("Netherlands");
            expect(parsedAddress.countryCode).toBe("NL");
        });
    });

    describe('Asian Addresses', () => {
        test('should parse Japanese address with Asian format asynchronously', async () => {
            const parsedAddress = await Address.create("〒150-2345 東京都渋谷区本町2丁目4-7サニーマンション203", { locale: 'ja-JP' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("本町2丁目4-7サニーマンション203");
            expect(parsedAddress.locality).toBe("渋谷区");
            expect(parsedAddress.region).toBe("東京都");
            expect(parsedAddress.postalCode).toBe("〒150-2345");
            expect(parsedAddress.countryCode).toBe("JP");
        });

        test('should parse Chinese address with Asian format asynchronously', async () => {
            const parsedAddress = await Address.create("中国北京市朝阳区建国路112号 中国惠普大厦100022", { locale: 'zh-CN' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("建国路112号 中国惠普大厦");
            expect(parsedAddress.locality).toBe("朝阳区");
            expect(parsedAddress.region).toBe("北京市");
            expect(parsedAddress.postalCode).toBe("100022");
            expect(parsedAddress.country).toBe("中国");
            expect(parsedAddress.countryCode).toBe("CN");
        });
    });

    describe('European Addresses', () => {
        test('should parse German address asynchronously', async () => {
            const parsedAddress = await Address.create("Herrenberger Straße 140, 71034 Böblingen, Deutschland", { locale: 'de-DE' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("Herrenberger Straße 140");
            expect(parsedAddress.locality).toBe("Böblingen");
            expect(typeof(parsedAddress.region)).toBe("undefined");
            expect(parsedAddress.postalCode).toBe("71034");
            expect(parsedAddress.country).toBe("Deutschland");
            expect(parsedAddress.countryCode).toBe("DE");
        });

        test('should parse Russian address asynchronously', async () => {
            const parsedAddress = await Address.create("Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной\nАЛЕКСЕЕВСКИЙ R-N\nВоронежская область\nРоссия\n247112", { locale: 'ru-RU' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной");
            expect(parsedAddress.locality).toBe("АЛЕКСЕЕВСКИЙ R-N");
            expect(parsedAddress.region).toBe("Воронежская область");
            expect(parsedAddress.postalCode).toBe("247112");
            expect(parsedAddress.country).toBe("Россия");
            expect(parsedAddress.countryCode).toBe("RU");
        });
    });

    describe('Other International Addresses', () => {
        test('should parse Thai address asynchronously', async () => {
            const parsedAddress = await Address.create("49 ซอยร่วมฤดี, ถนนเพลินจิต, ลุมพินี\nเขตปทุมวัน กรุงเทพฯ 10330\nประเทศไทย", { locale: 'th-TH' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("49 ซอยร่วมฤดี, ถนนเพลินจิต, ลุมพินี");
            expect(parsedAddress.locality).toBe("เขตปทุมวัน");
            expect(parsedAddress.region).toBe("กรุงเทพฯ");
            expect(parsedAddress.postalCode).toBe("10330");
            expect(parsedAddress.country).toBe("ประเทศไทย");
            expect(parsedAddress.countryCode).toBe("TH");
        });

        test('should parse Saudi Arabic address asynchronously', async () => {
            const parsedAddress = await Address.create("السيد عبد الله ناصر\nمكة المكرمة ٢١۴۵۴\nالمملكة العربية السعودية", { locale: 'ar-SA' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("السيد عبد الله ناصر");
            expect(parsedAddress.locality).toBe("مكة المكرمة");
            expect(typeof(parsedAddress.region)).toBe("undefined");
            expect(parsedAddress.postalCode).toBe("٢١۴۵۴");
            expect(parsedAddress.country).toBe("المملكة العربية السعودية");
            expect(parsedAddress.countryCode).toBe("SA");
        });

        test('should parse Hindi address asynchronously', async () => {
            const parsedAddress = await Address.create("१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू\nकोलकाता\nपश्चिम बंगाल\n७०००१७\nभारत", { locale: 'hi-IN' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू");
            expect(parsedAddress.locality).toBe("कोलकाता");
            expect(parsedAddress.region).toBe("पश्चिम बंगाल");
            expect(parsedAddress.postalCode).toBe("७०००१७");
            expect(parsedAddress.country).toBe("भारत");
            expect(parsedAddress.countryCode).toBe("IN");
        });

        test('should parse Gujarati address without postal code asynchronously', async () => {
            const parsedAddress = await Address.create("125/1, એજી ટાવર્સ. 3 જો માળ, પાર્ક સ્ટ્રીટ. સર્કસ એવન્યુ\nકોલકાતા\nપશ્ચિમ બંગાળ\nભારત", { locale: 'gu-IN' });

            expect(typeof(parsedAddress)).not.toBe("undefined");
            expect(parsedAddress.streetAddress).toBe("125/1, એજી ટાવર્સ. 3 જો માળ, પાર્ક સ્ટ્રીટ. સર્કસ એવન્યુ");
            expect(parsedAddress.locality).toBe("કોલકાતા");
            expect(parsedAddress.region).toBe("પશ્ચિમ બંગાળ");
            expect(parsedAddress.country).toBe("ભારત");
            expect(parsedAddress.countryCode).toBe("IN");
            expect(typeof(parsedAddress.postalCode)).toBe("undefined");
        });
    });
});

describe('Async Address Formatting', () => {
    describe('US Address Formatting', () => {
        test('should format US address asynchronously', async () => {
            const parsedAddress = await Address.create({
                streetAddress: "1234 Any Street",
                locality: "Anytown",
                region: "CA",
                postalCode: "94085",
                country: "United States of America",
                countryCode: "US"
            }, {locale: 'en-US'});

            const expected = "1234 Any Street\nAnytown CA 94085\nUnited States of America";
            const formatter = await AddressFmt.create({ locale: 'en-US' });
            expect(typeof(formatter)).not.toBe("undefined");
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });

    describe('Unknown Locale Formatting', () => {
        test('should format address with unknown locale QQ asynchronously', async () => {
            const parsedAddress = await Address.create({
                streetAddress: "123 mcdonald ave, apt 234",
                locality: "Sunnyvale",
                region: "CA",
                postalCode: "94086",
                locale: 'en-QQ'
            });

            const expected = "123 mcdonald ave, apt 234\nSunnyvale CA 94086";
            const formatter = await AddressFmt.create({
                locale: 'en-QQ',
                style: 'nocountry',
            });
            expect(typeof(formatter)).not.toBe("undefined");
            expect(formatter.format(parsedAddress)).toBe(expected);
        });

        test('should format address with unknown country asynchronously', async () => {
            const parsedAddress = await Address.create({
                streetAddress: "1234 Any Street",
                locality: "Anytown",
                region: "CA",
                postalCode: "94085",
                country: "Unknown",
                countryCode: "XY"
            }, {locale: 'en-XY'});

            const expected = "1234 Any Street\nAnytown CA 94085\nUnknown";
            const formatter = await AddressFmt.create({
                locale: 'en-XY',
                style: 'nocountry',
            });
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });

    describe('Asian Address Formatting', () => {
        test('should format Japanese address with Asian format asynchronously', async () => {
            const parsedAddress = await Address.create({
                streetAddress: "本町2丁目4-7サニーマンション203",
                locality: "渋谷区",
                region: "東京都",
                postalCode: "〒150-2345",
                countryCode: "JP",
                format: "asian"
            }, {locale: 'ja-JP'});

            const expected = "〒150-2345\n東京都渋谷区本町2丁目4-7サニーマンション203";
            const formatter = await AddressFmt.create({
                locale: 'ja-JP',
            });
            expect(typeof(formatter)).not.toBe("undefined");
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });
});

describe('Address Format Info', () => {
    describe('US Format Info', () => {
        test('should get US format info with right constraints', async () => {
            const formatter = await AddressFmt.create({ locale: 'en-US' });
            const info = await formatter.getFormatInfo(undefined, false);
            
            expect(info).toBeTruthy();

            expect(info[1][2].component).toBe("postalCode");
            expect(info[1][2].constraint).toBe("[0-9]{5}(-[0-9]{4})?");

            expect(info[1][1].component).toBe("region");
            expect(info[1][1].constraint).toBeTruthy();
            let r = searchRegions(info[1][1].constraint, "AZ");
            expect(r.code).toBe("AZ");
            expect(r.name).toBe("Arizona");
            r = searchRegions(info[1][1].constraint, "MS");
            expect(r.code).toBe("MS");
            expect(r.name).toBe("Mississippi");
            r = searchRegions(info[1][1].constraint, "NY");
            expect(r.code).toBe("NY");
            expect(r.name).toBe("New York");

            expect(info[2][0].component).toBe("country");
            expect(info[2][0].constraint).toBeTruthy();
            r = searchRegions(info[2][0].constraint, "JP");
            expect(r.code).toBe("JP");
            expect(r.name).toBe("Japan");
            r = searchRegions(info[2][0].constraint, "CR");
            expect(r.code).toBe("CR");
            expect(r.name).toBe("Costa Rica");
            r = searchRegions(info[2][0].constraint, "ZA");
            expect(r.code).toBe("ZA");
            expect(r.name).toBe("South Africa");
        });
    });

    describe('Unknown Country Format Info', () => {
        test('should get format info for unknown country', async () => {
            const formatter = await AddressFmt.create({ locale: 'en-XY' });
            const info = await formatter.getFormatInfo(undefined, false);
            
            expect(info).toBeTruthy();

            // test for generic data
            expect(info[1][0].component).toBe("locality");
            expect(info[1][0].constraint).toBe("([A-zÀÁÈÉÌÍÑÒÓÙÚÜàáèéìíñòóùúü\\.\\-\\']+\\s*){1,2}$");

            expect(info[1][1].component).toBe("region");
            expect(info[1][1].constraint).toBe("([A-zÀÁÈÉÌÍÑÒÓÙÚÜàáèéìíñòóùúü\\.\\-\\']+\\s*){1,2}$");

            expect(info[1][2].component).toBe("postalCode");
            expect(info[1][2].constraint).toBe("[0-9]+");
        });
    });
}); 