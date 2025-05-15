---
"ilib-lint": minor
---

- Implement fix for quote style rule
  - only fixes quotes which exist in the target but are wrong. It cannot
    fix missing quotes because it doesn't know where to put them.
  - quote chars can be separated from the text by a non-breaking space
    (French)
  - can deal with Japanese properly too. ie. Only primary quotes, no
    secondary, but also [square brackets] are accepted as quotes.
- Added fix for a declarative rule resource-no-space-between-double-and-single-byte-character
  - the extra spaces are removed
