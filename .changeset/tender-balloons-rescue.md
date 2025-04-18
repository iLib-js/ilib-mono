---
"ilib-xliff": minor
---

- Added resfile property to translation units
  - the file property gives which original source
    code file the translation unit was extracted from
  - the resfile property gives which xliff file
    the translation unit was in
  - resfile parameter is always set automatically in
    translation units generated from this library
    to document which xliff file they came from

