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

### Full Custom Configuration

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

### Partial Custom Configuration

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

### Multiple Locales

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
