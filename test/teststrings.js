/*
 * teststrings.js - test the String object
 *
 * Copyright © 2012-2021, JEDLSoft
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

import * as JSUtils from '../src/JSUtils.js';

export const testStrings = {
    testCodePointToUTF: function(test) {
        test.expect(3);
        var str = JSUtils.fromCodePoint(0x10302);
    
        test.equal(str.length, 2);
        test.equal(str.charCodeAt(0), 0xD800);
        test.equal(str.charCodeAt(1), 0xDF02);
        test.done();
    },
    
    testCodePointToUTFLast: function(test) {
        test.expect(3);
        var str = JSUtils.fromCodePoint(0x10FFFD);
    
        test.equal(str.length, 2);
        test.equal(str.charCodeAt(0), 0xDBFF);
        test.equal(str.charCodeAt(1), 0xDFFD);
        test.done();
    },
    
    testCodePointToUTFFirst: function(test) {
        test.expect(3);
        var str = JSUtils.fromCodePoint(0x10000);
    
        test.equal(str.length, 2);
        test.equal(str.charCodeAt(0), 0xD800);
        test.equal(str.charCodeAt(1), 0xDC00);
        test.done();
    },
    
    testCodePointToUTFBeforeFirst: function(test) {
        test.expect(2);
        var str = JSUtils.fromCodePoint(0xFFFF);
    
        test.equal(str.length, 1);
        test.equal(str.charCodeAt(0), 0xFFFF);
        test.done();
    },
    
    testCodePointToUTFNotSupplementary: function(test) {
        test.expect(2);
        var str = JSUtils.fromCodePoint(0x0302);
    
        test.equal(str.length, 1);
        test.equal(str.charCodeAt(0), 0x0302);
        test.done();
    },
};