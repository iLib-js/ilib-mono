/*
 * testWebpackloader.js - test the loader under webpack
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

import { setPlatform } from 'ilib-env';
import LoaderFactory, { registerLoader } from '../src/index';

export const testWebpackLoader = {
    testLoaderGetName: function(test) {
        test.expect(1);
        var loader = LoaderFactory();
        test.equal(loader.getName(), "Webpack Loader");
        test.done();
    },

    testLoaderSupportsSync: function(test) {
        test.expect(1);
        var loader = LoaderFactory();
        test.ok(!loader.supportsSync());
        test.done();
    },

    testLoadFileSync: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        test.throws(() => {
            return loader.loadFile("./test/files/test.json", {sync: true});
        });
        test.done();
    },

    testLoadFileAsync: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var promise = loader.loadFile("root.js", {sync: false});
        promise.then((module) => {
            test.deepEqual(module.getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });

            test.done();
        });
    },

    testLoadFileAsyncDefault: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var promise = loader.loadFile("root.js");
        promise.then((module) => {
            test.deepEqual(module.getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });

            test.done();
        });
    },

    testLoadFilesAsync: function(test) {
        test.expect(3);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "root.js",
            "de-DE.js"
        ], {sync: false});
        promise.then((content) => {
        console.dir(content);
            test.equal(content.length, 2);
            test.deepEqual(content[0].getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });
            test.deepEqual(content[1].getLocaleData(), {
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
            test.done();
        });
    },

    testLoadFilesAsyncUndefinedFileName: function(test) {
        test.expect(4);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "root.js",
            undefined,
            "de-DE.js"
        ], {sync: false});
        promise.then((content) => {
            test.equal(content.length, 3);
            test.deepEqual(content[0].getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });
            test.ok(!content[1]);
            test.deepEqual(content[2].getLocaleData(), {
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
            test.done();
        });
    },

    testLoadFilesAsyncNullFileName: function(test) {
        test.expect(4);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "root.js",
            null,
            "de-DE.js"
        ], {sync: false});
        promise.then((content) => {
            test.equal(content.length, 3);
            test.deepEqual(content[0].getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });
            test.ok(!content[1]);
            test.deepEqual(content[2].getLocaleData(), {
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
            test.done();
        });
    },

    testLoadFilesAsyncBooleanFileName: function(test) {
        test.expect(4);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "root.js",
            true,
            "de-DE.js"
        ], {sync: false});
        promise.then((content) => {
            test.equal(content.length, 3);
            test.deepEqual(content[0].getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });
            test.ok(!content[1]);
            test.deepEqual(content[2].getLocaleData(), {
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
            test.done();
        });
    },

    testLoadFilesAsyncNumericFileName: function(test) {
        test.expect(4);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "root.js",
            4,
            "de-DE.js"
        ], {sync: false});
        promise.then((content) => {
            test.equal(content.length, 3);
            test.deepEqual(content[0].getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });
            test.ok(!content[1]);
            test.deepEqual(content[2].getLocaleData(), {
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
            test.done();
        });
    },

    testLoadFilesAsyncEmptyFileName: function(test) {
        test.expect(4);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "root.js",
            "",
            "de-DE.js"
        ], {sync: false});
        promise.then((content) => {
            test.equal(content.length, 3);
            test.deepEqual(content[0].getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });
            test.ok(!content[1]);
            test.deepEqual(content[2].getLocaleData(), {
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
            test.done();
        });
    },

    testLoadFilesAsyncUnknownFileName: function(test) {
        test.expect(4);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "root.js",
            "ja-JP.js",
            "de-DE.js"
        ], {sync: false});
        promise.then((content) => {
            test.equal(content.length, 3);
            test.deepEqual(content[0].getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });
            test.ok(!content[1]);
            test.deepEqual(content[2].getLocaleData(), {
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
            test.done();
        });
    },

    testLoadFilesAsyncUnknownPath: function(test) {
        test.expect(4);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "root.js",
            "foo/bar/ja-JP.js",
            "de-DE.js"
        ], {sync: false});
        promise.then((content) => {
            test.equal(content.length, 3);
            test.deepEqual(content[0].getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });
            test.ok(!content[1]);
            test.deepEqual(content[2].getLocaleData(), {
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
            test.done();
        });
    },

    testLoadFilesAsyncMultiple: function(test) {
        test.expect(4);

        var loader = LoaderFactory();
        loader.setAsyncMode();

        var promise = loader.loadFiles([
            "root.js",
            "en-US.js",
            "de-DE.js"
        ]);
        promise.then((content) => {
            test.equal(content.length, 3);
            test.deepEqual(content[0].getLocaleData(), {
               "root": {
                   "localeinfo": {
                       "thousandsSeparator": ",",
                       "decimalSeparator": ".",
                       "clock": "24",
                       "timezone": "Etc/UTC"
                   }
               }
            });
            test.deepEqual(content[1].getLocaleData(), {
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
            test.deepEqual(content[2].getLocaleData(), {
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
            test.done();
        });
    }
};
