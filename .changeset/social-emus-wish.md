---
"ilib-loctool-json": patch
---

Fix json plugin to localize anyOf or oneOf properly

- If there was anyOf or oneOf in the schema, it would sometimes
  localize the json object as a string instead of as an object.
