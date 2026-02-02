# ilib-lint-javascript

## 1.1.0

### Minor Changes

- c451d9a: Export and use the resource-ilib-plural-categories-checker rule

  - it was not exported from the index.js nor mentioned in the ruleset, but now it is both
  - Added more unit tests to verify that it is ready to use and found one bug that was fixed
  - Made it gracefully handle plural resources
    - These should never have ICU plurals inside of them. Plurals within a plural category is not useful!

### Patch Changes

- Updated dependencies [1f44881]
  - ilib-tools-common@1.21.0

## 1.0.0

### Major Changes

- 9c03b14: - New linter plugin for javascript-based stacks
  - Added new rules:
    - resource-ilib-plural-syntax-checker - check ilib-style plurals like `one#singular string|other#plural string`
    - resource-ilib-plural-categories-checker - check ilib-style plurals contain the right plural categories in the target for the target locale
  - Added new rulesets:
    - ilib - for JS/ilib stacks
