/*
 * Webpackloader.test.js - test the loader under webpack
 *
 * Copyright © 2022-2023 JEDLSoft
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

import { getPlatform } from 'ilib-env';
import LoaderFactory, { registerLoader } from '../src/index.js';

describe("testWebpackLoader", () => {
    if (getPlatform() === "browser") {
        test("LoaderGetName", () => {
            expect.assertions(1);
            var loader = LoaderFactory();
            expect(loader.getName()).toBe("Webpack Loader");
        });

        test("LoaderSupportsSync", () => {
            expect.assertions(1);
            var loader = LoaderFactory();
            expect(!loader.supportsSync()).toBeTruthy();
        });

        test("LoadFileSync", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            expect(() => {
                return loader.loadFile("root.js", {sync: true});
            }).toThrow();
        });

        test("LoadFileAsync", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var promise = loader.loadFile("root.js", {sync: false});
            promise.then((module) => {
                expect(module.getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
            });
        });

        test("LoadFileAsyncDefault", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var promise = loader.loadFile("root.js");
            promise.then((module) => {
                expect(module.getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
            });
        });

        test("LoadFilesAsync", () => {
            expect.assertions(3);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "root.js",
                "de-DE.js"
            ], {sync: false});
            promise.then((content) => {
            console.dir(content);
                expect(content.length).toBe(2);
                expect(content[0].getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
                expect(content[1].getLocaleData()).toEqual({
                    "de": {
                        "localeinfo": {
                            "thousandsSeparator": ".",
                            "decimalSeparator": ",",
                            "language.name": "German",
                            "locale": "de"
                        }
                    },
                    "de-DE": {
                        "localeinfo": {
                            "clock": "24",
                            "locale": "de-DE"
                        }
                    },
                    "und-DE": {
                        "localeinfo": {
                            "timezone": "Europe/Berlin",
                            "region.name": "Germany",
                            "locale": "und-DE"
                        }
                    }
                });
            });
        });

        test("LoadFilesAsyncUndefinedFileName", () => {
            expect.assertions(4);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "root.js",
                undefined,
                "de-DE.js"
            ], {sync: false});
            promise.then((content) => {
                expect(content.length).toBe(3);
                expect(content[0].getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
                expect(content[1]).toBeFalsy();
                expect(content[2].getLocaleData()).toEqual({
                    "de": {
                        "localeinfo": {
                            "thousandsSeparator": ".",
                            "decimalSeparator": ",",
                            "language.name": "German",
                            "locale": "de"
                        }
                    },
                    "de-DE": {
                        "localeinfo": {
                            "clock": "24",
                            "locale": "de-DE"
                        }
                    },
                    "und-DE": {
                        "localeinfo": {
                            "timezone": "Europe/Berlin",
                            "region.name": "Germany",
                            "locale": "und-DE"
                        }
                    }
                });
            });
        });

        test("LoadFilesAsyncNullFileName", () => {
            expect.assertions(4);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "root.js",
                null,
                "de-DE.js"
            ], {sync: false});
            promise.then((content) => {
                expect(content.length).toBe(3);
                expect(content[0].getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
                expect(content[1]).toBeFalsy();
                expect(content[2].getLocaleData()).toEqual({
                    "de": {
                        "localeinfo": {
                            "thousandsSeparator": ".",
                            "decimalSeparator": ",",
                            "language.name": "German",
                            "locale": "de"
                        }
                    },
                    "de-DE": {
                        "localeinfo": {
                            "clock": "24",
                            "locale": "de-DE"
                        }
                    },
                    "und-DE": {
                        "localeinfo": {
                            "timezone": "Europe/Berlin",
                            "region.name": "Germany",
                            "locale": "und-DE"
                        }
                    }
                });
            });
        });

        test("LoadFilesAsyncBooleanFileName", () => {
            expect.assertions(4);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "root.js",
                true,
                "de-DE.js"
            ], {sync: false});
            promise.then((content) => {
                expect(content.length).toBe(3);
                expect(content[0].getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
                expect(content[1]).toBeFalsy();
                expect(content[2].getLocaleData()).toEqual({
                    "de": {
                        "localeinfo": {
                            "thousandsSeparator": ".",
                            "decimalSeparator": ",",
                            "language.name": "German",
                            "locale": "de"
                        }
                    },
                    "de-DE": {
                        "localeinfo": {
                            "clock": "24",
                            "locale": "de-DE"
                        }
                    },
                    "und-DE": {
                        "localeinfo": {
                            "timezone": "Europe/Berlin",
                            "region.name": "Germany",
                            "locale": "und-DE"
                        }
                    }
                });
            });
        });

        test("LoadFilesAsyncNumericFileName", () => {
            expect.assertions(4);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "root.js",
                4,
                "de-DE.js"
            ], {sync: false});
            promise.then((content) => {
                expect(content.length).toBe(3);
                expect(content[0].getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
                expect(content[1]).toBeFalsy();
                expect(content[2].getLocaleData()).toEqual({
                    "de": {
                        "localeinfo": {
                            "thousandsSeparator": ".",
                            "decimalSeparator": ",",
                            "language.name": "German",
                            "locale": "de"
                        }
                    },
                    "de-DE": {
                        "localeinfo": {
                            "clock": "24",
                            "locale": "de-DE"
                        }
                    },
                    "und-DE": {
                        "localeinfo": {
                            "timezone": "Europe/Berlin",
                            "region.name": "Germany",
                            "locale": "und-DE"
                        }
                    }
                });
            });
        });

        test("LoadFilesAsyncEmptyFileName", () => {
            expect.assertions(4);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "root.js",
                "",
                "de-DE.js"
            ], {sync: false});
            promise.then((content) => {
                expect(content.length).toBe(3);
                expect(content[0].getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
                expect(content[1]).toBeFalsy();
                expect(content[2].getLocaleData()).toEqual({
                    "de": {
                        "localeinfo": {
                            "thousandsSeparator": ".",
                            "decimalSeparator": ",",
                            "language.name": "German",
                            "locale": "de"
                        }
                    },
                    "de-DE": {
                        "localeinfo": {
                            "clock": "24",
                            "locale": "de-DE"
                        }
                    },
                    "und-DE": {
                        "localeinfo": {
                            "timezone": "Europe/Berlin",
                            "region.name": "Germany",
                            "locale": "und-DE"
                        }
                    }
                });
            });
        });

        test("LoadFilesAsyncUnknownFileName", () => {
            expect.assertions(4);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "root.js",
                "ja-JP.js",
                "de-DE.js"
            ], {sync: false});
            promise.then((content) => {
                expect(content.length).toBe(3);
                expect(content[0].getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
                expect(content[1]).toBeFalsy();
                expect(content[2].getLocaleData()).toEqual({
                    "de": {
                        "localeinfo": {
                            "thousandsSeparator": ".",
                            "decimalSeparator": ",",
                            "language.name": "German",
                            "locale": "de"
                        }
                    },
                    "de-DE": {
                        "localeinfo": {
                            "clock": "24",
                            "locale": "de-DE"
                        }
                    },
                    "und-DE": {
                        "localeinfo": {
                            "timezone": "Europe/Berlin",
                            "region.name": "Germany",
                            "locale": "und-DE"
                        }
                    }
                });
            });
        });

        test("LoadFilesAsyncUnknownPath", () => {
            expect.assertions(4);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "root.js",
                "foo/bar/ja-JP.js",
                "de-DE.js"
            ], {sync: false});
            promise.then((content) => {
                expect(content.length).toBe(3);
                expect(content[0].getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
                expect(content[1]).toBeFalsy();
                expect(content[2].getLocaleData()).toEqual({
                    "de": {
                        "localeinfo": {
                            "thousandsSeparator": ".",
                            "decimalSeparator": ",",
                            "language.name": "German",
                            "locale": "de"
                        }
                    },
                    "de-DE": {
                        "localeinfo": {
                            "clock": "24",
                            "locale": "de-DE"
                        }
                    },
                    "und-DE": {
                        "localeinfo": {
                            "timezone": "Europe/Berlin",
                            "region.name": "Germany",
                            "locale": "und-DE"
                        }
                    }
                });
            });
        });

        test("LoadFilesAsyncMultiple", () => {
            expect.assertions(4);

            var loader = LoaderFactory();
            loader.setAsyncMode();

            var promise = loader.loadFiles([
                "root.js",
                "en-US.js",
                "de-DE.js"
            ]);
            promise.then((content) => {
                expect(content.length).toBe(3);
                expect(content[0].getLocaleData()).toEqual({
                   "root": {
                       "localeinfo": {
                           "thousandsSeparator": ",",
                           "decimalSeparator": ".",
                           "clock": "24",
                           "timezone": "Etc/UTC"
                       }
                   }
                });
                expect(content[1].getLocaleData()).toEqual({
                    "en": {
                        "localeinfo": {
                            "language.name": "English",
                            "locale": "en"
                        }
                    },
                    "en-US": {
                        "localeinfo": {
                            "clock": "12",
                            "locale": "en-US"
                        }
                    },
                    "und-US": {
                        "localeinfo": {
                            "timezone": "America/New_York",
                            "region.name": "United States of America",
                            "locale": "und-US"
                        }
                    }
                });
                expect(content[2].getLocaleData()).toEqual({
                    "de": {
                        "localeinfo": {
                            "thousandsSeparator": ".",
                            "decimalSeparator": ",",
                            "language.name": "German",
                            "locale": "de"
                        }
                    },
                    "de-DE": {
                        "localeinfo": {
                            "clock": "24",
                            "locale": "de-DE"
                        }
                    },
                    "und-DE": {
                        "localeinfo": {
                            "timezone": "Europe/Berlin",
                            "region.name": "Germany",
                            "locale": "und-DE"
                        }
                    }
                });
            });
        });
    } else {
        test("fake", () => {
            expect(1+1).toBe(2);
        });
    }
});
