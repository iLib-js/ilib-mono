---
"ilib-env": patch
---

- Fixed the way the top scope is calculated with top()
  - Make sure to catch exceptions when trying
    to reference "global" which throws on some strict
    platforms
  - Better default path using the ESM "globalThis" if
    everything else fails
