/*
 * MockLoader.js - a mock loader for unit testing
 *
 * Copyright © 2022 JEDLSoft
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

import { Loader } from 'ilib-loader';

/**
 * @class
 * Superclass of the loader classes that contains shared functionality.
 *
 * All loaders must support asynchronous operation. That is, they take
 * a file name or a list of file names and return a promise to load
 * them. Some loader may optionally also support synchronous operation
 * as well if the locale files are located locally.
 *
 * @private
 * @constructor
 */
class MockLoader extends Loader {
    /**
     * Create a loader instance.
     *
     * @param {Object} options
     */
    constructor(options) {
        super(options);
        // Track the sync support state for testing
        this._mockSyncSupport = true;
    }

    getPlatforms() {
        return ["mock"];
    }

    getName() {
        return "Mock Loader";
    }

    /**
     * Return true if this loader supports synchronous operation.
     * For testing purposes, this can be temporarily set using setMockSyncSupport().
     * @returns {boolean} true if this loader supports synchronous operation
     */
    supportsSync() {
        return this._mockSyncSupport;
    }

    /**
     * Temporarily set whether this loader supports synchronous operations.
     * This is useful for testing scenarios where you want to test behavior
     * when the loader does not support sync operations.
     * @param {boolean} value - true to enable sync support, false to disable it
     */
    setMockSyncSupport(value) {
        this._mockSyncSupport = value;
    }

