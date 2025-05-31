---
"ilib-lint": minor
---

- Added auto-fixes for various rules:
  - resource-no-halfwidth-kana-characters
    - map the halfwidth kana to fullwidth kana
    - added test to verify that the fix works
  - resource-no-double-byte-space
    - map most types of space to an ASCII space
    - map the line break character to an ASCII \n
    - map the paragraph break character to ASCII \n\n
    - add tests to verify that all
  - resource-no-space-with-fullwidth-punctuation
    - remove the space before or after the fullwidth punctuation characters
    - modify the current tests to test both before and after. (Previously it was only before.)
    - add tests to verify all that
