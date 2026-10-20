# Handoff: ilib-zic TypeScript port + gentzinfo merge

Status as of the session that last updated this file. Use this document to
continue the timezone-tool work without re-deriving context.

**Branch:** `zic` (pushed to `origin/zic`)  
**Changeset:** `.changeset/ilib-zic-first-release.md` (major / first release)

## Goal of the larger effort

Fix / modernize the timezone data generation pipeline for ilib:

1. **Compile** raw IANA tzdata → per-zone JSON (`o`, `f`, `s`/`e`).
2. **Enrich** with country codes, Windows display names, `zonetab.json`,
   and per-country `timezone.jf` defaults.
3. **Write once** into an ilib locale tree.

Historically both lived in the monolithic
[ilib](https://github.com/iLib-js/iLib) repo:

| Legacy location | Role |
|-----------------|------|
| `java/src/com/ilib/tools/zic/` | Java zone info compiler |
| `tools/cldr/gentzinfo.js` | Node post-processor / metadata enricher |
| `~/src/tz/update.sh` | Download tzdata → Java zic → gentzinfo → `cp` into ilib |

**Current direction (done in this package):** one TypeScript package
**`ilib-zic`** in ilib-mono runs compile → enrich → write in a single CLI /
pipeline. Classic ilib no longer needs Java zic or `gentzinfo.js` for
updates (use `~/src/tz/update_new.sh`).

## Architecture (in-memory pipeline)

```
tzdata dir
    │
    ▼
ZoneInfoCompiler.compile()     →  Record<zoneId, ZoneInfo>   (o, f, s/e)
    │
    ▼
ZoneInfoEnricher.enrich()      →  EnrichedTzData (+ c, n, zonetab, timezone.jf)
    │
    ▼
LocaleDataWriter.write()       →  write everything once under localeDir
```

Orchestration: `ZoneInfoPipeline.run()` (also used by the CLI and sample).

**CLI:**

```
ilib-zic <src> <localeDir> [--verbose] [--compile-only]
```

| Argument / option | Description |
|-------------------|-------------|
| `src` | Unpacked IANA tzdata directory |
| `localeDir` | Locale **root** (parent of `zoneinfo/`; also gets `timezone.jf`, `und/`) |
| `--compile-only` | Skip enrich; write raw `zoneinfo/**/*.json` only |
| `-v, --verbose` | Progress logging |

Programmatic entry: `ZoneInfoPipeline` (preferred) or the three stages
individually.

## Package layout

### Package: `ilib-mono/packages/zic` (npm / CLI: `ilib-zic`)

Published name is **`ilib-zic`** (npm name `zic` is taken).

**Sources** (`src/`):

| File | Role |
|------|------|
| `ParseException.ts` | From Java `ParseException` |
| `RelativeDate.ts` | From Java (+ `StartRule`); `isDigit` from `ilib-ctype` |
| `Rule.ts` / `RuleSet.ts` / `Offset.ts` / `Zone.ts` | From Java |
| `ZoneInfoFile.ts` | Parse one extensionless tzdata file (`Zone`/`Rule`/`Link`) |
| `ZoneInfoCompiler.ts` | **In-memory** compile only (no disk writes) |
| `ZoneInfoEnricher.ts` | Port of `gentzinfo.js` (in-memory decorate) |
| `LocaleDataWriter.ts` | Single write of locale tree |
| `ZoneInfoPipeline.ts` | compile → enrich → write |
| `defaults.ts` | Hard-coded maps from gentzinfo (`COUNTRY_EXCEPTIONS`, `BACKWARDS_EXCEPTIONS`, `DEFAULT_TIMEZONE_ID`) |
| `types.ts` | `ZoneInfo`, `EnrichedTzData`, WindowsZones types |
| `loadJson.ts` | `loadJsonFile()` via `fs.readFileSync` + `JSON.parse` (clear errors) |
| `ZoneWriter.ts` / `JsonZoneWriter.ts` / `ZoneWriterFactory.ts` | Low-level writers (still used / exported) |
| `index.ts` | Public exports + CLI (`bin`: `ilib-zic`) |

**Dependencies (workspace / npm):**

- `ilib-ctype`, `ilib-common`, `ilib-data-utils` (UnicodeFile, Utils.makeDirs)
- `cldr-core` (Windows zone names; resolved under `node_modules`, loaded with `loadJsonFile`)
- `json-stable-stringify` (stable key order matching checked-in locale JSON)

### Output layout (matches `ilib/js/data/locale`)

```
<localeDir>/
  timezone.jf
  und/<CC>/timezone.jf
  zoneinfo/<Continent>/<City>.json   # c, e, f, n, o, s (sorted keys)
  zoneinfo/zonetab.json
```

## How compile works (short)

1. Read every **extensionless** file under `src` (IANA `africa`, `europe`,
   `northamerica`, `backward`, …). Files with `.` in the name (e.g.
   `zone.tab`) are skipped by the compiler; enricher reads `zone.tab` /
   `backward` separately.
2. Parse `Zone` / `Rule` / `Link` into maps. Links only succeed if the
   target is already present (file order matters).
3. For each zone, take the **current** offset and build JSON:
   - `o` — GMT offset (`H:M`, e.g. `-5:0`)
   - `f` — abbreviation format:
     - `%s` → `{c}` (letter from rules, e.g. `E{c}T`)
     - **`%z`** → numeric UT abbrev via zic `abbroffset` rules
       (`-03`, `-03/-02`, `+0530`, `+1245/+1345`)
     - fixed / slash forms left as-is when already explicit
   - `s` / `e` — current DST start/end (wall time), when applicable
4. Return in-memory map; writing is deferred to `LocaleDataWriter`.

Default: `currentOnly: true`.

## How enrich works (short)

Port of `ilib/tools/cldr/gentzinfo.js`, but **does not scan disk** for
zoneinfo JSON — it takes the compiler’s in-memory map and returns copies
(non-mutating).

1. Parse `zone.tab` + `backward` with `UnicodeFile` (`ilib-data-utils`,
   `splitChar: /\t+/g`).
2. Assign `c` from zone.tab / backward / `COUNTRY_EXCEPTIONS`.
3. Assign `n` from CLDR `windowsZones` (`Standard` → `{c}`); injectable
   via `windowsZones` option for tests.
4. Build sorted `countryToZones`, root `timezone.jf` (`Etc/UTC`), and
   per-country defaults (`DEFAULT_TIMEZONE_ID` or first sorted zone,
   resolving backward links).

Hard-coded maps live in `defaults.ts` (same values as gentzinfo.js).

## Intentional port details / quirks (do not “fix” casually)

These match the Java / gentzinfo behavior and unit tests:

- **Offset field indexing:** `Offset.setFields` always reads the numeric
  offset from `fields[1]`.
- **Zone first line:** `new Zone(line)` strips `line.substring(5)`
  (`"Zone "` prefix) before the first `Offset`.
- **`RelativeDate.offsetToWallTime`:** UTC `Date` math; FIRST/LAST
  day-of-week uses the **parameter** offset sign on day roll.
- **Year sentinels:** `min` / `max` → `Number.MIN/MAX_SAFE_INTEGER`.
- **Links:** target must already be in the map when the `Link` is seen.
- **`%z`:** implemented in `Offset` (`abbroffset` port from
  `~/src/tz/code/zic.c`). IANA main form uses `%z` widely since 2024b;
  checked-in ilib data already has expanded numeric `f` for those zones
  (never still `E{c}T` when tz uses `%z`).
- **CHANGELOG:** leave empty title only; changesets write release notes.

## Tests

| Area | Coverage |
|------|----------|
| Unit (`test/`) | Compiler (in-memory, negative paths), Enricher (zone.tab / backward / exceptions / Windows names / non-mutation / negatives), LocaleDataWriter (locale tree, stable JSON, negatives), Pipeline (full + `--compile-only` + negatives), Offset `%z`, Zone Sao_Paulo `%z`, `loadJson`, `defaults`, plus original Rule/RelativeDate/JsonZoneWriter tests |
| Fixtures (`test/helpers/tzFixtures.ts`) | Curated mini zone.tab / backward; sample compiled zones including **Sao_Paulo `-03/-02`**; injectable windowsZones |
| E2E (`test-e2e/`) | `samples/cli` → `locale/`; snapshots enriched NY/Paris/Tokyo/Sao_Paulo, `zonetab.json`, `timezone.jf`, `und/US/timezone.jf` |

```bash
cd packages/zic && pnpm build && pnpm test:all
# unit + e2e
```

**Sample mini tzdata** (`samples/cli/data/`, excerpted from tzdata2026e):

| File | Zone / role | Notes |
|------|-------------|-------|
| `northamerica` | `America/New_York` | `E%sT` |
| `europe` | `Europe/Paris` | `CE%sT` |
| `asia` | `Asia/Tokyo` | `JST` |
| `southamerica` | `America/Sao_Paulo` | `%z` → `-03/-02` |
| `zone.tab` | Country mapping | Curated subset |
| `backward` | Alias links | e.g. `US/Eastern` |

`pnpm run:sample` → `samples/cli/locale/` (gitignored).

## Update script (classic ilib locale tree)

| Script | Status |
|--------|--------|
| `~/src/tz/update.sh` | **Legacy** — Java zic + gentzinfo.js + `cp zoneinfo` |
| `~/src/tz/update_new.sh` | **New** — downloads tzdata, runs `ilib-zic` into `$ILIB_HOME/js/data/locale` |

```bash
~/src/tz/update_new.sh 2026e
# Overrides: ILIB_HOME, ILIB_MONO_HOME (defaults ~/src/ilib, ~/src/ilib-mono)
```

Writes `zoneinfo/`, `zonetab.json`, `timezone.jf`, and `und/<CC>/` in one
pass. No separate gentzinfo; no `npm upgrade cldr-data` (uses package
`cldr-core`).

## What this latest session completed (summary)

On top of the earlier Java→TS compiler port:

1. **Merged gentzinfo** into the same package as enrich + single write
2. **Refactored** compiler to in-memory only; pipeline orchestrates stages
3. **TDD:** skeletons + full unit specs (including negatives), then
   implementation until green
4. **`%z` abbreviation** support (zic `abbroffset`) + tests + sample zone
5. **`loadJsonFile`** instead of `require()` for CLDR JSON; clear I/O /
   parse errors
6. **E2E** updated for locale-root output and enrichment snapshots
7. **`~/src/tz/update_new.sh`** to drive classic ilib updates via ilib-zic
8. Used monorepo libs: `ilib-data-utils` (UnicodeFile, makeDirs),
   `ilib-common` available, `cldr-core`, `json-stable-stringify`

## What is still TODO

### 1. Validate against full IANA data

Sample + unit fixtures cover a handful of zones. Still worth:

- Run `update_new.sh` (or `ilib-zic`) against a full recent tzdata release
- Diff against last Java/gentzinfo-produced locale tree (formatting /
  key-order may differ; semantic equality matters)
- Spot-check southern-hemisphere DST, Link aliases, `%z`-only regions

### 2. Product / packaging follow-ups

- Open / merge PR for branch `zic`
- Decide whether classic `update.sh` / Java zic / gentzinfo.js should be
  archived or deleted once `update_new.sh` is trusted
- Optionally vendor a snapshot of `windowsZones.json` for hermetic CI
  (today: live `cldr-core` dependency)
- More unit tests for `ZoneInfoFile` / Link edge cases (Java never had them)

### 3. Downstream consumers

- Confirm `ilib/js/lib/TimeZone.js` and assemble scripts still happy with
  regenerated data
- Longer term: whether locale zoneinfo lives only in classic ilib or also
  moves into mono data packages

## Key paths

| Path | Notes |
|------|--------|
| `ilib-mono/packages/zic/` | This package (npm: `ilib-zic`) |
| `ilib/java/src/com/ilib/tools/zic/` | Original Java (reference) |
| `ilib/tools/cldr/gentzinfo.js` | Original enricher (now ported into this package) |
| `ilib/js/data/locale/zoneinfo/` | Checked-in consumer data / golden shape |
| `ilib/js/lib/TimeZone.js` | Runtime consumer of zoneinfo JSON |
| `~/src/tz/update.sh` | Legacy update script |
| `~/src/tz/update_new.sh` | New update script using ilib-zic |
| `~/src/tz/tzdata2026e` | Unpacked tzdata used for samples / comparison |
| `~/src/tz/code/` | IANA tzcode (zic.c) — reference for `%z` / `abbroffset` |

Sibling checkouts assumed under `~/src/ilib`, `~/src/ilib-mono`, and
`~/src/tz` (adjust if your layout differs).

## Suggested next-session prompt

> Continue from `ilib-mono/packages/zic/handoff.md`. Run
> `~/src/tz/update_new.sh` (or `ilib-zic`) against full tzdata2026e into a
> temp locale dir, diff against `ilib/js/data/locale` (semantic equality),
> fix any gaps, then open/merge the `zic` PR.

## Session tag note

Work so far has been **untagged** (`#tag none` / no Jira). Attribute
a ticket with `#tag <TICKET>` if this work should track somewhere.
