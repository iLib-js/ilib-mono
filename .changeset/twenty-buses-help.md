---
"ilib-loctool-json": patch
---

The `localizable` keyword in the JSON schema has been extended to support multiple string values: `"comment"`, `"key"`, and `"source"` in addition to previously supported boolean values.
Boolean values are still supported for backward compatibility. `false` is still a default value for the `localizable` keyword.
Also, for backward compatibility, the `localizable: "source"` keyword is treated as `localizable: true`.
