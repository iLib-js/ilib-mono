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

Copyright © 2025-2026, JEDLSoft

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](https://github.com/iLib-js/ilib-mono/blob/main/LICENSE) file in the ilib-mono repository on GitHub.

## Release Notes

See [CHANGELOG.md](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-javascript/CHANGELOG.md).

