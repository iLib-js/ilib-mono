---
"ilib-lint": patch
---

- fixed ansi console formatter to not throw exceptions
  if the Result object it is trying to format doesn't have
  all of the properties it is expecting to find.
- handle sentence ending rule much better
  - fixed the handling of its customization in the config
    file so that it can have customized sentence ending
    punctuation per locale
  - fix highlight field in the Result instances produced
  - handles quoted strings better
  - better highlight string
