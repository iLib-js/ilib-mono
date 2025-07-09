# resource-tap-named-params

Ensure that named parameters in Tap I18n that appear in the source string are
also used in the translated string. Named parameters have the syntax __name__.
That is, they are a parameter name surrounded by double underscores. The same
parameter must also exist in the target string with the same name.
Sometimes translators accidentally translate
the name of the parameter or they forget to include the parameter in
the target string, and this rule helps to catch those cases.

[Tap I18n parameter names can include](https://i18next.github.io/i18next/pages/doc_features.html#interpolation):
- Letters (a-z, A-Z)
- Numbers (0-9, but not as the first character)
- Underscores (_)
- Dots (.) for property dereferencing

Parameter names cannot contain whitespace.

## Examples

### No Lint Error

Target matches the source, so no lint error:

```json
{
    "source": "Hello __name__",
    "target": "Bonjour __name__"
}
```

### Errors

Target does not match the source, triggering a lint error. Missing:

```json
{
    "source": "Hello __name__",
    "target": "Bonjour"
}
```

Different parameter names in source and target:

```json
{
    "source": "Hello __name__",
    "target": "Bonjour __user__"
}
```

### Property Dereferencing

Tap I18n supports property dereferencing with dots:

```json
{
    "source": "Hello __user.name__",
    "target": "Bonjour __user.name__"
}
```

### Complex Parameter Names

Parameters can include underscores and numbers:

```json
{
    "source": "Hello __user_name__, you have __item_1__ and __item_2__.",
    "target": "Bonjour __user_name__, vous avez __item_1__ et __item_2__."
}
```

### Deep Property Access

Multiple levels of property access are supported:

```json
{
    "source": "Your __account.settings.notifications.email__ is enabled.",
    "target": "Votre __account.settings.notifications.email__ est activé."
}
``` 