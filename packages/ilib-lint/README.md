# ilib-lint

A static analysis linter for many types of source files that looks for i18n problems.

This i18n linter differs from other static linters in the following ways:

* It can apply different rulesets to different sets of files. This is useful for
  a number of reasons:
    * when linting a mono-repo that has different subprojects inside of it
      and each subproject needs different rules applied to its files
    * when different sets of files need different rulesets, even within the same file type
* It can handle any file type
    * most linters are specific to a programming language and its related files. This linter
      can read any type of file and apply the appropriate set of rules.
* Rules can be locale-sensitive
    * most linters apply the same rules blindly to all files, regardless of the locale
    * for resource files, it can apply the appropriate locale for each resource individually
* It can recognize the locale of files from the path name of files
    * this allows it to apply the locale-sensitive rules automatically. For example, you can apply
      a rule that checks that the translations in a resource file of a plural resource
      contain the correct set of plural categories for the target language.
* It can load plugins
    * Parsers - you can add parsers for new programming languages or resource file types
    * Formatters - you can make the output look exactly the way you want
    * Rules - you can add new rules declaratively or programmatically

See the [release notes](./docs/ReleaseNotes.md) for details on what is
new and what has changed.

## Installation

```
npm install ilib-lint

or

yarn add ilib-lint
```

Then, in your package.json, add a script:

```
"scripts": {
    "lint": "ilib-lint"
}
```

Please note: nodejs version 14 or above is required to run this tool, as it
is written with ESM modules.

## Quick Start

Running ilib-lint is easy. Just change your directory to the top level directory
of your project and run it with no parameters and no configuration file. It will
do all default behaviours and apply the default rules, which for some projects
is sufficient:

```
$ cd myproject
$ ilib-lint
ilib-lint - Copyright (c) 2022-2024 JEDLsoft, All rights reserved.
WARN: i18n/ru_RU.properties(45): translation should use the appropriate
quote style
  myproject.dialog1.body.text = Нажмите кнопку "Справка", чтобы получить
дополнительную информацию.
  Rule (locale-quote-style): quote style for the locale "ru-RU" should
be «text»
$
```

## Default Behaviours

The default behaviour is to recursively search the current directory for all
xliff files, and then apply all of the built-in resource rules to those files
and report human-readable results to the standard output.

The default behaviours are:

* Start in the current directory and recursively find all xliff files
  underneath there. The xliff file type is built-in to the linter.
* All built-in rules will be added to the current rule set, and it will
  instantiate each rule with its default settings.
* It will use the default set of locales (the top 20 locales on the internet
  by traffic) with "en-US" being the source locale
* For each file found, it applies each rule in the ruleset.
  If a file type does not have any rulesets that apply to it,
  it will be skipped.
    * the locale of a file can sometimes be gleaned from its path name
    * for some types of resource files, the locale is documented in
      the file itself. (eg. xliff or other resource files)
* Output will be printed on the standard output in human readable form


## Command-line Parameters

ilib-lint accepts the following command-line parameters:

* help - Print out a help message detailing these command-line parameters
* config - Give an explicit path to a configuration file instead of trying to
  find it in the current directory.
* errorsOnly - Only give information on errors, not warnings. Also, only exit
  with status 2 if there are errors, and status 0 if there are warnings. This
  flag allows you to squelch the warnings and only fail a script if there are
  actual errors.
* formatter - name the formatter to use to format the results
* list - list out all the known rulesets and all of the known plugins: parsers,
  rules, and formatters. This can assist you with creating your own configuration.
* locales - Locales you want your app to support globally. Value is a comma-separated
  list of BCP-47 style locale tags. File types can override this list.
  Default: the top 20 locales on the internet by traffic.
* progressinfo - whether or not to show progress information while finding and
  parsing source files.s
* sourceLocale - locale of the source files or the source locale for resource
  files. Default: "en-US"
* quiet - Produce no progress output during the run, except for errors running
  the tool such as the inability to load a plugin. Instead exit with a return
  value. Zero indicates no errors, and a positive exit value indicates errors.
* max-errors {number} - specify the maximum number of acceptable errors. If
  this number is exceeded, the linter will exit with an exit code of 2. The
  default maximum number is zero.
* max-warnings {number} - specify the maximum number of acceptable warnings.
  If the maximum number of errors is not exceeded, but the maximum number of
  warnings is, the linter will exit with an exit code of 1. The
  default maximum number is zero.
* max-suggestions {number} - specify the maximum number of acceptable suggestions.
  If the maximum number of errors and warnings are not exceeded, but the maximum
  number of suggestions is, the linter will exit with an exit code of 1. The
  default maximum number is unlimited. (That is, suggestions will not cause an
  exit code unless this command-line parameter is given.)
