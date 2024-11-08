/*
 * index.js - detect various things in the runtime environment
 *
 * Copyright © 2021-2024, JEDLSoft
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

/**
 * Get the raw, uncached platform value of the actual platform this is
 * running on.
 *
 * @private
 * @returns {string} the raw platform value
 */
function getPlatformValue() {
    try {
        if (typeof(java.lang.Object) !== 'undefined') {
            return (typeof(process) !== 'undefined') ? "trireme" : "rhino";
        }
    } catch (e) {}

    if (typeof(global) !== 'undefined' && global.process && global.process.versions && global.process.versions.node) {
        return "nodejs";
    } else if (typeof(Qt) !== 'undefined') {
        return "qt";
    } else if ((typeof(PalmSystem) !== 'undefined')|| (typeof(webOSSystem) !== 'undefined'))  {
        return (typeof(window) !== 'undefined') ? "webos-webapp" : "webos";
    } else if (typeof(window) !== 'undefined') {
        return "browser";
    } else {
        return "unknown";
    }
};

/**
 * Return the value of the top object in the system. This could be global
 * for node, or window for browsers, etc.
 * @static
 * @return {Object|undefined} the top variable, or undefined if there is none on this
 * platform
 */
export function top() {
    let topScope;
    const platformValue = typeof(platform) !== 'undefined' ? platform : getPlatformValue();
    switch (platformValue) {
        case "rhino":
            topScope = (function() {
                return (typeof global === 'object') ? global : this;
            })();
            break;
        case "nodejs":
        case "qt":
        case "trireme":
            topScope = typeof(global) !== 'undefined' ? global : this;
            //console.log("top: top is " + (typeof(global) !== 'undefined' ? "global" : "this"));
            break;
        default:
            topScope = window;
            break;
    }

    return topScope;
};

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
    const globalScope = top();
    if (!globalScope.platform) {
        globalScope.platform = getPlatformValue();
    }
    return globalScope.platform;
};

/**
 * Used in unit testing to simulate a platform.
 * @private
 */
export function setPlatform(plat) {
    let globalScope = top();
    globalScope.platform = plat;
};

/**
 * If this package is running in a browser, return the name of that browser.
 * @static
 * @return {string|undefined} the name of the browser that this is running in ("firefox", "chrome", "ie",
 * "safari", "Edge", "iOS", or "opera"), or undefined if this is not running in a browser or if
 * the browser name could not be determined
 */
export function getBrowser() {
    const globalScope = top();
    if (getPlatform() === "browser" && !globalScope.browser) {
        if (navigator && navigator.userAgent) {
            if (navigator.userAgent.indexOf("Firefox") > -1) {
                globalScope.browser = "firefox";
            } else if (navigator.userAgent.search(/Opera|OPR/) > -1 ) {
                globalScope.browser = "opera";
            } else if (navigator.userAgent.indexOf("Chrome") > -1) {
                globalScope.browser = "chrome";
            } else if (navigator.userAgent.indexOf(" .NET") > -1) {
                globalScope.browser = "ie";
            } else if (navigator.userAgent.indexOf("Safari") > -1) {
                // chrome also has the string Safari in its userAgent, but the chrome case is
                // already taken care of above
                globalScope.browser = "safari";
            } else if (navigator.userAgent.indexOf("Edge") > -1) {
                globalScope.browser = "Edge";
            } else if (navigator.userAgent.search(/iPad|iPhone|iPod/) > -1) {
                // Due to constraints of the iOS platform,
                // all browser must be built on top of the WebKit rendering engine
                globalScope.browser = "iOS";
            }
        }
    }

    return globalScope.browser;
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
 * Do a quick parsing of the locale ourselves instead of relying on
 * ilib-locale so that ilib-env does not have any dependencies.
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

    var parts = str.replace(/_/g, '-').split(/-/g);
    var localeParts = [];

    if (parts.length > 0) {
        if (parts[0].length === 2 || parts[0].length === 3) {
            // language
            localeParts.push(parts[0].toLowerCase());

            if (parts.length > 1) {
                if (parts[1].length === 4) {
                    // script
                    localeParts.push(parts[1][0].toUpperCase() + parts[1].substring(1).toLowerCase());
                } else if (parts[1].length === 2 || parts[1].length == 3) {
                    // region
                    localeParts.push(parts[1].toUpperCase());
                }

                if (parts.length > 2) {
                    if (parts[2].length === 2 || parts[2].length == 3) {
                        // region
                        localeParts.push(parts[2].toUpperCase());
                    }
                }
            }
        }
    }

    return localeParts.join('-');
}

/**
 * Return the default locale for this platform, if there is one.
 * If not, it will default to the locale "en-US".<p>
 *
 * @static
 * @return {string} the BCP-47 locale specifier for the default locale
 */
