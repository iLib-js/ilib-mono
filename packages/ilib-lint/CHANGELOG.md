# ilib-lint

## 2.19.0

### Minor Changes

- 0270710: - Add new all capitals rule
  - If the source string contains 2 or more alphabetic letter
    characters and all alphabetic letter characters are upper-case,
    and the target language uses a writing script that also
    supports casing, then the target string should also be in
    all upper-case to echo the style of the source.
  - all characters that are not alphabetic letters are unmodified
  - all strings written in scripts that do not support casing
    are unmodified
  - auto-fix available to automatically replace the target text
    with the upper-cased version of the string. The text is
    upper-cased locale-sensitively using ilib-casemapper.
- 17d0665: - ResourceSentenceEnding rule enhancements to support various exception
  - Added minimumLength configuration option (default: 10) to skip checking short strings/abbreviations
  - Added automatic skipping of strings with no spaces
  - Added exceptions array per locale to skip specific source strings from checking
  - Enhanced punctuation detection for quoted content to handle punctuation after closing quotes
  - Updated rule documentation with new configuration options and examples

### Patch Changes

- d6cb734: - Fixed two bugs in the sentence-ending punctuation rule
  - if the target has a subordinate clause that is iterrogatory, then according to Spanish grammar rules, the inverted punctuation should come mid-sentence right before the clause. Now the rule checks for the inverted punctuation in a better way to handle this.
  - colons in the middle of the string should not be considered sentence-ending punctuation when looking backwards for the inverted punctuation in Spanish
- c43b5cb: - Fixed bug: now get and use the right locales
  - command-line overrides the config file which overrides the default
  - before, it only ever used the defaults!
- Updated dependencies [0270710]
  - ilib-scriptinfo@1.0.0

## 2.18.2

### Patch Changes

- bd9293f: - Fixed a bug in the quote style rule which would cause infinite fix loops
  - Quote detection in the source was not working properly for quote-optional
    languages, such as Italian or Swedish, causing it to apply the same fix
    over and over again
- 4938290: - Fixed a bug where whitespace at the end of the target string would cause problems with the
  sentence-ending punctuation rule
  - Sentence-ending punctuation would not be found if there was one or more whitespace chars
    at the end of the target string. (Source string was okay, though.)
  - Rule now trims the whitespace from the target string before checking it.

## 2.18.1

### Patch Changes

- cd9f188: Fixed ErrorFilterTransformer clearing the dirty flag when all issues have been autofixed
- Updated dependencies [ff57dc9]
  - ilib-ctype@1.3.0

## 2.18.0

### Minor Changes

- f1cebb6: Added new rule to detect XLIFF files with UTF-8 BOM
- 2ff58c2: - Added new rules to validate encoding of the underlying text file - file-encoding rule - check that the file is encoded with the right character set - xliff-header-encoding - check that the xliff header mentions a valid encoding

### Patch Changes

- a164407: Introduced a hardcoded limit on the number of autofixing iterations that can be performed on a single IntermediateRepresentation. This prevents infinite loops in case of conflicting (or otherwise unsafe) Rules.
- 8aaa6fd: - Various result and formatter fixes to give better formatted output
  - make sure all rules are setting the locale field of a Result properly
  - make sure all rules are setting the lineNumber field of a Result properly
  - make sure all rules are getting the pathName from the intermediate representation instead
    of the resource. The intermediate representation contains the name of the xliff file that
    the resource was read from, whereas the resource instance contains
    the path to the original source file where the string was extracted
  - does not divide by zero any more causing incomplete stats table at
    the end of the formatted result output
- Updated dependencies [a164407]
  - ilib-lint-common@3.6.0

## 2.17.1

### Patch Changes

- ea31e0d: Fixed the issue where an incorrect xliff instance was created because the version was not being passed in the XliffSerializer.
- 114eae0: - fix incorrect fixes in the sentence-ending punctuation rule that extended past the end of the string
  - add differentiation between question mark, exclamation point, colon vs. period and ellipsis.
    - the first group gets a narrow non-breaking space in front of it, whereas the second group does not
  - make the French rule only apply to Euro locales
    - Canadian French for example does not follow the Euro French spacing rules
  - harmonize the description field to be similar for all cases
