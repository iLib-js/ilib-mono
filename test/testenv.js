/*
 * testenv.js - test the environment detection functions
 *
 * Copyright © 2021, JEDLSoft
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

if (typeof(ilibEnv) === 'undefined') {
    var ilibEnv = require("../lib/index.js");
}

module.exports.testglobal = {
    testGetLocaleDefault: function(test) {
        test.expect(1);
        test.equal(ilibEnv.getLocale(), "en-US");
        test.done();
    },
    
    testGetTimeZoneDefault: function(test) {
        // use a different test when the Intl object is available
        ilibEnv.clearCache();
        if (ilibEnv.isGlobal("Intl")) {
            test.done();
            return;
        }

        test.expect(1);
        ilibEnv.clearCache();

        var tmp;
        if (ilibEnv.getPlatform() === "nodejs") {
            tmp = process.env.TZ;
            process.env.TZ = "";
        }

        if (ilibEnv.getPlatform() === "browser") {
            navigator.timezone = undefined;
        }
        test.equal(ilibEnv.getTimeZone(), "local");
        process.env.TZ = tmp;
        test.done();
    },

    testGetTimeZoneDefaultWithIntl: function(test) {
        // only test when the Intl object is available
        if (!ilibEnv.globalVar("Intl")) {
            test.done();
            return;
        }

        ilibEnv.clearCache();
        var ro = new Intl.DateTimeFormat().resolvedOptions();
        var expected = ro && ro.timeZone;
        if (expected) {
            test.expect(1);
            ilibEnv.clearCache();
            test.equal(ilibEnv.getTimeZone(), expected);
        }
        test.done();
    },

    testGetTimeZoneBrowserWithoutIntl: function(test) {
        if (ilibEnv.getPlatform() !== "browser" || ilibEnv.globalVar("Intl")) {
            // only testable on a browser without the Intl object available
            test.done();
            return;
        }

        ilibEnv.clearCache();

        navigator.timezone = "America/New_York";

        test.expect(1);
        test.equal(ilibEnv.getTimeZone(), "America/New_York");

        ilibEnv.clearCache();

        test.done();
    },

    testGetTimeZoneNodejs: function(test) {
        // only test on older nodejs where the Intl object is not available
        if (ilibEnv.getPlatform() === "nodejs" && !ilibEnv.globalVar("Intl")) {
            test.expect(1);
            ilibEnv.clearCache();
            if (typeof(process) === 'undefined') {
                process = {
                    env: {}
                };
            }
            if (!process.env) process.env = {};
            var tmp = process.env.TZ;
            process.env.TZ = "America/Phoenix";
            
            test.equal(ilibEnv.getTimeZone(), "America/Phoenix");
            
            process.env.TZ = tmp;
        }
        test.done();
    },
    
    testGetTimeZoneRhino: function(test) {
        if (ilibEnv.getPlatform() !== "rhino" || ilibEnv.globalVar("Intl")) {
            // only test this in rhino
            test.done();
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
    
        test.expect(1);
        test.equal(ilibEnv.getTimeZone(), "America/New_York");
        test.done();
    },
    
    testGetTimeZoneWebOS: function(test) {
        if (ilibEnv.getPlatform() !== "webos" || ilibEnv.globalVar("Intl")) {
            // only test this in webos
            test.done();
            return;
        }
        ilibEnv.clearCache();
        
        PalmSystem.timezone = "Europe/London";
            
        test.expect(1);
        test.equal(ilibEnv.getTimeZone(), "Europe/London");
        test.done();
    },
    
    testGetLocaleNodejs: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }
        
        ilibEnv.clearCache();
        if (!process.env) process.env = {};
        
        process.env.LANG = "th-TH";
        
        test.expect(1);
        test.equal(ilibEnv.getLocale(), "th-TH");
        test.done();
        
        process.env.LANG = "";
        ilibEnv.clearCache();
    },
    
    testGetLocaleNodejs2: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }
        
        ilibEnv.clearCache();
    
        process.env.LC_ALL = "th-TH";
        
        test.expect(1);
        test.equal(ilibEnv.getLocale(), "th-TH");
        test.done();
        
        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    },

    testGetLocaleNodejsPosixLocale: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "C";

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "en-US");
        test.done();

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    },

    testGetLocaleNodejsPosixLocaleFull: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }

        ilibEnv.clearCache();

        process.env.LC_ALL = "C.UTF8";

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "en-US");
        test.done();

        process.env.LC_ALL = "";
        ilibEnv.clearCache();
    },

    testGetLocaleSimulateRhino: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
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

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "de-AT");

        // clean up
        ilibEnv.clearCache();
        global.environment = undefined;

        test.done();
    },

    testGetLocaleSimulateTrireme1: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("trireme");

        process.env.LANG = "de-AT";

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "de-AT");

        // clean up
        ilibEnv.clearCache();
        process.env.LANG = "";

        test.done();
    },

    testGetLocaleSimulateTrireme2: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("trireme");

        process.env.LANGUAGE = "de-AT";

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "de-AT");

        // clean up
        ilibEnv.clearCache();
        process.env.LANGUAGE = "";

        test.done();
    },

    testGetLocaleSimulateTrireme3: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("trireme");

        process.env.LC_ALL = "de-AT";

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "de-AT");

        // clean up
        ilibEnv.clearCache();
        process.env.LC_ALL = "";

        test.done();
    },

    testGetLocaleSimulateTriremeFullSpecifier: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("trireme");

        process.env.LC_ALL = "de_DE.UTF8";

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "de-DE");

        // clean up
        ilibEnv.clearCache();
        process.env.LC_ALL = "";

        test.done();
    },

    testGetLocaleSimulateTriremeFullLocale: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("trireme");

        process.env.LC_ALL = "zh-Hans-CN";

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "zh-Hans-CN");

        // clean up
        ilibEnv.clearCache();
        process.env.LC_ALL = "";

        test.done();
    },

    testGetLocaleSimulateWebOS: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("webos");

        global.PalmSystem = {
            locale: "ru-RU"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "ru-RU");

        // clean up
        ilibEnv.clearCache();
        global.PalmSystem = undefined;

        test.done();
    },

    testGetLocaleSimulateWebOSWebapp: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in node
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("webos-webapp");

        global.PalmSystem = {
            locale: "ru-RU"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "ru-RU");

        // clean up
        ilibEnv.clearCache();
        global.PalmSystem = undefined;

        test.done();
    },

    testGetLocaleSimulateRegularBrowser: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            language: "ja-JP"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "ja-JP");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;

        test.done();
    },

    testGetLocaleSimulateRegularBrowserLangOnly: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            language: "ja"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "ja");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;

        test.done();
    },

    testGetLocaleSimulateRegularBrowserFullLocale: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            language: "zh-Hans-CN"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "zh-Hans-CN");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;

        test.done();
    },

    testGetLocaleSimulateRegularBrowserNonBCP47: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            language: "ja_jp"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "ja-JP");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;

        test.done();
    },

    testGetLocaleSimulateIEBrowser1: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            browserLanguage: "ja-JP"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "ja-JP");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;

        test.done();
    },

    testGetLocaleSimulateIEBrowser2: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            userLanguage: "ko-KR"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "ko-KR");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;

        test.done();
    },

    testGetLocaleSimulateIEBrowser3: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            systemLanguage: "zh-CN"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "zh-CN");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;

        test.done();
    },

    testGetLocaleSimulateIEBrowserNonBCP: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            systemLanguage: "zh_cn"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "zh-CN");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;

        test.done();
    },

    testGetLocaleSimulateIEBrowserFull: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            test.done();
            return;
        }

        ilibEnv.clearCache();
        ilibEnv.setPlatform("browser");

        var loc = "";

        global.navigator = {
            systemLanguage: "zh-Hans-CN"
        };

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "zh-Hans-CN");

        // clean up
        ilibEnv.clearCache();
        global.navigator = undefined;

        test.done();
    },

    testGetLocaleSimulateQt: function(test) {
        if (ilibEnv.getPlatform() !== "nodejs") {
            // only test this in nodejs
            test.done();
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

        test.expect(1);
        test.equal(ilibEnv.getLocale(), "fr-FR");

        // clean up
        ilibEnv.clearCache();
        global.Qt = undefined;

        test.done();
    },

    testGetLocaleRhino: function(test) {
        if (ilibEnv.getPlatform() !== "rhino") {
            // only test this in node
            test.done();
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
        
        test.expect(1);
        test.equal(ilibEnv.getLocale(), "de-AT");
        test.done();
        
        if (typeof(process) === 'undefined') {
            // under plain rhino
            environment.user.language = undefined;
            environment.user.country = undefined;
        } else {
            process.env.LANG = "en_US.UTF8";
        }
    },
    
    testGetLocaleWebOS: function(test) {
        if (ilibEnv.getPlatform() !== "webos") {
            // only test this in node
            test.done();
            return;
        }
        
        ilibEnv.clearCache();
    
        PalmSystem.locale = "ru-RU";
        
        test.expect(1);
        test.equal(ilibEnv.getLocale(), "ru-RU");
        test.done();
        
        PalmSystem.locale = undefined;
    },

    testGetLocaleBrowser: function(test) {
        if (ilibEnv.getPlatform() !== "browser") {
            // only test this in a real browser
            test.done();
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
        test.expect(1);
        test.equal(ilibEnv.getLocale(), loc);
        test.done();
    },

    testIsGlobal: function(test) {
        test.expect(1);
        var platform = ilibEnv.getPlatform();
        if (platform === "nodejs" || platform === "trireme" || platform === "rhino") {
            global.testGlobalNumber = 32;
        } else {
            window.testGlobalNumber = 32;
        }
        test.ok(ilibEnv.isGlobal("testGlobalNumber"));
        test.done();
    },

    testIsGlobalNot: function(test) {
        test.expect(1);
        test.ok(!ilibEnv.isGlobal("asdfasdfasdf"));
        test.done();
    },
    
    testGlobal: function(test) {
        test.expect(1);
        var platform = ilibEnv.getPlatform();
        if (platform !== "nodejs" && platform !== "trireme" && platform !== "rhino") {
            window.testGlobalNumber = 42;
        } else {
            global.testGlobalNumber = 42;
        }
        test.equal(ilibEnv.globalVar("testGlobalNumber"), 42);
        test.done();
    },
    
    testGlobalUndefined: function(test) {
        test.expect(1);
        test.ok(typeof(ilibEnv.globalVar("testGlobalNumber2")) === "undefined");
        test.done();
    }
};
