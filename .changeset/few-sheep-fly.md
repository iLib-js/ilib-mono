---
"ilib-lint": minor
---

- Added the ability to specify exceptions to the
  resource-icu-plural-translated rule.
    - It does not produce warnings for those exception phrases.
      Now you can list the exceptions by locale in the parameters
      to the rule:
      ```
      "rulesets": {
        "myruleset": {
          "resource-icu-plural-translated": {
            "exceptions": {
              "it-IT": ["File", "Files"]
            }
          }
        }
      }
      ```
    - Exceptions are entire phrases, not individual words. The idea
      of the rule is to catch entire plural categories that the
      translators missed, and the idea of the exceptions to avoid
      those few false positives that pop up infrequently.
