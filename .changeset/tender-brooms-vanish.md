---
"ilib-lint": patch
---

- Fixed a bug where the parameter to the resource-state-checker
  rule was not being used properly, making it impossible to check
  for any state other than the default "translated".
