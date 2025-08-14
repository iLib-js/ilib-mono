# resource-quote-style

If you received this error in your project, that means that a string was found where:

- the source string contains quotes
- the target string does not contain quotes or the quotes are not correct for the
  target locale

Try adding quotes around the translation of the part of the source string that was
quoted, or adjusting the quotes in the target string to be appropriate for the target
locale.

## Standard Quote Requirements

For most locales, quotes are required when the source contains quotes. The target must use the appropriate quote style for that locale.

Example string with a problem:

source in English: This is a "string" in English.
target in German: Dies ist eine "Zeichenfolge" auf deutsch.

This would be flagged because the target is using the ASCII quotes instead of the
proper quotes in German. The correct proper quotes would look like this:

target: Dies ist eine „Zeichenfolge" auf deutsch.

## Optional Quote Languages

Some languages have been designated as "optional quote languages" where quotes are not strictly required in the target, even when the source contains quotes. However, if quotes are present, they must use the correct style for that locale.

In English and many other languages, quotation marks are used for various purposes:

- To mark text as something that a person said. eg. He said, "Hello!"
- a form of emphasis. eg. The egg was known as "golden".
- a way to refer to things. eg. The title of the movie was "Moonraker".
- a way to escape from the grammatical constraints of the sentence. The word "the" was not used properly.

In optional quote languages, quotation marks are used mostly for things that people say.

Currently, both Swedish and Italian are designated as optional quote languages, though other languages may be added to the list in the future.

### Example in Swedish (sv-SE)

In Swedish, quotes are optional according to Microsoft Style guidelines. This means:

- **No quotes in target**: ✅ Acceptable
- **Correct quotes in target**: ✅ Acceptable (using "text" style)
- **Wrong quotes in target**: ❌ Will trigger a warning

Examples:

```
source: This string contains "quotes" in it.
target (no quotes): Denna sträng innehåller citattecken.          ✅ OK
target (correct): Denna sträng innehåller ”citattecken”.         ✅ OK
target (wrong): Denna sträng innehåller »citattecken«.           ❌ Warning
```

The same type of thing applies to Italian.
