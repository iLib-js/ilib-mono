---
"ilib-lint": patch
---

- Fixed a bug where the linter would give a false positive
  if a string in an ICU plural category had no translatable
  text in it, and it was the same as the same category
  string in the source. Now it just ignores it.
- Fixed a bug where the linter would not enforce that all
  category strings in an ICU select have the same set of
  categories in the source and target strings. If there are
  extra or missing strings in the select, it will give results
