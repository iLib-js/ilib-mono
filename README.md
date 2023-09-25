# ilib-loctool-po

An ilib loctool plugin to parse and localize GNU gettext po files.

This plugin can parse and localize po or pot files written by
tools such as easygettext.

## Regular PO and POT Files

Entries in a PO file have the following format:

```
white-space
#  translator-comments
#. extracted-comments
#: reference…
#, flag…
#| msgctxt previous-context
#| msgid previous-untranslated-string
msgctxt context
msgid untranslated-string
msgstr translated-string
```

The format is specified on the [gnu website](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html).

This plugin can read any file with this format. Individual entries
are registered at string resources and will appear in the extracted
xliff and the new strings files.

If an entry has a context line, it will get a context in the xliff
output and will be differentiated from other strings that have the
same source but a different (or missing). That is, two entries that
differ only by their context will appear as two separate strings in
the xliff output.

In POT files, there are often no translations, as it is the "template"
that is used to generate all the translated po files. This plugin can
support any string with or without translations.

### Plurals

This plugin can also support plural strings. Plurals have the following
format:

```
msgid untranslated-string-singular
msgid_plural untranslated-string-plural
msgstr[0] translated-string-case-0
...
msgstr[N] translated-string-case-n
```

The string in `msgid` will be considered to be the string for the
`one` category used as the singular in English source.
The `msgstr_plural`
will be considered the `other` category, which is used as the plural
string in English. See the
[Unicode plural categories](http://cldr.unicode.org/index/cldr-spec/plural-rules)
document for details on what the categories mean.

The lines `msgstr[0]` through `msgstr[N]` are the translations of
these categories. The numbers are mapped to Unicode categories according
to the mappings included below in Appendix A. The mappings are different
for each language. That is, in one language, `0` might map to the `one`
category, whereas in another, it might be the `zero` category. The
strings in the xliff output will include the category only, and the
categories will be mapped back to numbers in the translated po file output.

Note that for some languages, the number of categories is different
than in English. For example, English uses 2 categories (`one` and
`other`) but Russian uses 3 (`one`, `few`, and `other`). The
xliff output will contain the right number of category strings for
the target language. Your translators should note the category given
in the `extype` attribute when translating each string. They will
not have to add or subtract any
xliff trans-unit entries. They only need to translate the contents
of the target tag in the given trans-units.

#### Example

Input po or pot file:

```
msgid "There is {n} object."
msgstr_plural "There are {n} objects."
```

Output xliff snippet:

```xml
      <trans-unit id="4" resname="There is {n} object." restype="plural" datatype="po" extype="one">
        <source>There is {n} object.</source>
        <target state="new">There is {n} object.</target>
      </trans-unit>
      <trans-unit id="5" resname="There is {n} object." restype="plural" datatype="po" extype="few">
        <source>There are {n} objects.</source>
        <target state="new">There are {n} objects.</target>
      </trans-unit>
      <trans-unit id="6" resname="There is {n} object." restype="plural" datatype="po" extype="other">
        <source>There are {n} objects.</source>
        <target state="new">There are {n} objects.</target>
      </trans-unit>
```

Note that the `msgid` string (the English singular) is used as the
resource name (`resname`) for each of the xliff entries so that
they can be connected again later when the xliff file is read in.
Also, the
source string for every category other than `one` is the source
string given on the `msgstr_plural` line.

## Configuring the Plugin

The plugin will look for the `po` property within the `settings`
of your `project.json` file. The following setting is
used within the po property:

- mappings: a mapping between file matchers and an object that gives
  info used to localize the files that match it. This allows different
  po files within the project to be processed into different output
  files. The matchers are
  a [micromatch-style string](https://www.npmjs.com/package/micromatch),
  similar to the the `includes` and `excludes` section of a
  `project.json` file. The value of that mapping is an object that
  can contain the following properties:
    - template: a path template to use to generate the path to
      the translated
      output files. The template replaces strings in square brackets
      with special values, and keeps any characters intact that are
      not in square brackets. The default template, if not specified is
      "[dir]/[locale].po". The plugin recognizes
      and replaces the following strings in template strings:
        - [dir] the original directory where the matched source file
          came from. This is given as a directory that is relative
          to the root of the project. eg. "foo/bar/strings.po" -> "foo/bar"
        - [filename] the file name of the matching file.
          eg. "foo/bar/strings.po" -> "strings.po"
        - [basename] the basename of the matching file without any extension
          eg. "foo/bar/strings.po" -> "strings"
        - [extension] the extension part of the file name of the source file.
          etc. "foo/bar/strings.po" -> "po"
        - [locale] the full BCP-47 locale specification for the target locale
          eg. "zh-Hans-CN" -> "zh-Hans-CN"
        - [language] the language portion of the full locale
          eg. "zh-Hans-CN" -> "zh"
        - [script] the script portion of the full locale
          eg. "zh-Hans-CN" -> "Hans"
        - [region] the region portion of the full locale
          eg. "zh-Hans-CN" -> "CN"
        - [localeDir] the full locale where each portion of the locale
          is a directory in this order: [langage], [script], [region].
          eg, "zh-Hans-CN" -> "zh/Hans/CN", but "en" -> "en".
        - [localeUnder] the full BCP-47 locale specification, but using
          underscores to separate the locale parts instead of dashes.
          eg. "zh-Hans-CN" -> "zh_Hans_CN"
    - localeMap: an output locale map that maps the locale used in the
      translations to a different locale for use in the file name template.
      For example, an app may wish to use the locale specifier "zh-CN"
      instead of the full "zh-Hans-CN" for some output files, but not
      all of them. In this case, a locale map for this template mapping
      is how this can be achieved. Any locale not listed in the mapping
      will be used as-is. The overall [shared] locale map is also applied
      if there is no locale map in the template mapping for a particular
      locale.
    - ignoreComments: specify whether to ignore types of comments. Possible values are:
        - *true* All comment types should be ignored
        - *false* No comment types should be ignored (default)
        - Array of strings. Name the types of comments that should be
          ignored. Possible values are:
            - "translator" - ignore translator comments (prefix is "# ")
            - "extracted" - ignore comments extracted from the source code (prefix is "#.")
            - "flags" - ignore special processing flags (prefix is "#,")
            - "previous" - ignore previous translation (prefix is "#|")
            - "paths" - ignore file names and line numbers (prefix is "#:")
    - headerLocale: specify what kind of locale to put in the file header. Possible values
        are:
        - *full*: put the fully specified locale spec in the header
        - *abbreviated*: put an abbreviated locale spec in the header (language only)
        - *mapped*: put the results of the output locale mapping (see above) into the header
    - contextInKey: some translation management systems cannot support separate context
      fields, and therefore two translation units that only differ in their context cannot
      be distinguished from each other. If this setting is set to "true", then the context
      is added to the key for a unit. eg. if the string is "Sent" and the context is "Email",
      a translation unit will be produced with the key "Sent --- Email" and the source string
      is "Sent".

Example configuration:

```json
{
    "settings": {
        "po": {
            "mappings": {
                "**/template.pot": {
                    "template": "resources/[locale].po",
                    "ignoreComments": ["paths"]
                },
                "sublibrary/**/library.pot": {
                    "template": "[dir]/[locale].po",
                    "localeMap": {
                        "nb-NO": "no",
                        "sr-Cyrl-RS": "sr-RS",
                        "zh-Hans-CN": "zh-CN"
                    },
                    "ignoreComments": true
                }
            }
        }
    }
}
```

In the above example, any file named `template.pot` will be localized and
the output is sent to a file named after the target locale located in the
`resources` directory. In these files, the translator and extracted
type of comments are ignored and will not be extracted into the resources
and therefore will not appear in the xliff files.

In the second part of the example, any `library.pot` file that appears in
the `sublibrary` directory will be localized and the results sent to a
po file named after each target locale which will appear in the same
directory where the source file was located. If the locale is one of the
ones listed in the locale map, it will be mapped before being substituted
in to the template. For these files, all comment types are ignored and none
are sent to the translators in the xliff files.

If the name of the localized file that the template produces is the same as
the source file name, this plugin will throw an exception, the file will not
be localized, and the loctool will continue on to the next file.


## License

Copyright © 2019, 2022-2023 JEDLSoft

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.6.3

- update dependencies
- convert all unit tests from nodeunit to jest

### v1.6.2

- update dependencies
- remove dependency on log4js. Get the logger from loctool instead.

### v1.6.1

- make sure the msgctxt line comes out before the msgid line. Some libraries
  cannot handle it the other way around.

### v1.6.0

- added the contextInKey setting so that we can support translation
  management systems that do not support contexts. Instead, we add the context
  to the key for each translation unit, so that two translations units
  that differ only in their context can still be dinstinguished from each
  other.

### v1.5.1

- fixed a bug in the getOutputLocale function when you are missing a
  locale in the localeMap that is mentioned in the list of locales

### v1.5.0

- Added headerLocale setting to the mappings. This allows you to specify
  the style of the locale spec listed in the header of the po file as it
  is written out to disk.

### v1.4.1

- Fixed the po header output so that it shows the locale spec of the mapped
  output locale, not of the source locale.

### v1.4.0

- added the ability to ignore comments. This solves the problem where file names
  and line numbers for each resource change when someone makes an unrelated
  change to a source file, but the resource itself nor the code around it has
  changed. This causes some translation management systems to treat the string
  as changed and therefore requiring useless retranslation.
    - Added the "ignoreComments" config option (see above for details)

### v1.3.1

- Fixed a bug where the plugin would not work when generating pseudo localizations
  for plurals

### v1.3.0

- Added the ability to specify a locale map in the file name template
  mapping. This allows for different locale specifications for different
  sets of output files, which may be necessary if those output files
  are intended to be used in different programming languages or on
  different platforms that support a different set of locales.

### v1.2.2

- Fix a bug where the target locale was not used when specified to
  POFileType.newFile. It was never passed in to the POFile constructor.
- Fix a bug where the target locale was specified for string and
  plural resources and there were no target strings or plurals. Having
  the locale but no target confuses mojito.

### v1.2.1

- Make sure to output an empty string if the translated string is the
  same as the source string so that `gettext()` will default back to
  the source string

### v1.2.0

- added the ability to specify a locale map so that output file names of
  po files are mapped from the internal locale to the output locale

### v1.1.2

- fixed a bug where path names in #: comments that did not have a
  colon and a line number were not being extracted properly

### v1.1.1

- fixed a bug where every resource from the PO file had its own file tag
  in the xliff output because the "original" path was set to the file
  name colon line number.

### v1.1.0

- Added the ability to use po files as output resource files by adding a write
  method. This means it can also be used as an output format for the new
  convert action.
    - if resources are added where the target locale
      does not match the locale of the PO file, then those resources
      will be added as source-only resources
    - handles resources with missing translations and puts a placeholder
      entry into the PO file
    - handles missing plural strings as well, depending on the language

### v1.0.1

- Make this plugin able to read already-localized po files
  The output file name template is used to construct a regular expression to 
  recognize already localized files and what the locale of that file is. 
  Without the template, the locale was never extracted and the source and 
  target were both en-US which is not correct. This was a bigger problem
  for those languages where the plural resources have more plural categories
  than in English, such as Russian or Polish.

### v1.0.0

- initial version
- read regular po and pot files and output translated po files

## Appendix A. Mappings From GNU gettext Plural Number and Unicode Category

These mappings are encoded in the file pluralforms.json which is packaged
with this plugin. The languages are listed below by their ISO 639 2 letter codes.
This plugin assumes that any language not explicitly listed below has only the
`one` and `other` categories.

### ar

| number | category |
| ---- | ---- |
| 0 | zero |
| 1 | one |
| 2 | two |
| 3 | few |
| 4 | many |
| 5 | other |

### be

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### bg

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### cs

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### da

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### de

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### el

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### en

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### eo

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### es

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### et

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### fi

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### fo

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### fr

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### ga

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### he

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### hr

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### hu

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### id

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### it

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### ja

| number | category |
| ---- | ---- |
| 0 | other |

### ko

| number | category |
| ---- | ---- |
| 0 | other |

### lt

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### lv

| number | category |
| ---- | ---- |
| 0 | zero |
| 1 | one |
| 2 | other |

### nl

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### no

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### pl

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### pt

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### ro

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### ru

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### sk

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### sl

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | two |
| 2 | few |
| 3 | other |

### sr

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### sv

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### th

| number | category |
| ---- | ---- |
| 0 | other |

### tr

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | other |

### uk

| number | category |
| ---- | ---- |
| 0 | one |
| 1 | few |
| 2 | other |

### zh

| number | category |
| ---- | ---- |
| 0 | other |

