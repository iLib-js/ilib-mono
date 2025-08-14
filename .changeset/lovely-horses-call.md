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
- Fix support for French sentence-ending punctuation
  - In French, you put a non-breaking space between the
    last text and the sentence-ending punctuation
  - This change will ensure that the non-breaking space is
    there. If there is a breaking space, it will be converted to
    a non-breaking space. If there is no space at all, a
    non-breaking space will be added. If there is already a
    non-breaking space, it will not touch it. It will only
    ensure that the sentence-ending punctuation is correct

