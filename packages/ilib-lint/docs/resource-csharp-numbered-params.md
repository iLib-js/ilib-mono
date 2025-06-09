# resource-csharp-numbered-params

Ensure that named C# parameters that appear in the source string are
also used in the translated string. Numbered parameters have the syntax {0}
and may optionally have some formatting instructions, such as {0:D} for a
decimal number. The same
parameter must also exist in the target string containing the same numbered
parameter along with the optional formatting instructions.
Sometimes translators forget to include the parameter in
the target string, and this rule helps to catch those cases.

## Examples

### No Lint Error

Target matches the source, so no lint error:

```json
{
    "source": "Hello {0}",
    "target": "Bonjour {0}"
}
```

### Errors

Target does not match the source, triggering a lint error.

Missing parameter in the target:

```json
{
    "source": "Hello {0}",
    "target": "Bonjour"
}
```

Target has a different parameter number in source and target:

```json
{
    "source": "Hello {0}",
    "target": "Bonjour {1}"
}
```

Target has the same parameter number, but with different formatting:

```json
{
    "source": "Hello {0:D}",
    "target": "Bonjour {0}"
}
```
