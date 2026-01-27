---
"ilib-lint-javascript": minor
---

Export and use the resource-ilib-plural-categories-checker rule

- it was not exported from the index.js nor mentioned in the ruleset, but now it is both
- Added more unit tests to verify that it is ready to use and found one bug that was fixed
- Made it gracefully handle plural resources
  - These should never have ICU plurals inside of them. Plurals within a plural category is not useful!
