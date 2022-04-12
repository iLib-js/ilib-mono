/*
 * MathUtils.js - Misc math utility routines
 *
 * Copyright © 2013-2015, 2018, 2022 JEDLSoft
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
 * @module MathUtils
 */

/**
 * Return the sign of the given number. If the sign is negative, this function
 * returns -1. If the sign is positive or zero, this function returns 1.
 * @static
 * @param {number} num the number to test
 * @return {number} -1 if the number is negative, and 1 otherwise
 */
export function signum(num) {
    var n = num;
    if (typeof(num) === 'string') {
        n = parseInt(num, 10);
    } else if (typeof(num) !== 'number') {
        return 1;
    }
    return (n < 0) ? -1 : 1;
};

/**
 * @static
 * @protected
 * @param {number} num number to round
 * @return {number} rounded number
 */
export function floor(num) {
    return Math.floor(num);
};

/**
 * @static
 * @protected
 * @param {number} num number to round
 * @return {number} rounded number
 */
export function ceiling(num) {
    return Math.ceil(num);
};

/**
 * Round a number towards 0.
 *
 * @param {number} num number to round
 * @return {number} rounded number
 */
export function down(num) {
    return (num < 0) ? Math.ceil(num) : Math.floor(num);
};

/**
 * Round a number away from 0.
 *
 * @param {number} num number to round
 * @return {number} rounded number
 */
export function up(num) {
    return (num < 0) ? Math.floor(num) : Math.ceil(num);
};

/**
 * Round a number up away from 0 if it is half way or larger, otherwise
 * round down.
 *
 * @param {number} num number to round
 * @return {number} rounded number
 */
export function halfup(num) {
    return (num < 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
};

/**
 * Round a number down towards 0 if it is half way or smaller, otherwise
 * round up.
 *
 * @param {number} num number to round
 * @return {number} rounded number
 */
export function halfdown(num) {
    return (num < 0) ? Math.floor(num + 0.5) : Math.ceil(num - 0.5);
};

/**
 * Round numbers up to the closest even number.
 *
 * @param {number} num number to round
 * @return {number} rounded number
 */
export function halfeven(num) {
    return (Math.floor(num) % 2 === 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
};

/**
 * Round numbers up to the closest odd number.
 *
 * @param {number} num number to round
 * @return {number} rounded number
 */
export function halfodd(num) {
    return (Math.floor(num) % 2 !== 0) ? Math.ceil(num - 0.5) : Math.floor(num + 0.5);
};

/**
 * Do a proper modulo function. The Javascript % operator will give the truncated
 * division algorithm, but for calendrical calculations, we need the Euclidean
 * division algorithm where the remainder of any division, whether the dividend
 * is negative or not, is always a positive number in the range [0, modulus).<p>
 *
 * @param {number} dividend the number being divided
 * @param {number} modulus the number dividing the dividend. This should always be a positive number.
 * @return the remainder of dividing the dividend by the modulus.
 */
export function mod(dividend, modulus) {
    if (modulus == 0) {
        return 0;
    }
    var x = dividend % modulus;
    return (x < 0) ? x + modulus : x;
};

/**
 * Do a proper adjusted modulo function. The Javascript % operator will give the truncated
 * division algorithm, but for calendrical calculations, we need the Euclidean
 * division algorithm where the remainder of any division, whether the dividend
 * is negative or not, is always a positive number in the range (0, modulus]. The adjusted
 * modulo function differs from the regular modulo function in that when the remainder is
 * zero, the modulus should be returned instead.<p>
 *
 * @param {number} dividend the number being divided
 * @param {number} modulus the number dividing the dividend. This should always be a positive number.
 * @return the remainder of dividing the dividend by the modulus.
 */
export function amod(dividend, modulus) {
    if (modulus == 0) {
        return 0;
    }
    var x = dividend % modulus;
    return (x <= 0) ? x + modulus : x;
};

/**
 * Return the number with the decimal shifted by the given precision.
 * Positive precisions shift the decimal to the right giving larger
 * numbers, and negative ones shift the decimal to the left giving
 * smaller numbers.
 *
 * @param {number} number the number to shift
 * @param {number} precision the number of places to move the decimal point
 * @returns {number} the number with the decimal point shifted by the
 * given number of decimals
 */
export function shiftDecimal(number, precision) {
    var numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
};

/**
 * Returns the base 10 logarithm of a number. For platforms that support
 * Math.log10() it is used directly. For plaforms that do not, such as Qt/QML,
 * it will be calculated using a polyfill.
 *
 * @param {number} num the number to take the logarithm of
 * @returns {number} the base-10 logarithm of the given number
 */
export function log10(num) {
    if (typeof(Math.log10) === "function") {
        return Math.log10(num);
    }

    return Math.log(num) / Math.LN10;
};

/**
 * Return the given number with only the given number of significant digits.
 * The number of significant digits can start with the digits greater than
 * 1 and straddle the decimal point, or it may start after the decimal point.
 * If the number of digits requested is less than 1, the original number
 * will be returned unchanged.
 *
 * @static
 * @param {number} number the number to return with only significant digits
 * @param {number} digits the number of significant digits to include in the
 * returned number
 * @param {function(number): number=} round a rounding function to use
 * @returns {number} the given number with only the requested number of
 * significant digits
 */
export function significant(number, digits, round) {
    if (digits < 1 || number === 0) return number;
    var rnd = round || Math.round;
    var factor = -Math.floor(log10(Math.abs(number))) + digits - 1;
    return shiftDecimal(rnd(shiftDecimal(number, factor)), -factor);
};
