## Configuration

The paths to process are given on the command-line. If no path is specified
on the command-line, the tool will default to the current directory.
If any named path contains a file called `ilib-lint-config.json`, that
file will be read and processed to configure a project within the ilib-lint tool
with that path as the root directory for the project.

This json config file will be parsed as [JSON5](https://json5.org), which means
it can contain comments and other nice features that make it easier for humans
to read and write.

The `ilib-lint-config.json` file can have any of the following properties:

-   name (String, required) - name of this project
-   locales (Array of strings) - that name the default set of locales for the
    whole project if they are not configured by each path
-   sourceLocale (String) - name the locale for source strings in this app.
    Default if not specified is "en-US".
-   excludes (Array of String) - an array of micromatch expressions for files
    or folders in the project to exclude from the recursive search.
-   rules (Array of Object) - an array of declarative regular-expression-based rules to use
    with this project. Resource rules are applied to resources loaded from a
    resource file. Source file rules are applied to regular programming source
    files. Each item in the rules array should be an
    object that contains the following properties, all of which are required:
    -   type (String) - the type of this rule. This may be any of the
        following:
        -   resource-matcher - check resources in a resource file. The
            regular expressions that match in the
            source strings must also match in the target string
        -   resource-source - check resources in a resource file. If
            the regular expressions match in the source string of a
            resource, a result will be generated
        -   resource-target - check resources in a resource file. If
            the regular expressions match in the target string of a
            resource, a result will be generated
        -   sourcefile - Check the text in a source file, such as a
            java file or a python file. Regular expressions that match
            in the source file will generate results
    -   name (String) - a unique dash-separated name of this rule.
        eg. "resource-url-match",
    -   description (String) - a description of what this rule is trying
        to do. eg. "Ensure that URLs that appear in the source string are
        also used in the translated string"
    -   note (String) - string to use when the regular expression check fails.
        eg. "URL '{matchString}' from the source string does not appear in
        the target string"
        Note that you can use `{matchString}` to show the user the string
        that the regular expression matched in the source but not in the target.
    -   regexps (Array.<String>) - an array of regular expressions to match
        against the source and/or target strings, depending on the "type"
        property. The expressions are treated as a short-circuit "or". That
        is, if any one of the expressions matches, the rule will create a
        single Result and the other regular expressions will not be tested. If you
        want to match multiple regular expressions, you should make multiple
    - fixes (Array<Object>) - declare auto-fixes to this problem. The properties
        in each fix can either be a name/value pair or a search/replace pair. You
        cannot mix the two. Each entry
        in the fixes array is an object that contains the following properties:
        - name/value style
            - name (String) - this gives the name of the metadata field to update
            - value (String) - this gives the value of the metadata field to update.
              If the name exists, but the value is missing or its value is empty,
              then the metadata field will be removed from the resource.
              Name/value pairs are used to update metadata fields in the resource
              that match the rule, and therefore only be used when the rule applies
              to resource files. If the name does not exist, then it will be added
              to the resource with the specified value.
        - search/replace style
            - search (String) - a regular expression to match against the previously
              matched string. The search
              will only be run against the part of the string that caused this rule
              to match in the first place. The regular expression should use
              javascript syntax.
            - replace (String) - a string to replace the matched text with. This
              string can use the normal javascript replacement syntax (eg. `$1`,
              `$2`, etc.) to re-insert the text that matched capturing groups in
              the search regular expression. If the replace property is not
              specified or if the value is the empty string, then the text
              that matched the search regular expression will be removed from the
              string.
-   formatters (Array of Object) - a set of declarative formatters. Each array element is
    an object that contains the following properties:
    -   name - a unique name for this formatter
    -   description - a description of this formatter to show to users
    -   template - a template string that shows how the various fields of a Result instance should be
        formatted, plus two extras that come from the rule: ruleName and ruleDescription
    -   highlightStart - string to use as the highlight starting marker in the highlight string
    -   highlightEnd - string to use as the highlight ending marker in the highlight string
-   rulesets (Object) - configure named sets of rules. Some rules can be shared between
    file types and others are more specific to the file type. As such, it is sometimes
    convenient to to name a set of rules and refer to the whole set by its name instead
    of listing them all out. The properties of the rulesets object are the names of the
    sets, and the values is also a Object that configures each rule that should be
    included in that set. The rules are turned on with a value "true" or with a
    rule-specific option. They are turned off with a falsy value.
-   filetypes (Object) - a set of configurations for various file types. The file types
    are given dash-separated names such as "python-source-files" so that they can be referred
    to in the
    paths object below. Properties in the filetypes object are the name of the file type,
    and the values are an object that gives the settings for that file type. The value
    object can contain any of the following properties:
    -   template (String, required) - a template that can be used to parse the
        file name for the locale of that file.
    -   locales (Array of String) - a set of locales that override
        the global locales list. If not specified, the file type uses the
        global set of locales.
    -   ruleset (String, Array of String, or Object) - name the rule set or
        list of rule sets to use with files of this type if the value is
        a string or an array of strings. When the value is a list of strings,
        the rules are a superset of all of the rules in the named rule sets.
        If the value is an object, then it is considered to be an on-the-fly
        unnamed rule set defined directly.
    -   parsers (Array of String) - explicitly name the parsers to use when
        parsing this type of file. If none are specified, then the linter will use
        the parser that knows how to parse files with the file name extension
        of the file being parsed. Eg, "js" files will be parsed by the
        "Javascript" parser. The idea behind the parsers array is that in some
        projects, there are some file types that use a non-standard file name
        extension and thus none of the parsers know how to parse it. For
        example, your project might have have some ".jscript"
        files in it, which are really Javascript, but the linter does not know
        that yet. You would specify the "Javascript" parser in the "jscript" file
        type to specify how to parse files of that type.
    -   transformers (Array of String) - name the transformers to apply to files
        of this type. The transformers are applied in the order specified.
        If none are specified, then the linter will not apply any transformers.
    -   serializer (String) - name the serializer to use when serializing a file
        of this type. If the file has been modified in some way, either by a
        Transformer or a Fixer plugin, the serializer can be used to serialize
        the modified file. If not specified, the linter will try to determine the
        serializer from the file name extension of the source file. If no appropriate
        serializer is found, the file will not be serialized.
-   paths (Object) - this maps sets of files to file types. The properties in this
    object are [micromatch](https://github.com/micromatch/micromatch) glob expressions
    that select a subset of files within the current project. The glob expressions
    can only be relative to the root of the project.
    The value of each glob expression property should be either a string that names
    a file type for files that match the glob expression, or an on-the-fly unnamed
    definition of the file type. If you specify the file type directly, it cannot be
    shared with other mappings, so it is usually a good idea to define a named file type
    in the "filetypes" property first.

The `ilib-lint-config.json` file can be written in [JSON5](https://github.com/json5/json5)
syntax, which means it can contain comments and other enhancements.

If you would like to see what parsers, transformers, and serializers you can use in your
config file, you can run the linter with the `--list` option in the root of your project.
This will list all of the parsers, rules, rulesets, formatters, transformers, and serializers
that are available in the plugins that are installed in your project.

### Example Config File

Here is an example of a configuration file:

```json
{
    // the name is required and should be unique amongst all your projects
    "name": "tester",
    // this is the global set of locales that applies unless something else overrides it
    "locales": ["en-US", "de-DE", "ja-JP", "ko-KR"],
    // list of plugins to load
    "plugins": ["react"],
    // default micromatch expressions to exclude from recursive dir searches
    "excludes": ["node_modules/**", ".git/**", "test/**"],
    // declarative definitions of new rules
    "rules": [
        // test that named parameters like {param} appear in both the source and target
        {
            "name": "resource-named-params",
            "type": "resource-matcher",
            "description": "Ensure that named parameters that appear in the source string are also used in the translated string",
            "note": "The named parameter '{matchString}' from the source string does not appear in the target string",
            "regexps": ["\\{\\w+\\}"],
            "link": "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/README.md"
        },
        // example of a declarative rule that includes auto-fixing
        {
            "name": "resource-quote-matcher",
            "type": "resource-target",
            "description": "Ensure that quotes in the target string are only single quotes",
            "note": "The quote {matchString} in the target string can only be single quote \"'\"",
            "regexps": ["[\"`]"],
            // this rule has an auto-fixer that will fix the quotes in the target string
            "fixes": [
                {
                    "search": "[\"`]",
                    "replace": "'"
                }
            ],
            // this rule has an option to only match quotes that are locale-specific
            "options": {
                "localeOnly": true
            }
        }
    ],
    "formatters": [
        {
            "name": "minimal",
            "description": "A minimalistic formatter that only outputs the path and the highlight",
            "template": "{pathName}\n{highlight}\n",
            "highlightStart": ">>",
            "highlightEnd": "<<"
        }
    ],
    // named rule sets to be used with the file types
    "rulesets": {
        "react-rules": {
            // this is the declarative rule defined above
            "resource-named-params": true,
            // the "localeOnly" is an option that the quote matcher supports
            // so this both includes the rule in the rule set and instantiates
            // it with the "localeOnly" option
            "resource-quote-matcher": "localeOnly"
        },
        "overrides": {
            "resource-camel-case": {
                // adds a list of exceptions for ResourceCamelCase rule
                "except": ["SomeException"]
            },
            "resource-snake-case": {
                // adds a list of exceptions for ResourceSnakeCase rule
                "except": ["some_exception"]
            }
        }
    },
    // defines common settings for a particular types of file
    "filetypes": {
        "json": {
            // override the general locales
            "locales": ["en-US", "de-DE", "ja-JP"],
            "ruleset": ["json"]
        },
        "javascript": {
            "ruleset": ["react-rules"]
        },
        "jsx": {
            "ruleset": ["react-rules"]
        },
        "xliff": {
            "ruleset": ["overrides"]
        },
        "sdl-xliff": {
            // these are actually special xliff files in our project,
            // but they have the same syntax as regular xliff, so we can
            // still use the regular xliff parser to parse them
            "parsers": [ "sdlxliff" ],
            "ruleset": ["resource"],
            // this transformer filters out all the "do not translate" translation units
            // from the xliff file -- they should not be translated anyways!
            "transformers": ["RemoveDoNotTranslateUnits"],
            "serializer": "sdlxliff"
        }
    },
    // this maps micromatch path expressions to a file type definition
    "paths": {
        // use the file type defined above
        "src/**/*.json": "json",
        "src/**/*.sdlxliff": "sdl-xliff",
        "src/**/*.js": "javascript",
        "src/**/*.jsx": "jsx",
        // define a file type on the fly
        "**/*.xliff": {
            "ruleset": {
                "formatjs-plural-syntax": true,
                "formatjs-plural-categories": true,
                "formatjs-match-substitution-params": true,
                "match-quote-style": "localeOnly"
            }
        }
    }
}
```

### Hierarchy

It may be instructive to understand how the hierarchy of settings works, as many
settings depend on other settings.

The top level setting is "paths". This maps a set of micromatch expressions to a
file type. In the example above, the "paths" object maps "src/**/*.json" to the
"json" file type. That is, all of the json files in the "src" directory and its
subdirectories will be processed with the rules for the json file type. The idea
is that you can define a set of file types in the "filetypes" section that are
different from each other, and then map sets of files in your project to those
file types. In this way, you can have a project that contains json files in the
src directory, and those json files are treated differently than json files in
the test directory.

A file type is a set of settings that apply to a particular type of file. It
specifies how to handle that file, what rules to apply, and so on. You can 
think of the settings in a file type definition as a pipeline. The pipeline
starts with the file. First, the file is read from disk, and then parsers are
applied so that the linter can sense of the file contents. From there, sets
of rules are applied to find any problems or issues with the file. Next, if
the plugins define any fixers, those fixers are applied to the file to try
to fix any problems. Next, if there are any transformers, those transformers
are applied to the file to transform it in some way. Finally, if the file has
been modified in some way, either by a Transformer or a Fixer plugin, the last
part of the pipeline is a serializer, which can write the file back to disk.

A rule is a way to define a set of conditions that must be met in
order for a file to be considered valid. Rules can be implemented as
declarative rules, which are defined in the config file, or as plugin rules,
which are defined with code in a plugin. Rules can be applied to any file
type as long as it understands the file type. For example, a rule that checks
for a missing semicolon could be applied to a JavaScript file, but it would
not be applied to a JSON file.

A declarative rule is made up of one or more
"matchers", which are regular expressions that match against the text in the
file. If a matcher matches, the rule is considered to have failed, and a
"result" is generated. A result is an object that contains information about
the failure, such as the line number, column number, and a message.

A rule set is simply a named collection of rules that can be applied to a file
type.

Results are collected together across all files and all rule sets and
presented to the user in a variety of ways depending on the formatter that is
used. The most common way is to output the results to the console in a
colorful human-readable format. Alternately, the results can be serialized to
a file in a variety of formats, including JSON or HTML, which might be
read by another tool or program such as an integrated development environment (IDE).
A plugin can implement a custom formatter to output the results in a format that
is useful to the consumer of the results.

Illustration of the hierarchy:

```
paths
    |
    +---> filetypes
    |         |
    |         +---> rulesets
    |                   |
    |                   +---> rules
    |
    +---> rulesets
              |
              +---> rules
```

The paths may map to file types, which in turn map to rulesets, which in turn map to rules.
Paths may also map directly to rulesets or rules if you do not want to define
a whole file type.

