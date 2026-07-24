# ilib-glyphstring

String subclass that iterates and truncates by whole glyphs, including
combining characters.

`GlyphString` extends [`ilib-istring`](https://www.npmjs.com/package/ilib-istring)
and adds glyph-aware iteration, truncation, and ellipsizing. A glyph here
means a base character plus any following combining marks that appear on
screen as a single unit.

## Installation

```
npm install ilib-glyphstring

or

yarn add ilib-glyphstring
```

## Why Glyphs Matter

In Unicode, accented and complex characters are often formed from a base
character followed by one or more combining marks. Those marks appear to
the user as a single glyph. For example, Latin "a" (U+0061) followed by
combining diaeresis "¨" (U+0308) form the glyph "ä".

Many CSS engines only ellipsize between Unicode code units or code points,
not between glyphs. If a layout allows four characters and the fourth is
a base with a combining mark as the fifth, CSS may truncate between them
and leave a broken glyph on screen (for example `"xxxa..."` instead of
`"xxxä..."`).

This problem is uncommon in everyday Latin text (which often uses
precomposed characters), but it is severe in scripts such as Thai,
Devanagari, and other Indic scripts that rely heavily on combining marks
because Unicode does not provide precomposed forms for every combination.

`GlyphString` is meant for truncation, hyphenation, and line wrapping —
operations that should break between glyphs, not between code points.
Prefer it over CSS `text-overflow: ellipsis` when your UI must respect
combining characters.

## The GlyphString Class

`GlyphString` inherits all of `IString` (formatting, locale-aware
plurals, code-point helpers, and so on) and overrides character iteration
so that each step yields a whole glyph.

```javascript
import GlyphString from "ilib-glyphstring";

const s = new GlyphString("aÄa"); // Ä is A + combining diaeresis
const it = s.charIterator();

it.next(); // "a"
it.next(); // "Ä"  (base + combining mark as one unit)
it.next(); // "a"
```

You can also construct asynchronously when locale/plural data
must be loaded first:

```javascript
import GlyphString from "ilib-glyphstring";

const s = await GlyphString.create("hello", { locale: "th-TH" });
```

Glyph combining-class and NFC composition tables are generated at build
time from the Unicode Character Database and shipped as static modules,
so they do not require an async load.

### Truncation

`truncate(length)` keeps the first `length` whole glyphs and returns a
plain string:

```javascript
import GlyphString from "ilib-glyphstring";

const s = new GlyphString("aẬbẬcẬdẬe"); // Ậ is A + two combining marks
console.log(s.truncate(4));
// "aẬbẬ"
```

Thai example (non-spacing marks stay with their bases):

```javascript
const s = new GlyphString("สวัุสดีคุณเป็นอย่างไรบ้าง");
console.log(s.truncate(4));
// "สวัุสดี"
```

If the last candidate glyph includes spacing combining marks (Unicode
general category `Mc`), that glyph is skipped. Spacing marks take
horizontal space, so including the base without them would change the
character and could overflow the intended width.

### Ellipsizing

`ellipsize(length)` truncates to `length - 1` glyphs and appends an
ellipsis (`…`), so the total is `length` glyphs including the ellipsis:

```javascript
import GlyphString from "ilib-glyphstring";

const s = new GlyphString("abcdefghijklmnop");
console.log(s.ellipsize(6));
// "abcde…"

const thai = new GlyphString("สวัุสดีคุณเป็นอย่างไรบ้าง");
console.log(thai.ellipsize(5));
// "สวัุสดี…"
```

### Iteration

`charIterator()` returns a `GlyphIterator` with:

- `hasNext()` — whether another glyph remains
- `next()` — the next whole glyph (or `undefined` when exhausted)
- `wasSpacingCombining()` — `true` if the last glyph from `next()`
  included spacing combining marks (`Mc`)

Because `forEach` on `IString` walks via `charIterator()`, calling
`forEach` on a `GlyphString` visits whole glyphs:

```javascript
import GlyphString from "ilib-glyphstring";

const s = new GlyphString("aÄa");
s.forEach((glyph) => {
    console.log(glyph);
});
// a
// Ä
// a
```

Surrogate pairs in the supplementary planes are treated as single
characters by the underlying code-point iterator, then grouped with any
following combining marks into glyphs.

### Spread and `for...of`

`GlyphString` and `GlyphIterator` work with the spread operator,
`for...of`, and `Array.from`. Each step is a whole glyph:

```javascript
import GlyphString from "ilib-glyphstring";

const s = new GlyphString("aÄa");

console.log([...s]);
// ["a", "Ä", "a"]

for (const glyph of s) {
    console.log(glyph);
}
// a
// Ä
// a
```

## The GlyphIterator Class

`GlyphIterator` is also available as a named export for cases where you
do not need a full `GlyphString` instance. It accepts a string, an
`IString`, or any object with `hasNext()` / `next()`. You can also use
`for...of` or spread on it:

```javascript
import { GlyphIterator } from "ilib-glyphstring";

const it = new GlyphIterator("क\u093Ea"); // क + Devanagari vowel sign आ
console.log(it.next()); // "का"
console.log(it.wasSpacingCombining()); // true (Mc)
console.log([...it]); // ["a"]
```

By default, the iterator recomposes adjacent starters when an NFC
mapping exists (including algorithmic Hangul Jamo composition). You can
override composition with the `compose` option. When compose succeeds,
the trail character is appended to the current glyph:

```javascript
import { GlyphIterator } from "ilib-glyphstring";

const it = new GlyphIterator("AB", {
    compose: (lead, trail) =>
        lead === "A" && trail === "B" ? "Æ" : undefined,
});
console.log(it.next()); // "AB" (one glyph because compose succeeded)
```

## Relationship to ilib-istring

| Concern | `IString` | `GlyphString` |
| --- | --- | --- |
| Iteration unit | Code points / characters | Whole glyphs (base + combining marks) |
| `for...of` / spread | Code points | Glyphs |
| Truncation | Not provided | `truncate`, `ellipsize` |
| Formatting / plurals | `format`, `formatChoice` | Inherited |
| Locale | Supported | Passed through to `IString` |

Use `IString` when you need formatting and code-point awareness. Use
`GlyphString` when display width and visual integrity of combining
sequences matter.

## License

Copyright © 2015-2018, 2023-2024, 2026 JEDLSoft

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-glyphstring/LICENSE) file in the ilib-mono repository on GitHub.

## Release Notes

See [CHANGELOG.md](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-glyphstring/CHANGELOG.md).
