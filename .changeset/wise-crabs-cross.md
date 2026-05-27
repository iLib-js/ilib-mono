---
"ilib-lint": patch
---

`resource-sentence-ending`: Added global exception list support. Strings specified under top-level `exceptions` in the rule config are now skipped for all locales, making it easy to exclude strings that end with a period as part of the name rather than as sentence-ending punctuation. Exception storage was also refactored from `Array` to `Set` for deduplication and O(1) lookup performance.
