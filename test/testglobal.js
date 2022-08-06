/*
 * testJSUtils.js - test the ilibCommon common
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

import * as JSUtils from '../src/JSUtils.js';

export const testGlobal = {
    testIsArrayNewArrayObj: function(test) {
        test.expect(1);
        var a = new Array();
        test.ok(JSUtils.isArray(a));
        test.done();
    },
    
    testIsArrayNewArrayBrackets: function(test) {
        test.expect(1);
        var a = [];
        test.ok(JSUtils.isArray(a));
        test.done();
    },
    
    testIsArrayObject: function(test) {
        test.expect(1);
        var a = {foo:234};
        test.ok(!JSUtils.isArray(a));
        test.done();
    },
    
    testIsArrayObjectWithNumericProperties: function(test) {
        test.expect(1);
        var a = {"0": "d", "1": "c"};
        test.ok(!JSUtils.isArray(a));
        test.done();
    },
    
    testIsArrayNumber: function(test) {
        test.expect(1);
        var a = 234;
        test.ok(!JSUtils.isArray(a));
        test.done();
    },
    
    testIsArrayString: function(test) {
        test.expect(1);
        var a = "asdf";
        test.ok(!JSUtils.isArray(a));
        test.done();
    },
    
    testIsArrayNull: function(test) {
        test.expect(1);
        var a = null;
        test.ok(!JSUtils.isArray(a));
        test.done();
    },
    
    testIsArrayUndefined: function(test) {
        test.expect(1);
        var a = undefined;
        test.ok(!JSUtils.isArray(a));
        test.done();
    },
    
    testExtendSimple: function(test) {
        test.expect(1);
        var object1 = {"a": "A", "b": "B"},
            object2 = {"c": "C", "d": "D"};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": "A", "b": "B", "c": "C", "d": "D"});
        test.done();
    },
    
    testExtendReturnObject1: function(test) {
        test.expect(1);
        var object1 = {"a": "A", "b": "B"},
            object2 = {"c": "C", "d": "D"};
        
        var x = JSUtils.extend(object1, object2);
        test.equal(x, object1);
        test.done();
    },
    
    testExtendArrays: function(test) {
        test.expect(1);
        var object1 = {"a": ["b", "c"]},
            object2 = {"a": ["d"]};
       
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": ["b", "c", "d"]});
        test.done();
    },
    
    testExtendArraysDups: function(test) {
        test.expect(1);
        var object1 = {"a": ["b", "c"]},
            object2 = {"a": ["c", "d"]};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": ["b", "c", "c", "d"]});
        test.done();
    },
    
    testExtendArraysEmptySource: function(test) {
        test.expect(1);
        var object1 = {"a": []},
            object2 = {"a": ["d"]};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": ["d"]});
        test.done();
    },
    
    testExtendArraysEmptyTarget: function(test) {
        test.expect(1);
        var object1 = {"a": ["b", "c"]},
            object2 = {"a": []};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": ["b", "c"]});
        test.done();
    },
    
    testExtendArraysIncongruentTypes1: function(test) {
        test.expect(1);
        var object1 = {"a": ["b", "c"]},
            object2 = {"a": "d"};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": "d"});
        test.done();
    },
    
    testExtendArraysIncongruentTypes2: function(test) {
        test.expect(1);
        var object1 = {"a": "b"},
            object2 = {"a": ["d"]};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": ["d"]});
        test.done();
    },
    
    testExtendSimpleProperty: function(test) {
        test.expect(1);
        var object1 = {"a": "A", "b": "B"},
            object2 = {"b": "X"};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": "A", "b": "X"});
        test.done();
    },
    
    testExtendComplexProperty: function(test) {
        test.expect(1);
        var object1 = {"a": "A", "b": {"x": "B"}},
            object2 = {"b": "X"};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": "A", "b": "X"});
        test.done();
    },
    
    testExtendSubobjects: function(test) {
        test.expect(1);
        var object1 = {"b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N"}};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"b": {"x": "M", "y": "N"}});
        test.done();
    },
    
    testExtendSubobjectsLeaveObj1PropsUntouched: function(test) {
        test.expect(1);
        var object1 = {"a": "A", "b": {"x": "X", "y": "Y", "z": "Z"}},
            object2 = {"b": {"x": "M", "y": "N"}};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}});
        test.done();
    },
    
    testExtendSubobjectsAddProps: function(test) {
        test.expect(1);
        var object1 = {"a": "A", "b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N", "z": "Z"}};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}});
        test.done();
    },
    
    testExtendSubobjectsAddProps: function(test) {
        test.expect(1);
        var object1 = {"a": "A", "b": {"x": "X", "y": "Y"}},
            object2 = {"b": {"x": "M", "y": "N", "z": "Z"}};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": "A", "b": {"x": "M", "y": "N", "z": "Z"}});
        test.done();
    },
    
    testExtendBooleans: function(test) {
        test.expect(1);
        var object1 = {"a": true, "b": true},
            object2 = {"b": false};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": true, "b": false});
        test.done();
    },
    
    testExtendAddBooleans: function(test) {
        test.expect(1);
        var object1 = {"a": true, "b": true},
            object2 = {"c": false};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": true, "b": true, "c": false});
        test.done();
    },
    
    testExtendNumbers: function(test) {
        test.expect(1);
        var object1 = {"a": 1, "b": 2},
            object2 = {"b": 3};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": 1, "b": 3});
        test.done();
    },
    
    testExtendNumbersWithZero: function(test) {
        test.expect(1);
        var object1 = {"a": 1, "b": 2},
            object2 = {"b": 0};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": 1, "b": 0});
        test.done();
    },
    
    testExtendNumbersAddZero: function(test) {
        test.expect(1);
        var object1 = {"a": 1, "b": 2},
            object2 = {"c": 0};
        
        JSUtils.extend(object1, object2);
        test.deepEqual(object1, {"a": 1, "b": 2, "c": 0});
        test.done();
    }
};
