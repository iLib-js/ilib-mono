---
"ilib-lint": minor
---

- Make sure to output locale when formatting results
  - update the Ansi Console formatter to include the locale if it is
    available in the result
  - added a test for the ansi console formatter
  - update the config-based format
