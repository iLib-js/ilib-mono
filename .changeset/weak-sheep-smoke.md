---
"ilib-tools-common": minor
---

- Split formatPath into formatPath and formatLocaleParams
  - this way we can format template strings with locale substitutions
    in it without treating the whole string as a path
