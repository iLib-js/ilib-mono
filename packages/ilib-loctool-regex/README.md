# ilib-loctool-regex

ilib-loctool-regex is a plugin for the loctool that
allows it to read and localize any file types that can be processed
with regular expressions.

## Configuring the Plugin

### Standard Settings

To use this plugin, you should set these two settings:

- The `projectType` setting should be set to `custom`
- The `resourceFileTypes` setting should be set to an object that
  includes the `regex` property. The value names the plugin
  that will be used as a resource file format.

### Custom Settings

The plugin will look for the `regex` property within the `settings`
of your `project.json` file. The following settings are
used within the json property:

- mappings: a mapping between file matchers and an object that gives
  info used to localize the files that match it. This allows different
  files within the project to be processed with different regular
  expressions. The matchers are
  a [micromatch-style string](https://www.npmjs.com/package/micromatch),
  similar to the the `includes` and `excludes` section of a
  `project.json` file. The value of that mapping is an object that
  can contain the following properties:
    - resourceFileType - the type of the resource file that will be
      generated from the localized strings. This is the name of the
      plugin that will be used to generate the resource file.
    - template - the template to specify the output resource file
      path. See the loctool documentation for more information on
      how to use path name templates.
    - sourceLocale - the locale of the source strings. This is the
      locale in which the strings are written in the source files.
    - expressions - an array of objects that document the regular
      expressions to use to extract strings from the source file
      and some additional information. The strings
      will be extracted, localized, and placed in the resource file.
      Each object in the array can contain the following properties:
        - expression - the regular expression to use to extract the
          strings from the source file. The regular expressions should
          be in the form of a string, not a regular expression object,
          because json files cannot contain regular expression objects.
          The string should not have the leading and trailing slashes.
          Regular expressions use [JavaScript regular expression
          syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions).
          The regular expressions must contain named capturing groups to
          indicate the various parts that form a Resource. The value of
          the named capturing group can be any string. If the string is
          surrounded by quotes (either single or double), the plugin will
          remove the quotes. For array resources, the strings should be
          separated by commas and may have quotes around each element of
          the array. The names of the named capturing groups should be from
          this list:
            - `source` - the string in the source language (required). For
              plural resources, use this for the singular form of the string.
              For array resources, this should contain the list of strings
              in comma-separated form. For example, "one, two, three". The
              plugin will split this string on commas and trim each part.
            - `sourcePlural` - for plural resources, this gives the plural
              form of the string.
            - `key` - the unique key of the string
            - `comment` - a comment that describes the string for the
              translator
            - `context` - the context of the string
            - `flavor` - the flavor of the string (mostly for Android)
        - flags - the regular expression flags to use when extracting
          the strings. See the [JavaScript regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
          documentation for more information on regular expression flags.
        - datatype - the type of the resource that is being extracted.
          This indicates the type of file that the resource came from which
          helps when trying to escape or unescape the string. Typically this
          is something like "java" or "js" or "html". This can be any string.
        - resourceType - the type of the resource that is being extracted.
          This can be one of the following values:
            - string - a simple string (the default)
            - plural - a plural string
            - array - an array of strings
        - context - the context of the string. This can be any string
          that gives more information about the context of the string.
        - keyStrategy - if the unique key is not given in the source
          file, this property can be used to specify how to calculate
          the key. This can be one of the following values:
            - "hash" - use a hash of the source string as the key
            - "source" - use the whole source string as the key
            - "truncate" - use the first 32 characters of the source
              string as the key

Example configuration for a web project with PHP and JavaScript files:

```json
{
    "settings": {
        "regex": {
            "mappings": {
                "**/*.php": {
                    "resourceFileType": "ilib-loctool-php-resource",
                    "template": "resources/Translations-[locale].php",
                    "sourceLocale": "en-US",
                    "expressions": [
                        {
                            "expression": "\\btranslate\\s*(\\s*['\"](?<source>[^'\"]*)['\"]\\s*\\)",
                            "flags": "g",
                            "datatype": "php",
                            "resourceType": "string",
                            "keyStrategy": "source"
                        },
                        {
                            "expression": "\\btranslate\\s*\\(\\s*['\"](?<source>[^'\"]*)['\"]\\s*,\\s*['\"](?<key>[^'\"]*)['\"]\\s*\\)",
                            "flags": "g",
                            "datatype": "php",
                            "resourceType": "string"
                        }
                    ]
                },
                "**/*.js": {
                    "resourceFileType": "ilib-loctool-json",
                    "template": "resources/strings-[locale].json",
                    "sourceLocale": "en-US",
                    "expressions": [
                        {
                            "expression": "\b\\$t\\s*\\(\"(?<source>[^\"]*)\"\\)",
                            "flags": "g",
                            "datatype": "js",
                            "resourceType": "string",
                            "keyStrategy": "hash"
                        }
                    ]
                }
            }
        }
    }
}
```

In the above example, any file named `*.php` will be parsed with both the
given regular expressions. The first regular expression extracts strings
that are passed as the first parameter to the `translate` function. The
second regular expression extracts strings that are passed as the first
parameter to the `translate` function and the second parameter is the
key of the string. The extracted strings will be localized and placed in
a PHP resource file. The resource file will be named `Translations-[locale].php`
where `[locale]` is replaced with the locale of the localized strings.

Furthermore, any file named `*.js` will be parsed with the given regular
expression. The regular expression extracts strings that are passed as
the first parameter to the `$t` function. The extracted strings will be
localized and placed in a JSON resource file. The resource file will be
named `strings-[locale].json` where `[locale]` is replaced with the locale
of the localized strings.

## Testing your Regular Expressions

Getting regular expressions right can be tricky. The `ilib-loctool-regex`
plugin uses the JavaScript regular expression engine to extract strings
from your source files. This means that you can use any regular expression
that is valid in JavaScript. Javascript regular expressions have their
own quirks different than other regular expression engines. Often, you
will create a regular expression,
place it into the config file, run the loctool, and see that it does not
extract all the strings you expect it to extract. This is almost always
because the regular expression itself is not quite right. When this happens,
you will not necessarily get any error messages from the loctool. The strings
will just mysteriously not show up in the resource file.

To help you get your regular expressions right, you can test them using
the `testregex` command line tool that comes with this plugin. The `testregex`
tool takes a path to your project's config file and the name of a file
to match against. It will run the regular expressions in the config file
against the contents of the file and show you the results in a very verbose
manner. This can help you see exactly what the regular expression is doing
and perhaps give a clue as to why it is not extracting the strings that
you expect.

Example usage:

```sh
testregex folder/a/b/c/project.json myfile.php
```

This will run the regular expressions in the `project.json` file against
the contents of the `myfile.php` file in the same way that the loctool
will and show you the results.

Example output:

```
Running regular expression "\\btranslate\\s*(\\s*['\"](?<source>[^'\"]*)['\"]\\s*)" against file "myfile.php"
Extracted strings:
    translate("Hello, world!")
    translate("Goodbye, world!")
```

## Release Notes

Please see the [release notes](./CHANGELOG.md) for information on the
most recent updates to this package.

## License

Copyright © 2024 Box, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
