/*
 * index.js - detect various things in the runtime environment
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

var platform;

/**
 * Return the name of the platform. Recognized platforms are:
 * - trireme
 * - rhino
 * - nodejs
 * - qt
 * - webos-webapp
 * - webos
 * - browser
 * - unknown
 *
 * If the the platform is "browser", you can call the function getBrowser()
 * to find out which one.
 *
 * @static
 * @return {string} string naming the platform
 */
var getPlatform = function getPlatform() {
    if (!platform) {
        try {
            if (typeof(java.lang.Object) !== 'undefined') {
                platform = (typeof(process) !== 'undefined') ? "trireme" : "rhino";
                return platform;
            }
        } catch (e) {}

        if (typeof(global) !== 'undefined' && global.process && global.process.versions && global.process.versions.node && typeof(module) !== 'undefined') {
            platform = "nodejs";
        } else if (typeof(Qt) !== 'undefined') {
            platform = "qt";
            ilib._cacheMerged = true; // qt is too slow, so we need to cache the already-merged locale data
        } else if (typeof(PalmSystem) !== 'undefined') {
            platform = (typeof(window) !== 'undefined') ? "webos-webapp" : "webos";
        } else if (typeof(window) !== 'undefined') {
            platform = "browser";
        } else {
            platform = "unknown";
        }
    }
    return platform;
};

var browser;

/**
 * If this package is running in a browser, return the name of that browser.
 * @static
 * @return {string|undefined} the name of the browser that this is running in ("firefox", "chrome", "ie",
 * "safari", "Edge", "iOS", or "opera"), or undefined if this is not running in a browser or if
 * the browser name could not be determined
 */
var getBrowser = function getBrowser() {
    if (getPlatform() === "browser") {
        if (navigator && navigator.userAgent) {
            if (navigator.userAgent.indexOf("Firefox") > -1) {
                browser = "firefox";
            }
            if (navigator.userAgent.search(/Opera|OPR/) > -1 ) {
                browser = "opera";
            }
            if (navigator.userAgent.indexOf("Chrome") > -1) {
                browser = "chrome";
            }
            if (navigator.userAgent.indexOf(" .NET") > -1) {
                browser = "ie";
            }
            if (navigator.userAgent.indexOf("Safari") > -1) {
                // chrome also has the string Safari in its userAgent, but the chrome case is
                // already taken care of above
                browser = "safari";
            }
            if (navigator.userAgent.indexOf("Edge") > -1) {
                browser = "Edge";
            }
            if (navigator.userAgent.search(/iPad|iPhone|iPod/) > -1) {
                // Due to constraints of the iOS platform,
                // all browser must be built on top of the WebKit rendering engine
                browser = "iOS";
            }
        }
    }
    return browser;
};


/**
 * Return the value of the top object in the system. This could be global
 * for node, or window for browsers, etc.
 * @static
 * @return {Object|undefined} the top variable, or undefined if there is none on this
 * platform
 */
var top = function top() {
    if (typeof(this.top) === 'undefined') {
        this.top = null;
        switch (getPlatform()) {
            case "rhino":
                this.top = (function() {
                  return (typeof global === 'object') ? global : this;
                })();
                break;
            case "nodejs":
            case "trireme":
                this.top = typeof(global) !== 'undefined' ? global : this;
                //console.log("ilib._top: top is " + (typeof(global) !== 'undefined' ? "global" : "this"));
                break;
            default:
                this.top = window;
                break;
        }
    }

    return this.top || undefined;
};

/**
 * Return the value of a global variable given its name in a way that works
 * correctly for the current platform.
 * @static
 * @param {string} name the name of the variable to return
 * @return {*} the global variable, or undefined if it does not exist
 */
var globalVar = function globalVar(name) {
    try {
        return top()[name];
    } catch (e) {
        return undefined;
    }
};

/**
 * Return true if the global variable is defined on this platform.
 * @static
 * @param {string} name the name of the variable to check
 * @return {boolean} true if the global variable is defined on this platform, false otherwise
 */
var isGlobal = function isGlobal(name) {
    return typeof(globalVar(name)) !== 'undefined';
};

var locale;

/**
 * Return the default locale for this platform, if there is one.
 * If not, it will default to the locale "en-US".<p>
 *
 * @static
 * @return {string} the BCP-47 locale specifier for the default locale
 */
