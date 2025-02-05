---
"loctool": patch
---

Fix a bug reading multi-level xliff dirs

- if the xliff dir named in the config or the command
  line contained multiple directory levels (as opposed to
  everything being in the root of that xliff dir), the code
  miscalculated the relative path those those resource
  files and therefore could not load them. This is now
  fixed.
