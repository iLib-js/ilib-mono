# ilib-istring Architecture

This document describes the internal architecture of `ilib-istring`, how the
pieces of code fit together, how the locale (plural) data is generated, built,
and loaded, and — in detail — how plural categories are computed from that data.
It also records a key design decision about the root plural data and why the
"empty" plural files for certain languages must be kept.

## 1. Overview

`ilib-istring` provides `IString`, a string class that mirrors the intrinsic
JavaScript `String` API and adds localization-aware formatting. Its
locale-dependent behavior — choosing a plural category for a number — is driven
by CLDR plural rules that are compiled into per-locale data files and loaded at
runtime.

This document covers how that data is generated, built, loaded, and evaluated.
The public method signatures and the choice-format syntax are described in the
JSDoc API documentation and are not repeated here.

## 2. Design decision: root plural data is English-like

### Source-of-truth principle

**CLDR is the single source of truth for all per-language plural data.** Every
`locale/<lang>/[<script>/][<region>/]plurals.json` file is generated directly
from `cldr-core` by `scripts/generate.js` and must not be hand-edited — re-run
`build:data` to change them.

**The one deliberate exception is `root`** (`locale/plurals.json`). CLDR's own
root defines no categories (i.e. `other`-only). We intentionally deviate and put
an English-like rule at root instead (see rationale below). `root` is therefore
the only plural data in this package that is *not* taken from CLDR.

### The decision

The root plural data (`locale/plurals.json`) contains the **English-like**
plural rule set: a single `one` category (for `i = 1` and `v = 0`, i.e. the
integer 1), with everything else falling into the mandatory `other` category.
`IString.plurals_default` (a hard-coded fallback used in the browser when a data
file cannot be loaded synchronously) contains the **same** rule.

This mirrors the behavior of the original monolithic `ilib` library, which had
no separate root plural data — only a built-in English-like fallback.

### Consequence: the "empty" plural files are required

Many languages have no numeric plural distinction (they only use the `other`
category): Japanese, Korean, Chinese, Thai, Vietnamese, Indonesian, Igbo,
Yoruba, and ~30 others. For each of these, `generate.js` writes an **explicit
empty** `plurals.json` containing `{}`.

These empty files are **not** redundant. They exist to *override* the
English-like `one` rule inherited from root. The data is resolved
"most specific wins" (see §5), and an empty `{}` counts as data, so it overrides
root. Without the empty file, such a language would inherit root's `one` rule
and incorrectly select the `one` category for the number 1.

Concretely, for Japanese (`ja`):

- **With** `ja/plurals.json = {}` → `this.plurals = {}` → `ruleset["one"]` is
  `undefined` → `"one"` never matches → the number 1 selects `other`. Correct.
- **Without** it → `this.plurals = {one: <english rule>}` → `"one"` matches the
  number 1 → wrong category.

### Why English-like at root is a reasonable default

For the ~600 languages that CLDR has no plural data for at all, `IString` falls
back to the root/default rule. English-like is the "least wrong" choice:

- **English-like languages** — exactly right.
- **Other-only / non-plural languages** — usually still correct in practice.
  A translation for such a language will only contain an `other` (or default)
  segment, so even if the category logic computed `one`, `formatChoice` has no
  `one#` segment to select and falls through to the mandatory `other` string.
  (The explicit empty files make the *category computation itself* correct for
  the known other-only languages, which also keeps the test suite honest.)
- **Complex plural languages** (dual, or Slavic-style few/many) — the root gets
  some categories wrong, but only matters when the translation actually provides
  a distinct string for a category that differs from the `other` string.

The `other` category is always mandatory and is the universal fallback in
`formatChoice`, which is what makes an imperfect default tolerable.

## 3. Code structure

```
packages/ilib-istring/
├── src/
│   └── index.js            # The entire IString implementation + plural engine
├── locale/                 # SOURCE plural data, one plurals.json per locale
│   ├── plurals.json        # ROOT data (English-like default rule)
│   ├── en/plurals.json     # English (own copy of the one/other rule)
│   ├── ja/plurals.json     # {}  (explicit empty → overrides root)
│   └── <lang>/[<script>/][<region>/]plurals.json
├── assembled/              # BUILD OUTPUT for the browser (one JS file per locale)
├── test-web/               # BUILD OUTPUT: webpack bundle of the browser test suite
├── locales.json            # SOURCE list of locales to assemble for the browser build
├── assemble.mjs            # ilib-assemble plugin: reads locale/**/plurals.json
├── scripts/
│   └── generate.js         # Regenerates locale/**/plurals.json from cldr-core
└── docs/
    └── Architecture.md     # This document
```

### Key modules and how they interact

