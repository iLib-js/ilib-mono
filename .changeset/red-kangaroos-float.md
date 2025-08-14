---
"ilib-lint": patch
---

- Fix quote handling for Swedish and Italian
  - Quotes are optional in those languages for many places
    where were would use quotes in English
  - The rule now checks for the presence of quotes in the
    source and target, and if the quotes are not present
    in the target, no Result is generated. (For other locales
    a result is generated for this case.) If the quotes are
    present in the target, they must be the native quotes.
    They cannot be the ascii ones.
