---
"ilib-lint": patch
---

- Fixed a bug where the parameter to the resource-state-checker
  rule was not being used properly, making it impossible to check
  for any state other than the default "translated".
- Fixed tests and the rule manager to pass the parameters from
  the config file properly so that all rules can access parameters
  of any type, including string.
