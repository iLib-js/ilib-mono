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

let platform;

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
export function getPlatform() {
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

let browser;

/**
 * If this package is running in a browser, return the name of that browser.
 * @static
 * @return {string|undefined} the name of the browser that this is running in ("firefox", "chrome", "ie",
 * "safari", "Edge", "iOS", or "opera"), or undefined if this is not running in a browser or if
 * the browser name could not be determined
 */
export function getBrowser() {
    if (getPlatform() === "browser") {
        if (navigator && navigator.userAgent) {
            if (navigator.userAgent.indexOf("Firefox") > -1) {
                browser = "firefox";
            } else if (navigator.userAgent.search(/Opera|OPR/) > -1 ) {
                browser = "opera";
            } else if (navigator.userAgent.indexOf("Chrome") > -1) {
                browser = "chrome";
            } else if (navigator.userAgent.indexOf(" .NET") > -1) {
                browser = "ie";
            } else if (navigator.userAgent.indexOf("Safari") > -1) {
                // chrome also has the string Safari in its userAgent, but the chrome case is
                // already taken care of above
                browser = "safari";
            } else if (navigator.userAgent.indexOf("Edge") > -1) {
                browser = "Edge";
            } else if (navigator.userAgent.search(/iPad|iPhone|iPod/) > -1) {
                // Due to constraints of the iOS platform,
                // all browser must be built on top of the WebKit rendering engine
                browser = "iOS";
            }
        }
    }
    return browser;
};

let topScope;

/**
 * Return the value of the top object in the system. This could be global
 * for node, or window for browsers, etc.
 * @static
 * @return {Object|undefined} the top variable, or undefined if there is none on this
 * platform
 */
export function top() {
    if (typeof(topScope) === 'undefined') {
        switch (getPlatform()) {
            case "rhino":
                topScope = (function() {
                  return (typeof global === 'object') ? global : this;
                })();
                break;
            case "nodejs":
            case "trireme":
                topScope = typeof(global) !== 'undefined' ? global : this;
                //console.log("top: top is " + (typeof(global) !== 'undefined' ? "global" : "this"));
                break;
            default:
                topScope = window;
                break;
        }
    }

    return topScope;
};

/**
 * Return the value of a global variable given its name in a way that works
 * correctly for the current platform.
 * @static
 * @param {string} name the name of the variable to return
 * @return {*} the global variable, or undefined if it does not exist
 */
export function globalVar(name) {
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
export function isGlobal(name) {
    return typeof(globalVar(name)) !== 'undefined';
};

let locale;

/**
 * @private
 */
function parseLocale(str) {
    if (!str) return str;

    // take care of the libc style locale with a dot + script at the end
    var dot = str.indexOf('.')
    if (dot > -1) {
        str = str.substring(0, dot);
    }

    // handle the posix default locale
    if (str === "C") return "en-US";

    // full locale
    if (str.length >= 10) {
        return [
            str.substring(0,2).toLowerCase(),
            str[3].toUpperCase() + str.substring(4,7).toLowerCase(),
            str.substring(8,10).toUpperCase()
        ].join("-");
    }

    // language + script
    if (str.length >= 7) {
        return [
            str.substring(0,2).toLowerCase(),
            str[3].toUpperCase() + str.substring(4,7).toLowerCase()
        ].join("-");
    }

    // language + region
    if (str.length >= 5) {
        return [
            str.substring(0,2).toLowerCase(),
            str.substring(3,5).toUpperCase()
        ].join("-");
    }

    // language only
    if (str.length < 3) {
        return str.toLowerCase();
    }

    return str;
}

/**
 * Return the default locale for this platform, if there is one.
 * If not, it will default to the locale "en-US".<p>
 *
 * @static
 * @return {string} the BCP-47 locale specifier for the default locale
 */
export function getLocale() {
    let lang, dot;
    if (typeof(locale) !== 'string') {
        const plat = getPlatform();
        switch (plat) {
            case 'browser':
                // running in a browser
                if(typeof(navigator.language) !== 'undefined') {
                    locale = parseLocale(navigator.language);  // FF/Opera/Chrome/Webkit
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
                    // for some reason, MS uses lower case region tags
                    locale = parseLocale(lang);
                }
                break;
            case 'webos-webapp':
            case 'webos':
                // webOS
                if (typeof(PalmSystem.locales) !== 'undefined' &&
                    typeof(PalmSystem.locales.UI) != 'undefined' &&
                    PalmSystem.locales.UI.length > 0) {
                    locale = parseLocale(PalmSystem.locales.UI);
                } else if (typeof(PalmSystem.locale) !== 'undefined') {
                    locale = parseLocale(PalmSystem.locale);
                } else {
                    locale = undefined;
                }
                break;
            case 'rhino':
                if (typeof(environment) !== 'undefined' && environment.user && typeof(environment.user.language) === 'string' && environment.user.language.length > 0) {
                    // running under plain rhino
                    var l = [environment.user.language];
                    if (typeof(environment.user.country) === 'string' && environment.user.country.length > 0) {
                        l.push(environment.user.country);
                    }
                    locale = l.join("-");
                }
                break;
            case "trireme":
                // under trireme on rhino emulating nodejs
                lang = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL;
                // the LANG variable on unix is in the form "lang_REGION.CHARSET"
                // where language and region are the correct ISO codes separated by
                // an underscore. This translate it back to the BCP-47 form.
                locale = parseLocale(lang);
                break;
            case 'nodejs':
                // running under nodejs
                let lang = global.process.env.LANG || global.process.env.LC_ALL;
                // the LANG variable on unix is in the form "lang_REGION.CHARSET"
                // where language and region are the correct ISO codes separated by
                // an underscore. This translate it back to the BCP-47 form.
                locale = parseLocale(lang);
                break;
            case 'qt':
                // running in the Javascript engine under Qt/QML
                const locobj = Qt.locale();
                locale = parseLocale(locobj.name || "en-US");
                break;
        }
        locale = typeof(locale) === 'string' && locale.length && locale !== "C" ? locale : 'en-US';
        if (locale === "en") {
            locale = "en-US"; // hack to get various platforms working correctly
        }
    }
    return locale;
};

let tz;

/**
 * Return the default time zone for this platform if there is one. 
 * If not, it will default to the the zone "local".<p>
 *
 * @static
 * @return {string} the default time zone for the platform
 */
export function getTimeZone() {
    if (typeof(tz) === 'undefined') {
        if (typeof(Intl) !== 'undefined' && typeof(Intl.DateTimeFormat) !== 'undefined') {
            const ro = new Intl.DateTimeFormat().resolvedOptions();
            const { timeZone } = ro;
            if (timeZone && timeZone !== "Etc/Unknown") {
                tz = timeZone;
                return tz;
            }
        }
        let timezone;

        switch (getPlatform()) {
            case 'browser':
                // running in a browser
                ({ timezone } = navigator);
                if (timezone && timezone.length > 0) {
                    tz = timezone;
                }
                break;
            case 'webos-webapp':
            case 'webos':
                // running in webkit on webOS
                ({ timezone } = PalmSystem);
                if (timezone && timezone.length > 0) {
                    tz = timezone;
                }
                break;
            case 'rhino':
                // running under rhino
                if (typeof(environment.user.timezone) !== 'undefined' && environment.user.timezone.length > 0) {
                    ({timezone: tz} = environment.user);
                }
                break;
            case 'nodejs':
                if (global.process.env) {
                    ({TZ : tz} = global.process.env);
                }
                break;
        }

        tz = tz || "local";
    }

    return tz;
};

/**
 * Used in unit testing to start afresh.
 * @private
 */
export function clearCache() {
    platform = locale = browser = tz = undefined;
};

/**
 * Used in unit testing to simulate a platform.
 * @private
 */
export function setPlatform(plat) {
    platform = plat;
};
