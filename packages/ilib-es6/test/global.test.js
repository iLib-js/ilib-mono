/*
 * global.test.js - test the ilib static routines
 *
 * Copyright © 2012-2015, 2017-2024 JEDLSoft
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

import ilib from "../src/ilib.js";
import Locale from "../src/Locale.js";

describe("testglobal", () => {
    beforeAll(() => {
        ilib.clearCache();
    });

    test("GetLocaleDefault", () => {
        expect.assertions(1);
        expect(ilib.getLocale()).toBe("en-US");
    });

    test("SetLocale", () => {
        expect.assertions(2);
        expect(ilib.getLocale()).toBe("en-US");

        ilib.setLocale("it-IT");

        expect(ilib.getLocale()).toBe("it-IT");
        delete ilib.locale; // clean up
    });

    test("SetLocaleObject", () => {
        expect.assertions(2);
        expect(ilib.getLocale()).toBe("en-US");

        ilib.setLocale(new Locale("it-IT"));

        // do not change the locale if the arg is not a string
        expect(ilib.getLocale()).toBe("en-US");
    });

    test("SetLocaleEmpty", () => {
        expect.assertions(2);
        expect(ilib.getLocale()).toBe("en-US");

        ilib.setLocale();

        expect(ilib.getLocale()).toBe("en-US");
    });

    test("GetVersion", () => {
        expect.assertions(1);
        expect(ilib.getVersion().substring(0,5)).toBe("14.20");
    });

    test("GetCLDRVersion", () => {
        expect.assertions(1);
        expect(ilib.getCLDRVersion()).toBe("44.1");
    });

    test("GetTimeZoneDefault", () => {
        // use a different test when the Intl object is available
        ilib._platform = undefined;
        if (ilib._global("Intl")) {
            return;
        }

        expect.assertions(1);
        ilib._platform = undefined;
        ilib.tz = undefined;

        if (ilib._getPlatform() === "nodejs") {
            process.env.TZ = "";
        }

        if (ilib._getPlatform() === "browser") {
            navigator.timezone = undefined;
        }
        expect(ilib.getTimeZone()).toBe("local");
    });

    /*
    uncomment again when ilib is fixed
    test("GetTimeZoneDefaultWithIntl", () => {
        // only test when the Intl object is available
        if (!ilib._global("Intl")) {
            return;
        }

        ilib._platform = undefined;
        ilib.tz = undefined; // clear this first
        const ro = new Intl.DateTimeFormat().resolvedOptions();
        const expected = ro && ro.timeZone;
        if (expected) {
            expect.assertions(1);
            expect(ilib.getTimeZone()).toBe(expected);
        }
    });
    */

    test("SetTimeZone", () => {
        // use a different test when the Intl object is available
        if (ilib._global("Intl")) {
            return;
        }

        expect.assertions(2);
        ilib._platform = undefined;
        ilib.tz = undefined;
        expect(ilib.getTimeZone()).toBe("local");

        ilib.setTimeZone("America/Los_Angeles");

        expect(ilib.getTimeZone()).toBe("America/Los_Angeles");
        delete ilib.tz; // clean up
    });

    test("GetTimeZoneBrowser", () => {
        if (ilib._getPlatform() !== "browser" || ilib._global("Intl")) {
            // only testable on a browser without the Intl object available
            return;
        }

        ilib._platform = undefined;
        ilib.tz = undefined;
        navigator.timezone = "America/New_York";

        expect.assertions(1);
        expect(ilib.getTimeZone()).toBe("America/New_York");
        navigator.timezone = undefined;
    });

    test("SetTimeZoneEmpty", () => {
        // use a different test when the Intl object is available
        if (ilib._global("Intl")) {
            return;
        }

        expect.assertions(2);
        ilib._platform = undefined;
        ilib.tz = undefined;
        if (ilib._getPlatform() === "browser") {
            navigator.timezone = undefined;
        }

        expect(ilib.getTimeZone()).toBe("local");

        ilib.setTimeZone();

        expect(ilib.getTimeZone()).toBe("local");
    });

    test("GetTimeZoneNodejs", () => {
        // only test on older nodejs where the Intl object is not available
        if (ilib._getPlatform() === "nodejs" && !ilib._global("Intl")) {
            expect.assertions(1);
            ilib._platform = undefined;
            ilib.tz = undefined;
            if (typeof(process) === 'undefined') {
                process = {
                    env: {}
                };
            }
            if (!process.env) process.env = {};

            const tmp = process.env.TZ;
            process.env.TZ = "America/Phoenix";

            expect(ilib.getTimeZone()).toBe("America/Phoenix");

            process.env.TZ = tmp;
        }
    });

    test("GetTimeZoneRhino", () => {
        if (ilib._getPlatform() !== "rhino" || ilib._global("Intl")) {
            // only test this in rhino
            return;
        }
        ilib.tz = undefined;

        if (typeof(process) === 'undefined') {
            // under plain rhino
            environment.user.timezone = "America/New_York";
        } else {
            // under trireme on rhino emulating nodejs
            process.env.TZ = "America/New_York";
        }

        expect.assertions(1);
        expect(ilib.getTimeZone()).toBe("America/New_York");
    });

    test("GetTimeZoneWebOS", () => {
        if (ilib._getPlatform() !== "webos" || ilib._global("Intl")) {
            // only test this in webos
            return;
        }
        ilib.tz = undefined;
        PalmSystem.timezone = "Europe/London";

        expect.assertions(1);
        expect(ilib.getTimeZone()).toBe("Europe/London");
    });

    test("GetLocaleNodejs1", () => {
        if (ilib._getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilib.locale = undefined;
        if (!process.env) process.env = {};

        process.env.LANG = "th-TH";

        expect.assertions(1);
        expect(ilib.getLocale()).toBe("th-TH");

        process.env.LANG = "";
        ilib.locale = undefined;
    });

    test("GetLocaleNodejs2", () => {
        if (ilib._getPlatform() !== "nodejs") {
            // only test this in node
            return;
        }

        ilib.locale = undefined;

        process.env.LC_ALL = "th-TH";

        expect.assertions(1);
        expect(ilib.getLocale()).toBe("th-TH");

        process.env.LC_ALL = "";
        ilib.locale = undefined;
    });

    test("GetLocaleRhino", () => {
        if (ilib._getPlatform() !== "rhino") {
            // only test this in node
            return;
        }

        ilib.locale = undefined;

        if (typeof(process) === 'undefined') {
            // under plain rhino
            environment.user.language = "de";
            environment.user.country = "AT";
        } else {
            // under trireme on rhino emulating nodejs
            process.env.LANG = "de_AT.UTF8";
        }

        expect.assertions(1);
        expect(ilib.getLocale()).toBe("de-AT");

        if (typeof(process) === 'undefined') {
            // under plain rhino
            environment.user.language = undefined;
            environment.user.country = undefined;
        } else {
            process.env.LANG = "en_US.UTF8";
        }
    });

    test("GetLocaleWebOS", () => {
        if (ilib._getPlatform() !== "webos") {
            // only test this in node
            return;
        }

        ilib.locale = undefined;

        PalmSystem.locale = "ru-RU";

        expect.assertions(1);
        expect(ilib.getLocale()).toBe("ru-RU");

        PalmSystem.locale = undefined;
    });

    test("GetLocaleNotString", () => {
        if (ilib.isDynCode()) {
            // can't test this with dynamically loaded code because the global context
            // is different for each module and we cannot set global variables, so we
            // cannot simulate the conditions where this code would work
            return;
        }
        ilib._platform = undefined;
        ilib.locale = new Locale("it-IT");

        // should remove the locale object and make it into a string
        expect.assertions(1);
        expect(ilib.getLocale()).toBe("en-US");
    });

    test("GetLocaleBrowser", () => {
        if (ilib._getPlatform() !== "browser") {
            // only test this in a real browser
            return;
        }
        ilib.locale = undefined;

        const loc = "";

        if (navigator.language.length > 5) {
            const l = navigator.language;
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
        expect(ilib.getLocale()).toBe(loc);
    });

    test("IsArrayNewArrayObj", () => {
        expect.assertions(1);
        const a = new Array();
        expect(ilib.isArray(a)).toBeTruthy();
    });

    test("IsArrayNewArrayBrackets", () => {
        expect.assertions(1);
        const a = [];
        expect(ilib.isArray(a)).toBeTruthy();
    });

    test("IsArrayObject", () => {
        expect.assertions(1);
        const a = {foo:234};
        expect(!ilib.isArray(a)).toBeTruthy();
    });

    test("IsArrayObjectWithNumericProperties", () => {
        expect.assertions(1);
        const a = {"0": "d", "1": "c"};
        expect(!ilib.isArray(a)).toBeTruthy();
    });

    test("IsArrayNumber", () => {
        expect.assertions(1);
        const a = 234;
        expect(!ilib.isArray(a)).toBeTruthy();
    });

    test("IsArrayString", () => {
        expect.assertions(1);
        const a = "asdf";
        expect(!ilib.isArray(a)).toBeTruthy();
    });

    test("IsArrayNull", () => {
        expect.assertions(1);
        const a = null;
        expect(!ilib.isArray(a)).toBeTruthy();
    });

    test("IsArrayUndefined", () => {
        expect.assertions(1);
        const a = undefined;
        expect(!ilib.isArray(a)).toBeTruthy();
    });

    test("ExtendSimple", () => {
        expect.assertions(1);
        const object1 = {"a": "A", "b": "B"},
            object2 = {"c": "C", "d": "D"};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": "B", "c": "C", "d": "D"});
    });

    test("ExtendReturnObject1", () => {
        expect.assertions(1);
        const object1 = {"a": "A", "b": "B"},
            object2 = {"c": "C", "d": "D"};

        const x = ilib.extend(object1, object2);
        expect(x).toBe(object1);
    });

    test("ExtendArrays", () => {
        expect.assertions(1);
        const object1 = {"a": ["b", "c"]},
            object2 = {"a": ["d"]};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": ["b", "c", "d"]});
    });

    test("ExtendArraysDups", () => {
        expect.assertions(1);
        const object1 = {"a": ["b", "c"]},
            object2 = {"a": ["c", "d"]};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": ["b", "c", "c", "d"]});
    });

    test("ExtendArraysEmptySource", () => {
        expect.assertions(1);
        const object1 = {"a": []},
            object2 = {"a": ["d"]};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": ["d"]});
    });

    test("ExtendArraysEmptyTarget", () => {
        expect.assertions(1);
        const object1 = {"a": ["b", "c"]},
            object2 = {"a": []};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": ["b", "c"]});
    });

    test("ExtendArraysIncongruentTypes1", () => {
        expect.assertions(1);
        const object1 = {"a": ["b", "c"]},
            object2 = {"a": "d"};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "d"});
    });

    test("ExtendArraysIncongruentTypes2", () => {
        expect.assertions(1);
        const object1 = {"a": "b"},
            object2 = {"a": ["d"]};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": ["d"]});
    });

    test("ExtendSimpleProperty", () => {
        expect.assertions(1);
        const object1 = {"a": "A", "b": "B"},
            object2 = {"b": "X"};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": "X"});
    });

    test("ExtendComplexProperty", () => {
        expect.assertions(1);
        const object1 = {"a": "A", "b": {"x": "B"}},
            object2 = {"b": "X"};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": "X"});
    });

    test("ExtendSubobjects", () => {
        expect.assertions(1);
        const object1 = {"b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N"}};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"b": {"x": "M", "y": "N"}});
    });

    test("ExtendSubobjectsLeaveObj1PropsUntouched", () => {
        expect.assertions(1);
        const object1 = {"a": "A", "b": {"x": "X", "y": "Y", "z": "Z"}},
            object2 = {"b": {"x": "M", "y": "N"}};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}});
    });

    test("ExtendSubobjectsAddProps", () => {
        expect.assertions(1);
        const object1 = {"a": "A", "b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N", "z": "Z"}};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}});
    });

    test("ExtendSubobjectsAddProps", () => {
        expect.assertions(1);
        const object1 = {"a": "A", "b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N", "z": "Z"}};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}});
    });

    test("ExtendBooleans", () => {
        expect.assertions(1);
        const object1 = {"a": true, "b": true},
            object2 = {"b": false};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": true, "b": false});
    });

    test("ExtendAddBooleans", () => {
        expect.assertions(1);
        const object1 = {"a": true, "b": true},
            object2 = {"c": false};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": true, "b": true, "c": false});
    });

    test("ExtendNumbers", () => {
        expect.assertions(1);
        const object1 = {"a": 1, "b": 2},
            object2 = {"b": 3};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": 1, "b": 3});
    });

    test("ExtendNumbersWithZero", () => {
        expect.assertions(1);
        const object1 = {"a": 1, "b": 2},
            object2 = {"b": 0};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": 1, "b": 0});
    });

    test("ExtendNumbersAddZero", () => {
        expect.assertions(1);
        const object1 = {"a": 1, "b": 2},
            object2 = {"c": 0};

        ilib.extend(object1, object2);
        expect(object1).toStrictEqual({"a": 1, "b": 2, "c": 0});
    });


    /*
    const testGlobalNumber = 42;

    test("IsGlobal", () => {
        expect.assertions(1);
        expect(ilib._isGlobal("testGlobalNumber")).toBeTruthy();
    });

    test("IsGlobalNot", () => {
        expect.assertions(1);
        expect(!ilib._isGlobal("asdfasdfasdf")).toBeTruthy();
    });

    test("Global", () => {
        expect.assertions(1);
        expect(ilib._global("testGlobalNumber")).toBe(42);
    });

    test("GlobalUndefined", () => {
        expect.assertions(1);
        expect(typeof(ilib._global("testGlobalNumber2")) === "undefined").toBeTruthy();
    });
    */

});
