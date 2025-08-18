# resource-all-caps

If the source string is in ALL CAPS, then the target must also be in ALL CAPS.

This rule ensures that the target translation matches the casing style of the source string. If the source uses ALL CAPS, then the target should also use ALL CAPS, even though the content is translated.

## Rule explanation

ALL CAPS is a way of writing text where all letters are uppercase. In this context, any string that contains only uppercase letters, numbers, spaces, and punctuation is considered ALL CAPS and should maintain the same casing style in the target translation.

A string is considered to be in ALL CAPS if:
- It must be at least 2 characters long (single letters are not considered)
- The string may contain any characters, but if it contains at least 2 letter characters, and all letter characters in the string are upper-case, it is considered to be ALL CAPS

Examples of ALL CAPS strings:
- `ALL CAPS`
- `ALL CAPS TEXT`
- `ALL CAPS 123`
- `ALL CAPS!`
- ` ALL CAPS ` (with leading/trailing whitespace)
- `ALL CAPS 123!`
- `ALL-CAPS-TEXT`
- `ALL.CAPS.TEXT`

Examples of strings that are NOT in ALL CAPS:
- `A` (single letter)
- `all caps` (contains lowercase letters)
- `All Caps` (contains mixed case)
- `ALL CaPS` (contains lowercase letters)
- `all cAps` (contains lowercase letters)

## Examples

### Correct

Correct ALL CAPS translations in Spanish - target follows the style of source. No error will be produced.

```xliff
<source>ALL CAPS</source>
<target>TODO MAYÚSCULAS</target>
```

```xliff
<source>ALL CAPS TEXT</source>
<target>TODO MAYÚSCULAS TEXTO</target>
```

```xliff
<source>ALL CAPS 123</source>
<target>TODO MAYÚSCULAS 123</target>
```

### Incorrect

Incorrectly matched ALL CAPS in a Spanish translation:

```xliff
<source>ALL CAPS</source>
<target>todo mayúsculas</target>
```

Problems in the above incorrect translation:
The "ALL CAPS" string was translated but the casing style was not preserved. The target should maintain the ALL CAPS style.

## Language Exceptions

This rule only applies to languages that have capital letters in their script. For languages without capital letters (such as Arabic, Chinese, Japanese, Korean, Thai, and many others), the rule is automatically disabled and no errors will be reported.

### Languages where the rule applies:
- English, Spanish, French, German, Italian, Portuguese
- Russian, Greek, Turkish, Polish, Czech, Hungarian
- Romanian, Bulgarian, Croatian, Slovak, Slovenian
- Estonian, Latvian, Lithuanian
- And other languages with capital letters

### Languages where the rule is disabled:
- Arabic, Chinese, Japanese, Korean, Thai
- Hebrew, Persian, Urdu, Bengali, Hindi
- Tamil, Telugu, Kannada, Malayalam, Gujarati
- And other languages without capital letters

## Configuration

The rule can be configured to ignore certain strings using the `exceptions` parameter:

```json
{
  "rulesets": {
    "myset": {
      "resource-all-caps": {
        "exceptions": ["MY EXCEPTION", "ANOTHER EXCEPTION"]
      }
    }
  }
}
```

## How to Fix

When you see this error, you need to preserve the casing style of the source in your translation. The rule can automatically fix this by converting all letter characters in the target to uppercase while leaving non-letter characters unchanged. This happens when the
linter is running in auto-fix mode (ie. with the --fix command-line option).

**Before:**
```xliff
<source>ALL CAPS</source>
<target>todo mayúsculas</target>
```

**After (auto-fix applied):**
```xliff
<source>ALL CAPS</source>
<target>TODO MAYÚSCULAS</target>
```

The auto-fix will:
- Convert all letter characters to uppercase
- Leave numbers, punctuation, and other characters unchanged
- Preserve the original translation content

Alternatively, you can manually update your translation to match the ALL CAPS style of the source.

If you need to exclude certain strings from this rule, you can add them to the exceptions list in your configuration.

## Common Scenarios

### Error Messages and Status Codes
ALL CAPS strings are often used for error messages, status codes, or system identifiers where the casing style should be preserved.

**Correct:**
```xliff
<source>ERROR 404</source>
<target>ERROR 404</target>
```

**Incorrect:**
```xliff
<source>ERROR 404</source>
<target>Error 404</target>
```

### Button Labels and UI Elements
Sometimes UI elements use ALL CAPS for emphasis or consistency. The translation should maintain this style.

**Correct:**
```xliff
<source>SUBMIT</source>
<target>ENVIAR</target>
```

**Incorrect:**
```xliff
<source>SUBMIT</source>
<target>Enviar</target>
```

 