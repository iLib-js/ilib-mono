# ilib-lint-python

An ilib-lint plugin that provides the ability to parse po files and provides
rules to check resources that come from code written in python.


## Installation

```
npm install --save-dev ilib-lint-python

or

yarn add --dev ilib-lint-python
```

Then, in your `ilib-lib-config.json`, add a script:

```
    "plugins": [
        "python"
    ],
```

Please note: nodejs version 14 or above is required to run ilib-lint, as it
is written with ESM modules.

## Rules

The following rules apply to any resources from any file type, but are
designed to check resources that come from python code:

- resource-python-fstrings-match - check that any python-style substitution
  parameters for f-strings (like "{name}" or "{2}") that appear in the source
  string also appear in the target strings.
- resource-python-fstrings-numbered - check that if the source string contains
  more than one substitution parameter in the f-strings style, then the
  parameters are properly named or numbered so that the translators can
  rearrange them as needed by the grammar of the target language.
- resource-python-legacy-match - check that any legacy python-style substitution
  parameters (like "%(name)s" or "%(name)d") that appear in the source string
  also appear in the target strings.
- resource-python-template-match - check that any Template class-style substitution
  parameters (like "$name" or "$age") that appear in the source string
  also appear in the target strings.

## RuleSets

This plugin defines one ruleset `python` that will turn on all the rules
that this plugin supports. Users may rely on this ruleset when defining their
file types.

## License

Copyright © 2023-2024, JEDLSoft

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

### v2.0.1

- Fixed a bug where the exports were not properly set up in the package.json

### v2.0.0

- Updated dependency from i18nlint-common to ilib-lint-common
    - IntermediateRepresentation now takes a SourceFile as an
      parameter to the constructor instead of a file path
    - can now be loaded by ilib-lint >= v2

### v1.1.2

- updated dependencies
- converted all unit tests from nodeunit to jest

### v1.1.1

- fixed a bug where doubled curly braces (= escaped curly braces) were
  interpreted as replacement parameters
- updated dependencies

### v1.1.0

- updated dependencies
- update to i18nlint-common 2.x which requires the use of an intermediate
  representation

### v1.0.3

- Fixed a bug where a numeric parameter in the target FString, such as
  "{0}" would cause an exception

### v1.0.2

- Fix bug with parsing whitespace in params
    - allow for whitespace in the susbstitution parameter so that
      {name} = { name }
    - match based on the name only, but highlight the whole text of
      the parameter when there is an error

### v1.0.1

- updated dependencies

### v1.0.0

- initial version
- Rules for python resources
