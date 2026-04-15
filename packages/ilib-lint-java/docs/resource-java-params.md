# Resource Java Parameters

## Description

This rule checks that Java MessageFormat replacement parameters in source strings are properly matched in target strings.

## Java MessageFormat Syntax

Java MessageFormat uses indexed parameters with curly braces:

- `{0}`, `{1}`, `{2}` - Simple indexed parameters
- `{0,number,currency}` - Parameters with formatting
- `{0,date,short}` - Date/time formatting
- `{0,choice,0#no files|1#one file|1<{0,number,integer} files}` - Choice formatting

## Examples

### ✅ Correct Usage

**Source:** `"Hello {0}, you have {1} messages"`
**Target:** `"Hola {0}, tienes {1} mensajes"`

**Source:** `"Price: {0,number,currency}"`
**Target:** `"Precio: {0,number,currency}"`

### ❌ Incorrect Usage

**Source:** `"Hello {0}, you have {1} messages"`
**Target:** `"Hola {0}, tienes mensajes"` (missing `{1}`)

**Source:** `"Price: {0,number,currency}"`
**Target:** `"Precio: {0}"` (missing formatting - must be `{0,number,currency}`)

**Source:** `"Price: {0,number,currency}"`
**Target:** `"Precio: {0,date}"` (wrong formatting - cannot change parameter type)

## Error Messages

### Errors (Missing Parameters)
- `"Missing Java MessageFormat parameters in target: {0}, {1}"`
- `"Missing Java MessageFormat parameters in target: {0,number,currency}"` (for formatted parameters)
- `"Missing Java MessageFormat parameters in target array item [0]: {1}"`
- `"Missing Java MessageFormat parameters in target plural (other): {0}"`

### Warnings (Extra Parameters)
- `"Extra Java MessageFormat parameters in target: {1}"`
- `"Extra Java MessageFormat parameters in target array item [0]: {2}"`
- `"Extra Java MessageFormat parameters in target plural (other): {1}"`

## Important Notes

The rule checks that the **entire parameter specification** matches exactly between source and target. This means:

- `{0,number,currency}` in source must be `{0,number,currency}` in target
- `{0,date,short}` in source must be `{0,date,short}` in target  
- You cannot change `{0,number,currency}` to `{0,date}` or `{0}` - the full specification must match

## Configuration

This rule is enabled by default in the `java` rule set.

```javascript
{
    "ruleSets": {
        "java": {
            "resource-java-params": true
        }
    }
}
```

## Related

- [Java MessageFormat Documentation](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/MessageFormat.html)
- [resource-kotlin-params](./resource-kotlin-params.md) 