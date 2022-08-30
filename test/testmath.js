/*
 * testmath.js - test the math utility routines
 * 
 * Copyright © 2012-2015, 2017-2019, 2021-2022 JEDLSoft
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

import Locale from 'ilib-locale';

import * as Utils from '../src/Utils.js';
import * as MathUtils from '../src/MathUtils.js';
import * as JSUtils from '../src/JSUtils.js';
import ISet from '../src/ISet.js';

function strcmp(left, right) {
    return left.localeCompare(right);
}

let set = new ISet();

export const testMathUtils = {
    testModSimple: function(test) {
        test.expect(1);
        test.equal(MathUtils.mod(2, 4), 2);
        test.done();
    },
    
    testModWrap: function(test) {
        test.expect(1);
        test.equal(MathUtils.mod(6, 4), 2);
        test.done();
    },
    
    testModWrapNeg: function(test) {
        test.expect(1);
        test.equal(MathUtils.mod(-6, 4), 2);
        test.done();
    },
    
    testModZeroModulus: function(test) {
        test.expect(1);
        test.equal(MathUtils.mod(6, 0), 0);
        test.done();
    },
    
    testModZeroNum: function(test) {
        test.expect(1);
        test.equal(MathUtils.mod(0, 6), 0);
        test.done();
    },
    
    testModReal: function(test) {
        test.expect(1);
        let actual = MathUtils.mod(2.234231, 4);
        test.roughlyEqual(actual, 2.234231, 0.0000001);
        test.done();
    },
    testModRealWrap: function(test) {
        test.expect(1);
        let actual = MathUtils.mod(6.234231, 4);
        test.roughlyEqual(actual, 2.234231, 0.0000001);
        test.done();
    },
    testModRealNeg: function(test) {
        test.expect(1);
        let actual = MathUtils.mod(-6.3, 4);
        test.roughlyEqual(actual, 1.7, 0.0000001);
        test.done();
    },
    
    testAmodSimple: function(test) {
        test.expect(1);
        test.equal(MathUtils.amod(2, 4), 2);
        test.done();
    },
    
    testAmodWrap: function(test) {
        test.expect(1);
        test.equal(MathUtils.amod(6, 4), 2);
        test.done();
    },
    
    testAmodWrapNeg: function(test) {
        test.expect(1);
        test.equal(MathUtils.amod(-6, 4), 2);
        test.done();
    },
    
    testAmodZeroModulus: function(test) {
        test.expect(1);
        test.equal(MathUtils.amod(6, 0), 0);
        test.done();
    },
    
    testAmodZeroNum: function(test) {
        test.expect(1);
        test.equal(MathUtils.amod(0, 6), 6);
        test.done();
    },
    
    testAmodReal: function(test) {
        test.expect(1);
        let actual = MathUtils.amod(2.234231, 4);
        test.roughlyEqual(actual, 2.234231, 0.0000001);
        test.done();
    },
    testAmodRealWrap: function(test) {
        test.expect(1);
        let actual = MathUtils.amod(6.234231, 4);
        test.roughlyEqual(actual, 2.234231, 0.0000001);
        test.done();
    },
    testAmodRealNeg: function(test) {
        test.expect(1);
        let actual = MathUtils.amod(-6.3, 4);
        test.roughlyEqual(actual, 1.7, 0.0000001);
        test.done();
    },
    
    testLog10: function(test) {
        test.expect(1);
        test.equal(Math.floor(MathUtils.log10(12345)), 4);
        test.done();
    },

    testLog10two: function(test) {
        test.expect(1);
        test.equal(Math.floor(MathUtils.log10(987654321)), 8);
        test.done();
    },

    testSignificant1: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(12345, 3), 12300);
        test.done();
    },

    testSignificant2: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(12345, 2), 12000);
        test.done();
    },

    testSignificant3: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(12345, 1), 10000);
        test.done();
    },

    testSignificantZero: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(12345, 0), 12345);
        test.done();
    },

    testSignificantNegativeDigits: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(12345, -234), 12345);
        test.done();
    },

    testSignificantNegativeNumber: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(-12345, 4), -12340);
        test.done();
    },

    testSignificantStradleDecimal: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(12.345, 4), 12.35);
        test.done();
    },

    testSignificantLessThanOne: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(0.123456, 2), 0.12);
        test.done();
    },

    testSignificantLessThanOneRound: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(0.123456, 4), 0.1235);
        test.done();
    },

    testSignificantLessThanOneSmall: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(0.000123456, 2), 0.00012);
        test.done();
    },

    testSignificantZero: function(test) {
        test.expect(1);
        test.equal(MathUtils.significant(0, 2), 0);
        test.done();
    },

    testSignumPositive: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum(1), 1);
        test.done();
    },
    
    testSignumPositiveLarge: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum(1345234), 1);
        test.done();
    },
    
    testSignumNegative: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum(-1), -1);
        test.done();
    },
    
    testSignumPositiveLarge: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum(-13234), -1);
        test.done();
    },
    
    testSignumZero: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum(0), 1);
        test.done();
    },
    
    testSignumStringNumberPositive: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum("1345234"), 1);
        test.done();
    },
    
    testSignumStringNumberNegative: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum("-1345234"), -1);
        test.done();
    },
    
    testSignumUndefined: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum(), 1);
        test.done();
    },
    
    testSignumNull: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum(null), 1);
        test.done();
    },
    
    testSignumStringNonNumber: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum("rafgasdf"), 1);
        test.done();
    },
    
    testSignumBoolean: function(test) {
        test.expect(2);
        test.equal(MathUtils.signum(true), 1);
        test.equal(MathUtils.signum(false), 1);
        test.done();
    },
    
    testSignumFunction: function(test) {
        test.expect(1);
        test.equal(MathUtils.signum(function () { return -4; }), 1);
        test.done();
    },
};
