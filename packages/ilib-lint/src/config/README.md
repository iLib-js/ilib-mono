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
        separate declarative rules.
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
        projects, there are some file types uses a non-standard file name
        extension and thus none of the parsers knows how to parse it. For
        example, your project might have have some ".jscript"
        files in it, which are really Javascript, but the linter does not know
        that yet. You would specify the "Javascript" parser in the "jscript" file
        type to specify how to parse files of that type.
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
            "link": "https://github.com/ilib-js/ilib-lint/blob/main/README.md"
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
        "sdl-xliff": {
            // these are actually special xliff files in our project,
            // but they have the same syntax as regular xliff, so we can
            // still use the regular xliff parser to parse them
            "parsers": [ "xliff" ],
            "ruleset": ["resource"]
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
