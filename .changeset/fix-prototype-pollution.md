---
"ilib-common": patch
---

fix(ilib-common): prevent prototype pollution in JSUtils functions

Added `isSafeKey()` helper to block dangerous keys (`__proto__`, `constructor`, `prototype`) 
from being processed in `extend()`, `extend2()`, `merge()`, `deepCopy()`, and `shallowCopy()` 
functions. This prevents CWE-1321 prototype pollution attacks.
