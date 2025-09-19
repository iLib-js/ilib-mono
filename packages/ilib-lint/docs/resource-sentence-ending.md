# Resource Sentence Ending Rule

## What This Rule Checks

This rule ensures that sentence-ending punctuation in translated strings matches the conventions of the target language.

**Example Issues:**
```
Sentence ending punctuation should be "。" for ja-JP locale, not "."
```

## How to Fix

### For Japanese and Chinese
Replace English punctuation with the appropriate full-width characters:

| English | Japanese/Chinese |
|---------|-----------------|
| `.` | `。` |
| `?` | `？` |
| `!` | `！` |
| `:` | `：` |

**Before:**
```xml
<target>こんにちは世界.</target>
```

**After:**
```xml
<target>こんにちは世界。</target>
```

### For Other Supported Languages

| Language | Period | Question | Exclamation |
|----------|--------|----------|-------------|
| Greek | `.` | `;` | `!` |
| Arabic | `.` | `؟` | `!` |
| Tibetan | `།` | `།` | `།` |
| Amharic | `።` | `፧` | `!` |
| Urdu | `۔` | `؟` | `!` |
| Assamese | `।` | `?` | `!` |
| Hindi | `।` | `?` | `!` |
| Oriya | `।` | `?` | `!` |
| Punjabi | `।` | `?` | `!` |
| Kannada | `।` | `?` | `!` |

### For Other Languages
The rule defaults to English punctuation. If you need different punctuation for your language, use custom configuration.

## Custom Configuration

You can override the default punctuation rules for specific locales by providing custom configuration. The configuration uses locale codes as keys and punctuation mappings as values.

### Rule Behavior Configuration

The rule includes several built-in behaviors to avoid false positives:

#### Minimum Length Threshold
By default, the rule skips strings shorter than 10 characters to avoid checking abbreviations and short phrases that aren't grammatical sentences.

```json
{
  "rulesets": {
    "myset": {
      "resource-sentence-ending": {
        "minimumLength": 15
      }
    }
  }
}
```

#### Automatic Exception Handling
The rule automatically skips checking strings that:
- Have no spaces (likely identifiers or single words)
- Are shorter than the minimum length threshold

#### Exception Lists
You can specify exact source strings to skip checking for specific locales:

```json
{
  "rulesets": {
    "myset": {
      "resource-sentence-ending": {
        "de-DE": {
          "exceptions": [
            "See the Dr.",
            "Visit the Prof.",
            "Check with Mr."
          ]
        }
      }
    }
  }
}
```

### Custom Punctuation Configuration

#### Full Custom Configuration

To completely override all punctuation types for a locale:

```json
{
  "rulesets": {
    "myset": {
      "resource-sentence-ending": {
        "ja-JP": {
          "period": ".",
          "question": "?",
          "exclamation": "!",
          "ellipsis": "...",
          "colon": ":"
        }
      }
    }
  },
  "filetypes": {
    "mytype": {
      "ruleset": [ "myset" ]
    }
  }
}
```

#### Partial Custom Configuration

You can override only specific punctuation types. Unspecified types will use the default rules for that language:

```json
{
  "rulesets": {
    "myset": {
      "resource-sentence-ending": {
        "ja-JP": {
          "question": "?",
          "exclamation": "!"
        }
      }
    }
  },
  "filetypes": {
    "mytype": {
      "ruleset": [ "myset" ]
    }
  }
}
```

In this example, Japanese will use:
- **Custom**: Question mark (`?`) and exclamation mark (`!`)
- **Default**: Period (`。`), ellipsis (`…`), and colon (`：`)

#### Multiple Locales

You can configure different punctuation rules for multiple locales:

```json
{
  "rulesets": {
    "myset": {
      "resource-sentence-ending": {
        "ja-JP": {
          "period": ".",
          "question": "?"
        },
        "zh-CN": {
          "period": ".",
          "exclamation": "!"
        },
        "fr-FR": {
          "ellipsis": "..."
        }
      }
    }
  },
  "filetypes": {
    "mytype": {
      "ruleset": [ "myset" ]
    }
  }
}
```

