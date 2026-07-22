---
"ilib-ctype": minor
---

- add hasUCDCharProperty to return whether or not a particular
  Unicode char has the Unicode character property defined in
  the Unicode Character Database (UCD)
- Accepts property codes like "Mn" as well as the property's
  long name like "Nonspacing_Mark"
- Reuses the data in the ctype\_\*.js files, BUT hides their
  definitions so we can refactor everything later if we wish
