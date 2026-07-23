# resource-icu-plurals-translated

ICU-style plurals and selects are notoriously difficult for translators to get right.
This is because they are professional linguists, not programmers, and are usually
not clear on concepts like "balanced brackets" and such. To be fair, the syntax
is rather complicated, and if their translation tool does not automatically
pick out which parts need to be translated and which do not, they sometimes do not
interpret the plural syntax properly despite their best efforts. This means they end
up not translating parts of the string that do in fact need a translation.

If you got this warning, it means that the translator did not translate one or
more of the categories of a plural or select and it is the exact same string as in
the source. Sometimes, this is okay because the translation of the source string
is exactly the same in the target language, which means you can ignore this warning.
This is why this rule produces warnings instead of errors. A majority of the time,
however, it is a case of a missed translation.

Example:

English: "{numberOfFiles, plural, one {# file} other {# files}}"<br>
German: "{numberOfFiles, plural, one {# file} other {# Dateien}}

In this case, the German translator missed the "one" category. The string will
need to be sent back to the translator for retranslation.

## Exceptions

Sometimes, certain words or phrases are intentionally the same in both source and target languages.
For example, the word "File" in Italian is also "File" - the exact same spelling! These exceptions
may be phrases that happen to be the same, such as that example in Italian, or they may be loanwords
from other languages, which is common for computer and software terms.

In such cases, you can configure exceptions to suppress false warnings about untranslated plural categories.

### Configuration

You can configure exceptions by passing an object parameter to the rule constructor:

```javascript
{
    "rulesets": {
        "myruleset": {
            "resource-icu-plurals-translated": {
                "exceptions": {
                    "it": ["File", "Email", "Download", "File Download"],
                    "de": ["Download", "Upload"],
                    "fr": ["Email", "Internet"],
                    "pl": ["App Center"]
                }
            }
        }
    }
}
```

The `exceptions` property should be an object with language codes as keys and arrays of exception phrases as values.
Note that differences in region or script are ignored (e.g., exceptions for `it-IT` and `it-CH` will be folded into the same language `it`).

### Exception Matching

Once an untranslated plural category is found, the rule will check if it matches any of the exceptions configured for its target language.

Matching rules:

-   Exact matches only (no partial matching)
-   Case-insensitive
-   ICU MessageFormat syntax is NOT ignored (e.g. string `# File` will not match exception `File`)
-   Leading and trailing whitespace is ignored
-   Only language is considered (region and script are ignored; e.g., both `it-IT` and `it-CH` strings will be checked against exceptions configured for `it`)
