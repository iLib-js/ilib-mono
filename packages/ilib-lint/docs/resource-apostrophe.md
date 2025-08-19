# Resource Apostrophe Rule

## What This Rule Detects

The Resource Apostrophe rule identifies when ASCII straight quotes (`'` - U+0027) are used as apostrophes in your translated strings instead of proper Unicode apostrophes (`'` - U+2019).

**Important Limitation**: This rule only checks for apostrophes that appear in the middle of words (e.g., `don't`, `it's`, `user's`). It does not check for apostrophes at the beginning or end of words (e.g., `'twas`, `cats'`) because these cases are ambiguous - they could be either apostrophes or quotation marks, and the rule cannot reliably distinguish between them.

## Why This Matters

Using ASCII straight quotes as apostrophes can cause:
- **Display issues** in some fonts and systems
- **Inconsistent typography** across different platforms
- **Accessibility problems** for screen readers
- **Professional appearance** concerns in published content

## Examples of What Gets Flagged

### ❌ Problematic Usage
```
It's a test.          // ASCII straight quote
Don't forget.         // ASCII straight quote
The user's data.      // ASCII straight quote
```

### ✅ Correct Usage
```
It's a test.          // Unicode apostrophe
Don't forget.         // Unicode apostrophe
The user's data.      // Unicode apostrophe
```

## How to Fix

Replace all ASCII straight quotes (`'`) that are used as apostrophes with Unicode apostrophes (`'`).

### Auto-Fix Available
This rule provides automatic fixes! When you run the linter with the `--fix` flag, it will automatically convert ASCII straight quotes to Unicode apostrophes in your target strings.

### Manual Replacement
Simply replace `'` with `'` wherever you see it used as an apostrophe.

## When This Rule Won't Help

This rule specifically targets apostrophe usage. It won't flag:
- Straight quotes used for actual quotation marks (use `"` and `"` instead)
- Apostrophes in source strings (only target strings are checked)
- Languages that don't use apostrophes (Japanese, Chinese, etc.)
- **Apostrophes at word boundaries** (e.g., `'twas`, `cats'`) because these are ambiguous and could be either apostrophes or quotation marks
