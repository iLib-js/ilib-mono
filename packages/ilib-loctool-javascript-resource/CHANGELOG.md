# ilib-loctool-javascript-resource

## 1.1.2

### Patch Changes

- 604565d: Fix json plugin to localize anyOf or oneOf properly

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

## 1.1.1

### Patch Changes

- 86ccd9c: - Fixed a bug where the header/footer was treated like a path
  - if your header or footer included slashes, the whole
    thing would become normalized as a path when reality, it
    should just stay as it is.
  - eg. // this is a header became / this is a header
    because the normalize would get rid of the double slashes

## 1.1.0

### Minor Changes

- a377dd2: - Add the ability to specify a header and footer in
  the output js file:

  - Use the same replacements as in output paths
    (See loctool utils.formatPath() for details.)

  ```json
  {
    "settings": {
      "javascript": {
        "header": "const strings_[language] = ",
        "footer": "export default strings_[language];\n"
      }
    }
  }
  ```

## 1.0.7

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.

## 1.0.5

- update dependencies

## 1.0.4

- Add the ability to specify the locale to the JavaScriptResourceFileType.newFile() method
- Add the ability to specify the path name of the caller has already calculated what it
  should be. This is so that the caller can implement output mappings and specify the
  output file name for the resource file
- Updated dependencies
- Min version of node is 10 now

## 1.0.3

- Fixed bug where the resource directory generate incorrectly.

## 1.0.1

- Fixed bug where JavscriptResourceFileType.getExtracted and getNew and getPseudo were returning
  undefined instead of an empty translation set.

## 1.0.0

- Initial release