- **`src/index.js`** — Defines the `IString` class. Contains:
  - The constructor (synchronous) and `IString.create()` (asynchronous factory).
  - `init()` which loads the locale's plural rule set into `this.plurals`.
  - `format()` and `formatChoice()`.
  - `IString._fncs` — the plural rule evaluation engine (a small interpreter
    for the compiled CLDR rule AST) and `calculateNumberDigits()` (computes the
    CLDR plural operands `n, i, v, w, f, t, c, e`).
  - `plurals_default` — the hard-coded English-like fallback rule.

- **External dependencies:**
  - `ilib-localedata` — `getLocaleData()` / `LocaleData` handle caching, root
    resolution, and sync/async loading of `plurals` data.
  - `ilib-loader` — provides the platform-specific loader (Node reads files from
    disk synchronously; the browser uses the webpack loader, which is
    **async-only**).
  - `ilib-locale` — `Locale` parsing and sublocale generation.
  - `ilib-env` — `getPlatform()` / `getLocale()`.
  - `ilib-common` — `Utils`, `JSUtils`, `MathUtils`, `Path`.

## 4. Data generation and build pipeline

### 4.1 Generating source data (`scripts/generate.js`, run via `build:data`)

- Reads `node_modules/cldr-core/supplemental/plurals.json`
  (`plurals-type-cardinal`). CLDR is the source of truth for every generated
  file; the only value not derived from CLDR is `root` (see §2).
- For each language, compiles the human-readable CLDR rule text (e.g.
  `"i = 1 and v = 0 @integer 1"`) into a JSON rule AST via `create_rule()`.
- Writes `locale/<lang>/plurals.json`. Languages that CLDR defines with only the
  `other` category compile to an empty rule set and are written as an explicit
  `{}` so they override the root fallback (see §2).

### 4.2 Assembling data for the browser (`build:assemble`)

The browser cannot load individual data files synchronously, so all needed data
is pre-assembled:

- `build:assemble` runs `ilib-assemble` with `--localefile ./locales.json`.
- `locales.json` is a **tracked source file** listing which locales to include
  in the browser build. (It is an *input*, not an artifact — do not delete it in
  `clean`.)
- `assemble.mjs` is the plugin that, for each requested locale, walks its
  sublocales (`root`, language, script, region) and reads the corresponding
  `locale/**/plurals.json`, merging them into a single per-locale JS module
  under `assembled/` (e.g. `assembled/ru-RU.js`). Each assembled module is
  self-contained and includes the `root` data.

### 4.3 Building the browser test bundle (`build:test:browser`)

`build:assemble` → `build:dev` → `build:test:browser-suite` (webpack). Webpack
uses the `calling-module` alias pointed at `assembled/` so the webpack loader can
`import()` the per-locale chunks on demand. The output bundle
`test-web/ilib-istring-test.js` is loaded by `test/testSuite.html`.

## 5. Data loading at runtime

`init()` obtains a `LocaleData` instance via `getLocaleData({ basename: "plurals",
path: localeDir(), sync })` and calls `loadData({ basename: "plurals", locale,
mostSpecific: true, sync })`.

- `localeDir()` returns:
  - Node: `<module>/../locale` (individual JSON files, loaded synchronously).
  - Browser: `../assembled` (pre-assembled per-locale JS modules).

- **`mostSpecific: true`** means the result is the data of the *most specific*
  sublocale that has any data. Sublocales are ordered least→most specific
  (`root` → `ja` → `ja-JP`), and the reducer keeps the last one with truthy data.
  Because an empty `{}` is truthy, an empty language file overrides the root
  rule — this is the mechanism that makes the "empty override" files work.

- **Sync vs async:**
  - Node's loader supports synchronous loading, so the constructor works
    directly.
  - The browser's webpack loader is async-only. Synchronous construction in the
    browser therefore requires the data to already be in the cache. Either use
    `IString.create()` (async), or pre-load with `LocaleData.ensureLocale(...)`
    after registering the correct global root (`../assembled`). If sync data is
    not cached, `init()` catches the failure and falls back to
    `plurals_default` (English-like).

## 6. How plural categories are calculated from the data

This is the core of the locale-dependent behavior. It happens in three steps:
compute operands, evaluate the rule AST, select the category.

### 6.1 The rule data format (compiled CLDR AST)

`this.plurals` is a map from category name to a rule AST. Example (Russian
`one`, roughly "i % 10 = 1 and i % 100 != 11"):

```json
{
  "one": {
    "and": [
      { "eq": [ { "mod": [ "i", 10 ] }, 1 ] },
      { "neq": [ { "mod": [ "i", 100 ] }, 11 ] }
    ]
  }
}
```

Nodes are objects keyed by an operator; operands are either:

