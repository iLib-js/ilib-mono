---
"ilib-lint": minor
---

- Fix resource-sentence-ending rule to reduce false positives
  - If the source ends in non-sentence-ending punctuation or
    no punctuation at all, then do not flag and remove the
    non-sentence-ending punctuation from the target, even if
    it is different
- Added support for Bengali sentence-ending punctuation
  - A regular western period was incorrectly used instead of
    the Bengali period (danda) 
