# ilib-po

## 1.1.4

### Patch Changes

- ea53ec0: Fix character escaping in PO message strings

  - Escape backslashes as well as quotes when generating PO output (msgid, msgstr, msgctxt, #k)
  - Unescape backslashes and quotes correctly when parsing PO files
  - Rename `escapeQuotes` / `unescapeQuotes` to `escapeQuotesAndBackslashes` / `unescapeQuotesAndBackslashes` in utils

- Updated dependencies [1f44881]
  - ilib-tools-common@1.21.0

## 1.1.3

### Patch Changes

- 638b54e: - Fixed handling of Polish plural categories in PO files. The categories `one`, `few`, and `many` are now correctly recognized and processed.
  - Added logic to backfill the `many` plural category with the `other` category for Polish when `many` is missing in the incoming `Resource` object.
- Updated dependencies [2e65e98]
  - ilib-tools-common@1.15.0

## 1.1.2

### Patch Changes

- f7435c5: Fixed Parser attempting to use non-existent plural forms definitions - now it properly falls back to English if the form is not defined for a given language.

## 1.1.1

### Patch Changes

- 9cadb43: Fixed syntax errors in generated PO file when there are linebreaks in comments for translators.
- Updated dependencies [c5ee237]
  - ilib-tools-common@1.14.0

## 1.1.0

### Minor Changes

- 0672f4c: - Added the ability to ilib-po to encode ResourceArray resources. The array elements
  are encoded as separate resources with the key of the array resource
  and the index of the array element both encoded in new types of comments
  in the po file. These are po file format extensions which are mostly
  ignored by other po file tools, but are used by the ilib-po parser and
  generator to encode the array elements in a reversible way.
  - The above work with ResourceArray resources now also allow you to add
    a key to each resource that is different than source string. This goes
    for all resource types, not just arrays.
  - Fixed a bug where resources that have comments in them which are not
    in json format were parsed as if they were json. Now the parser will
    only treat comments as json if they start with a '{' character.

### Patch Changes

- ae2549a: Fixed broken links in package metadata.
- Updated dependencies [f9f1095]
- Updated dependencies [ae2549a]
  - ilib-tools-common@1.12.2

## 1.0.1

### Patch Changes

- ff316a5: Fixed a bug where a variable was used before assignment.
- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-tools-common@1.12.1

## 1.0.0

- extracted code and unit tests from ilib-loctool-po
- converted to Typescript