export function getLocale() {
    let globalScope = top();

    let lang, dot;
    if (typeof(globalScope.locale) !== 'string') {
        const plat = getPlatform();
        switch (plat) {
            case 'browser':
                // running in a browser
                if(typeof(navigator.language) !== 'undefined') {
                    globalScope.locale = parseLocale(navigator.language);  // FF/Opera/Chrome/Webkit
                }
                if (!globalScope.locale) {
                    // IE on Windows
                    lang = typeof(navigator.browserLanguage) !== 'undefined' ?
                        navigator.browserLanguage :
                            (typeof(navigator.userLanguage) !== 'undefined' ?
                                navigator.userLanguage :
                                    (typeof(navigator.systemLanguage) !== 'undefined' ?
                                        navigator.systemLanguage :
                                            undefined));
                    // for some reason, MS uses lower case region tags
                    globalScope.locale = parseLocale(lang);
                }
                break;
            case 'webos-webapp':
            case 'webos':
                // webOS
                if (typeof(PalmSystem.locales) !== 'undefined' &&
                    typeof(PalmSystem.locales.UI) != 'undefined' &&
                    PalmSystem.locales.UI.length > 0) {
                    globalScope.locale = parseLocale(PalmSystem.locales.UI);
                } else if (typeof(PalmSystem.locale) !== 'undefined') {
                    globalScope.locale = parseLocale(PalmSystem.locale);
                } else if (typeof(webOSSystem.locale) !== 'undefined') {
                    ilib.locale = parseLocale(webOSSystem.locale);
                } else {
                    globalScope.locale = undefined;
                }
                break;
            case 'rhino':
                if (typeof(environment) !== 'undefined' && environment.user && typeof(environment.user.language) === 'string' && environment.user.language.length > 0) {
                    // running under plain rhino
                    var l = [environment.user.language];
                    if (typeof(environment.user.country) === 'string' && environment.user.country.length > 0) {
                        l.push(environment.user.country);
                    }
                    globalScope.locale = l.join("-");
                }
                break;
            case "trireme":
                // under trireme on rhino emulating nodejs
                lang = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL;
                // the LANG variable on unix is in the form "lang_REGION.CHARSET"
                // where language and region are the correct ISO codes separated by
                // an underscore. This translate it back to the BCP-47 form.
                globalScope.locale = parseLocale(lang);
                break;
            case 'nodejs':
                // running under nodejs
                lang = global.process.env.LANG || global.process.env.LC_ALL;
                // the LANG variable on unix is in the form "lang_REGION.CHARSET"
                // where language and region are the correct ISO codes separated by
                // an underscore. This translate it back to the BCP-47 form.
                globalScope.locale = parseLocale(lang);
                break;
            case 'qt':
                // running in the Javascript engine under Qt/QML
                const locobj = Qt.locale();
                globalScope.locale = parseLocale(locobj.name || "en-US");
                break;
        }
        globalScope.locale = typeof(globalScope.locale) === 'string' && globalScope.locale.length && globalScope.locale !== "C" ? globalScope.locale : 'en-US';
        if (globalScope.locale === "en") {
            globalScope.locale = "en-US"; // hack to get various platforms working correctly
        }
    }
    return globalScope.locale;
};

/**
 * Set the default locale for ilib. This overrides the locale from the
 * platform. To clear the locale again and cause `getLocale` to
 * get the locale from the platform again, call `setLocale` with no
 * parameters.<p>
 *
 * @static
 * @param {string} locale the BCP-47 locale specifier to set as the default locale
 */
export function setLocale(locale) {
    if (typeof(locale) !== 'string' && typeof(locale) !== 'undefined') {
        return;
    }
    let globalScope = top();
    globalScope.locale = typeof(locale) === 'undefined' ? locale : parseLocale(locale);
};

/**
 * Return the default time zone for this platform if there is one.
 * If not, it will default to the the zone "local".<p>
 *
 * @static
 * @return {string} the default time zone for the platform
 */
export function getTimeZone() {
    let tz, globalScope = top();

    if (typeof(globalScope.tz) === 'undefined') {
        if (typeof(Intl) !== 'undefined' && typeof(Intl.DateTimeFormat) !== 'undefined') {
            const ro = new Intl.DateTimeFormat().resolvedOptions();
            const { timeZone } = ro;
            if (timeZone && timeZone !== "Etc/Unknown") {
                globalScope.tz = timeZone;
                return globalScope.tz;
            }
        }
        let timezone, timeZone;

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
                ({ timeZone } = webOSSystem);
                if ((timezone && timezone.length > 0) || (timeZone && timeZone.length > 0)) {
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

        globalScope.tz = tz || "local";
    }

    return globalScope.tz;
};

/**
 * Set the default time zone for ilib. This overrides the time zone from the
 * platform. To clear the time zone again and cause `getTimeZone` to
 * get the time zone from the platform again, call `setTimeZone` with no
 * parameters.<p>
 *
 * @static
 * @param {string} zoneName the IANA name of the time zone
 */
export function setTimeZone(zoneName) {
    if (typeof(zoneName) !== 'string' && typeof(zoneName) !== 'undefined') {
        return;
    }
    let globalScope = top();
    globalScope.tz = zoneName;
};

/**
 * Used in unit testing to start afresh.
 * @private
 */
export function clearCache() {
    let globalScope = top();
    globalScope.platform = globalScope.locale = globalScope.browser = globalScope.tz = undefined;
};
