# Sample Applications

This directory contains a sample application demonstrating how to use
`ilib-glyphstring`. The sample is written in TypeScript, but usage from plain
JavaScript (whether ES6 or older ES5 code) is very similar.

## CLI sample

The `cli` sample is a small command-line tool that takes a string, segments it
into whole glyphs using a `GlyphString`, and prints each glyph on its own line
along with the Unicode code points that compose it.

### Key Library Usage

```typescript
import GlyphString from "ilib-glyphstring";

const gs = new GlyphString("á马👍");
const it = gs.charIterator();

while (it.hasNext()) {
    const glyph = it.next();
    // glyph is a whole on-screen glyph (base character + combining marks)
    console.log(glyph);
}
```

### Running the Sample

```bash
cd samples/cli
pnpm install
pnpm run:sample "á马👍"
```

You can also run it from the repo root for all packages with:

```bash
pnpm run:samples
```

### Example Output

Running it on the Devanagari word "नमस्ते":

```
$ pnpm run:sample "नमस्ते"
न	[U+0928]
म	[U+092E]
स्	[U+0938, U+094D]
ते	[U+0924, U+0947]
```

Each line shows the whole glyph followed by the list of Unicode code points
(in `U+XXXX` notation) that make it up. Note how "स्" and "ते" are each a single
glyph on screen even though they are composed of a base character plus a
combining mark. A supplementary-plane character such as an emoji (👍 =
`U+1F44D`) is likewise reported as a single glyph even though it is a surrogate
pair in UTF-16.

### What This Sample Demonstrates

- **Construction**: creating a `GlyphString` from a plain string
- **Glyph iteration**: using `charIterator()` to walk whole glyphs rather than
  individual UTF-16 code units

This sample focuses on demonstrating the library's core functionality rather
than being a comprehensive application. The actual library usage is just a few
lines of code.
