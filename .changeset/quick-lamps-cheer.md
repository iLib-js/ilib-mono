---
"loctool": patch
---

Fixed webOS xliff style dropping a unit's `name` attribute when it equalled the
source text. An explicit `name` is now always preserved on serialization.
