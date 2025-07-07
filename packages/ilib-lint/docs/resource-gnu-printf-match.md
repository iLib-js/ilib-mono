# resource-gnu-printf-match

Test that GNU printf-style substitution parameters match in the source and target strings.
This rule ensures that GNU printf-style parameters in the source string also appear in the target
string with the same format specifiers. GNU printf supports positional parameters, width/precision
from arguments, and various format specifiers that must be preserved in translations.

Sometimes translators forget to include parameters in the target string, change the parameter
format, or use different positional arguments, and this rule helps to catch those cases.

## GNU printf Parameter Syntax

GNU printf parameters have the following syntax:
- `%[parameter][flags][width][.precision][length]type`
- Positional parameters: `%1$d`, `%2$s`, etc.
- Width from argument: `%*d`, `%1$*d`
- Precision from argument: `%.*f`, `%1$.*f`
- Width and precision from arguments: `%*.*f`, `%1$*.*f`

### Supported Format Specifiers

- `%d`, `%i` - signed decimal integer
- `%u` - unsigned decimal integer
- `%o` - unsigned octal
- `%x`, `%X` - unsigned hexadecimal
- `%f`, `%F` - decimal floating point
- `%e`, `%E` - scientific notation
- `%g`, `%G` - shortest representation
- `%c` - character
- `%s` - string
- `%p` - pointer address
- `%n` - number of characters written
- `%%` - literal percent sign

## Examples

### No Lint Error

Target matches the source, so no lint error:

```json
{
    "source": "Hello %s, you have %d items.",
    "target": "Bonjour %s, vous avez %d articles."
}
```

Positional parameters match:

```json
{
    "source": "Hello %1$s, you have %2$d items.",
    "target": "Bonjour %1$s, vous avez %2$d articles."
}
```

Width and precision from arguments match:

```json
{
    "source": "Value: %*.*f",
    "target": "Valeur: %*.*f"
}
```

### Errors

Target does not match the source, triggering a lint error.

Missing parameter in the target:

```json
{
    "source": "Hello %s, you have %d items.",
    "target": "Bonjour %s"
}
```

Different format specifiers:

```json
{
    "source": "Value: %d",
    "target": "Valeur: %f"
}
```

Different positional parameters:

```json
{
    "source": "Hello %1$s, you have %2$d items.",
    "target": "Bonjour %2$s, vous avez %1$d articles."
}
```

Extra parameter in target not in source:

```json
{
    "source": "Hello %s",
    "target": "Bonjour %s, count: %d"
}
```

### Complex Examples

Width and precision specifications:

```json
{
    "source": "Price: %8.2f",
    "target": "Prix: %8.2f"
}
```

Multiple positional parameters:

```json
{
    "source": "User %1$s has %2$d items in %3$s",
    "target": "L'utilisateur %1$s a %2$d articles dans %3$s"
}
```

Width from argument:

```json
{
    "source": "Value: %*d",
    "target": "Valeur: %*d"
}
```

### Array Resources

For array resources, parameters are checked for each corresponding string:

```json
{
    "source": ["Hello %1$s", "Welcome %1$s"],
    "target": ["Bonjour %1$s", "Bienvenue %1$s"]
}
```

### Plural Resources

For plural resources, parameters are checked for each category:

```json
{
    "source": {"one": "You have %d item", "other": "You have %d items"},
    "target": {"one": "Vous avez %d article", "other": "Vous avez %d articles"}
}
```

## Common Issues

1. **Missing parameters**: Translators sometimes forget to include parameters in the target string
2. **Wrong format specifiers**: Using `%f` instead of `%d` for integers, or vice versa
3. **Positional parameter mismatches**: Using `%1$s` in source but `%2$s` in target
4. **Extra parameters**: Adding parameters in the target that don't exist in the source
5. **Width/precision mismatches**: Different formatting specifications between source and target

## Related Rules

- `resource-csharp-numbered-params` - For C# numbered parameters
- `resource-angular-named-params` - For Angular named parameters
- `resource-tap-named-params` - For Tap I18n named parameters 