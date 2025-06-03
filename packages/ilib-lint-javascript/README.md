# ilib-lint-javascript

An ilib-lint plugin that provides rules and rulesets for
linting strings from JavaScript files.


## Installation

```
npm install --save-dev ilib-lint-javascript

or

yarn add --dev ilib-lint-javascript
```

Then, in your `ilib-lib-config.json`, add a script:

```
    "plugins": [
        "ilib-lint-javascript"
    ],
```

Please note: nodejs version 14 or above is required to run ilib-lint, as it
is written with ESM modules.

## Rules

The following rules apply to any resources from any file type, but are
designed to check resources:

- resource-ilib-plural-syntax-checker - Checks that the ilib-style plural
  syntax of a plural string in the target is correct.
- resource-ilib-plural-categories-checker - Checks that the plural categories
  in the target ilib-style plural string are the ones that are expected for
  the target locale.

## RuleSets

This plugin defines the following rulesets:

- ilib - All rules that apply to strings in an ilib/javascript project.

## License

Copyright © 2025, JEDLSoft

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

See [CHANGELOG.md](./CHANGELOG.md)
