// Add missing Jest functions
window.test = window.it;
window.test.each = (inputs) => (testName, test) =>
  inputs.forEach((args) => window.it(testName, () => test(...args)));
window.test.todo = function () {
  return undefined;
};

window.expect.assertions = (num) => { return undefined; };

