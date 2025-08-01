---
"ilib-lint": patch
---

- handle sentence ending rule better
  - fixed null pointer exception in the ascii formatter if
    the Result does not have certain fields available
  - fix highlight field in Result
  - handles quoted strings better
  - better highlight string