- 9212dff: - Add defensive code to the serializers so they don't
  crash if they are given bogus input
- Updated dependencies [9212dff]
  - ilib-lint-common@3.5.0

## 2.17.0

### Minor Changes

- 445db19: - Add a rule that checks for single quotes used as apostrophes in the middle of words
  - Fix converts them to actual Unicode apostrophes
  - Don't check for single quotes at the beginning or ending of words because we can't
    really tell if they are used as apostrophes or as actual quote characters
- 2a359b6: - Added the ability to specify exceptions to the
  resource-icu-plural-translated rule. - It does not produce warnings for those exception phrases.
  Now you can list the exceptions by locale in the parameters
  to the rule:
  `    "rulesets": {
  "myruleset": {
    "resource-icu-plural-translated": {
      "exceptions": {
        "it-IT": ["File", "Files"]
      }
    }
  }
}` - Exceptions are entire phrases, not individual words. The idea
  of the rule is to catch entire plural categories that the
  translators missed, and the idea of the exceptions to avoid
  those few false positives that pop up infrequently.
- 21b1009: - Fix resource-sentence-ending rule to reduce false positives
  - If the source ends in non-sentence-ending punctuation or
    no punctuation at all, then do not flag and remove the
    non-sentence-ending punctuation from the target, even if
    it is different
  - Added support for Bengali sentence-ending punctuation
    - A regular western period was incorrectly used instead of
      the Bengali period (danda)
  - Fix support for French sentence-ending punctuation
    - In French, you put a non-breaking space between the
      last text and the sentence-ending punctuation
    - This change will ensure that the non-breaking space is
      there. If there is a breaking space, it will be converted to
      a non-breaking space. If there is no space at all, a
      non-breaking space will be added. If there is already a
      non-breaking space, it will not touch it. It will only
      ensure that the sentence-ending punctuation is correct

### Patch Changes

- e6b2896: - Fix quote handling for Swedish and Italian
  - Quotes are optional in those languages for many places
    where were would use quotes in English
  - The rule now checks for the presence of quotes in the
    source and target, and if the quotes are not present
    in the target, no Result is generated. (For other locales
    a result is generated for this case.) If the quotes are
    present in the target, they must be the native quotes.
    They cannot be the ascii ones.
- 2959c54: - Fixed resource-kebab-case rule so that there are no false
  positives for simple hyphenated words
  - now does not complain for simple English words that are
    hyphenated, such as "co-owner" or "share-only"
  - new rule is that there has to be at least 2 dashes in
    the text, and the text can only be letters or numbers
    in order to be considered kebab case
- ba699b7: - Fixed a bug where the unique id of resources was not
  set into the Result object for the
  resource-sentence-ending rule

## 2.16.2

### Patch Changes

- 154b879: - handle sentence ending rule much better
  - fixed the handling of its customization in the config
    file so that it can have customized sentence ending
    punctuation per locale
  - fix highlight field in the Result instances produced
  - handles quoted strings better
  - fix a hang caused by treating non-sentence-ending
    punctuation in the source as a period which got the
    linter into a loop in auto-fix mode. It would add a
    period to the translation over and over again which
    still did not match the non-period in the source
    string, causing it to add another period.

## 2.16.1

### Patch Changes

- efebec7: - fixed null pointer exception in the ascii formatter if
  the Result.fix is set to null instead of undefined

## 2.16.0

### Minor Changes

- 89dee27: - Added ResourceSentenceEnding rule with auto-fix support
  - Matches the sentence ending punctuation in the English source string and
    the locale-sensitive sentence-ending punctuation in the target string.
  - Only checks the end of the string, not the middle.
  - Ignores any quotation marks or whitespace at the end of the string
  - Added support for both Unicode ellipsis (…) and three dots (...) in English
  - Added configuration parameter support for custom punctuation mappings per locale

