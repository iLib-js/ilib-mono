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

Copyright © 2023-2024, 2026, JEDLSoft

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-python/LICENSE) file in the ilib-mono repository on GitHub.

## Release Notes

See [CHANGELOG.md](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-python/CHANGELOG.md).

