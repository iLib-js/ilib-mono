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
npm install ilib-lint-java
```

## Usage

Add the plugin to your ilib-lint configuration:

```javascript
import JavaPlugin from 'ilib-lint-java';

const config = {
    plugins: [
        JavaPlugin
    ]
};
```

## License

Copyright © 2025 JEDLSoft

Licensed under the Apache License, Version 2.0. 