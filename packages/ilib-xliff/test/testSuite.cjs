/*
 * testSuite.js - test suite for this directory under commonjs versions
 * of nodejs
 *
 * Copyright © 2022, JEDLSoft
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

// this processes all subsequent requires using babel
process.env.BABEL_ENV = "test";
require("@babel/register")({
    presets: [
        '@babel/preset-env',
    ],
    compact: false,
    minified: false,
    plugins: [
        ["module-resolver", {
            "root": "test",
            // map the src dir to the lib dir so we can
            // test the commonjs code
            "alias": {
                "../src": "../lib"
            }
        }]
    ]
});

// call the ESM tests and use babel to make this version of node
// be able to run it
require("./testSuite.js");