- an **operand symbol** — a string like `"i"`, `"n"`, `"v"`, `"f"`, `"t"`,
  `"w"`, `"c"`, `"e"` (resolved against the computed operands),
- a **literal number**, or
- a **nested rule** object/array.

Supported operators (implemented in `IString._fncs`): `and`, `or`, `eq`/`is`,
`neq`/`isnot`, `mod`, `in`/`inrange`, `notin`, `within`, plus range arrays.

### 6.2 Computing the operands (`calculateNumberDigits`)

For a given number, `IString._fncs.calculateNumberDigits(number)` returns the
CLDR plural operands:

| Operand | Meaning |
|--------|---------|
| `n` | the absolute value of the number (may have a fraction) |
| `i` | the integer part |
| `v` | number of visible fraction digits (with trailing zeros) |
| `w` | number of visible fraction digits (without trailing zeros) |
| `f` | visible fraction digits (with trailing zeros), as an integer |
| `t` | visible fraction digits (without trailing zeros), as an integer |
| `c` / `e` | compact/exponent value (from exponential notation) |

For an integer like `1`, this yields `{ n:1, i:1, v:0, w:0, f:0, t:0 }`, which
is exactly what the English `one` rule (`i = 1 and v = 0`) tests for.

### 6.3 Evaluating a rule (`getValue` + operator functions)

`IString._fncs.getValue(rule, operands)` recursively interprets the AST:

- If `rule` is an **object**, find its operator (`firstPropRule`) and dispatch to
  `IString._fncs[operator](rule[operator], operands)`.
- If `rule` is a **string** (an operand symbol), return `operands[symbol]`.
- If `rule` is a **number/other literal**, return it as-is.

Operator functions combine sub-values, e.g. `and` returns true only if every
sub-rule is truthy; `mod` computes `MathUtils.mod(left, right)`; `eq` compares
`left == right`. The result for a category rule is a boolean: does this number
belong to this category?

### 6.4 Selecting the category (`_testChoice` inside `formatChoice`)

When `formatChoice` evaluates a plural category limit (`zero|one|two|few|many`),
`_testChoice` looks up `this.plurals[limit]` and evaluates that rule with
`getValue(rule, operands)`. The architecturally important behaviors are:

- If the category is **absent** from the rule set (e.g. `this.plurals = {}` for an
  other-only language), the lookup is `undefined` and the match is false. This is
  why other-only languages never match `one` and always fall through to `other`.
- `other` (and the empty default limit) always matches, so it is the guaranteed
  fallback when no category rule matches. `other` is mandatory in every rule set.

So a number is mapped to a category by testing the provided category segments and
taking the first whose compiled rule evaluates true, with `other`/default as the
guaranteed fallback. (The full choice-format syntax — numeric comparisons,
ranges, multiple indices, and boolean/regexp limits — is documented in the
`formatChoice` JSDoc.)

### 6.5 End-to-end example

Russian, `formatChoice(21, ...)` on a pattern with `one#`, `few#`, `many#`, and a
default segment:

1. `calculateNumberDigits(21)` → `{ n:21, i:21, v:0, ... }`.
2. Test `one` → `i % 10 == 1 and i % 100 != 11` → `21%10==1` (true) and
   `21%100!=11` (true) → **true**.
3. `one` is the first matching category → the `one#` string is selected and then
   run through `format(params)` for variable substitution.

For Japanese, `this.plurals = {}`, so `one`/`few`/`many` all fail to match and
the default/`other` string is always selected — which is the correct behavior
for a language with no numeric plural distinction.

## 7. Testing

- **CLI (Node):** `test:cli` runs `test/testSuite.sh` → `test/testSuite.js`,
  loading individual files from `locale/` synchronously.
- **Browser:** `test:browser` builds the assembled data + webpack bundle, then
  opens `test/testSuite.html`. Because the webpack loader is async-only, the
  sync tests pre-load data in `setUp` via `LocaleData.addGlobalRoot("../assembled")`
  followed by `LocaleData.ensureLocale(...)` for each locale in `locales.json`.

## 8. Maintenance notes

- `locale/**/plurals.json` and `locales.json` are **source**; `assembled/`,
  `lib/`, and `test-web/` are **build artifacts** (safe to delete in `clean`).
- Do not remove the empty (`{}`) plural files: they are load-bearing overrides
  of the English-like root rule (see §2).
- CLDR is the source of truth for all per-language data — do not hand-edit
  `locale/<lang>/**/plurals.json`; change them by re-running `build:data`.
- The **only** intentional deviation from CLDR is `root`
  (`locale/plurals.json`), which is English-like rather than CLDR's `other`-only
  root. If you regenerate data, preserve this root override.
- To refresh data after a CLDR upgrade, run `build:data` (regenerates
  `locale/**/plurals.json` from `cldr-core`), then rebuild.
