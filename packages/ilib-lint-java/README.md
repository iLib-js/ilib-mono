# ilib-lint-java

ilib-lint plugin that implements rules to check Java and Kotlin sources and translations.

## Rules

### resource-java-params

Checks that Java MessageFormat replacement parameters in source strings are properly matched in target strings.

**Example:**
```java
// Source: "Hello {0}, you have {1} messages"
// Target: "Hola {0}, tienes {1} mensajes" ✓
// Target: "Hola {0}, tienes mensajes" ✗ (missing {1})
```

### resource-kotlin-params

Checks that Kotlin string template parameters in source strings are properly matched in target strings.

**Example:**
```kotlin
// Source: "Hello $name, you have $count messages"
// Target: "Hola $name, tienes $count mensajes" ✓
// Target: "Hola $name, tienes mensajes" ✗ (missing $count)
```

## Installation

```bash
npm install --save-dev ilib-lint-java
# or
yarn add --dev ilib-lint-apple
```

## Usage

Add the plugin to your ilib-lint-config.json configuration:

```json
{
    // [...]
    plugins: [
        "ilib-lint-java"
    ],
    filetypes: {
        "properties": {
            "rulesets": [ "generic", "java" ]
        }
    },
    "paths": {
        "locales/**/*.xliff": "properties"
    }
};
```

## License

Copyright © 2025-2026 JEDLSoft

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-java/LICENSE) file in the ilib-mono repository on GitHub.

## Release Notes

See [CHANGELOG.md](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-java/CHANGELOG.md).

