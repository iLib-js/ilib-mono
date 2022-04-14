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
    }

    getPlatforms() {
        return ["mock"];
    }

    getName() {
        return "Mock Loader";
    }

    supportsSync() {
        return false;
    }

    loadFile(pathName, options) {
        let returnValue;

        if (pathName.search("fr/localeinfo.json$") !== -1) {
            returnValue = `
            {
                "language.name": "French",
                "numfmt": {
                    "groupChar": " ",
                    "currencyFormats": {
                        "common": "{n} {s}",
                        "commonNegative": "({n} {s})"
                    },
                    "pctFmt": "{n} %"
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
        }
        return (options && options.sync) ? returnValue : Promise.resolve(returnValue);
    }
};

export default MockLoader;
