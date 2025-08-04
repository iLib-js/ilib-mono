---
"ilib-lint": minor
---

- Added the ability to specify exceptions to the
  resource-icu-plural-translated rule so that it does not produce
  warnings for those exception words and phrases. Now you can list
  the exceptions by locale in the parameters to the rule:

  "rulesets": {
  "myruleset": {
  "resource-icu-plural-translated": {
  "exceptions": {
  "it-IT": ["File", "Files"]
  }
  }
  }
  }
