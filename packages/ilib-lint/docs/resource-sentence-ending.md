# Resource Sentence Ending Rule

## What This Rule Checks

This rule ensures that sentence-ending punctuation in translated strings matches the conventions of the target language.

**Example Issue:**
```
Sentence ending punctuation should be "。" for ja-JP locale, not "."
```

## How to Fix

### For Japanese, Chinese, and Korean
Replace English punctuation with the appropriate full-width characters:

| English | Japanese/Chinese/Korean |
|---------|------------------------|
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

### For Unsupported Languages
The rule defaults to English punctuation. If you need different punctuation for your language, use custom configuration.

## Custom Configuration

If you need different punctuation rules for your project, add this to your config:

```json
{
  "rulesets": {
    "myset": {
      "resource-sentence-ending": {
        "fr": {
          "period": "!",
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

**Japanese/Chinese/Korean:**
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