### Patch Changes

- 44ada06: - Fixed a bug where the exceptions for some rules were not taking effect
  - resource-kebab-case, resource-camel-case, and resource-snake-case
  - Syntax as noted in their documents for exceptions did not work
- Updated dependencies [2f63633]
  - ilib-tools-common@1.18.0

## 2.15.0

### Minor Changes

- d4dfcc3: - Add resource-return-char rule to check for return character count mismatches
  - Ensure source and target strings have matching counts of CR, LF, and CRLF characters.
  - Added new ruleset called "windows" which contains this rule
- e8a6eb7: - Added ability to match Swift and ObjC style printf params
  - The GNU printf rule now supports %@ params
  - Fixed some bugs in the GNU printf param rule
    - was not able to detect multiple missing params
- 6f36165: - Add ResourceGNUPrintfMatch rule for GNU printf parameter validation
  - Implement new linting rule that validates GNU printf-style parameters between source and target strings
  - Support full GNU printf syntax including positional parameters (%1$s, %2$d), width/precision from arguments, and GNU extensions
  - Handle ResourceString, ResourceArray, and ResourcePlural resources with proper category matching
  - Register rule in new "gnu" ruleset for programming-language-agnostic GNU printf validation
- c0807be: - Add Tap I18n named parameter support
  - Add resource-tap-named-params rule for Tap I18n parameter syntax (**param**)
  - Support parameter names with underscores, dots for property access, and numbers
  - Add comprehensive test coverage including parameter reordering scenarios
  - Add documentation for Tap I18n parameter validation
  - Include new "tap" ruleset in built-in rulesets

### Patch Changes

- da4e63b: - Fixed the regex for parsing URLs in the resource-url-match rule
  - does not accept a dot as the last character in the string anymore
  - now supports URL queries, hashes, and URL-encoded characters

## 2.14.0

### Minor Changes

- e05d249: - Added auto-fixes for various rules:
  - resource-no-halfwidth-kana-characters
    - map the halfwidth kana to fullwidth kana
    - added test to verify that the fix works
  - resource-no-double-byte-space
    - map most types of space to an ASCII space
    - map the line break character to an ASCII \n
    - map the paragraph break character to ASCII \n\n
    - add tests to verify that all
  - resource-no-space-with-fullwidth-punctuation
    - remove the space before or after the fullwidth punctuation characters
    - modify the current tests to test both before and after. (Previously it was only before.)
    - add tests to verify all that
- 9c03b14: - Added new rules:
  - resource-csharp-numbered-params - match source and target C# style of params `{0}` or `{1:D}`
  - resource-angular-named-params - match source and target for Angular/Vue style of params `{{ param }}`
  - Added new rulesets:
    - angular - for strings from JS/Angular stacks
    - vue - for strings from JS/Vue stacks
    - csharp - for strings from C#
- 8281e0f: - Implement fix for quote style rule
  - only fixes quotes which exist in the target but are not the right
    ones for the target locale. It cannot fix missing quotes because
    it doesn't know where to put them.
  - quote chars can be separated from the text by a non-breaking space
    (French)
  - can deal with Japanese properly too. ie. Only primary quotes, no
    secondary, but also [square brackets] are accepted as quotes.
  - Added fix for a declarative rule resource-no-space-between-double-and-single-byte-character
    - the extra spaces are removed

## 2.13.0

### Minor Changes