var getLocale = function getLocale() {
    if (typeof(locale) !== 'string') {
        var plat = getPlatform();
        switch (plat) {
            case 'browser':
                // running in a browser
                if(typeof(navigator.language) !== 'undefined') {
                    locale = (navigator.language.length > 3) ? navigator.language.substring(0,3) + navigator.language.substring(3,5).toUpperCase() : navigator.language;  // FF/Opera/Chrome/Webkit
                }
                if (!locale) {
                    // IE on Windows
                    lang = typeof(navigator.browserLanguage) !== 'undefined' ?
                        navigator.browserLanguage :
                            (typeof(navigator.userLanguage) !== 'undefined' ?
                                navigator.userLanguage :
                                    (typeof(navigator.systemLanguage) !== 'undefined' ?
                                        navigator.systemLanguage :
                                            undefined));
                    if (typeof(lang) !== 'undefined' && lang) {
                        // for some reason, MS uses lower case region tags
                        locale = (lang.length > 3) ? lang.substring(0,3) + lang.substring(3,5).toUpperCase() : lang;
                    } else {
                        locale = undefined;
                    }
                }
                break;
            case 'webos-webapp':
            case 'webos':
                // webOS
                if (typeof(PalmSystem.locales) !== 'undefined' &&
                    typeof(PalmSystem.locales.UI) != 'undefined' &&
                    PalmSystem.locales.UI.length > 0) {
                    locale = PalmSystem.locales.UI;
                } else if (typeof(PalmSystem.locale) !== 'undefined') {
                    locale = PalmSystem.locale;
                } else {
                    locale = undefined;
                }
                break;
            case 'rhino':
                if (typeof(environment) !== 'undefined' && environment.user && typeof(environment.user.language) === 'string' && environment.user.language.length > 0) {
                    // running under plain rhino
                    locale = environment.user.language;
                    if (typeof(environment.user.country) === 'string' && environment.user.country.length > 0) {
                        locale += '-' + environment.user.country;
                    }
                }
                break;
            case "trireme":
                // under trireme on rhino emulating nodejs
                lang = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL;
                // the LANG variable on unix is in the form "lang_REGION.CHARSET"
                // where language and region are the correct ISO codes separated by
                // an underscore. This translate it back to the BCP-47 form.
                if (lang && typeof(lang) !== 'undefined') {
                    var dot = lang.indexOf('.');
                    if (dot > -1) {
                        lang = lang.substring(0, dot);
                    }
                    locale = (lang.length > 3) ? lang.substring(0,2).toLowerCase() + '-' + lang.substring(3,5).toUpperCase() : lang;
                } else {
                    locale = undefined;
                }
                break;
            case 'nodejs':
                // running under nodejs
                lang = global.process.env.LANG || global.process.env.LC_ALL;
                // the LANG variable on unix is in the form "lang_REGION.CHARSET"
                // where language and region are the correct ISO codes separated by
                // an underscore. This translate it back to the BCP-47 form.
                if (lang && typeof(lang) !== 'undefined') {
                    var dot = lang.indexOf('.');
                    if (dot > -1) {
                        lang = lang.substring(0, dot);
                    }
                    locale = (lang.length > 3) ? lang.substring(0,2).toLowerCase() + '-' + lang.substring(3,5).toUpperCase() : lang;
                } else {
                    locale = undefined;
                }
                break;
            case 'qt':
                // running in the Javascript engine under Qt/QML
                var locobj = Qt.locale();
                var lang = locobj.name && locobj.name.replace("_", "-") || "en-US";
                break;
        }
        locale = typeof(locale) === 'string' && locale.length && locale !== "C" ? locale : 'en-US';
        if (locale === "en") {
            locale = "en-US"; // hack to get various platforms working correctly
        }
    }
    return locale;
};

var tz;

/**
 * Return the default time zone for this platform if there is one. 
 * If not, it will default to the the zone "local".<p>
 *
 * @static
 * @return {string} the default time zone for ilib
 */
var getTimeZone = function() {
    if (typeof(tz) === 'undefined') {
        if (typeof(Intl) !== 'undefined' && typeof(Intl.DateTimeFormat) !== 'undefined') {
            var ro = new Intl.DateTimeFormat().resolvedOptions();
            tz = ro && ro.timeZone;
            if (tz) {
                return tz;
            }
        }

        switch (ilib._getPlatform()) {
            case 'browser':
                // running in a browser
                if (navigator.timezone && navigator.timezone.length > 0) {
                    tz = navigator.timezone;
                }
                break;
            case 'webos-webapp':
            case 'webos':
                // running in webkit on webOS
                if (PalmSystem.timezone && PalmSystem.timezone.length > 0) {
                    tz = PalmSystem.timezone;
                }
                break;
            case 'rhino':
                // running under rhino
                if (typeof(environment.user.timezone) !== 'undefined' && environment.user.timezone.length > 0) {
                    tz = environment.user.timezone;
                }
                break;
            case 'nodejs':
                if (global.process.env && typeof(global.process.env.TZ) !== "undefined") {
                    tz = global.process.env.TZ;
                }
                break;
        }

        tz = tz || "local";
    }

    return tz;
};

var clearCache = function clearCache() {
    platform = locale = browser = tz = undefined;
};

module.exports = {
    clearCache: clearCache,
    getBrowser: getBrowser,
    getLocale: getLocale,
    getPlatform: getPlatform,
    getTimeZone: getTimeZone,
    globalVar: globalVar,
    isGlobal: isGlobal,
    top: top
};