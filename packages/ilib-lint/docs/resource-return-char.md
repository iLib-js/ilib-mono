# Resource Return Character Rule

## Overview

The `resource-return-char` rule checks that the number of return characters (CR, LF, CRLF) in the source string matches the number in the target string. This is particularly important for Windows applications where return characters are used for formatting output.

## What it checks

This rule counts all return characters in both source and target strings in a platform-agnostic way:

- **CR** (`\r`) - Carriage Return
- **LF** (`\n`) - Line Feed
- **CRLF** (`\r\n`) - Carriage Return + Line Feed (counted as one return character)

The rule ensures that the total count of return characters is identical between source and target.

## Error Severity

This rule produces **errors** (not warnings) because mismatched return character counts can cause serious formatting issues in Windows applications.

## Examples

### ✅ Correct - Matching return characters

**Source:** `"Line 1\nLine 2\nLine 3"` (2 newlines)
**Target:** `"Zeile 1\nZeile 2\nZeile 3"` (2 newlines)
**Result:** No error

### ❌ Incorrect - Mismatched return characters

**Source:** `"Line 1\nLine 2\nLine 3"` (2 newlines)
**Target:** `"Zeile 1\nZeile 2"` (1 newline)
**Result:** Error - "Return character count mismatch: source has 2 return character(s), target has 1"

### ❌ Incorrect - Missing return characters

**Source:** `"Line 1\nLine 2"` (1 newline)
**Target:** `"Zeile 1 Zeile 2"` (0 newlines)
**Result:** Error - "Return character count mismatch: source has 1 return character(s), target has 0"

### ❌ Incorrect - Extra return characters

**Source:** `"Line 1 Line 2"` (0 newlines)
**Target:** `"Zeile 1\nZeile 2"` (1 newline)
**Result:** Error - "Return character count mismatch: source has 0 return character(s), target has 1"

## How to fix

When this rule reports an error, the translation vendor must:

1. **Count the return characters** in the source string
2. **Ensure the target string has exactly the same number** of return characters
3. **Place the return characters in appropriate locations** in the target text
4. **Redeliver the corrected translation**

### Common scenarios:

- **Missing line breaks:** Add the appropriate number of line breaks to the target
- **Extra line breaks:** Remove excess line breaks from the target
- **Wrong line break placement:** Move line breaks to match the source structure

## Configuration

This rule is part of the `windows` ruleset and has no configurable parameters.

## Auto-fix

This rule does not provide auto-fix functionality because the correct placement of return characters in the target string cannot be automatically determined.