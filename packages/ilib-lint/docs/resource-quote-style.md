# resource-quote-style

If you received this error in your project, that means that a string was found where:

- the source string contains quotes
- the target string does not contain quotes or the quotes are not correct for the
  target locale

Try adding quotes around the translation of the part of the source string that was
quoted, or adjusting the quotes in the target string to be appropriate for the target
locale.

Example string with a problem:

source in English: This is a “string” in English.
target in German: Dies ist eine "Zeichenfolge" auf deutsch.

This would be flagged because the target is using the ASCII quotes instead of the
proper quotes in German. The correct proper quotes would look like this:

target: Dies ist eine „Zeichenfolge“ auf deutsch.
