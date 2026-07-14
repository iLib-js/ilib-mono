---
"ilib-assemble": patch
---

Fixed legacy assemble to strip require imports and non-ilib module.exports from minified/compiled ilib sources, so the assembled bundle is valid JS.