* min-score {number} - specify the minimum acceptable I18N score for the project.
  If the minimum score it not reached, the linter will exit with an exit code
  of 2. There is no default minimum, so the linter will not give an exit code
  unless this parameter is specified or unless one of the other limits is
  exceeded.

If multiple limits are exceeded (maximum number of errors, warnings, or suggestions,
or minimum I18N score), the exit code will be the most severe amongst them
all. (Usually "2".)

## Exit Status

If you want to use this linter in a script, you can check for the following
exit status:

* 0 - no problems or only suggestions found
* 1 - warnings found
* 2 - errors found

When the `--errorsOnly` flag is given, the program will return 0 unless at least
one error was found.

## Configuration

See [details](./src/config/README.md).

## Built-in Rules

Some generic rules that apply to many types of files are built-in to ilib-lint.
This apply mostly to resource files, such as XLIFF files.

The built-in rules are:

- [resource-completeness](./docs/resource-completeness.md) - Make sure every resource has a source and
  a target string
- [resource-dnt-terms](./docs/resource-dnt-terms.md) - Error if a "do not translate" terms is transalted
- [resource-edge-whitespace](./docs/resource-edge-whitespace.md) - Error if the leading and trailing whitespace
  in the target does not match the source
- [resource-icu-plurals](./docs/resource-icu-plurals.md) - Check for ICU-style plurals. Also works with formatjs
  plurals, as it has the same syntax.
- [resource-named-params](./docs/resource-named-params.md) - Ensure that named parameters that appear in the source
  string are also used in the translated string
- [resource-no-double-byte-space](./docs/resource-no-double-byte-space.md) - Do not use "double-byte" whitespace characters
- [resource-no-fullwidth-digits](./docs/resource-no-fullwidth-digits.md) -Do not use "full width" digits
- [resource-no-fullwidth-latin](./docs/resource-no-fullwidth-latin.md) - Do not use "full width" Latin letters (Romaji)
- [resource-no-fullwidth-punctuation-subset](./docs/resource-no-fullwidth-punctuation-subset.md) - Do not use certain
  "full width" punctuation characters
- [resource-no-halfwidth-kana-characters](./docs/resource-no-halfwidth-kana-characters.md) - Do not use "half width"
  Japanese kana characters
- [resource-no-space-between-double-and-single-byte-character](./docs/resource-no-space-between-double-and-single-byte-character.md) - Do not put a space between a double-byte
  and a single-byte character
- [resource-no-space-with-fullwidth-punctuation](./docs/resource-no-space-with-fullwidth-punctuation.md) - Do not put spaces before or after certain
  "full width" punctuation characters.
- [resource-no-translation](./docs/resource-no-translation.md) - Warning the target translation comes back the same as
  the original source string
- [resource-quote-style](./docs/resource-quote-style.md) - If the source string has quotes, check that the target
  string also has quotes and that those quotes are appropriate for the locale
- [resource-state-checker](./docs/resource-state-checker.md) - Ensure that all resources have a particular state
  field value, or one of an array of state field values. The parameter for this
  rule should either be a string or an array of strings that name the allowed
  values.
- [resource-unique-keys](./docs/resource-unique-keys.md) - Ensure that the keys are unique within a locale across
  all resource files
- [resource-url-match](./docs/resource-url-match.md) - If the source string contains references to URLs, check
  that the target string also contains references to the same URLs
- [source-icu-plural-params](./docs/source-icu-plural-params.md) - Make sure the "one" category contains the same
replacement parameter as the "other" category
- [source-icu-unexplained-params](./docs/source-icu-unexplained-params.md) - Ensure that every replacement parameter
in the source string is explained in the translator's note
- [source-no-dashes-in-replacement-params](./docs/source-no-dashes-in-replacement-params.md) - Do not allow dashes
in the names of replacement parameters
- [source-no-escaped-curly-braces](./docs/source-no-escaped-curly-braces.md) - Do not put single quotes around
replacement parameters
- [source-no-lazy-plurals](./docs/source-no-lazy-plurals.md) - Do not use the construct "(s)" to indicate either
singular or plural. Use a real plural string instead.
- [source-no-manual-currency-formatting](./docs/source-no-manual-currency-formatting.md) - Do not manually format
currency. Use a number formatter instead.
- [source-no-manual-date-formatting](./docs/source-no-manual-date-formatting.md) - Do not manually format dates.
Use a date formatter instead.
- [source-no-manual-percentage-formatting](./docs/source-no-manual-percentage-formatting.md) - Do not manually
format percentages. Use a number formatter instead.
- [source-no-noun-replacement-params](./docs/source-no-noun-replacement-params.md) - Do not use the untranslatable
construct "the {param}" or "a {param}"

