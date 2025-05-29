# resource-kebab-case

If the source string contains only kebab case and no whitespace, then the target must be the same.

The source string is treated as 'Do Not Translate' because kebab-cased strings are generally not meant to be translated.
Instead, they are commonly used in software as identifiers, variable names, or control strings.

## Rule explanation

Kebab case is a way of writing phrases without spaces, where spaces are replaced with hyphens (`-`), and the words are typically all lowercase.

In this context, any string that conforms to the following rules is considered kebab case and should not be translated:


A string is considered to be in kebab case if:
- It contains only letters, numbers, and hyphens
- Words are separated by single hyphens
- It may have leading or trailing whitespace
- It may have a leading or trailing hyphen
- It may contain mixed case letters
- It may contain only upper case letters

Examples of kebab case strings:
- `kebab-case`
- `kebab-case-with-multiple-words`
- `kebab-case-123`
- `Kebab-Case-Mixed`
- `KEBAB-CASE-UPPER`
- ` kebab-case ` (with leading/trailing whitespace)
- `kebab-case-` (with trailing hyphen)
- `-kebab-case` (with leading hyphen)

Examples of strings that are not in kebab case:
- `kebab case` (contains spaces)
- `kebabCase` (camel case)
- `PascalCase` (pascal case)
- `kebab_case` (snake case)
- `kebab.case` (contains dots)
- `kebab--case` (consecutive hyphens)

## Examples

### Correct

Correctly matched kebab case variations in a Spanish (es-ES) translation, where both source and target are the same:

```xliff
<source>access-granted</source>
<target>access-granted</target>
```

### Incorrect

Incorrectly matched kebab case in a Spanish translation:

```xliff
<source>access-granted</source>
<target>acceso-concedido</target>
```
Problems in the above incorrect translation:
The "access-granted" kebab-cased string was translated when it should have been treated as "Do Not Translate".

## Configuration

The rule can be configured to ignore certain strings using the `except` parameter:

```json
{
    "resource-kebab-case": {
        "except": ["some-kebab-case-string"]
    }
}
```

## Fix

This rule provides an automatic fix that replaces the target string with the source string when a violation is detected. 
