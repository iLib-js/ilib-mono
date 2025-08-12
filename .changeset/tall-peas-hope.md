---
"ilib-lint": patch
---

- Fixed resource-kebab-case rule so that there are no false
  positives for simple hyphenated words
  - now does not complain for simple English words that are
    hyphenated, such as "co-owner" or "share-only"
  - new rule is that there has to be at least 2 dashes in
    the text, and the text can only be letters or numbers
    in order to be considered kebab case
