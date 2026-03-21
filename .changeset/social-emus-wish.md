---
"ilib-loctool-json": patch
"ilib-loctool-javascript-resource": patch
---

Fix json plugin to localize anyOf or oneOf properly

- If there was anyOf or oneOf in the schema, it would sometimes
  localize the json object as a string instead of as an object.
- `JsonFileType.getResourceFile` now creates resource files at the path
  from the mapping template and target locale (same as `getLocalizedPath`)
  instead of reusing the source file path, so merged translations are
  written to the correct output location.
- `getLocalizedPath` uses `parsePath` / `formatPath` from `ilib-tools-common`
  so template placeholders line up with the source path the same way as
  other loctool file types. `formatPath` still receives `sourcepath` so
  `[filename]` / `[dir]` resolve when the template does not regex-match the
  source (e.g. `src/t1.js` with the default `resources/...` template).
- When `JsonFile` delegates to `ilib-loctool-javascript-resource`, it passes
  the source JSON path into `getResourceFile` for disambiguation. JavaScript
  resource files now treat only `.js` paths as explicit output paths; a
  non-`.js` path still resolves through the javascript `resourceDirs` template.
