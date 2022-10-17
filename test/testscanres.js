/*
 * testscanres.js - test the resource file scanner
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

import scanResources from '../src/scanres.js';

export const testScanResources = {
    testScanResourcesDir: function(test) {
        test.expect(1);
        scanResources("test/testfiles/resources", {quiet: true}).then(data => {
            let expected = {
                "root": {
                    "strings": {
                        "a": "b"
                    }
                },
                "de": {
                    "strings": {
                        "a": "b de"
                    }
                },
                "de-DE": {
                    "strings": {
                        "a": "b de-DE"
                    }
                },
                "en": {
                    "strings": {
                        "a": "x"
                    }
                }
            };
            test.deepEqual(data, expected);

            test.done();
        });
    },

    testScanResourcesDirSubdir: function(test) {
        test.expect(1);
        scanResources("test/testfiles/resources/de", {quiet: true}).then(data => {
            let expected = {
                "root": {
                    "strings": {
                        "a": "b de"
                    }
                },
                "DE": {
                    "strings": {
                        "a": "b de-DE"
                    }
                }
            };
            test.deepEqual(data, expected);

            test.done();
        });
    },

    testScanResourcesDirBogusDir: function(test) {
        test.expect(1);
        scanResources("test/testfiles/resources34534", {quiet: true}).then(data => {
            let expected = {};
            test.deepEqual(data, expected);

            test.done();
        });
    },

    testScanResourcesDirWithNonStrings: function(test) {
        test.expect(1);
        scanResources("test/testfiles/resources2", {quiet: true}).then(data => {
            let expected = {
                "root": {
                    "strings": {
                        "a": "b"
                    },
                    "foobar": {
                       "test": "foobar"
                    },
                    "ilibmanifest": {
                        "files": [
                            "en/strings.json",
                            "ko/strings.json",
                            "strings.json"
                        ]
                    }
                },
                "ko": {
                    "strings": {
                        "a": "b ko"
                    }
                },
                "en": {
                    "strings": {
                        "a": "b en"
                    }
                },
            };
            test.deepEqual(data, expected);

            test.done();
        });
    },


};