- 8b80b36: Added auto-fix functionality for the resource-no-fullwidth-punctuation-subset rule. The fixer automatically converts specific fullwidth punctuation marks (？！％) to their ASCII equivalents (?!%) in resource strings.
- bb08093: Added auto-fix functionality for the resource-no-fullwidth-digits rule. The fixer automatically converts fullwidth digits (１２３４５) to their ASCII equivalents (12345) in resource strings.

  Added auto-fix functionality for the resource-no-fullwidth-latin rule. The fixer automatically converts fullwidth Latin characters (ＡＢＣ) to their ASCII equivalents (ABC) in resource strings.

  Added auto-fix functionality for the resource-camel-case rule. The fixer automatically converts target strings to match source strings that contain only camel case (e.g., "myVariable", "someFunction").

  Added auto-fix functionality for the resource-snake-case rule. The fixer automatically converts target strings to match source strings that contain only snake case (e.g., "my_variable", "some_function").

  Added the kebab case match rule with auto-fix functionality. If source strings contain only kebab case and no whitespace (e.g., "my-variable", "some-function"), then the targets must be the same. It is treated as Do Not Translate. If the target is different from the source, it is an error. The fixer automatically converts target strings to match source strings.

## 2.12.0

### Minor Changes

- 34211b9: - Added "fix" and "fixApplied" properties to each result
  in the json formatter output
- 17b823d: - Make sure to output locale when formatting results
  - update the Ansi Console formatter to include the locale if it is
    available in the result
  - added a test for the ansi console formatter
  - update the config-based format

## 2.11.0

### Minor Changes

- bdd77c0: - Add support for fixes in declarative rules
  - you can now add fixes in the rules by
    including a fixes array. (See the README
    for details on how to specify those
    fixes.)

### Patch Changes

- Updated dependencies [64dcd13]
  - ilib-tools-common@1.17.0

## 2.10.0

### Minor Changes

- b182d42: - Added ability to count source words
  - Added support from FileStats for source words
  - Added support to most results to output the locale of the result
    so we can slice and dice by locale if necessary
  - Added tests for XliffParser to make sure it is producing the right
    file stats
  - Added support in the json formatter for source words and for
    target locales of results

### Patch Changes

- Updated dependencies [b182d42]
  - ilib-lint-common@3.4.0

## 2.9.3

### Patch Changes

- f6c2fc0: - the error filter transformer was filtering out any resource
  with the same key as one of the results. However, it would do
  this for all locales and across all files, which might represent
  various localization batches. - now filters out only the resources for the appropriate
  locale and file - now matches the file path to the resource file with the
  translation unit came from instead of the source code path
  where the string originally came from
- Updated dependencies [f6c2fc0]
- Updated dependencies [f6c2fc0]
  - ilib-lint-common@3.3.0
  - ilib-tools-common@1.16.0

## 2.9.2

### Patch Changes

- c0059a9: - fixed a bug where the linter would throw an exception if the
  formatter named on the command-line was not known. Now, it
  prints out a proper error message.
- 2e65e98: - Fixed a bug where the linter would give a false positive
  if a string in an ICU plural category had no translatable
  text in it, and it was the same as the same category
  string in the source. Now it just ignores it.
  - Fixed a bug where the linter would not enforce that all
    category strings in an ICU select have the same set of
    categories in the source and target strings. If there are
    extra or missing strings in the select, it will give results
- Updated dependencies [2e65e98]
  - ilib-tools-common@1.15.0

## 2.9.1

### Patch Changes

- 3ca3daa: - output from the json formatter is now 1 line
  compressed json format. The output is intended
  to be read by machine anyways, and having
  the output be a single line makes it easy
  to append a new json file in the "json lines" format.

## 2.9.0

### Minor Changes

- ae97eb7: - add a built-in JsonFormatter to format results in json form for the
  purposes of graphing the results across your localization batches.
  This leaves out a lot of the details such as the source string or
  description, as these are not needed for graphing.

## 2.8.1

### Patch Changes

- c34a1a4: fixed the issue where the formatter defined in another plugin was not being selected correctly.

## 2.8.0

### Minor Changes

- 4a41879: - Added the ability to write files out again if they
  are modified and a serializer is available
  - added the --write flag to cause the write to happen
  - added the --overwrite flag to cause it to overwrite
    the original file (otherwise, it writes to another
    parallel file)
  - modified the ouput of --list to output the names
    of known serializers that are built-in or loaded from
    plugins
  - file type definitions can now include a property that
    names the serializer to use to write out files of
    that type
  - file type definitions can now only use plugins that
    operate on the same type of intermediate representation
    types. That is, you cannot specify a parser that produces
    a "line" representation type, and then a serializer
    that accepts a "resource" representation type. They all
    have to be "line" or "resource".

