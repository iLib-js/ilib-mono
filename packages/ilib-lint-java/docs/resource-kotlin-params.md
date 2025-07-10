# Resource Kotlin Parameters

## Description

This rule checks that Kotlin string template parameters in source strings are properly matched in target strings.

## Kotlin String Template Syntax

Kotlin uses string templates with dollar signs:

- `$variable` - Simple variable interpolation
- `${expression}` - Expression interpolation
- `${user.name}` - Property access
- `${if (condition) "yes" else "no"}` - Complex expressions

## Examples

### ✅ Correct Usage

**Source:** `"Hello $name, you have $count messages"`
**Target:** `"Hola $name, tienes $count mensajes"`

**Source:** `"Hello ${user.name}, you have ${messages.size} messages"`
**Target:** `"Hola ${user.name}, tienes ${messages.size} mensajes"`

**Source:** `"Price: $price"`
**Target:** `"Precio: $price"`

### ❌ Incorrect Usage

**Source:** `"Hello $name, you have $count messages"`
**Target:** `"Hola $name, tienes mensajes"` (missing `$count`)

**Source:** `"Hello ${user.name}, you have ${messages.size} messages"`
**Target:** `"Hola $user, tienes mensajes"` (missing `${messages.size}`)

## Error Messages

- `"Missing Kotlin string template parameters in target: $count, $price"`
- `"Missing Kotlin string template parameters in target array item [0]: $name"`
- `"Missing Kotlin string template parameters in target plural (other): $count"`

## Configuration

This rule is enabled by default in the `java` rule set.

```javascript
{
    "ruleSets": {
        "java": {
            "resource-kotlin-params": true
        }
    }
}
```

## Notes

- The rule extracts the main variable name from expressions like `${user.name}` as `user`
- Complex expressions are simplified to their primary variable when possible
- Both simple (`$variable`) and expression (`${expression}`) syntax are supported

## Related

- [Kotlin String Templates Documentation](https://kotlinlang.org/docs/strings.html#string-templates)
- [resource-java-params](./resource-java-params.md) 