## Writing Plugins

The linter tool can support plugins that provide parsers, formatters, or rules,
or any of them at the same time.

## Common Code

All plugins should import and use the classes in the
[ilib-lint-common](https://github.com/ilib-js/ilib-lint-common) package.
This defines the super classes for each plugin type, as well as a number
of utility classes and functions.

### Linter Plugins

Linter plugins are simple wrappers around the parser, formatter, and rule
plugins, which allow the plugin to define multiple plugins. For example, many
plugins define multiple related rules at the same time which check for
different aspects of a string.

The linter plugin should override and implement these three methods:

- getParsers - return an array of classes that inherit from the Parser class
- getRules - return an array of classes that inherit from the Rule class
- getRuleSets - return an array of named rule sets that define which rules to use
- getFormatters - return an array of classes that inherit from the Formatter class

For rules and formatters, each array entry can be either declarative or
programmatic. See the descriptions below about declarative and programmatic
plugins.

When returning programmatic plugins, make sure to return the actual class
itself instead of instances of the class. The linter will need to create
multiple instances of each class during the run of the program.

### Parsers

The job of the parser is to convert a source file into an intermediate representation
that rules can easily digest. There are a few standard representations that many
rules use, but your parser and rules can use their own representation, as
long as the parser and the rules agree on what that format is. Typically, a
sophisticated parser will produce something like an abstract syntax tree (AST) that
the rules know how to traverse and interpret. The standard representations are
much simpler than that. These parsers should pick a unique name for their
representation so that the appropriate rules can parse that representation.

The standard representations are:

- resources - the file is converted into an array of
  [Resource](https://github.com/iLib-js/ilib-tools-common/blob/main/src/Resource.js)
  instances
- lines - the file in converted into a simple array of lines
- source - the file is not parsed. Instead, the entire text of the file is used to
  search for problems. (Usually with regular expressions.)

The resources representation is intended to represent entries in resource files
such as xliff files, gnu po files, or java properties files. Each entry in the
resource file is represented as an instance of one of the standard resource
classes all defined in the
[ilib-tools-common](https://github.com/ilib-js/ilib-tools-common)
project:

- ResourceString - the resource is a single string
- ResourceArray - the resource is an array of strings
- ResourcePlural - the resource is a plural string

The power of a resource file is that resources can contain both a source and a
target string, so the rules are able to check the source strings against the target
strings. Regularly, source files only have source strings in them (if any) so
the target translations cannot be checked.

Parsers should extend the `Parser` class from the `ilib-lint-common` package. The constructor
for your class should define the following properties:

- `this.name` - a unique name for this parser
- `this.description` - a description of this type of parser to display to users

It should also override the
[parseData()](https://github.com/iLib-js/ilib-lint-common/blob/main/src/Parser.js)
method which parses a string, and the
[parse()](https://github.com/iLib-js/ilib-lint-common/blob/main/src/Parser.js)
method, which loads data from the file and then parses it.

You can see an example of a parser plugin by looking at the gnu PO file parser at
[ilib-lint-python-gnu](https://github.com/ilib-js/ilib-lint-python-gnu/blob/main/src/POParser.js).
That parser interprets a .po file as a resource file and returns a set of
Resource instances.

### Rules

Rules interpret the intermediate representation of a file produced by a Parser
and produce a single
[Result](https://github.com/iLib-js/ilib-lint-common/blob/main/src/Result.js)
instance, an array of Result instances, one for each problem found, or undefined
if there are no problems found.

There are two types of rules, declarative and programmatic.

Declarative rules are simply a list of regular expressions with metadata. The
linter searches for matches to those regular expressions and produces Result
instances when found. (Or when they are not found in some cases!)

These can be declared in the config file. (See the example config file above.)

Each declarative rule should have the following properties:

* type (String) - the type of this rule. This may be any of the
  following:
    * resource-matcher - check resources in a resource file. The
      regular expressions that match in the
      source strings must also match in the target string
    * resource-source - check resources in a resource file. If
      the regular expressions match in the source string of a
      resource, a result will be generated
    * resource-target - check resources in a resource file. If
      the regular expressions match in the target string of a
      resource, a result will be generated
    * source-checker - Check the text in a source file, such as a
      java file or a python file. Regular expressions that match
      anywhere in the source file will generate results
* name (String) - a unique dash-separated name of this rule.
  eg. "resource-url-match",
* description (String) - a description of what this rule is trying
  to do. eg. "Ensure that URLs that appear in the source string are
  also used in the translated string"
* note (String) - string to use when the regular expression check fails.
  eg. "URL '{matchString}' from the source string does not appear in
  the target string"
  Note that you can use `{matchString}` to show the user the string
  that the regular expression matched in the source but not in the target.
* regexps (Array.<String>) - an array of regular expressions to match
  in the source and target strings. If any one of those expressions
  matches in the source, but not the target, the rule will create
  a Result that will be formatted for the user.
* link (String) - an URL to a website with a more complete explanation
  of the problem that was found and how the problem can be resolved
  and avoided in the future. Often, this is a link to a markdown file
  in the docs folder on the github repo for the plugin, but it can be
  any link you like.
* severity (String) - the severity of this result if this check fails.
  This should be one of "error", "warning", or "suggestion".
    - Errors are typically things that block localization completely,
      cause exceptions or crashes in code, or which are unacceptable
      from a localization point of view. Teams should strive for
      zero errors in their project.
    - Warnings are things that are not quite as severe as errors
      and therefore do not block localization or cause crashes, but
      which should still be fixed to improve the quality of the
      translations.
    - Suggestions are things that may not necessarily be wrong, but
      where a better way exists or where a recommended practice should
      be followed.

Programmatic rules are used when the requirements for the rules are more complicated
than a simple regular expression string can handle. For example, a rule that checks
if the target string of a resource has the correct quote style for the target
locale first needs to look up what the correct quote style even is in
order to apply the rule.

In order to create a rule instance, create a class that extends the
[Rule](https://github.com/ilib-js/ilib-lint-common/blob/main/src/Rule.js)
class in the [ilib-lint-common](https://github.com/ilib-js/ilib-lint-common/) project.
The constructor of this class should define the following properties:

- `this.name` - a unique name for this rule
- `this.description` - a description of this type of rule to display to users

There are no rules for what to name your Rule, but the Rules written by the ilib-js
organization generally follow some conventions. Resource checkers start with
"resource-" and source file checkers start with "source-". For resource checkers,
the word "match" is used at the end when checking both the source and target,
"source" is used at the end when checking only the source string, and "target"
when checking only the target string. So, "resource-urls-match" is a Rule that
checks resource files for URLs in both the source and target. You are free to name
your rules anything you like or to follow the conventions above. The important
part is that the name should uniquely identify your Rule so that you can use it
in config files.

The rule should also override and implement the getRuleType() method and the
[match()](https://github.com/iLib-js/ilib-lint-common/blob/main/src/Rule.js) method,
which takes an intermediate representation as a parameter and returns either
a single Result, an array of Result, or undefined.

If you would like to see an example rule plugin, see the definition of
the built-in ICU plural matcher rule:
[resource-icu-plurals](https://github.com/ilib-js/ilib-lint/blob/main/src/rules/ResourceICUPlurals.js)
which checks resources to make sure that plurals in source and target strings
have the correct syntax for ICU and formatjs.

### Rule Sets

Rule sets are exactly what they sound like -- a named set that makes it easy
to use a list of rules with a particular file type.

Rule sets can be declared in the config file or can be returned from a plugin.
By convention, at least one of the rulesets returned from each plugin typically
names all of the rules that that plugin supports. That way, a configuration can
be assured of using all the latest available rules when the version of the plugin
is upgraded, without explicitly updating the config to name all of those new rules.

Rule sets should be returned from the getRuleSets method of a plugin which are an
object where the properties name the rule sets, and the value of each property is
another object that lists the individual rules that are members of that set,
and their possible parameters/initializers.

Example return value from a call to getRuleSets:

```javascript
{
    "javascript": {
        "source-check-hard-coded-strings": true,
        "source-check-icu-plural-syntax": {
            "enforcement": "strict"
        }
    }
}
```

In this example, one rule set "javascript" is returned, listing two rules. The
first rule has the value `true` meaning that it is turned on. The second rule
has an initializer telling the rule code to strictly enforce the plural
syntax. (Each rule defines for itself what parameters/initalizers it accepts.)

### Formatters

Formatters transform a [Result object](https://github.com/iLib-js/ilib-lint-common/blob/main/src/Result.js) into a format that the consumer can use. For the most part, the consumer
is a human, so the result should be formatted in text so that the user can read
it easily. Other times, the consumer is another program, so the result should be
formatted for easy parsing. Formatters can formats the results in any way necessary.

There are two types of formatters, declarative and programmatic.

Declarative formatters are simply a template string where properties of the Result
instances are formatted into it. These can be declared in the config file. (See the
example config file above.)

The template strings may have any of the following fields from the Result instance
in them:

- severity
- pathName
- lineNumber
- source
- highlight
- id

Additionally, they may have the following fields from the Rule instance in them:

- ruleDescription
- ruleName
- ruleLink

Programmatic formatters are used when the requirements for formatting are more complicated
than a simple template string can handle. For example, a CSV formatter would have to make
sure that fields in a CSV file are escaped properly to conform to CSV syntax, and would
include escaping code in it.

In order to create a formatter instance, create a class that extends the
[Formatter](https://github.com/ilib-js/ilib-lint-common/blob/main/src/Formatter.js)
class in the [ilib-lint-common](https://github.com/ilib-js/ilib-lint-common/) project.
The constructor of this class should define the following properties:

- `this.name` - a unique name for this formatter
- `this.description` - a description of this type of formatter to display to users
- `this.link` - (optional) a link to a web page that gives a more complete explanation
  of the rule and how to resolve the problem it found

The formatter should also override and implement the
[format()](https://github.com/iLib-js/ilib-lint-common/blob/main/src/Formatter.js) method,
which takes a Result instance as a parameter and returns a formatted string.

If you would like to look at an example formatter plugin, see the definition of
the built-in default formatter
[ansi-console-formatter](https://github.com/ilib-js/ilib-lint/blob/main/src/formatters/AnsiConsoleFormatter.js)
which formats a Result for colorful output on an ANSI console.

## Example Plugin

You can take a look at the [ilib-lint-python](https://github.com/ilib-js/ilib-lint-python)
plugin as a working example of ilib-lint plugin. It implements some rules that
check the various types of substitution parameters that python/django and
gnu gettext support.

Additionally, there is a [sample python project](https://github.com/iLib-js/ilib-samples/tree/main/lint)
that uses the ilib-lint-python plugin. It has purposeful errors built into it which
violate the rules implemented in the plugin so that the linter will produce some output.
Clone the project, cd to the lint directory, run `npm install`, and then `npm run lint`
to see the results.

## I18N Score

At the end of each run, the i18n tool can generate a score that gives you an idea numerically
of how ready your project is for localization. The score goes from 0 to 100 where 0 means
that your project is not localization ready at all, and 100 means it is completely ready for
localization.

Many projects do not have a perfect 100 score, and that can be acceptable. It is still possible
to produce a reasonably localized version of the project without achieving 100. The recommended
goal for each project should be to continually increase the score as development proceeds up to
a minimal acceptable threshold that your team agrees to with your localization team. Nicely
localized projects typically have a score in the range of 80 to 100. Often teams will decide
that they want a maximum of zero errors, but allow up to N number of warnings, and M number of
suggestions.

### Calculations

There are actually a number of things calculated at the end of the run:

- percentage of source files containing errors, warnings, suggestions, and total problems
- percentage of source lines containing errors, warnings, suggestions, and total problems
- the overall score across the whole project

The overall score takes into account the following factors:

- the number of source files
- the number of lines in each source file
- the number and type of results from applying rules
- the number of rules being applied
- the scores from subprojects

Errors weigh heaviest in the calculations, followed by warnings, and finally suggestions. That
is, a project with 5 errors in it will have a lower score than one with 5 warnings or 5
suggestions.

As such, it should be noted that the I18N score is not a percentage, but a
unit-less score which may change over time as the linter changes, even if your project does
not change. The relative movement of the score is the most important thing to look at to
see if the project is improving. As new rules are implemented and set into your configuration
after updating a newer version of the linter or installing new plugins, the score for a
project may go down for a while until the problems manifested by the new rules are resolved. This
does not mean the quality of your project has gone down, just that new things have been
identified to work on.

When your project contains subprojects, each subproject will get its own report and I18N
score. The reports and scores for subprojects will be rolled up to the main project, which
will have an overall federated score across the current project and all all subprojects. This
way, you will be able to measure the progress in libraries, services, or subprojects independently
of your main project.

For example, your project may use a mono-repo which contains "frontend", "backend", and "services"
subprojects within it, each being developed by different teams. They can each have their
own I18N scores and the overall project has a federated score based on the scores of the
subprojects.

### Using the Score as a CI/CD Pipeline Check

The linter now includes command-line flags where you can specify minimums and maximums
for various numbers. The linter will exit with an exit code if the minimums or maximums are
not satisfied. You can use this exit code to determine if your CI/CD pipeline has failed or
succeeded.

See the section above on command-line parameters for details on these.

## Migrating Plugins

See the [migration doc](./docs/migration.md) for more information about upgrading your
ilib-lint plugins from v1 of ilib-lint to v2.

## License

Copyright © 2022-2024, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.