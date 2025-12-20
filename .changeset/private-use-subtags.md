---
"ilib-locale": minor
---

Add support for BCP-47 private use subtags. The parser now recognizes the private use singleton "x" and preserves the entire private use subtag (e.g., "x-pseudo", "x-sort-phonebook") as the variant, rather than only keeping the last segment.

