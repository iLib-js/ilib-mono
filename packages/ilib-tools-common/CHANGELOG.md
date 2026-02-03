# ilib-tools-common

## 1.21.0

### Minor Changes

- 1f44881: - Split formatPath into formatPath and formatLocaleParams
  - this way we can format template strings with locale substitutions
    in it without treating the whole string as a path

## 1.20.1

### Patch Changes

- ca616ec: Fix an issue where the metadata property was missing from ResourceXliff.

## 1.20.0

### Minor Changes

- 92e0b3a: - The Resource.setState() call now throws an exception if you
  set an invalid state. Valid states are ones defined in the
  xliff 1.2 specification, plus a few nonstandard states for ilib
  and mojito, and custom states which must all have the prefix
  "x-".
  - valid states are: needs-translation, needs-l10n, needs-adaptation,
    translated, needs-review-translation, needs-review-l10n,
    needs-review-adaptation, final, new, signed-off, accepted

## 1.19.1

### Patch Changes

- 3ac309b: Add the xliff option to the ResourceXliff class so that it can be used in instances of ResourceXliff.

## 1.19.0

### Minor Changes

- 32130cf: - Added support for Scala and C++ string escaping and unescaping
  - All Scala string types:
    - scala - Regular single or double-quoted strings ("...")
    - scala-raw - Raw strings like (raw"foo")
    - scala-triple - Triple-quoted strings like ("""foo""")
    - scala-char - Character literals like ('a')
  - All C++ string types:
    - cpp - Regular double-quoted strings ("...")
    - cpp-char - Character literals ('...')
    - cpp-raw - Raw strings (R"(...)") - no escape processing
    - cpp-wide - Wide strings (L"...")
    - cpp-utf8 - UTF-8 strings (u8"...")
    - cpp-utf16 - UTF-16 strings (u"...")
    - cpp-utf32 - UTF-32 strings (U"...")

## 1.18.0

### Minor Changes

- 2f63633: - Add a `metadata` property to the `Resource` class to store any metadata that may exist on a per-Resource basis. It is up to parsers to recognize and parse the metadata appropriately and up to the serializers to serialize it properly again.

## 1.17.0

### Minor Changes

- 64dcd13: - Pushed hashKey() and cleanHashKey() methods up to the superclass
  - All of string, plural, and array resources already
    supported them, but the superclass Resource did not
  - By pushing them up to the superclass, you can rely on the
    being there no which subclass you have a reference to

## 1.16.0

### Minor Changes

- f6c2fc0: - Added resfile support to the Resource class
  - documents which resource file a translation unit
    was read from, if any
  - only defined for resource files like xliff,
    properties, or PO files. It is undefined if the
    trans unit did not come from a resource file.
  - added getResFile() to return the resfile value
  - Added ability for the ResourceXliff file to add
    the resfile property to every Resource read from
    an xliff file

### Patch Changes

- Updated dependencies [f6c2fc0]
  - ilib-xliff@1.4.0

## 1.15.0

### Minor Changes

- 2e65e98: - Add getLanguagePluralCategories function to return an
  array of plural category names for the given ISO 639
  language code.
  - returns the categories from CLDR 47.0.0
  - example: "pl" -> ["one", "few", "many", "other"]

## 1.14.0

### Minor Changes

- c5ee237: - Added Escaper class to the tools library
  - escaperFactory() generates the appropriate escaper instance
    for the given programming language/syntax
  - Escaper.unescape() takes a string as it would be encoded in
    a source file, and transforms it into how it would be
    represented in memory while the program is running
  - Escaper.escape() does the converse
  - original code was extracted from various loctool plugins
  - this library is intended to be used with any loctool or ilib-lint
    plugin so that we do escaping/unescaping the same way no
    matter which plugin we are using

## 1.13.0

### Minor Changes

- 4965315: Added functions convertPluralResToICU and convertICUToPluralRes to convert
  ICU-style plural strings encoded in ResourceString instances into ResourcePlural
  instances and vice-versa
- 32ac524: - added directory walk routines
  - returns a js object that models the file system under the given directory
  - allows for arrays of include and exclude micromatch expressions

## 1.12.2

### Patch Changes

- f9f1095: Unified package entrypoint definitions. This should help resolve edge cases where older packages (like Jest 26) were unable to correctly load some of them.
- ae2549a: Fixed broken links in package metadata.
- Updated dependencies [ae2549a]
  - ilib-xliff@1.2.2

## 1.12.1

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-xliff@1.2.1

## 1.12.0

- Added support for the dnt flag (do not translate) in Resources
  - also for the "translate" flag of translation units

## 1.11.0

- added location information to the TranslationUnit and Resource constructors
  plus a Location class to keep track of the location in the source file
  where the resources come from.

## 1.10.0

- now ships with commonjs code as well as modern ESM in the same package
- updated dependencies

## 1.9.1

- forgot to export the HTML data in the previous version from the main entry point

## 1.9.0

- added data about HTML in the Utils
  - nonBreakingTags - a hash of all HTML tags that do not break a string
  - selfClosingTags - a hash of all HTML tags that are commonly self-closing
  - ignoreTags - a hash of HTML tags where the content is ignored, such as <script>
  - localizableAttributes - a hash of all tags that contain attributes which
    have localizable values

## 1.8.1

- update dependencies
- fixed a bug where the ResourceXliff.getVersion() call was documented to
  return a string, but it came out as a floating point number instead. Made
  it return the string properly.
- converted all unit tests to jest

## 1.8.0

- added parsePath() utility function which takes a template and a path
  and returns an object that maps each template parameter to a part of
  that path
  - getLocaleFromPath() is now re-implemented to use this
    function to find the locale parts of a path

## 1.7.0

- added getLines() method to tell how many lines there are in the xml file
- added support for location information of the start of each resource
  in the original file where the resource instances were read from
  - supports line and character within the line

## 1.6.0

- Added isDirty() method to the Resource class so we can see whether or
  not the resource has been modified since it was first created
  - also added clearDirty() method

## 1.5.0

- Added getVariant method to the TranslationUnit class

## 1.4.0

- Added TranslationUnit and TranslationVariant classes
- added hashKey function to the utilities
- fixed missing import for makeDirs() utility function

## 1.3.0

- Added more utility functions:
  - isEmpty - return whether or not an object is empty
  - cleanString - removing differences that are inconsequential for translation such as leading whitespace
  - makeDirs - create directories on disk
  - containsActualText - test if there is text left over after HTML and entities are stripped
  - objectMap - visitor pattern for objects

## 1.2.0

- Added formatPath and getLocaleFromPath utility function

## 1.1.0

- Added ResourceXliff class (represents an xliff file as a list of Resource instances)
- Added TranslationSet class (sets of Resources)
- Introduced some backwards compatibility support so that this library
  can be used with loctool plugins.
  - added some deprecated methods and accept some deprecated
    constructor parameters

## 1.0.0

- Initial code copied from loctool 2.18.0:
  - Resource
  - ResourceString
  - ResourceArray
  - ResourcePlural
