/*
 * addressasync.test.js - test the address parsing and formatting routines asynchronously
 *
 * Copyright © 2018, 2022, 2024 JEDLSoft
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

import AddressFmt from "../src/AddressFmt.js";
import Address from "../src/Address.js";

function searchRegions(array, regionCode) {
    return array.find(region => {
        return region.code === regionCode;
    });
}

describe("testaddresspromise", () => {
    test("PromiseParseAddressAsyncSimple", () => {
        expect.assertions(7);
        return Address.create("950 W Maude Ave.\nSunnyvale, CA 94085\nUSA", {
            locale: 'en-US'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("950 W Maude Ave.");
            expect(parsedAddress.locality).toBe("Sunnyvale");
            expect(parsedAddress.region).toBe("CA");
            expect(parsedAddress.postalCode).toBe("94085");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });
    });

    // to verify NOV-111026
    test("PromiseParseAddressAsyncSimple2", () => {
        expect.assertions(7);
        return Address.create("20 Main St.\nMyTown, NY 11530\nUSA", {
            locale: 'en-US'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("NY");
            expect(parsedAddress.postalCode).toBe("11530");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });
    });

    test("PromiseParseAddressAsyncSimple3", () => {
        expect.assertions(7);
        return Address.create("5-2-1 Ginza, Chuo-ku\nTokyo 170-3293\nJapan", {
            locale: 'en-US'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("5-2-1 Ginza");
            expect(parsedAddress.locality).toBe("Chuo-ku");
            expect(parsedAddress.region).toBe("Tokyo");
            expect(parsedAddress.postalCode).toBe("170-3293");
            expect(parsedAddress.country).toBe("Japan");
            expect(parsedAddress.countryCode).toBe("JP");
        });
    });

    test("PromiseParseAddressAsyncMoreComplex", () => {
        expect.assertions(7);
        return Address.create("950 W 21st Ave, Apt 45\nNY, NY 10234", {
            locale: 'en-US'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("950 W 21st Ave, Apt 45");
            expect(parsedAddress.locality).toBe("NY");
            expect(parsedAddress.region).toBe("NY");
            expect(parsedAddress.postalCode).toBe("10234");
            expect(typeof(parsedAddress.country) === "undefined").toBeTruthy();
            expect(parsedAddress.countryCode).toBe("US");
        });
    });

    test("PromiseParseAddressAsyncSpelledOutState", () => {
        expect.assertions(7);
        return Address.create("20 Main St.\nMyTown, Arizona 11530\nUSA", {
            locale: 'en-US'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("Arizona");
            expect(parsedAddress.postalCode).toBe("11530");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });
    });

    test("PromiseParseAddressAsyncSpelledOutStateWithSpaces", () => {
        expect.assertions(7);
        return Address.create("20 Main St.\nMyTown, New York 11530\nUSA", {
            locale: 'en-US'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("20 Main St.");
            expect(parsedAddress.locality).toBe("MyTown");
            expect(parsedAddress.region).toBe("New York");
            expect(parsedAddress.postalCode).toBe("11530");
            expect(parsedAddress.country).toBe("USA");
            expect(parsedAddress.countryCode).toBe("US");
        });
    });

    test("PromiseParseAddressAsyncUnknown", () => {
        expect.assertions(7);

        return Address.create("123 Main Street, Pretoria 5678, South Africa", {
            locale: 'en-US'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("123 Main Street");
            expect(parsedAddress.locality).toBe("Pretoria");
            expect(typeof(parsedAddress.region) === "undefined").toBeTruthy();
            expect(parsedAddress.postalCode).toBe("5678");
            expect(parsedAddress.country).toBe("South Africa");
            expect(parsedAddress.countryCode).toBe("ZA");
        });
    });

    test("PromiseParseAddressAsyncNonUS", () => {
        expect.assertions(7);
        return Address.create("Achterberglaan 23, 2345 GD Uithoorn, Netherlands", {
            locale: 'en-US'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("Achterberglaan 23");
            expect(parsedAddress.locality).toBe("Uithoorn");
            expect(typeof(parsedAddress.region) === "undefined").toBeTruthy();
            expect(parsedAddress.postalCode).toBe("2345 GD");
            expect(parsedAddress.country).toBe("Netherlands");
            expect(parsedAddress.countryCode).toBe("NL");
        });
    });

    test("PromiseFormatAddressAsyncUS", () => {
        expect.assertions(2);
        const pa = new Address({
            streetAddress: "1234 Any Street",
            locality: "Anytown",
            region: "CA",
            postalCode: "94085",
            country: "United States of America",
            countryCode: "US"
        }, {locale: 'en-US'});

        const expected = "1234 Any Street\nAnytown CA 94085\nUnited States of America";
        return AddressFmt.create({
            locale: 'en-US'
        }).then(formatter => {
            expect(typeof(formatter) !== "undefined").toBeTruthy();
            expect(formatter.format(pa)).toBe(expected);
        });
    });

    test("PromiseFormatAddressAsyncUnknownLocaleQQ", () => {
        expect.assertions(2);
        const pa = new Address({
            streetAddress: "123 mcdonald ave, apt 234",
            locality: "Sunnyvale",
            region: "CA",
            postalCode: "94086",
            locale: 'en-QQ'
        });

        // should return the "root" information
        const expected = "123 mcdonald ave, apt 234\nSunnyvale CA 94086";
        return AddressFmt.create({
            locale: 'en-QQ',
            style: 'nocountry'
        }).then(formatter => {
            expect(typeof(formatter) !== "undefined").toBeTruthy();
            expect(formatter.format(pa)).toBe(expected);
        });
    });

    test("PromiseParseAddressAsyncJPAsianNormal1", () => {
        expect.assertions(6);
        return Address.create("〒150-2345 東京都渋谷区本町2丁目4-7サニーマンション203",  {
            locale: 'ja-JP'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("本町2丁目4-7サニーマンション203");
            expect(parsedAddress.locality).toBe("渋谷区");
            expect(parsedAddress.region).toBe("東京都");
            expect(parsedAddress.postalCode).toBe("〒150-2345");
            expect(parsedAddress.countryCode).toBe("JP");
        });
    });

    test("PromiseFormatAddressAsyncJPAsianNormal", () => {
        expect.assertions(2);
        const parsedAddress = new Address({
            streetAddress: "本町2丁目4-7サニーマンション203",
            locality: "渋谷区",
            region: "東京都",
            postalCode: "〒150-2345",
            countryCode: "JP",
            format: "asian"
        }, {locale: 'ja-JP'});

        const expected = "〒150-2345\n東京都渋谷区本町2丁目4-7サニーマンション203";

        return AddressFmt.create({
            locale: 'ja-JP'
        }).then(formatter => {
            expect(typeof(formatter) !== "undefined").toBeTruthy();
            expect(formatter.format(parsedAddress)).toBe(expected);
        });
    });


    test("PromiseParseAddressAsyncCNAsianNormal", () => {
        expect.assertions(7);
        return Address.create("中国北京市朝阳区建国路112号 中国惠普大厦100022", {
            locale: 'zh-CN'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("建国路112号 中国惠普大厦");
            expect(parsedAddress.locality).toBe("朝阳区");
            expect(parsedAddress.region).toBe("北京市");
            expect(parsedAddress.postalCode).toBe("100022");
            expect(parsedAddress.country).toBe("中国");
            expect(parsedAddress.countryCode).toBe("CN");
        });
    });

    test("PromiseParseAddressAsyncDENormal", () => {
        expect.assertions(7);
        return Address.create("Herrenberger Straße 140, 71034 Böblingen, Deutschland", {
            locale: 'de-DE'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("Herrenberger Straße 140");
            expect(parsedAddress.locality).toBe("Böblingen");
            expect(typeof(parsedAddress.region) === "undefined").toBeTruthy();
            expect(parsedAddress.postalCode).toBe("71034");
            expect(parsedAddress.country).toBe("Deutschland");
            expect(parsedAddress.countryCode).toBe("DE");
        });
    });

    test("PromiseParseAddressAsyncTHNormal", () => {
        expect.assertions(7);
        return Address.create("49 ซอยร่วมฤดี, ถนนเพลินจิต, ลุมพินี\nเขตปทุมวัน กรุงเทพฯ 10330\nประเทศไทย", {
            locale: 'th-Th'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("49 ซอยร่วมฤดี, ถนนเพลินจิต, ลุมพินี");
            expect(parsedAddress.locality).toBe("เขตปทุมวัน");
            expect(parsedAddress.region).toBe("กรุงเทพฯ");
            expect(parsedAddress.postalCode).toBe("10330");
            expect(parsedAddress.country).toBe("ประเทศไทย");
            expect(parsedAddress.countryCode).toBe("TH");
        });
    });

    test("PromiseParseAddressAsyncRUNormal", () => {
        expect.assertions(7);
        return Address.create("Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной\nАЛЕКСЕЕВСКИЙ R-N\nВоронежская область\nРоссия\n247112", {
            locale: 'ru-RU'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("Петров Иван Сергеевич ул. Лесная D. 5 поз. Лесной");
            expect(parsedAddress.locality).toBe("АЛЕКСЕЕВСКИЙ R-N");
            expect(parsedAddress.region).toBe("Воронежская область");
            expect(parsedAddress.postalCode).toBe("247112");
            expect(parsedAddress.country).toBe("Россия");
            expect(parsedAddress.countryCode).toBe("RU");
        });
    });

    test("PromiseParseAddressAsyncSANormalNative", () => {
        expect.assertions(7);
        return Address.create("السيد عبد الله ناصر\nمكة المكرمة ٢١۴۵۴\nالمملكة العربية السعودية", {
            locale: 'ar-SA'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("السيد عبد الله ناصر");
            expect(parsedAddress.locality).toBe("مكة المكرمة");
            expect(typeof(parsedAddress.region) === "undefined").toBeTruthy();
            expect(parsedAddress.postalCode).toBe("٢١۴۵۴");
            expect(parsedAddress.country).toBe("المملكة العربية السعودية");
            expect(parsedAddress.countryCode).toBe("SA");
        });
    });

    test("PromiseParseAddressAsyncINHINormal", () => {
        expect.assertions(7);
        return Address.create("१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू\nकोलकाता\nपश्चिम बंगाल\n७०००१७\nभारत", {
            locale: 'hi-IN'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("१२५/१, एजी टावर्स. ३ तल, पार्क स्ट्रीट. सर्कस एवेन्यू");
            expect(parsedAddress.locality).toBe("कोलकाता");
            expect(parsedAddress.region).toBe("पश्चिम बंगाल");
            expect(parsedAddress.postalCode).toBe("७०००१७");
            expect(parsedAddress.country).toBe("भारत");
            expect(parsedAddress.countryCode).toBe("IN");
        });
    });

    test("PromiseParseAddressAsyncINGUNoZip", () => {
        expect.assertions(7);
        return Address.create("125/1, એજી ટાવર્સ. 3 જો માળ, પાર્ક સ્ટ્રીટ. સર્કસ એવન્યુ\nકોલકાતા\nપશ્ચિમ બંગાળ\nભારત", {
            locale: 'gu-IN'
        }).then(parsedAddress => {
            expect(typeof(parsedAddress) !== "undefined").toBeTruthy();
            expect(parsedAddress.streetAddress).toBe("125/1, એજી ટાવર્સ. 3 જો માળ, પાર્ક સ્ટ્રીટ. સર્કસ એવન્યુ");
            expect(parsedAddress.locality).toBe("કોલકાતા");
            expect(parsedAddress.region).toBe("પશ્ચિમ બંગાળ");
            expect(parsedAddress.country).toBe("ભારત");
            expect(parsedAddress.countryCode).toBe("IN");
            expect(typeof(parsedAddress.postalCode) === "undefined").toBeTruthy();
        });
    });

    test("PromiseAddressFmtGetFormatInfoUSRightConstraints", () => {
        expect.assertions(22);
        return AddressFmt.create({
            locale: 'en-US'
        }).then(formatter => {
            return formatter.getFormatInfo("de-DE", false); // get labels in German
        }).then(info => {
            expect(info).toBeTruthy();

            expect(info[1][2].component).toBe("postalCode");
            expect(info[1][2].label).toBe("Postleitzahl");
            expect(info[1][2].constraint).toBe("[0-9]{5}(-[0-9]{4})?");

            expect(info[1][1].component).toBe("region");
            expect(info[1][1].label).toBe("Bundesland");
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
            expect(info[2][0].label).toBe("Land");
            expect(info[2][0].constraint).toBeTruthy();
            r = searchRegions(info[2][0].constraint, "JP");
            expect(r.code).toBe("JP");
            expect(r.name).toBe("Japan");
            r = searchRegions(info[2][0].constraint, "CR");
            expect(r.code).toBe("CR");
            expect(r.name).toBe("Costa Rica");
            r = searchRegions(info[2][0].constraint, "ZA");
            expect(r.code).toBe("ZA");
            expect(r.name).toBe("Südafrika");
        });
    });
});
