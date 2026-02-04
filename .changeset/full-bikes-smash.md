---
"loctool": patch
---

Refactor XliffSelect for improved deduplication and cleanup
- Expand `tuHash()` to include additional fields: `datatype`, `flavor`, `context`, and `source`
- Remove redundant logic for handling `settings.exclude` with multiple input files
