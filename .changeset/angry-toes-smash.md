---
"ilib-lint": minor
---

- Add a rule that checks for single quotes used as apostrophes in the middle of words
  - Fix converts them to actual Unicode apostrophes
  - Don't check for single quotes at the beginning or ending of words because we can't
    really tell if they are used as apostrophes or as actual quote characters
