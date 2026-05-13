---
"ilib-lint": patch
---

- Fix false violations in ResourceSentenceEnding when source ends with call-out style quotes (e.g. `select 'Manual Zoom.'`).  
The rule now correctly distinguishes call-out references from person quotations (`She said, "Hello!"`) and compares overall sentence endings instead of only the quoted content.

