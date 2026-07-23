# ilib-lint-apple

ilib-lint plugin for strings extracted from files from the Apple platforms.

## Installation

```sh
npm install --save-dev ilib-lint-apple
# or
yarn add --dev ilib-lint-apple
```

Then, in your `ilib-lint-config.json`, add the plugin:

```json
{
    "plugins": [
        "ilib-lint-apple"
    ]
}
```

Please note: nodejs version 14 or above is required to run ilib-lint, as it
is written with ESM modules.

## Rules

The following rule is designed to check resources that come from Apple platform code:

- **resource-swift-params** - Ensures that Swift string interpolation parameters in source strings also appear in target strings with the same parameter names.

This rule checks for Swift string interpolation syntax like `\(name)` and `\(expression)` in localized strings. If parameters are found in the source string, the target string must contain the same parameters.

## Rule Sets

This plugin defines one ruleset `apple` that will turn on all the rules
that this plugin supports. Users may rely on this ruleset when defining their
file types.

### Using the Rule Set

You can enable the entire "apple" rule set in your configuration:

```json
{
    "filetypes": {
        "xliff": {
            "ruleset": ["apple"]
        }
    }
}
```

Or define a custom rule set that can be used in a file type:

```json
{
    "rulesets": {
        "my-apple-rules": {
            "resource-swift-params": true
        }
    },
    "filetypes": {
        "xliff": {
            "ruleset": ["my-apple-rules"]
        }
    }
}
```

## License

Copyright © 2025-2026, JEDLSoft

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-apple/LICENSE) file in the ilib-mono repository on GitHub.

## Release Notes

See [CHANGELOG.md](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-apple/CHANGELOG.md).

