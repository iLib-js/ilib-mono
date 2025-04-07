---
"ilib-tools-common": minor
---

- Add getLanguagePluralCategories function to return an
  array of plural category names for the given ISO 639
  language code.
  - returns the categories from CLDR 47.0.0
  - example: "pl" -> ["one", "few", "many", "other"]
