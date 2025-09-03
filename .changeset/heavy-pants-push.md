---
"ilib-lint": patch
---

- fix incorrect fixes in the sentence-ending punctuation rule that extended past the end of the string
  - add differentiation between question mark, exclamation point, colon vs. period and ellipsis.
    - the first group gets a narrow non-breaking space in front of it, whereas the second group does not
  - make the French rule only apply to Euro locales
    - Canadian French for example does not follow the Euro French spacing rules
  - harmonize the description field to be similar for all cases
