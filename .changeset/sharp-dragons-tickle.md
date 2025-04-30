---
"ilib-lint": minor
---

- Added ability to count source words
  - Added support from FileStats for source words
  - Added support to most results to output the locale of the result
    so we can slice and dice by locale if necessary
  - Added tests for XliffParser to make sure it is producing the right
    file stats
  - Added support in the json formatter for source words and for
    target locales of results
