---
"ilib-loctool-json": minor
---

- Added support for `resourceFileTypes` configuration to delegate output writing to a
  different plugin. When a `resourceFileTypes` mapping exists for "json" in the project
  configuration, the plugin will use the configured resource file type plugin to write
  localized files instead of writing JSON directly. This allows using plugins like
  `ilib-loctool-javascript-resource` to add custom headers/footers to the output.
