# resource-swift-params

Ensures that Swift string interpolation parameters in source strings also appear in target strings with the same parameter names.

## Description

This rule checks for Swift string interpolation syntax like `\(name)` and `\(expression)` in localized strings. If parameters are found in the source string, the target string must contain the same parameters.

Swift string interpolation allows embedding expressions within string literals using the `\(expression)` syntax. This rule ensures that all parameters used in the source string are also present in the target string, helping to prevent runtime errors when the localized strings are used.

## Examples

### No Lint Error

Target matches the source, so no lint error:

```json
{
    "source": "Hello \(name), you have \(count) items.",
    "target": "Bonjour \(name), vous avez \(count) articles."
}
```

### Errors

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

Extra parameter in the target:

```json
{
    "source": "Hello \(name), you have \(count) items.",
    "target": "Bonjour \(name), vous avez \(count) articles et \(extra) bonus."
}
```

## Supported Swift Interpolation Syntax

This rule supports the following Swift string interpolation patterns:

- Simple variables: `\(name)`, `\(count)`, `\(price)`
- Complex expressions: `\(count == 1 ? "item" : "items")`
- Formatted values: `\(price, specifier: "%.2f")`
- Method calls: `\(user.getName())`
- Computed properties: `\(user.fullName)`
