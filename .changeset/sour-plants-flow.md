---
"ilib-lint": patch
---

- Fixed bug: now get and use the right locales
  - command-line overrides the config file which overrides the default
  - before, it only ever used the defaults!
