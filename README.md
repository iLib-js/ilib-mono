# ilib-lint-react

An ilib-lint plugin that provides the ability to parse React files and
provides rules to check resources that come from code written in React.

## Installation

```
npm install --save-dev ilib-lint-react

or

yarn add --dev ilib-lint-react
```

Then, in your `ilib-lib-config.json`, add some configuration:

```
    "plugins": [
        "react"
    ],
    "filetypes": {
        "jsx": {
            "parser": "jsx",
            "ruleset": [ "react" ]
        },
        "js": {
            "parser": "js",
            "ruleset": [ "javscript" ]
        }
    },
    "paths": {
        "src/**/*.jsx": "jsx",
        "src/**/*.js": "js"
    }
```

Please note: nodejs version 14 or above is required to run ilib-lint, as it
is written with ESM modules.

## Parsers

This plugin provides multiple parsers:

- JSParser - parser for regular Javascript files
- JSXParser - parser for React JSX files

Some projects use the file extension "js" instead of "jsx" for their JSX
files. If you are not sure what is in your files that have a "js" extension,
then use the jsx parser to be safe. Both parsers produce the same form of
intermediate representation that the rules can parse, and the JSX parser
has the ability to parse regular javascript as well as JSX syntax. You
should use the JSParser only if you want strict Javascript syntax which
throws exceptions if the file attempts to use JSX syntax.

## Rules

The following rules apply to any resources from any file type, but are
designed to check resources that come from react code:

- source-formatjs-plurals - check that any React-intl style plurals have
  correct syntax (NOT IMPLEMENTED YET)

## RuleSets

This plugin defines one ruleset `react` that will turn on all the rules
that this plugin supports. Users may rely on this ruleset when defining their
file types.

## License

Copyright © 2023, Box, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

## Release Notes

### v1.0.0

- initial version
- Parser for jsx and js files
- Rules for react resources
