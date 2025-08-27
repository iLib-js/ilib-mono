---
"ilib-lint": patch
---

Introduced a hardcoded limit on the number of autofixing iterations that can be performed on a single IntermediateRepresentation. This prevents infinite loops in case of conflicting (or otherwise unsafe) Rules.
