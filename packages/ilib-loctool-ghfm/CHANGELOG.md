# ilib-loctool-ghfm

## 1.11.7

### Patch Changes

- fcfe79c: - Fixed a bug where some whitespace was not being added
  to translatable strings properly during extraction but
  not during localization, meaning that some strings were
  not able to be translated because the string did not
  match the translations

## 1.11.6

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - message-accumulator@3.0.1
  - ilib-loctool-yaml@1.5.2

## 1.11.5

- fixed incorrect imports of certain dependencies, which caused this
  plugin to fail when they were updated

## 1.11.4

- Fixed a bug where code blocks introduced with triple backticks
  were not properly parsed if they occurred right after some other
  types of blocks. The work around is to add a blank link in front
  of the code block which allows the parser to reset and behave properly
- Fixed an problem with a "dereferencing undefined" exception that occurs
  while printing out a warning about a previously caught exception, which
  not only hides the first exception, but also causes loctool to abort
  altogether!

## 1.11.3

- Fixed a bug where HTML-like tags that were indented and the only
  thing on a line were not parsed correctly and caused infinite
  recursion until the stack blew out
- Fixed a bug where code blocks that start with an indented triple
  backtick cause the markdown parser to skip every other item in an
  ordered list and not extract its strings

## 1.11.2

- Updated dependencies
- converted unit tests from nodeunit to jest

## 1.11.1

- Updated dependencies

## 1.11.0

- Now uses newest yaml parser which puts a hash of the source path name in the
  key for each frontmatter field. This way, the Title field in different
  md files will have different resource keys and therefore can be translated
  separately.

## 1.10.0

- added localeMaps to the mappings

## 1.9.1

- fixed a bug where URLs in direct links were added to the new strings set
  even when the localize-links directive was turned off. If the "fully
  translated" flag was also turned on, then the plugin would think a file was
  not fully translated because these links appear in the new strings set
  and so it would not produce the localized version of the file.

## 1.9.0

- added the ability to localize URLs in direct links when the localize-links
  directive is turned on

## 1.8.4

- fixed a bug where markdown embedded inside of flow HTML was not being parsed
  properly. Flow HTML and markdown should be able to contain each other.

## 1.8.3

- fixed a bug where strings inside of flow HTML were not being extracted or
  localized. Flow HTML is where the HTML tags span multiple lines. HTML that
  was on a single line was already handled correctly--it is the multiple-lines
  that threw off the parser. Example of flow HTML:

```
  <span class="myclass">
  This text is on a separate line.
  </span>
```

## 1.8.2

- fixed a bug where the new and pseudo strings for the front matter were not
  being generated properly

## 1.8.1

- fixed incorrect documentation (ie. the above text!)
- mark files as not fully translated if there is pseudo translation

## 1.8.0

- added support for settings mappings
- added support for parsing and localizing frontmatter fields

## 1.7.2

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.

## 1.7.1

- Fixed an "Unbalanced component error" while parsing footnote definitions

## 1.7.0

- Added support for markdown footnotes using remark-footnote
- Don't test on node 6 any more -- unit tests do not pass on node 6
  because of a dependency which we can't really fix ourselves

## 1.6.0

- Added support for the "fullyTranslated" setting in the frontmatter if
  the fullyTranslated setting is turned on in the loctool and the current
  file has all of its strings fully translated.

## 1.5.1

- Updated dependencies so that this plugin can work on nodejs v6 still
  without node-gyp problems.

## 1.5.0

- added a "fullyTranslated" setting for the markdown code. This makes sure
  that if a file does not have all of its translations, then that file is
  produced in the source language.
  - Also produces a file in the project root called `translation-status.json`
    that details which files were fully translated and which were not
- Fixed a bug where markdown tables were not handled properly
- Fixed a bug where inline code was not handled properly if it was the
  only thing in the localizable segment. Inline code should only be
  localized if it is in the middle of or adjacent to localizable text.

## 1.4.1

- Fixed a bug where self-closed tags like <br/> in markdown files were not handled properly,
  causing exceptions that complained about syntax errors

## 1.4.0

- Add support for localizing links and link references.

By default, URLs are not localizable, as the majority are the same
in all languages. Sometimes, however you want to be able to give a
different URL for each locale. With this new features, you can turn
on link localization.

To localize a link in the text, put a localize-links directive around
it, which is an lint-style HTML comment. Example:

```markdown
There are

<!-- i18n-enable localize-links -->

[fifty](http://www.example.com/)

<!-- i18n-disable localize-links -->

of them for sale.
```

The text "fifty" is localized along with the rest of the sentence in the
string:

```
There are <c0>fifty</c0> of them for sale.
```

Note the c0 tags denote where the link goes. The directives, being HTML
comments, are not included in the string to translate.

The URL itself appears as a separate string to translate.

Localizing a link reference is very similar. Surround the reference
definition with a localize-links directive:

```markdown
There are [fifty][url] of them for sale.

<!-- i18n-enable localize-links -->

[url]: http://www.example.com/ "link title"

<!-- i18n-disable localize-links -->
```

The link title for link reference definitions is included as a separate string
to translate.

## 1.3.0

- The plugin now adds a translator comment/note for inline code so that the
  translator can know what the text of the self-closing components is.
- Minimum node version to run this plugin is now v10

## 1.2.6

- Add support for shortcut and full link references
  - Shortcut references are converted back to full so that the title of the
    reference can be translated to something different than the [possibly]
    English label of the shortcut.

## 1.2.5

- Handle valueless HTML attributes properly

## 1.2.4

- The previous fix where HTML comments were not recognized and skipped properly
  was only fixed for the parsing side of this plugin. Now it is fixed for the
  localization side as well.

## 1.2.3

- Fixed a bug where HTML comments were not recognized and skipped properly
  if there was whitespace/indentation before them in the source file.

## 1.2.2

- Fixed reference link support. If there is text in a reference link, then it will
  be included in the text to localize.