### Patch Changes

- Updated dependencies [4a41879]
  - ilib-lint-common@3.2.0

## 2.7.2

### Patch Changes

- f9f1095: Unified package entrypoint definitions. This should help resolve edge cases where older packages (like Jest 26) were unable to correctly load some of them.
- ae2549a: Fixed broken links in package metadata.
- cb08afe: Updated rule documentation links to point to the monorepo.
- Updated dependencies [f9f1095]
- Updated dependencies [ae2549a]
  - ilib-tools-common@1.12.2
  - ilib-lint-common@3.1.2
  - ilib-common@1.1.6

## 2.7.1

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-tools-common@1.12.1
  - ilib-lint-common@3.1.1
  - ilib-common@1.1.5

## 2.7.0

- updated the resource snake case rule and resource camel case rule from declarative to programmatic, allowing for project-specific configurations.
- added the option to define a list of exceptions for both the resource snake case and camel case rules.

## 2.6.0

- fixed a bug where the results were not formatted properly when using the ansi-console-formatter
- added XliffSerializer, LineSerializer, and StringSerializer classes generate the
  text of modified files
  - not used yet -- this is in preparation for the implementation of autofixing

## 2.5.0

- added the camel case match rule. If source strings contain only camel case and no whitespace, then the targets must be
  the same. It is treated as Do Not Translate. If the target is different from the source, it is an error.

## 2.4.0

- added the snake case match rule. If source strings contain only snake case and no whitespace, then the targets must be
  the same. It is treated as Do Not Translate. If the target is different from the source, it is an error.

## 2.3.0

- implemented the XML match rule. If there are XML tags and entities in the
  source, then the translations must match. The order of XML tags can change,
  as the grammar of other languages might require that, but the number and
  type of XML tags must match or an error will recorded.
  - this rule will also record an error if the XML in the source is
    well-formed, but the XML in the translation is not

## 2.2.1

- fixed the output from the LintableFile class so that if there is only one
  parser for the file, it will show the specific parser error that caused that
  parsing problem instead of saying that none of the parsers could parse
  the file without any specifics.
- updated dependencies

## 2.2.0

- added --no-return-value command-line flag to have the linter always return 0, even
  when there are errors and warnings. This still reports the results to the output.
  The intention is that the linter can be used to report results without causing
  build pipelines to fail.

## 2.1.1

- check to make sure that every result in the results array returned by the plugins
  is not undefined so that we do not run into the problem of dereferencing undefined
  results later on, which caused some exceptions

## 2.1.0

- fixed a bug where the quote style checker was not converting the highlight quotes properly
- added an option `output` to write the output to a file.
- added an option `name` to give the project name. It is useful when the config file is shared in multiple projects.
- updated to use `formatOutput()` if it is defined in the plugin formatter.
- fixed quote checker rule to make a special case for Japanese. In Japanese, square brackets
  are now allowed as a quote style, and only the main hockey-stick-style of quotes are
  accepted even if the source has an alternate quote style. The double-hockey sticks are no
  longer accepted.

## 2.0.1

- fixed loading of plugins
  - if a plugin `ilib-lint-x` exists and a different package `x`
    also exists that is unrelated to ilib-lint, and the config
    says to load the plugin named simply `x`, it would first attempt
    to load package `x`, succeed to load it, but then fail to
    initialize it because `x` is not really an ilib-lint plugin.
  - Another problem is that if this type of error occurred, it
    would not attempt to load any other paths or plugins. This means
    it would not load the perfectly valid plugin that is there
    just because there was a conflicting package name.
  - Additionally, if given a path directly to the plugin (absolute
    or relative), it would not load that specific plugin and just
    fail completely.
  - Now, it:
    - loads the specific plugin given a path to it
    - if the plugin name is specified with the prefix like
      `ilib-lint-x` it will attempt to load that package in various
      locations until it finds one that works
    - if the name is specified as simply `x`, it will attempt to
      load the `ilib-lint-x` package first and only if it fails to
      load or does not initialize properly will it fall back to
      attempting to load the package just named just `x`
