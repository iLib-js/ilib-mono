---
"ilib-lint-python-gnu": patch
"ilib-tools-common": patch
"ilib-lint-common": patch
"ilib-lint-python": patch
"ilib-data-utils": patch
"ilib-lint-react": patch
"ilib-assemble": patch
"ilib-lint": patch
"tmxtool": patch
---

Unified package entrypoint definitions. This should help resolve edge cases where older packages (like Jest 26) were unable to correctly load some of them.
