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
used within the `regex` property:

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
      plugin that will be used to generate the resource file. This
      overrides the shared resourceFileType at the root level of the
      project.json, which specifies the default resource file type
      for the whole project.
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
          Regular expressions use [JavaScript regular expression
          syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions).
          The regular expressions must contain named capturing groups to
          indicate the various parts that form a Resource. The value of
          the named capturing group can be any string. If the matched
          string for a capturing group is surrounded by quotes (either single
          or double), the plugin will remove the outer quotes. For array
          resources, the matched strings should be
          separated by commas and may have quotes around each element of
          the array. This plugin will remove all the quotes from each array
          element.
          The names of the named capturing groups should be from
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
          This indicates the type of file that the resource came from, which
          helps when trying to escape or unescape the string. Typically this
          is something like "java" or "js" or "html". This can be any string.
        - resourceType - the type of the resource that is being extracted.
          This can be one of the following values:
            - string - a simple string (the default - must define the source capturing group)
            - plural - a plural string (regex must define both source and sourcePlural capturing groups)
            - array - an array of strings
        - context - the context of the string. This can be any string
          that gives more information about the context of the string. This
          string is used if the regular expression does not have a `context`
          capturing group.
        - keyStrategy - if the unique key is not extracted with a capturing group
          in the source file, this property can be used to specify how to calculate
          a key automatically. This can be one of the following values:
            - "hash" - use a hash of the source string as the key. The hash is
              usually much shorter than the source string, but has a 1 in a
              few million chance of conflicting with the hash of another unrelated
              string.
            - "source" - use the whole source string as the key. This can get
              quite long, but it is always unique.
            - "truncate" - use the first 32 characters of the source
              string as the key. This fixed-length key is usually unique.

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
                            "expression": "translate\\s*(\\s*['\"](?<source>[^'\"]*)['\"]\\s*\\)",
                            "flags": "g",
                            "datatype": "php",
                            "resourceType": "string",
                            "keyStrategy": "source"
                        },
                        {
                            "expression": "translate\\s*\\(\\s*['\"](?<source>[^'\"]*)['\"]\\s*,\\s*['\"](?<key>[^'\"]*)['\"]\\s*\\)",
                            "flags": "g",
                            "datatype": "php",
                            "resourceType": "string"
                        },
                        {
                            "expression": "translateArray\\s*\\(\\s*\\[\\s*(?<source>['\"][^'\"]*['\"](\\s*,\\s*['\"][^'\"]*['\"])*)\\s*\\]\\s*\\)",
                            "flags": "g",
                            "datatype": "php",
                            "resourceType": "array"
                        },
                        {
                            "expression": "translatePlural\\s*\\(\\s*['\"](?<source>[^'\"]*)['\"]\\s*,\\s*['\"](?<sourcePlural>[^'\"]*)['\"]",
                            "flags": "g",
                            "datatype": "php",
                            "resourceType": "plural"
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

In the above example, any file named `*.php` will be parsed with all of the
given regular expressions. Explanation of the above regexes:

1. The first regular expression extracts strings
that are passed as the first parameter to the `translate` function. It will match
a string like `translate("string to translate")`. Since the string does not have
a unique id, one is generated using the `source` strategy. That is, the source
string itself is re-used as its own unique id.
1. The second regular expression extracts strings that are passed as the first
parameter to the `translate` function and the second parameter is the
key of the string. It will match a string like `translate("string to translate", "unique.id")`.
1. The third regular expression is an example of an array translation. The
`source` capturing group will have a value like `"a", "b", "c"` which this plugin
will transform into an array of 3 strings. This will match a string like
`translateArray(["a", "b", "c"])`.
1. The fourth regular expression is an example of a plural translation. The
first parameter to the `translatePlural` function is the singular string and is
assigned to the `source` capturing group. The second parameter is the plural
string and is assigned to the `sourcePlural` capturing group. This creates a plural
resource where the `source` string is the `one` plural category, and the `sourcePlural`
string is the `other` plural category.

The extracted strings will be localized and placed in
a PHP resource file. The resource file will be named `Translations-[locale].php`
where `[locale]` is replaced with the locale of the localized strings.

Furthermore, any file named `*.js` will be parsed with the given regular
expression. The regular expression extracts strings that are passed as
the first parameter to the `$t` function. The extracted strings will be
localized and placed in a JSON resource file. The resource file will be
named `strings-[locale].json` where `[locale]` is replaced with the locale
of the localized strings. It matches strings like 
`$t("this is the string to translate")`. Since this type of string extracted
from js files does not have its own unique id, one is generated using
the `hash` strategy. That is, the hash of the source string is taken, and
the string version of that hash is used as unique id.

## Some Tips for Getting Your Regular Expressions to Work Correctly

- The regular expression in json should be given as a string and should not
  have the leading and trailing slashes. For example, do not write
  `"/^text/"`. Instead, just put `"^text"` as your expression.
- Regular expressions are case sensitive by default. If you want to
  match case insensitively, you can add the `i` flag to the regular
  expression.
- Regular expressions are greedy by default. This means that they will
  match as much as possible. If you want to match as little as possible,
  you can add the `?` flag to the regular expression. For example, the
  regular expression `"[^"]*"` will match a string, but it may also capture
  everything between two strings on the same line. `"[^"]*?"` will only
  match the first string on the line. Example input:
  `"first string", other stuff, "second string"`. The first regex will
  match all of that, whereas the second one will only match "first string".
- Remember to escape things properly in the json strings. If you put
  the regular expression `"a\sb"`, it will be looking for the string "asb".
  You need to escape the backslack in order to get "a" followed by a
  whitespace characters followed by a "b". ie. it should read `"a\\sb"`.
  Also, remember to escape double quote characters in your expression
  so that they don't cause problems with json syntax.
- Regular expressions will match the first occurrence in the string by
  default. If you want to match all occurrences, you can add the `g` flag
  to the regular expression. Almost all regular expressions in your
  config file should have the `g` flag.
- Regular expressions by default only match regular ASCII characters. If
  you want to match Unicode characters, you can add the `u` or the `v`
  flag to the regular expression. This will allow you to match any Unicode
  character in the string encoded with the `\u` escape sequences. Example:
  `/\u{1F600}/u` will match the Unicode character for the grinning face emoji.
- Expressions in the config file are applied in the order they are listed.
  If you have two expressions that could match the same string or part of the
  same string, the first one that matches will be the one that is used. Make
  sure that the expressions are listed such that the longer expressions are
  listed first so that they can more easily match. Example, if you have an
  expression that can match `functionCall("first param"` and another that
  can match `functionCall("first param", "second param"`, you will see that
  there is overlap in what they can match. The first
  expression will match and the second one never will because the first
  expression will "use up" the input first. If you reverse their
  order, then the second one will match only if there are two parameters 
  to the `functionCall` call, otherwise the first one will match if there
  is only one parameter, which is what is intended.
- To test your regular expressions in a much more friendly and interactive
  way, you can use the [RegExr](https://regexr.com/) website. This website
  allows you to enter a regular expression and a string to match against. It
  will show you the results in real time as you type. It can also give you
  a description of what each part of the regular expression does. This is
  great for the initial development of the regular expression. For fine
  tuning, see the section below about Testing Your Regular Expressions to
  try them in the context of your project.

## Testing your Regular Expressions in Your Project

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
tool takes a path to the root of your project where the project.json config file
is located, and the name of a file to match against.
It will run the regular expressions in the config file
against the contents of the file and show you the results in a very verbose
manner. This can help you see exactly what the regular expression is doing
and perhaps give a clue as to why it is not extracting the strings that
you expect.

Example usage:

```sh
testregex folder/a/b/c myfile.php
```

This will run the regular expressions in the `folder/a/b/c/project.json` file against
the contents of the `myfile.php` file in the same way that the loctool
will, and it will show you the results of every match in the file in the order that they
were matched. The match result is in the style of the output of a regular expression
match that you may see in a js debugger such as chrome inspect. ie. it is a hybrid of an
array of numbered match group values and an object with other properties, such as the "groups"
subobject which gives the values of named capturing groups you might have defined in your
expression.

Example output:

```
File: ./myfile.php
Matched mapping: ["**/*.php"]
Trying regular expression: translate\s*(\s*['"](?<source>[^'"]*)['"]\s*\)
  Flags: g
  Result:
[
  "0": "translate(\"Hello, world!\");",
  "1": "Hello, world!",
  "groups": {
    "source": "Hello, world!"
  },
  "index": 0,
  "length": 2
]
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