- updated dependencies
- fixed to set the formatter which designated from the command line option.

## 2.0.0

- updated to use ilib-lint-common instead of i18nlint-common. (Same library, new name.)
- converted to use SourceFile from ilib-lint-common so that files
  are not referenced by path names any more. Instead, instanace of
  SourceFile are used so that downstream parts of the linter such as
  highlighting and auto-fixing can gain access to the raw, pre-parsed
  text of the file.
- using ilib-lint-common is a breaking change, and it requires:
  - all plugins need to be updated to conform to the new ilib-lint-common API
  - this version of the linter will not load old plugins that do not
    use ilib-lint-common

## 1.15.0

- added the ability to specify which parsers to use for a particular
  file type. This allows you to parse files that do not have the
  standard file name extension for the file type. Example: the
  "JavascriptReactJsx" parser automatically parses files with the
  extension ".jsx" but in your project, the convention is to put them
  in files with the extension ".js" instead. In this case, the mappings
  should include an entry that maps "\*_/_.js" to a "react-jsx" file type
  and the "react-jsx" file type should specify that files should be parsed
  with the "JavascriptReactJsx" parser.
- fixed some problems with the documentation

## 1.14.0

- added a new rule to check whether or not replacement parameters in the
  source string are explained in the translator's comments.
- fixed a bug where the quote style checker was not checking quotes properly
  when the quotes surrounded a replacement parameter like "{this}"
- added the ability to set sourceLocale through the config file.
- added time elapsed information in the result.
- added a `progressinfo` option to know the which file is checking while the tool is running.
- fixed the source plural category checker to not complain about extra
  categories in the source string other than the required "one" and "other"
  categories.
  - However, if the source contains the "=1" category and not
    the "one" category, a new type error is given because the "=1" should
    be "one" instead.

## 1.13.1

- fixed a bug with the sorting of results

## 1.13.0

- make sure the results are sorted by file path and also line number within
  that file path
- updated the rule that checks for spaces between double- and single-byte
  characters. The rule now allows for spaces between double-byte characters
  and single-byte punctuation.

## 1.12.0

- added source-icu-plural-params rule to check if a replacement parameter
  is used in the "other" category. If so, then the same replacement
  parameter must also appear in the "one" category string. The idea is
  to support languages where there are multiple numbers that are considered
  singular.
- resolved a bug with the `--config path` command-line parameter where
  the linter could not load the config file if the path was given as relative
  to the current directory instead of an absolute path.

## 1.11.0

- added source-no-noun-replacement-params rule to check if a noun is being
  substituted into a replacement parameter in the source English text. Nouns
  and the articles "a", "an", and "the" are not translatable to all languages
  because of gender and plurality agreement rules.
- converted all unit tests from nodeunit to jest
- updated dependencies

## 1.10.0

- added rule source-no-dashes-in-replacement-params to check that replacement
  parameter do not contain dashes, which is not allowed in ICU syntax.
- added rule source-no-manual-percentage-formatting to check that source
  string do not contain manually formatted percentages. Tell the engineer to
  use a locale-sensitive number formatter instead.

## 1.9.0

- make sure the rule resource-no-space-with-fullwidth-punctuation only applies to
  Japanese and specifically not Chinese
- added rule to check source ICU plural syntax
- added rule to check required categories in source ICU plural
- added rule to check that source and target string do not contain
  escaped replacement parameters '{likeThis}'. In later versions of react-intl,
  single-quoted replacement params are left alone when rendered.
- fix a bug where the ICU Plural checker would throw an exeception if
  it encountered a resource that was supposed to be translated, but for some
  reason, did not have a target string

