---
"ilib-lint-common": minor
---

- Added "param" property to the constructor of a Rule
  - gives the parameters from the ilib-lint-config file
  - preserves the type of the parameter
  - previously, it was ambiguous how the parameters
    would get passed to the rule constructor
