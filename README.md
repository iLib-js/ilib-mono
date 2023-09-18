# ilib-loctool-csv

Ilib loctool plugin to parse and localize comma- or tab-separated value files

## Installation

```
npm install ilib-loctool-csv

or

yarn add ilib-loctool-csv
```

Make sure to do that in the same directory as the loctool itself so that
the loctool knows how to load this plugin automatically.

## Settings

The plugin will look for the `csv` property within the `settings`
of your `project.json` file. The following settings are
used within the csv property:

- mappings: a mapping between file matchers and an object that gives
  info used to localize the files that match it. This allows different
  csv files within the project to be processed with different schema.
  The matchers are
  a [micromatch-style string](https://www.npmjs.com/package/micromatch),
  similar to the the `includes` and `excludes` section of a
  `project.json` file. The value of that mapping is an object that
  can contain the following properties:
    - method: (string) the method of localizable. Currently, the only
      value accepted is "copy" which means that a copy of the input file
      is created with localized column values in it. In the future, there will
      be support for other methods, such as multilingual csv files.
    - template: (string) a path template to use to generate the path to
      the translated
      output files. The template replaces strings in square brackets
      with special values, and keeps any characters intact that are
      not in square brackets. The default template, if not specified is
      "[dir]/[basename]-[locale].[extension]". The plugin relies on the
      loctool to recognize and replaces the following strings in templates:
        - [dir] the original directory where the matched source file
          came from. This is given as a directory that is relative
          to the root of the project. eg. "foo/bar/strings.json" -> "foo/bar"
        - [filename] the file name of the matching file.
          eg. "foo/bar/strings.json" -> "strings.json"
        - [basename] the basename of the matching file without any extension
          eg. "foo/bar/strings.json" -> "strings"
        - [extension] the extension part of the file name of the source file.
          etc. "foo/bar/strings.json" -> "json"
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
    - rowSeparatorRegex: (string) a regular expression that can be used to
      split the rows from each other
    - rowSeparator: (string) a single character that can be used to split
      the rows from each other. You should specify exactly one of rowSeparatorRegex
      and rowSeparator. Default if not specified is a new line char.
    - columnSeparator: (string) a single character that can be used to
      split the columns from each other. Default if not specified is a
      single comma.
    - headerRow: (boolean) if set to true, then first row of the file
      is a header row which contains a list of column names. When there is a
      header row, every column is considered localizable. If false, you
      must specify the columns array below to configure the columns. Default
      if not specified is `true`.
    - columns: (Array.<Column>) an array of column definitions in the order that
      they appear in the file. The default if this setting is not specified
      is that all columns are localizable. Each column definition can contains:
        - name: (string) a name for this column
        - localizable: (boolean) whether or not this column is localizable.
          Default: false, if not specified
        - locale: (string) the locale of this column. (not used yet -- will be
          used with multilingual csv support to be implemented later)
        - key: (boolean) this column contains the resource key for the other
          columns (not used yet -- will be used in multilingual csv support
          to be implemented later)

Example configuration:

```json
{
    "settings": {
        "csv": {
            "mappings": {
                "src/**/*.csv": {
                    "template": "resources/[localeDir]/[basename].csv",
                    "rowSeparator": "\n\n",
                    "columnSeparator": ",",
                    "headerRow": false,
                    "columns": [
                        {
                            "name": "id"
                        },
                        {
                            "name": "name"
                        },
                        {
                            "name": "address"
                        },
                        {
                            "name": "description",
                            "localizable": true
                        }
                    ]
                },
                "src/**/app.tsv": {
                    "template": "[dir]/[basename]-[locale].tsv",
                    "headerRow": true,
                    "columns": [
                        {
                            "name": "id",
                        },
                        {
                            "name": "name",
                            "localizable": true
                        },
                        {
                            "name": "description",
                            "localizable": true
                        },
                        {
                            "name": "category",
                            "localizable": true
                        }
                    ]
                }
            }
        }
    }
}
```

In the above example, any file named `*.csv` in the `src` directory will be
parsed with the given settings. Only the `description` column is localizable.
The output file name is sent to the `resources` directory.

In the second part of the example, any `app.tsv` file in the `src` directory
will be parsed. In this case, there is a header row in the file that gives the
names of the columns. The template specifies that the localized file name will
also contain the locale to distinguish it from the source file.

If the name of the localized file that the template produces is the same as
the source file name, this plugin will throw an exception, the file will not
be localized, and the loctool will continue on to the next file.

## Default Behaviour

In the absence of any mapping information, a default set of mappings will be applied.
The plugin will assume that csv files contain rows separated by newline
characters, and columns separated by a comma. It will also assume that tsv
files contain rows separated by newline characters, and columns separated
by a tab character. Both types of files are assumed to have a header row
and that all columns are localizable.

If mappings are given, but a csv file does not match any of the match expressions,
then that entire file is considered not localizable.

Example:

```
name,description,category
"Joe Schmoe","A really great guy, but not exceptional in any way.","regular guy"
"Jimmy Shmitts","A really Latino good actor with a German name.","Oscar winner"
```

Essentially, this means that we assume that the file has the following mappings:

```json
{
    "settings": {
        "csv": {
            "mappings": {
                "**/*.csv": {
                    "method": "copy",
                    "template": "[dir]/[basename]-[locale].[extension]",
                    "rowSeparatorRegex": "[\n\r\f]+",
                    "columnSeparatorChar": ","
                },
                "**/*.tsv": {
                    "method": "copy",
                    "template": "[dir]/[basename]-[locale].[extension]",
                    "rowSeparatorRegex": "[\n\r\f]+",
                    "columnSeparatorChar": "\t"
                }
            }
        }
    }
}
```


## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.2.3

- update dependencies
- convert unit tests from nodeunit to jest

### v1.2.2

- update dependencies
- use the loctool's logger instead of its own

### v1.2.1

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.

### v1.2.0

- previous versions did not package the js files, which made them useless!
- added content to this README.md
- added support for mappings
- added support for extracting resources from csvs
- added support for configuring columns
- added support for optional header row

### v1.1.0

- add localization support

### v1.0.0

- initial version
- support reading csvs but not writing them

