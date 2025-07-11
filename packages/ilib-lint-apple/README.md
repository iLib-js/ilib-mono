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

### Examples

**No Lint Error**

Target matches the source, so no lint error:

```json
{
    "source": "Hello \(name), you have \(count) items.",
    "target": "Bonjour \(name), vous avez \(count) articles."
}
```

**Errors**

Missing parameter in the target:

```json
{
    "source": "Hello \(name), you have \(count) items.",
    "target": "Bonjour \(name)"
}
```

Different parameter names:

```json
{
    "source": "Hello \(name), you have \(count) items.",
    "target": "Bonjour \(user), vous avez \(items) articles."
}
```

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