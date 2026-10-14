# ilib-loctool-mrkdwn

## 1.0.4

### Patch Changes

- 598e3e8: - Fixed a bug where strings whose values contained escaped quotes (`\"` or `\'`)
  were silently skipped during extraction, so they were never sent for
  translation and were missing from the localized files.
  - Fixed decoding of escape sequences. Keys and values containing escape
    sequences (including `\\`, `\uXXXX`, `\xXX`, `\/`) are now decoded, so
    `"C:\\new"` is no longer extracted as a backslash followed by a newline.
    Affected values get new source text and need to be translated again, and
    affected keys get new resource IDs.
  - Fixed a bug where an empty single-quoted value (`'key': ''`) stopped the
    parsing of the rest of the file.
  - Keys may now contain escaped quotes too.

## 1.0.3

### Patch Changes

- 5ec8679: Added missing dependency on ilib.
- Updated dependencies [ae2549a]
  - message-accumulator@3.0.2
  - ilib-tree-node@2.0.1

## 1.0.2

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - message-accumulator@3.0.1

## 1.0.1

- Fixed a bug where the "outputStyle" setting was not behaving as documented above

## 1.0.0

- Initial release
