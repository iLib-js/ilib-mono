/*
 * env.test.js - test the environment detection functions
 *
 * Copyright © 2021-2023 JEDLSoft
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

import * as ilibEnv from '../src/index.js';

describe("testEnv", () => {
    test("GetLocaleDefault", () => {
        expect.assertions(1);
        ilibEnv.clearCache();
        expect(ilibEnv.getLocale()).toBe("en-US");
    });

    test("SetLocale", () => {
        expect.assertions(1);
        ilibEnv.setLocale("ja-JP");
        expect(ilibEnv.getLocale()).toBe("ja-JP");
    });

    test("SetLocaleNonString1", () => {
        expect.assertions(1);
        ilibEnv.setLocale("ja-JP");
        ilibEnv.setLocale(true);
        // should not change
        expect(ilibEnv.getLocale()).toBe("ja-JP");
    });

    test("SetLocaleNonString2", () => {
        expect.assertions(1);
        ilibEnv.setLocale("ja-JP");
        ilibEnv.setLocale(4);
        // should not change
        expect(ilibEnv.getLocale()).toBe("ja-JP");
    });

    test("SetLocaleClear", () => {
        expect.assertions(1);
        ilibEnv.setLocale("ja-JP");
        ilibEnv.setLocale();
        // should revert back to the default
        expect(ilibEnv.getLocale()).toBe("en-US");
    });

    test("GetTimeZoneDefault", () => {
        // use a different test when the Intl object is available
        if (ilibEnv.isGlobal("Intl")) {
            return;
        }

        expect.assertions(1);
        ilibEnv.clearCache();

        var tmp;
        if (ilibEnv.getPlatform() === "nodejs") {
            tmp = process.env.TZ;
            process.env.TZ = "";
        }

        if (ilibEnv.getPlatform() === "browser") {
            navigator.timezone = undefined;
        }
        expect(ilibEnv.getTimeZone()).toBe("local");
        process.env.TZ = tmp;
    });

    test("GetTimeZoneDefaultWithIntl", () => {
        // only test when the Intl object is available
        if (!ilibEnv.globalVar("Intl")) {
            return;
        }

        ilibEnv.clearCache();
        var ro = new Intl.DateTimeFormat().resolvedOptions();
        var expected = ro && ro.timeZone;
        if (expected) {
            expect.assertions(1);
            ilibEnv.clearCache();
            expect(ilibEnv.getTimeZone()).toBe(expected);
        }
    });

    test("GetTimeZoneBrowserWithoutIntl", () => {
        if (ilibEnv.getPlatform() !== "browser" || ilibEnv.globalVar("Intl")) {
            // only testable on a browser without the Intl object available
            return;
        }

        ilibEnv.clearCache();

        navigator.timezone = "America/New_York";

        expect.assertions(1);
        expect(ilibEnv.getTimeZone()).toBe("America/New_York");

        ilibEnv.clearCache();
    });

    test("GetTimeZoneNodejs", () => {
        // only test on older nodejs where the Intl object is not available
        if (ilibEnv.getPlatform() === "nodejs" && !ilibEnv.globalVar("Intl")) {
            expect.assertions(1);
            ilibEnv.clearCache();
            if (typeof(process) === 'undefined') {
                process = {
                    env: {}
                };
            }
            if (!process.env) process.env = {};
            var tmp = process.env.TZ;
            process.env.TZ = "America/Phoenix";

            expect(ilibEnv.getTimeZone()).toBe("America/Phoenix");

            process.env.TZ = tmp;
        }
    });

    test("GetTimeZoneRhino", () => {
        if (ilibEnv.getPlatform() !== "rhino" || ilibEnv.globalVar("Intl")) {
            // only test this in rhino
            return;
        }
        ilibEnv.clearCache();
        if (typeof(process) === 'undefined') {
            // under plain rhino
            environment.user.timezone = "America/New_York";
        } else {
            // under trireme on rhino emulating nodejs
            process.env.TZ = "America/New_York";
        }

        expect.assertions(1);
        expect(ilibEnv.getTimeZone()).toBe("America/New_York");
    });

    test("GetTimeZoneWebOS", () => {
        if (ilibEnv.getPlatform() !== "webos" || ilibEnv.globalVar("Intl")) {
            // only test this in webos
            return;
        }
        ilibEnv.clearCache();

        PalmSystem.timezone = "Europe/London";

        expect.assertions(1);
        expect(ilibEnv.getTimeZone()).toBe("Europe/London");
    });

    test("SetTimeZone", () => {
        ilibEnv.clearCache();

        expect.assertions(1);

        ilibEnv.setTimeZone("Europe/London");

        expect(ilibEnv.getTimeZone()).toBe("Europe/London");
    });

    test("SetTimeZoneNonString1", () => {
        ilibEnv.clearCache();

        expect.assertions(1);

        let tz = ilibEnv.getTimeZone();

        ilibEnv.setTimeZone(true);

        // should not change
        expect(ilibEnv.getTimeZone()).toBe(tz);
    });

    test("SetTimeZoneNonString1", () => {
        ilibEnv.clearCache();

        expect.assertions(1);

        let tz = ilibEnv.getTimeZone();

        ilibEnv.setTimeZone(2);

        // should not change
        expect(ilibEnv.getTimeZone()).toBe(tz);
    });

    test("SetTimeZoneReset", () => {
        ilibEnv.clearCache();

        expect.assertions(2);

        let tz = ilibEnv.getTimeZone();

        ilibEnv.setTimeZone("Europe/London");

        expect(ilibEnv.getTimeZone()).toBe("Europe/London");

        ilibEnv.setTimeZone();

        // should not change
        expect(ilibEnv.getTimeZone()).toBe(tz);
    });

    test("GetLocaleNodejs", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();
        if (!process.env) process.env = {};

        process.env.LANG = "th-TH";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("th-TH");

        process.env.LANG = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejs2", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "th-TH";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("th-TH");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsFullLocale", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "zh-Hans-CN";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("zh-Hans-CN");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsLangScript", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "zh-Hans";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("zh-Hans");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsLangOnly", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "zh";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("zh");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsPosixLocale", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "C";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("en-US");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsPosixLocaleFull", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "C.UTF8";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("en-US");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsThreeLetterLanguage2", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "yue-Hant"; // Cantonese

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("yue-Hant");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsThreeLetterLanguage3", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "yue-Hant-CN"; // Cantonese

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("yue-Hant-CN");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsThreeDigitRegion", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "en-001"; // Cantonese

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("en-001");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsUnderscoreLocale", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        // on some platforms, it uses underscores instead of dashes
        process.env.LC_ALL = "de_DE";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("de-DE");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsLocaleWithVariant1", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        // should ignore variants
        process.env.LC_ALL = "de-DE-FOOBAR";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("de-DE");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsLocaleWithVariant2", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        // should ignore variants
        process.env.LC_ALL = "zh-Hans-CN-FOOBAR";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("zh-Hans-CN");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleNodejsLocaleWithLongVariant", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        // should ignore variants
        process.env.LC_ALL = "zh-Hans-CN-u-col-pinyin";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("zh-Hans-CN");

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    });

    test("GetLocaleSimulateRhino", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("rhino");

        global.environment = {
            user: {
                language: "de",
                country: "AT"
            }
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("de-AT");

        // clean up
        ilibEnv.clearCache();
        global.environment = undefined;
    });

    test("GetLocaleSimulateTrireme1", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("trireme");

        process.env.LANG = "de-AT";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("de-AT");

        // clean up
        ilibEnv.clearCache();
        process.env.LANG = "";
    });

    test("GetLocaleSimulateTrireme2", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("trireme");

        process.env.LANGUAGE = "de-AT";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("de-AT");

        // clean up
        ilibEnv.clearCache();
        process.env.LANGUAGE = "";
    });

    test("GetLocaleSimulateTrireme3", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("trireme");

        process.env.LC_ALL = "de-AT";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("de-AT");

        // clean up
        ilibEnv.clearCache();
        process.env.LC_ALL = "";
    });

    test("GetLocaleSimulateTriremeFullSpecifier", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("trireme");

        process.env.LC_ALL = "de_DE.UTF8";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("de-DE");

        // clean up
        ilibEnv.clearCache();
        process.env.LC_ALL = "";
    });

    test("GetLocaleSimulateTriremeFullLocale", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("trireme");

        process.env.LC_ALL = "zh-Hans-CN";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("zh-Hans-CN");

        // clean up
        ilibEnv.clearCache();
        process.env.LC_ALL = "";
    });

    test("GetLocaleSimulateWebOS", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("webos");

        global.PalmSystem = {
            locale: "ru-RU"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("ru-RU");

        // clean up
        ilibEnv.clearCache();
        global.PalmSystem = undefined;
    });

    test("GetLocaleSimulateWebOSWebapp", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("webos-webapp");

        global.PalmSystem = {
            locale: "ru-RU"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("ru-RU");

        // clean up
        ilibEnv.clearCache();
        global.PalmSystem = undefined;
    });

    test("GetLocaleSimulateRegularBrowser", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            language: "ja-JP"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("ja-JP");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;
    });

    test("GetLocaleSimulateRegularBrowserLangOnly", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            language: "ja"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("ja");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;
    });

    test("GetLocaleSimulateRegularBrowserFullLocale", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            language: "zh-Hans-CN"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("zh-Hans-CN");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;
    });

    test("GetLocaleSimulateRegularBrowserNonBCP47", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            language: "ja_jp"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("ja-JP");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;
    });

    test("GetLocaleSimulateIEBrowser1", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            browserLanguage: "ja-JP"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("ja-JP");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;
    });

    test("GetLocaleSimulateIEBrowser2", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            userLanguage: "ko-KR"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("ko-KR");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;
    });

    test("GetLocaleSimulateIEBrowser3", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            systemLanguage: "zh-CN"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("zh-CN");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;
    });

    test("GetLocaleSimulateIEBrowserNonBCP", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            systemLanguage: "zh_cn"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("zh-CN");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;
    });

    test("GetLocaleSimulateIEBrowserFull", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            systemLanguage: "zh-Hans-CN"
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("zh-Hans-CN");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;
    });

    test("GetLocaleSimulateQt", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("qt");

        var loc = "";

        global.Qt = {
            locale: function() {
                return {
                    name: "fr-FR"
                };
            }
        };

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("fr-FR");

        // clean up
        ilibEnv.clearCache();
        global.Qt = undefined;
    });

    test("GetLocaleRhino", () => {
        if (ilibEnv.getPlatform() !== "rhino") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        if (typeof(process) === 'undefined') {
            // under plain rhino
            environment.user.language = "de";
            environment.user.country = "AT";
        } else {
            // under trireme on rhino emulating nodejs
            process.env.LANG = "de_AT.UTF8";
        }

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("de-AT");

        if (typeof(process) === 'undefined') {
            // under plain rhino
            environment.user.language = undefined;
            environment.user.country = undefined;
        } else {
            process.env.LANG = "en_US.UTF8";
        }
    });

    test("GetLocaleWebOS", () => {
        if (ilibEnv.getPlatform() !== "webos") {
            // only test this in node
            return;
        }

        ilibEnv.clearCache();

        PalmSystem.locale = "ru-RU";

        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe("ru-RU");

        PalmSystem.locale = undefined;
    });

    test("GetLocaleBrowser", () => {
        if (ilibEnv.getPlatform() !== "browser") {
            // only test this in a real browser
            return;
        }
        ilibEnv.clearCache();

        var loc = "";

        if (navigator.language.length > 5) {
            var l = navigator.language;
            loc = l.substring(0,3) + l.charAt(3).toUpperCase() + l.substring(4,8).toLowerCase() + l.substring(8).toUpperCase();
        } else if (navigator.language.length > 2) {
            loc = navigator.language.substring(0,3) + navigator.language.substring(3).toUpperCase();
        } else {
            loc = navigator.language;
        }
        if (loc === "en") {
            loc = "en-US";
        }
        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe(loc);
    });

    test("IsGlobal", () => {
        expect.assertions(1);
        var platform = ilibEnv.getPlatform();
        if (platform === "nodejs" || platform === "trireme" || platform === "rhino") {
            global.testGlobalNumber = 32;
        } else {
            window.testGlobalNumber = 32;
        }
        expect(ilibEnv.isGlobal("testGlobalNumber")).toBeTruthy();
    });

    test("IsGlobalNot", () => {
        expect.assertions(1);
        expect(!ilibEnv.isGlobal("asdfasdfasdf")).toBeTruthy();
    });

    test("Global", () => {
        expect.assertions(1);
        var platform = ilibEnv.getPlatform();
        if (platform !== "nodejs" && platform !== "trireme" && platform !== "rhino") {
            window.testGlobalNumber = 42;
        } else {
            global.testGlobalNumber = 42;
        }
        expect(ilibEnv.globalVar("testGlobalNumber")).toBe(42);
    });

    test("GlobalUndefined", () => {
        expect.assertions(1);
        expect(typeof(ilibEnv.globalVar("testGlobalNumber2")) === "undefined").toBeTruthy();
    });

    test("test clearing the cache", () => {
        expect.assertions(5);

        ilibEnv.setLocale("af-ZA");
        expect(ilibEnv.getLocale()).toBe("af-ZA");
        expect(ilibEnv.isGlobal("locale")).toBeTruthy();
        expect(ilibEnv.globalVar("locale")).toBe("af-ZA");

        ilibEnv.clearCache();

        expect(ilibEnv.isGlobal("locale")).toBeFalsy();
        expect(ilibEnv.globalVar("locale")).toBeUndefined();
    });
});