#### Combined Configuration Example

Here's a comprehensive example showing all configuration options together:

```json
{
  "rulesets": {
    "myset": {
      "resource-sentence-ending": {
        "minimumLength": 8,
        "ja-JP": {
          "period": "。",
          "question": "？",
          "exclamation": "！",
          "exceptions": [
            "Loading...",
            "Please wait..."
          ]
        },
        "de-DE": {
          "exceptions": [
            "See the Dr.",
            "Visit the Prof.",
            "Check with Mr."
          ]
        },
        "fr-FR": {
          "ellipsis": "..."
        }
      }
    }
  },
  "filetypes": {
    "mytype": {
      "ruleset": [ "myset" ]
    }
  }
}
```

This configuration:
- Sets minimum length to 8 characters
- Configures Japanese punctuation and exceptions
- Adds German exceptions for common abbreviations
- Overrides French ellipsis behavior

### Supported Punctuation Types

The following punctuation types can be customized:

| Type | Description | Default |
|------|-------------|---------|
| `period` | Sentence-ending period | `.` |
| `question` | Question mark | `?` |
| `exclamation` | Exclamation mark | `!` |
| `ellipsis` | Ellipsis (three dots) | `…` |
| `colon` | Colon | `:` |

### Configuration Behavior

- **Locale Validation**: Only valid locales are processed. Invalid locales are ignored with a warning.
- **Language-Based Storage**: Custom configurations are stored by language code (e.g., "ja" for Japanese) and apply to all locales of that language.
- **Merging**: Custom configurations merge with the default locale-specific rules, so you only need to specify the punctuation types you want to override.
- **Fallback**: If a punctuation type is not specified in the custom configuration, the rule uses the default punctuation for that language.
- **Exception Processing**: Exception lists are processed before punctuation checking, so strings in the exception list will never trigger warnings regardless of punctuation mismatches.
- **Automatic Skipping**: The rule automatically skips strings that are shorter than `minimumLength` or have no spaces (unless they end with sentence-ending punctuation).

## Exception Behaviors

The rule includes several built-in behaviors to avoid false positives on non-sentence content:

### Short Strings
Strings shorter than the `minimumLength` threshold (default: 10 characters) are automatically skipped:

**Examples of skipped strings:**
- `"A.M."` (4 characters)
- `"Tues."` (6 characters)
- `"Dr."` (3 characters)

**Examples of checked strings:**
- `"Welcome to our site!"` (21 characters)
- `"Please see the Doctor."` (18 characters)

### No-Space Strings
Strings with no spaces are automatically skipped:

**Examples of skipped strings:**
- `"FONT_NAME_FRONTEND_ADMIN!"` (no spaces, identifier pattern)
- `"sentence-ending-rule:"` (no spaces, identifier pattern)

**Examples of checked strings:**
- `"Hi."` (no spaces but ends with period)
- `"Loading..."` (no spaces but ends with ellipsis)

### Exception Lists
Strings in locale-specific exception lists are always skipped:

**Example:**
```json
{
  "de-DE": {
    "exceptions": ["See the Dr.", "Visit the Prof."]
  }
}
```

Even if the target lacks punctuation, these source strings will never trigger warnings.

## Common Scenarios

### Quotes at the End
The rule handles quotes correctly. Focus on the punctuation before the quotes:

**Correct:**
```xml
<source>He said "Hello."</source>
<target>彼は「こんにちは。」と言いました</target>
```

**Incorrect:**
```xml
<source>He said "Hello."</source>
<target>彼は「こんにちは。」と言いました.</target>
```

### Ellipsis
Replace `...` with the appropriate character for your language:

**Japanese/Chinese:**
```xml
<source>Loading...</source>
<target>読み込み中…</target>
```

## Disabling the Rule

If you need to disable this rule for specific cases, add it to your ignore list:

```json
{
  "rules": {
    "resource-sentence-ending": false
  }
}
```
