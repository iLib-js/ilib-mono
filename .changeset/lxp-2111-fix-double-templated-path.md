---
"ilib-loctool-json": patch
---

Fixed `getResourceFile` re-templating an already-final path when a caller (such as `ilib-loctool-regex` delegating output via `resourceFileTypes`) supplied one, producing incorrect nested paths like `resources/ja/JP/ja.json` instead of `resources/ja.json`. A path passed explicitly is now used as-is; the path is only computed from this plugin's own mapping when none is given. `JsonFile.localize()` now passes its own computed localized path to the delegate instead of the raw source path.
