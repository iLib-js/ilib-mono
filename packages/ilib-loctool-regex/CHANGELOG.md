# ilib-loctool-regex

## 1.1.2

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.1.1

### Patch Changes

- 4b14226: - Updated to use latest ilib-localematcher package
- Updated dependencies [4b14226]
  - ilib-tools-common@1.21.4

## 1.1.0

### Minor Changes

- e6c3ddd: - Added the ability to specify the escaping style for
  strings that are extracted by the regular expressions
  - supports all escaping styles published by
    ilib-tools-common
  - supports extra "none" style to turn off unescaping

### Patch Changes

- f76a112: - Fixed a bug where an empty source string derails
  the parsing of the rest of the file. Now, it skips
  the match it found with the empty source and
  continues parsing after that.

## 1.0.0

### Major Changes

- 56503ce: - Added a regular expression-based parser to extract localizable
  strings from any type of textual source file such as php, java,
  or javascript.
  - Regular expressions are given in the project.json config file
    plus some configuration instructing loctool how to construct
    Resource instances out of the regex match results.
