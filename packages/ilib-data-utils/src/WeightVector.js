/*
 * WeightVector.js - a vector of collation weights
 * 
 * Copyright © 2013, 2018, 2021-2022 JEDLSoft
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


/**
 * @class Create a new weight vector instance.
 */
export default class WeightVector {
    /**
     * Create a new weight vector instance.
     * @constructor
     * @param {Array.<number>|string|number} primary
     * @param {string|number} secondary
     * @param {string|number} tertiary
     * @param {string|number} quaternary
     */
    constructor(primary, secondary, tertiary, quaternary) {
        this.weights = [0, 0, 0, 0];
    
        if (typeof(primary) === 'object') {
            this.weights = primary.concat(this.weights.slice(primary.length));
        } else if (typeof(primary) === 'string') {
            let str = primary.replace(/\]/g, '');
            str = str.replace(/\[/g, '').trim();
    
            if (str.charAt(0) === '.' || str.charAt(0) === '*') {
                // alternate char... what to do about these?
                str = str.substring(1);
                this.alt = true; // what does this mean?
            }
    
            const weights = str.split(/\./g);
            for (var i = 0; i < weights.length; i++) {
                this.weights[i] = (weights[i] && weights[i].length > 0) ? parseInt(weights[i], 16) : 0;
            }
        } else if (typeof(primary) !== 'undefined') {
            this.weights[0] = primary;
            this.weights[1] = secondary;
            this.weights[2] = tertiary;
            this.weights[3] = quaternary;
        }
    }

    set(position, amount) {
        this.weights[position] = amount;
    }

    get(position) {
        return this.weights[position];
    }

    add(position, amount) {
        this.weights[position] += amount;
        for (let i = position + 1; i < 4; i++) {
            this.weights[i] = 0;
        }
    }

    increment(position) {
        this.add(position, 1);
    }

    addPrimary(amount) {
        this.add(0, amount);
    }

    addSecondary(amount) {
        this.add(1, amount);
    }

    addTertiary(amount) {
        this.add(2, amount);
    }

    addQuaternary(amount) {
        this.add(3, amount);
    }

    compare(otherVector) {
        for (let i = 0; i < 4; i++) {
            if (this.weights[i] !== otherVector.weights[i]) {
                return i;
            }
        }
        return -1;
    }

    clone() {
        return new WeightVector(this.weights);
    }

    toString() {
        return JSON.stringify(this.weights);
    }
};