    loadFile(pathName, options) {
        console.log(`DEBUG: MockLoader.loadFile called with pathName: "${pathName}", options:`, options);
        let returnValue;

        if (pathName.endsWith(".js")) {
            // For test directories that should not exist, return undefined first
            if (pathName.includes("files4") || pathName.includes("files5")) {
                returnValue = undefined;
            } else if (pathName.includes("files7")) {
                // Handle files7 directory (CommonJS files)
                if (pathName.includes("en-US.js")) {
                    returnValue = {
                        "root": {
                            "info": { "a": "b", "c": "d" },
                            "foo": { "m": "n", "o": "p" }
                        },
                        "en": {
                            "info": { "a": "b en", "c": "d en" },
                            "foo": { "m": "n en", "o": "p en" }
                        }
                    };
                } else if (pathName.includes("en-GB.js")) {
                    returnValue = {
                        "root": {
                            "info": { "a": "b", "c": "d" },
                            "foo": { "m": "n", "o": "p" }
                        },
                        "en": {
                            "info": { "a": "b en", "c": "d en" },
                            "foo": { "m": "n en", "o": "p en" }
                        }
                    };
                } else if (pathName.includes("root.js")) {
                    returnValue = {
                        "root": {
                            "info": { "a": "b", "c": "d" },
                            "foo": { "m": "n", "o": "p" }
                        }
                    };
                } else if (pathName.includes("en.js")) {
                    returnValue = {
                        "root": {
                            "info": { "a": "b", "c": "d" },
                            "foo": { "m": "n", "o": "p" }
                        },
                        "en": {
                            "info": { "a": "b en", "c": "d en" },
                            "foo": { "m": "n en", "o": "p en" }
                        }
                    };
                } else {
                    // For other files7 .js files, try to read them
                    try {
                        const fs = require('fs');
                        const path = require('path');
                        const fullPath = path.resolve(__dirname, pathName);
                        returnValue = fs.readFileSync(fullPath, 'utf8');
                    } catch (error) {
                        returnValue = undefined;
                    }
                }
            } else if (pathName.includes("en-US.js")) {
                returnValue = {
                    getLocaleData: () => ({
                        "root": {
                            "info": { "a": "b", "c": "d" },
                            "foo": { "m": "n", "o": "p" }
                        },
                        "en": {
                            "info": { "a": "b en", "c": "d en" },
                            "foo": { "m": "n en", "o": "p en" }
                        },
                        "en-US": {
                            "info": { "a": "b en-US", "c": "d en-US" },
                            "foo": { "m": "n en-US", "o": "p en-US" }
                        }
                    })
                };
            } else if (pathName.includes("root.js")) {
                returnValue = {
                    getLocaleData: () => ({
                        "root": {
                            "info": { "a": "b", "c": "d" },
                            "foo": { "m": "n", "o": "p" }
                        }
                    })
                };
            } else if (pathName.includes("empty.js")) {
                returnValue = undefined;
            } else if (pathName.includes("invalid.js")) {
                returnValue = "invalid javascript content";
            } else if (pathName.search("root.js$") !== -1) {
                console.log(`DEBUG: Matched root.js pattern 1`);
                returnValue = `{
                    "root": {
                        "info": {
                            "a": "b root",
                            "c": "d root"
                        },
                        "foo": {
                            "m": "n root",
                            "o": "p root"
                        }
                    }
                }`;
            } else if (pathName === "root.js" || pathName.endsWith("/root.js")) {
                console.log(`DEBUG: Matched root.js pattern 2`);
                returnValue = `{
                    "root": {
                        "info": {
                            "a": "b root",
                            "c": "d root"
                        },
                        "foo": {
                            "m": "n root",
                            "o": "p root"
                        }
                    }
                }`;
            } else {
                // For other .js files, read the actual file content
                const fs = require('fs');
                const path = require('path');
                try {
                    const fullPath = path.resolve(__dirname, pathName);
                    returnValue = fs.readFileSync(fullPath, 'utf8');
                } catch (error) {
                    returnValue = undefined;
                }
            }
        } else if (pathName.search("fr/localeinfo.json$") !== -1) {
            returnValue = `
            {
                "language.name": "French",
                "numfmt": {
                    "groupChar": " ",
                    "currencyFormats": {
                        "common": "{n} {s}",
                        "commonNegative": "({n} {s})"
                    },
                    "pctFmt": "{n} %"
                },
                "paperSizes": {
                    "regular": "A4",
                    "photo": "4x6"
                },
                "scripts": [
                    "Latn"
                ],
                "locale": "fr"
            }
            `;
        } else if (pathName.search("FR/localeinfo.json$") !== -1) {
            returnValue = `
            {
                "currency": "EUR",
                "firstDayOfWeek": 1,
                "region.name": "France",
                "timezone": "Europe/Paris",
                "locale": "FR"
            }
            `;
        } else if (pathName.search("yyy/localeinfo.json$") !== -1) {
            returnValue = (pathName.indexOf('yyy') === -1) ? undefined : `
            {
                "clock": "24",
                "units": "metric",
                "calendar": "hebrew",
                "firstDayOfWeek": 4,
                "currency": "JPY",
                "timezone": "Asia/Tokyo",
                "numfmt": {
                    "decimalChar": ".",
                    "groupChar": ",",
                    "groupSize": 4,
                    "pctFmt": "{n} %",
                    "pctChar": "%",
                    "currencyFormats": {
                        "common": "common {s} {n}",
                        "iso": "iso {s} {n}"
                    }
                },
                "locale": "yyy-ZZ"
            }
            `;
        } else if (pathName === "qq/localeinfo.json") {
            returnValue = `
            {
                "calendar": "gregorian",
                "clock": "24",
                "currency": "USD",
                "firstDayOfWeek": 1,
                "numfmt": {
                    "script": "Latn",
                    "decimalChar": ",",
                    "groupChar": ".",
                    "prigroupSize": 3,
                    "pctFmt": "{n}%",
                    "pctChar": "%",
                    "roundingMode": "halfdown",
                    "exponential": "e",
                    "currencyFormats": {
                        "common": "{s}{n}",
                        "commonNegative": "{s}-{n}"
                    }
                },
                "timezone": "Etc/UTC",
                "units": "metric"
            }`;
        } else if (pathName.endsWith(".json")) {
            // For test .json files, return JSON strings since parseData expects strings for JSON parsing
            if (pathName.includes("en.json")) {
                returnValue = JSON.stringify({
                    "en": {
                        "info": { "a": "b en", "c": "d en" },
                        "foo": { "m": "n en", "o": "p en" }
                    }
                });
            } else if (pathName.includes("multi.json")) {
                returnValue = JSON.stringify({
                    "root": {
                        "info": { "a": "b", "c": "d" },
                        "foo": { "m": "n", "o": "p" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" },
                        "foo": { "m": "n en", "o": "p en" }
                    }
                });
            } else if (pathName.includes("invalid.json")) {
                returnValue = "invalid json content";
            } else {
                // For other .json files, return undefined instead of trying to read actual files
                // This prevents issues in browser environments where fs/path modules aren't available
                returnValue = undefined;
            }
        }
        return (options && options.sync) ? returnValue : Promise.resolve(returnValue);
    }
};

export default MockLoader;
