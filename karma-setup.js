// the jest.fn() API
// import jest from "jest";
// The matchers API
// import {expect, jest, test, beforeAll, beforeEach, afterAll, afterEach} from 'jest-without-globals';

// Add missing Jest functions
window.test = window.it;
window.test.each = (inputs) => (testName, test) =>
  inputs.forEach((args) => window.it(testName, () => test(...args)));
window.test.todo = function () {
  return undefined;
};

window.expect.assertions = (num) => { return undefined; };

/*
window.jest = jest;
window.expect = expect;
window.beforeAll = beforeAll;
window.beforeEach = beforeEach;
window.afterAll = afterAll;
window.afterEach = afterEach;
*/