# The `select` Command

The `select` command reads one or more XLIFF files, filters their
translation units according to selection criteria, and writes the
matching units to a single output XLIFF file.

Typical uses include building a random sample for linguistic review,
pulling only the units for one locale or project, removing units that
match unwanted patterns, or collapsing duplicate strings that appear
across multiple translation drops.

## Synopsis

```
loctool select <criteria> <outfile> <infile> [<infile> ...]
```

All input and output files must be XLIFF. You may list as many input
files as you need; their units are loaded, merged, and then filtered
before writing.

For the full command-line help:

```
loctool select --help
```

## How Selection Works

Selection happens in three stages:

1. **Load and merge.** Each input file is read. Exact duplicates are
   collapsed using the default identity fields (see
   [Uniqueness](#uniqueness) below). Unless `--prune` is set, each unit
   also receives an `original-file` extended attribute naming the
   input file it came from.
2. **Filter.** Units are kept or discarded according to the criteria
   string. Criteria are combined with commas and form a conjunction:
   a unit must satisfy every part to be selected (or, with `--prune`,
   to be excluded).
3. **Write.** Matching units are serialized to the output file.

Within the filter stage, criteria are applied in this order:

1. Field matches (`field=regexp` / `field!=regexp`), including plural
   category and array index forms
2. Uniqueness (`unique` / `unique:…`)
3. Size budgets (`maxunits`, `maxsource`, `maxtarget`)

`random` is special: when present, the unit list is shuffled *before*
the filters run, so that later budgets such as `maxunits` sample from
a random order.

Uniqueness is applied before size budgets so that
`unique:key+source,maxunits:100` counts only units that survived the
uniqueness filter.

## Selection Criteria

Criteria are a comma-separated list of parts. Each part is one of the
forms below.

### Field matches

```
<field>=<regexp>
<field>!=<regexp>
```

Keep units where `<field>` matches the regular expression, or (with
`!=`) where it does **not** match. The first `=` (or `!=`) separates
the field name from the pattern, so the pattern itself may contain
`=` signs.

Supported fields:

| Field | Meaning |
|-------|---------|
| `project` | Project / product name |
| `context` | Context string |
| `sourceLocale` | Source locale |
| `targetLocale` | Target locale |
| `key` | Resource key (`resname`) |
| `pathName` | Path of the source file |
| `state` | Translation state |
| `comment` | Translator / developer comment |
| `dnt` | Do-not-translate flag |
| `datatype` | Datatype (for example `javascript`, `x-json`) |
| `resType` | Resource type (`string`, `plural`, `array`, …) |
| `flavor` | Flavor |
| `source` | Source text |
| `target` | Target text |

For plurals and arrays you can narrow the match further:

| Form | Meaning |
|------|---------|
| `source.<category>` / `target.<category>` | Match only the given plural category (`zero`, `one`, `two`, `few`, `many`, `other`) |
| `source.<index>` / `target.<index>` | Match only the array element at that zero-based index |

Bare `source=` / `target=` still match across string, plural, and array
resources as appropriate.

### Random sampling

```
random
```

Shuffle the candidate units before applying the remaining criteria.
Combine with a size budget to draw a sample:

```
loctool select 'random,maxunits:100' sample.xliff translations.xliff
```

### Uniqueness

```
unique
unique:<field>+<field>+...
```

Do not select a unit if another unit with the same identity was already
selected (first match wins).

Bare `unique` uses this default identity:

- `project`
- `targetLocale`
- `key`
- `datatype`
- `flavor`
- `context`
- `source`

`unique:<field>+…` builds the identity from only the listed fields.
Fields are separated by `+`. `resname` is accepted as an alias for
`key`.

This is useful when the same logical string appears under different
project values — for example when Mojito drop ids are stored in the
project / `product-name` field. In that case the default identity
treats each drop’s copy as distinct, while `unique:key+source`
collapses them:

```
loctool select 'unique:key+source' merged.xliff drop1.xliff drop2.xliff
```

Note that loading already collapses exact duplicates under the *default*
identity. Narrower uniqueness such as `unique:key+source` is applied
only as a selection filter afterwards.

### Size budgets

| Criterion | Meaning |
|-----------|---------|
| `maxunits:<n>` | Stop after selecting `<n>` units |
| `maxsource:<n>` | Stop when the cumulative source word count would reach `<n>` |
| `maxtarget:<n>` | Stop when the cumulative target word count would reach `<n>` |

Word counts are a simple whitespace split of the source or target
string. That is a rough estimate and is less meaningful for languages
that do not separate words with spaces.

## Command Options

These options are specific to `select` (global loctool flags such as
`-2` for XLIFF 2.0 still apply):

| Option | Meaning |
|--------|---------|
| `--projectId <name>` | Set the project name on selected units when writing the output |
| `--extendedAttr <name>=<value>` | Add an extended attribute to every selected unit. Repeatable. |
| `--prune` | Invert the filter: write units that do *not* match the criteria, and skip adding `original-file` |

## Examples

### Select everything from several files

The CLI always requires a criteria argument. After load-time
deduplication of exact duplicates, any criterion that does not discard
units will keep the rest. The simplest options are bare `unique`
(default identity, already applied at load) or `random` (keeps
everything, but shuffled):

```
loctool select unique all.xliff a.xliff b.xliff c.xliff
loctool select random all.xliff a.xliff b.xliff c.xliff
```

When calling the `XliffSelect` API directly, omitting `criteria`
likewise keeps every unit that survived the load-time merge.

### Filter by locale

```
loctool select 'targetLocale=^fr' french.xliff translations.xliff
```

### Filter by project and state

```
loctool select 'project=^webapp$,state=translated' ready.xliff translations.xliff
```

### Exclude do-not-translate units

```
loctool select 'dnt!=^true$' translatable.xliff translations.xliff
```

### Find untranslated units

```
loctool select 'target=^$' missing.xliff translations.xliff
```

(Exact emptiness depends on how empty targets are represented in your
files; adjust the pattern if needed.)

### Take a random sample for LQA

Draw 50 random units, or about 200 source words:

```
loctool select 'random,maxunits:50' lqa-sample.xliff translations.xliff
loctool select 'random,maxsource:200' lqa-sample.xliff translations.xliff
```

### Sample only one project

```
loctool select 'project=^checkout$,random,maxunits:100' \
    checkout-sample.xliff translations.xliff
```

### Deduplicate across Mojito drops

When each drop stores its id as the project name, overlapping strings
are kept by default. Collapse them by key and source, keeping the
first-seen translation:

```
loctool select 'unique:key+source' \
    deduped.xliff drop-2025-01.xliff drop-2025-02.xliff
```

Combine with a budget when you only want a unique sample:

```
loctool select 'unique:key+source,random,maxunits:100' \
    sample.xliff drop-2025-01.xliff drop-2025-02.xliff
```

### Match a plural category

```
loctool select 'source.one=file' plurals.xliff translations.xliff
```

### Match an array element

```
loctool select 'source.0=Monday' weekdays.xliff translations.xliff
```

### Prune unwanted units out of a file

`--prune` inverts the match. This writes everything *except* units
whose source looks like a debug string:

```
loctool select --prune 'source=^DEBUG:' cleaned.xliff translations.xliff
```

### Annotate selected units

Add metadata that survives in the output XLIFF:

```
loctool select \
    --extendedAttr 'review-batch=2026-08' \
    --projectId myapp \
    'random,maxunits:100' \
    batch.xliff translations.xliff
```

Selected units also get `original-file` pointing at the input file they
came from (unless `--prune` is used).

### XLIFF 2.0 output

```
loctool -2 select 'targetLocale=^de' german.xliff translations.xliff
```

## Tips

- Quote the criteria string so the shell does not interpret `|`, `*`,
  or other regexp characters.
- Criteria are a conjunction: every part must match. There is no `or`
  operator; run `select` more than once (or use `--prune`) if you need
  the complement of a filter.
- Prefer `unique:…` when you need a custom identity. Bare `unique` is
  equivalent to the same identity already used to collapse duplicates
  at load time, so it mainly matters after other filters have changed
  which units remain candidates.
- See also `loctool select --help` for the authoritative option list
  shipped with your installed version.