## 1.8.0

- added auto-fixing support
  - Parser can now implement writing out a modified IntermediateRepresentation
    back to the file from which it was parsed
  - Rule can produce and attach a Fix to the given Result
  - a Fixer should be able to apply provided Fixes onto the IntermediateRepresentation
    so that a fixed content would then be written out to the file
  - auto-fixing can be enabled either via CLI flag "fix" or in project config file "autofix"
- implemented a mechanism for fixing strings
- improved ICU plural checker to be able to parse plurals properly when the plurals
  are embedded in the middle of a string. Previously, it only checked the plurals
  when they were they only thing in the string.

## 1.7.0

- added the ability to include or exclude locales from declarative rules
  - the "locales" property gives the list of locales that the
    the rule applies to
  - the "skipLocales" property gives the list of locales that
    the rule does not apply to
  - modified a few locales to be Japanese-only:
    - resource-no-fullwidth-punctuation-subset
    - resource-no-space-between-double-and-single-byte-character
    - resource-no-double-byte-space
    - this fixes a bug where these rules erroneously applied to
      Chinese
- fixed plural checker to not produce a result if the source plural
  category is empty. Previously, if the source category and the target
  category were both empty, it would complain that the target string
  is the same as the source string.
- fixed parsing of select and selectordinal plurals so they don't complain
  about a missing "one" category

## 1.6.1

- resource-quote-style: don't emit error when quotes are missing in SV target
- fixed a problem of false positives when there is a plural and the target
  language has less plural categories than the source language
- having no state attribute on the target tag of a translation unit would
  cause an exception. Now it properly gives an error that no state was found.
- fixed a problem where the same results were printed out multiple times

## 1.6.0

- added the ability to scan source code files and apply rules
  - added source-checker Rule for declarative rules
- moved functionality into Project class
  - main loop moved from index.js into the run() method
  - directory walk function moved to a method of Project
- added I18N score into the summary at the end of the run
  - gives a score from 0 to 100 where 0 means your project
    is not localization ready at all, and 100 means it is completely
    ready for localization.
  - added command-line parameters to control the exit code
    from the linter based on the score

## 1.5.3

- fixed a problem where the quote checker rule would not handle ASCII single quote
  characters used as apostophes properly.

## 1.5.2

- update the documentation above to enumerate all the current resource plugins
- fixed a bug where some resources cause a crash in the
  resource-icu-plurals-translated rule

## 1.5.1

- state checker rule was not configured properly, so it did not run. Now, it will.

## 1.5.0

- added rule to ensure whitespaces at the edges of string are preserved in the same form
- added rule to check if resources have both source and target defined
- fixed bug where resources of type array or plural were not getting
  processed properly in the declarative rules
- added rule to check Do Not Translate terms in resources
- added rule to warn against half-width kana characters
- added rule to warn against double-byte whitespace characters
- added rule to warn of whitespace adjacent to certain fullwidth punctuation characters
- added rule to warn of a space between double-byte and single-byte character
- added rule to check whether or not there is a translation for each source string in
  a resource
- removed ability for the ICU plural rule to report results on the
  source text
  - now it only checks the target text
  - a different rule should be implemented to check the
    source text
- added rule to check if any of the categories of a plural, select,
  or selectordinal are not translated

## 1.4.0

- added rules to detect some double-byte (fullwidth) characters

## 1.3.0

- added resource-state-checker Rule so that you can ensure that all
  resources have a particular state field value

## 1.2.1

- fixed packaging problem where the test plugin was listed in the
  dependencies instead of the devDependencies

## 1.2.0

- added Rule links to give rule writers a way of giving a more complete explanation
  of the rule and how to resolve the problem.

## 1.1.0

- added support for plugins
- added count at the end of the output
- added the --list option to show what things are available to
  put in the config file

## 1.0.0

- initial version
- define initial code and default built-in rules
- this is an ESM-only project, which is why it can only be run with
  nodejs v14+
