/*
 * testsearch.js - test the search utility routines
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

import * as SearchUtils from '../src/SearchUtils';

function strcmp(left, right) {
    return left.localeCompare(right);
}

export const testSearch = {
    testBsearch: function(test) {
        test.expect(1);
        var array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        
        test.equal(SearchUtils.bsearch(10, array), 5);
        test.done();
    },
    
    testBsearchEmptyArray: function(test) {
        test.expect(1);
        var array = [];
        
        test.equal(SearchUtils.bsearch(10, array), 0);
        test.done();
    },
    
    testBsearchUndefinedArray: function(test) {
        test.expect(1);
        test.equal(SearchUtils.bsearch(10, undefined), -1);
        test.done();
    },
    
    testBsearchUndefinedTarget: function(test) {
        test.expect(1);
        var array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        
        test.equal(SearchUtils.bsearch(undefined, array), -1);
        test.done();
    },
    
    testBsearchBefore: function(test) {
        test.expect(1);
        var array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        
        test.equal(SearchUtils.bsearch(0, array), 0);
        test.done();
    },
    
    testBsearchAfter: function(test) {
        test.expect(1);
        var array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        
        test.equal(SearchUtils.bsearch(20, array), 10);
        test.done();
    },
    
    testBsearchExact: function(test) {
        test.expect(1);
        var array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        
        // place it right after the exact match
        test.equal(SearchUtils.bsearch(15, array), 7);
        test.done();
    },
    
    testBsearchExactBeginning: function(test) {
        test.expect(1);
        var array = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        
        // place it right after the exact match
        test.equal(SearchUtils.bsearch(0, array), 0);
        test.done();
    },
    
    testBsearchExactEnd: function(test) {
        test.expect(1);
        var array = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        
        // place it right after the exact match
        test.equal(SearchUtils.bsearch(19, array), 10);
        test.done();
    },
    
    testBsearchMonthEdge: function(test) {
        test.expect(1);
        var array = [0,31,60,91,121,152,182,213,244,274,305,335,366];
        
        test.equal(SearchUtils.bsearch(182, array), 6);
        test.done();
    },
    
    testBsearchStrings: function(test) {
        test.expect(1);
        var array = [
            "barley", 
            "cardomum", 
            "eggs", 
            "garlic", 
            "jackfruit", 
            "limes", 
            "orange", 
            "quince", 
            "spaghetti", 
            "veal"
        ];
        
        test.equal(SearchUtils.bsearch("mango", array, strcmp), 6);
        test.done();
    },
    
    testBsearchStringsBefore: function(test) {
        test.expect(1);
        var array = [
            "barley", 
            "cardomum", 
            "eggs", 
            "garlic", 
            "jackfruit", 
            "limes", 
            "orange", 
            "quince", 
            "spaghetti", 
            "veal"
        ];
        
        test.equal(SearchUtils.bsearch("apple", array, strcmp), 0);
        test.done();
    },
    
    testBsearchStringsAfter: function(test) {
        test.expect(1);
        var array = [
            "barley", 
            "cardomum", 
            "eggs", 
            "garlic", 
            "jackfruit", 
            "limes", 
            "orange", 
            "quince", 
            "spaghetti", 
            "veal"
        ];
        
        test.equal(SearchUtils.bsearch("zucchini", array, strcmp), 10);
        test.done();
    },
    
    testBisectionSearchSimple: function(test) {
        var actual = SearchUtils.bisectionSearch(16, 0, 10, 1e-12, function linear(x) {
            return 2 * x + 5;
        });
        test.expect(1);
        test.roughlyEqual(actual, 5.5, 1e-12);
        test.done();
    },
    
    testBisectionSearchMoreComplex: function(test) {
        var actual = SearchUtils.bisectionSearch(16, 0, 10, 1e-12, function square(x) {
            return x * x;
        });
        test.expect(1);
        test.roughlyEqual(actual, 4, 1e-12);
        test.done();
    },
    
    testBisectionSearchTrig: function(test) {
        var actual = SearchUtils.bisectionSearch(0.5, 0, 90, 1e-11, function sinInDegrees(x) {
            return Math.sin(x * Math.PI / 180);
        });
        test.expect(1);
        test.roughlyEqual(actual, 30, 1e-9);
        test.done();
    },
    
    testBisectionSearchVeryComplex: function(test) {
        var actual = SearchUtils.bisectionSearch(0, -0.9, 0, 1e-13, function polynomial(x) {
            var coeff = [2, 5, 3];
            var xpow = 1;
            var ret = 0;
            for (var i = 0; i < coeff.length; i++) {
                ret += coeff[i] * xpow;
                xpow *= x;
            }
            return ret;
        });
        test.roughlyEqual(actual, -0.66666666666666, 1e-13);
        test.done();
    }
};
