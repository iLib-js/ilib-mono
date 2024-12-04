# ilib-loctool-po

## 1.6.3

- update dependencies
- convert all unit tests from nodeunit to jest

## 1.6.2

- update dependencies
- remove dependency on log4js. Get the logger from loctool instead.

## 1.6.1

- make sure the msgctxt line comes out before the msgid line. Some libraries
  cannot handle it the other way around.

## 1.6.0

- added the contextInKey setting so that we can support translation
  management systems that do not support contexts. Instead, we add the context
  to the key for each translation unit, so that two translations units
  that differ only in their context can still be dinstinguished from each
  other.

## 1.5.1

- fixed a bug in the getOutputLocale function when you are missing a
  locale in the localeMap that is mentioned in the list of locales

## 1.5.0

- Added headerLocale setting to the mappings. This allows you to specify
  the style of the locale spec listed in the header of the po file as it
  is written out to disk.

## 1.4.1

- Fixed the po header output so that it shows the locale spec of the mapped
  output locale, not of the source locale.

## 1.4.0

- added the ability to ignore comments. This solves the problem where file names
  and line numbers for each resource change when someone makes an unrelated
  change to a source file, but the resource itself nor the code around it has
  changed. This causes some translation management systems to treat the string
  as changed and therefore requiring useless retranslation.
  - Added the "ignoreComments" config option (see above for details)

## 1.3.1

- Fixed a bug where the plugin would not work when generating pseudo localizations
  for plurals

## 1.3.0

- Added the ability to specify a locale map in the file name template
  mapping. This allows for different locale specifications for different
  sets of output files, which may be necessary if those output files
  are intended to be used in different programming languages or on
  different platforms that support a different set of locales.

## 1.2.2

- Fix a bug where the target locale was not used when specified to
  POFileType.newFile. It was never passed in to the POFile constructor.
- Fix a bug where the target locale was specified for string and
  plural resources and there were no target strings or plurals. Having
  the locale but no target confuses mojito.

## 1.2.1

- Make sure to output an empty string if the translated string is the
  same as the source string so that `gettext()` will default back to
  the source string

## 1.2.0

- added the ability to specify a locale map so that output file names of
  po files are mapped from the internal locale to the output locale

## 1.1.2

- fixed a bug where path names in #: comments that did not have a
  colon and a line number were not being extracted properly

## 1.1.1

- fixed a bug where every resource from the PO file had its own file tag
  in the xliff output because the "original" path was set to the file
  name colon line number.

## 1.1.0

- Added the ability to use po files as output resource files by adding a write
  method. This means it can also be used as an output format for the new
  convert action.
  - if resources are added where the target locale
    does not match the locale of the PO file, then those resources
    will be added as source-only resources
  - handles resources with missing translations and puts a placeholder
    entry into the PO file
  - handles missing plural strings as well, depending on the language

## 1.0.1

- Make this plugin able to read already-localized po files
  The output file name template is used to construct a regular expression to
  recognize already localized files and what the locale of that file is.
  Without the template, the locale was never extracted and the source and
  target were both en-US which is not correct. This was a bigger problem
  for those languages where the plural resources have more plural categories
  than in English, such as Russian or Polish.

## 1.0.0

- initial version
- read regular po and pot files and output translated po files
