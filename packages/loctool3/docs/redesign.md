# loctool 3 redesign

Loctool 3 is a rewrite, not a port. Version 2 grew for more than a decade: JavaScript, informal plugin conventions, a split between “options” and “settings,” synchronous I/O, and a plugin SPI that exists mainly as prose in `Plugins.md`. That stack still works, but it is hard to extend, hard to explain when it fails, and hard to share with the rest of the iLib toolchain.

This document records the design goals for the rewrite. Later sections will turn these into concrete architecture, APIs, and migration notes.

## Design philosophies

### 1. Modernized

Loctool 3 should look and feel like a current iLib package: TypeScript first, typed public APIs, documentation that matches the code, and a plugin model that other tools can reuse.

**TypeScript.** The implementation language is TypeScript, compiled with the same `ilib-internal` scaffolding as the other packages in this monorepo. Types are part of the product. Plugin authors, TMS integrations, and the core itself should share one set of interfaces rather than duck-typed JavaScript plus a markdown SPI. Version 2 already started this in `packages/loctool/src`; version 3 finishes the job in `packages/loctool3` without dragging the `lib/` JavaScript runtime along.

**Explicit plugin contract.** In version 2 a plugin is two constructor functions (`FileType` and `File`) that happen to implement the right methods. Loading is a sequence of `require()` guesses (`name`, `ilib-loctool-name`, `node_modules`, `../plugins`). If none work, the tool throws `Could not load plugin X` and stops. Version 3 should define a real contract: TypeScript interfaces (and a small runtime base class) for file types, files, resource writers, and any new plugin kinds. Discovery, versioning, and capability advertisement belong in that contract, not in tribal knowledge. A plugin that does not satisfy the contract should fail at load time with a specific reason, not halfway through a localize run.

**Shared plugins with ilib-lint.** Extraction and linting look at the same files and the same strings. Today they do not share a plugin model. ilib-lint plugins implement `ilib-lint-common` (`getParsers`, `getRules`, `getFormatters`, …) and emit an intermediate representation; loctool plugins implement a loctool-only FileType/File SPI and emit `Resource` objects. The redesign should converge on common pieces so that a JavaScript (or JSON, PO, XLIFF, …) plugin can feed both tools:

- Shared types for source files, resources, and locales (`ilib-tools-common` and friends already exist; the plugin SPI should sit on top of them).
- Shared parsers or file-type plugins where the work is “understand this file format,” with loctool consuming resources for extract/localize and ilib-lint consuming an IR for rules.
- Shared discovery conventions (prefix, package metadata, ESM loading) so authors do not maintain two loaders and two naming schemes.

They will not be the same program. Lint cares about diagnostics and fixes; loctool cares about translation sets, resource files, and localization. What they share is the **pipeline engine** and the plugins that produce and consume a common intermediate representation. Each tool configures a different sequence of stages on that engine. See [Architecture](#architecture).

**Better documentation.** Version 2 documentation is uneven: a long plugin guide, command pages that are still incomplete, and behavior that only shows up in log output. Version 3 documentation should be generated from the TypeScript APIs where possible, and should cover the three audiences equally: people running the CLI, people writing `loctool-config.json`, and people writing plugins. Every public type, config key, command, and error code should have a home in `docs/`. If a behavior is not documented, it is not part of the contract.

Modernized also means dropping accidental complexity that is not load-bearing: the options vs. settings split, hardcoded project-type subclasses (`WebProject`, `AndroidProject`, …) versus `CustomProject`, and built-in file types that cannot be versioned independently of the core.

### 2. Performance

Loctool 3 should be faster than version 2 on the same project, and should stay fast as projects grow.

Version 2 is sequential and synchronous. It walks the tree with `readdirSync`, reads source and translation files with `readFileSync`, initializes file types one after another, and extracts files in a single-threaded loop. The translation repository reloads matching XLIFF/PO files on every run. Plugins often re-read schemas and config at construction time. There is no incremental cache of parse results.

The rewrite should treat I/O and CPU as first-class:

- Asynchronous I/O and concurrent work where it is safe (directory walk, independent file extracts, independent locale writes). Correctness still comes first: translation-set merges and resource-file writes must remain deterministic.
- Incremental runs. If the source file, plugin, and relevant translations have not changed, do not re-parse the world. A localize of one touched file in a large repo should not cost a full extract.
- Cheap plugin and config startup. Loading a plugin should not scan disks or parse large schemas unless that plugin is actually used.
- Streaming or batched intermediate I/O for large XLIFF/PO sets, instead of holding every translation unit in memory when it is not needed.

“Faster than v2” is a product requirement, not a slogan. We should keep a small set of representative projects (including a large one) and measure wall time for `localize` / extract / generate. Regressions against those numbers are bugs.

Performance work must not sacrifice the next philosophy. A fast tool that dies with a stack trace is still a failure.

### 3. Easier to use

The tool should never fail and leave the user with no idea why.

That is the bar. Version 2 often misses it. Invalid JSON in a config file is a warning, then the walk continues as if there were no project. A file that looks like a project but is missing `id` is skipped. Unknown properties warn and are ignored. Plugin search tries several paths at trace level only, then throws a one-line load error. Per-file extract errors are logged and skipped, so a localize can “succeed” with missing strings. The distinction between CLI flags, `settings`, and project-file fields is easy to get wrong and hard to debug.

Version 3 should make failure a designed output:

- **Validate early.** Config, plugins, and locales are checked before any extract or write. Missing required fields, unknown keys, incompatible plugin versions, and unreadable files are errors with names, not warnings that disappear in the log.
- **Errors have structure.** Every user-facing failure should say what happened, where (file, line, config key, plugin, command), why the tool believes that is wrong, and what to do next. Stack traces are for bugs in loctool, not for a typo in `loctool-config.json`.
- **No silent success.** Skipping a file, a plugin, or a translation is either an explicit, countable warning the user opted into, or it is an error. A zero exit code means the requested command completed for the files it claimed to process.
- **Logs that match the question.** Quiet, default, and verbose/debug modes should be consistent across commands. Debug output should include the decisions the tool made (which plugin claimed a file, which config file won, which translations were applied) without requiring a debugger.
- **Sensible defaults.** `loctool init` and the config schema should produce a working project. Users should not need to know historical project types (`web`, `android`, `iosobjc`) to localize a typical app.

Easier to use also applies to plugin authors: typed contracts, a sample plugin in-tree, and load errors that mention the interface method that was missing. If the only way to learn the SPI is to copy an existing plugin and see what does not crash, the contract has failed.

### 4. New capabilities

The rewrite exists in part to add features that are awkward or impossible in version 2’s core.

#### Pseudo-localization as plugins

In version 2, pseudo-localization is baked into the core (`PseudoFactory` and a handful of `Pseudo*` classes). Locales map to fixed algorithms: British/Canadian word substitution, debug prefixes, RTL wrappers, OpenCC simplified-to-traditional, and so on. Projects can choose locales and turn pseudo off (`nopseudo`), but they cannot plug in a new generator without changing loctool itself.

Version 3 should treat pseudo-localization as a plugin kind, the same way file types are plugins:

- Built-in generators (debug, length expansion, RTL, script conversion, word-based locale flavors) ship as plugins, not as special cases in the extract loop.
- A project can select, compose, or replace generators per locale.
- A generator may be local and deterministic, or it may call out to a service. That includes **AI pseudo-translation**: send source strings to a model with a prompt that preserves placeholders, HTML, and ICU/plural structure, and use the result as the pseudo target. AI output is a plugin concern (auth, caching, rate limits, fallback when the API is down). The core only needs a “given these resources, return pseudo resources” interface.

Pseudo plugins must be safe by default: they must not destroy placeholders or ICU syntax, they must be skippable offline, and they must be obviously marked so no one ships them as real translations.

#### Direct TMS connection (Mojito)

Version 2 talks to translation memory and translators through files, mostly XLIFF. That works, and it should keep working: file-based export/import is the portable path, and Mojito already consumes XLIFF. The extra round trip is still costly. Users export, upload, wait, download, import, and then debug mismatches in ids, states, and locales.

Version 3 should be able to **talk to a TMS directly**, with Mojito as the first target:

- Push newly extracted strings into a Mojito repository (create or update a drop).
- Pull approved/accepted translations back into the local translation set and resource files.
- Map loctool resource identity (project, key, locale, context, source) to Mojito text units so `select`/dedup and later syncs stay stable.
- Respect TMS workflow states (the same `accepted` / `approved` / `needs-approval` / `rejected` vocabulary ilib-lint already knows) so generate/localize can filter on review status.

The TMS is a backend behind a small interface, not a hard-wired Mojito client sprinkled through the localize command. Mojito is first because that is the TMS we use; a second TMS should be another plugin, not a fork. Offline XLIFF/PO/properties intermediate files remain fully supported. Direct TMS is an additional path, not a replacement for files.

Credentials, repository names, and poll-for-import-complete belong in config and in a dedicated command surface (for example localize/export/import that can target `xliff` or `mojito`), with failures that name the HTTP/API error instead of a generic write failure.

## How these constrain each other

These goals are not independent.

- A typed plugin contract is what makes shared lint/loctool plugins and pseudo/TMS plugins possible.
- Performance work (async, concurrency, caches) is only acceptable if errors stay attributable: a failed extract in a worker must still name the file and plugin.
- Direct TMS and AI pseudo-translation introduce network failure modes. Those must follow the “never fail without saying why” rule (timeouts, auth, quota, invalid payload) and must not become silent no-ops.
- Documentation is part of modernization and of ease of use. New plugin kinds (pseudo, TMS) need the same contract-level docs as file types.

If a later design choice serves one of these at the expense of another, call it out explicitly in this document rather than letting it hide in the implementation.

## Architecture

Both loctool and ilib-lint are pipelines. A source file (or a set of files) enters at one end. An initial plugin — typically a Parser or other file reader — produces an **intermediate representation (IR)**. That IR is handed to a sequence of stages. Most stages are plugins. Each stage reads the IR, optionally mutates or decorates it, and passes it on. The last stage is usually a writer, serializer, or formatter.

The **mechanism** is shared: how stages are registered, how IR is typed and routed, how errors from a stage are reported, how a stage declares what IR types it accepts. The **configuration** is not shared. ilib-lint wires the pipeline to produce lint Results. Loctool wires it to produce translations and resource files. The same Parser plugin can sit at the front of both.

ilib-lint already points in this direction. `ilib-lint-common` defines `PipelineElement`, `Parser`, `Transformer`, `Serializer`, `Fixer`, `Rule`, `Formatter`, and `IntermediateRepresentation`. Loctool 3 should not invent a parallel SPI. It should generalize that pipeline so both tools run on it, and so new stage kinds (aggregation, translation, TMS, pseudo) are first-class rather than special cases inside one CLI.

### Intermediate representation

The IR is the currency of the pipeline. A Parser does not “return strings for loctool” or “return trees for lint.” It returns an IR of a declared type. Later stages subscribe to that type.

Some IR types are reserved and shared, as they already are in `PipelineElement`:

- `resource` — an array of `Resource` instances from `ilib-tools-common`. This is the preferred type for resource files (XLIFF, PO, properties, JSON resource bundles) and for extracted messages from source.
- `line` — the file as an array of lines.
- `string` — the file as one string.
- `*` — any type; used for stages that do not care about structure (encoding checks, for example).

Plugins may define additional types (`javascript-ast`, `html-tree`, …) as long as every stage that consumes them agrees on the shape. A Javascript parser might emit both a language-specific IR (for syntax-aware lint rules) and a `resource` IR (for message extract / resource rules). One parse, two representations, two downstream paths.

Stages should **decorate** the IR rather than hide side channels. Lint Results, applied fixes, chosen translations, and aggregation provenance belong on the IR (or on the Resource objects inside a `resource` IR) so a later stage can see what earlier stages did. Version 2 loctool keeps extracted / new / pseudo sets on the FileType object; version 2 lint keeps Results in a parallel list. That split makes it hard to write a stage that, for example, only translates resources that have no error Results, or only writes files whose IR is dirty.

An IR also carries the `SourceFile` it came from, file stats, and a dirty flag (already on `IntermediateRepresentation`). Dirty means a later serializer/writer should persist it.

### Stages

A stage is a pipeline element with a name, a description, an IR type, and one job. Concrete kinds include:

| Kind | Role | Typical in |
|------|------|------------|
| Parser / reader | Source bytes → IR | both |
| Rule | Inspect IR, attach Results | lint |
| Fixer | Apply automatic fixes for some Results; mark those Results fixed | lint |
| Transformer | Filter or rewrite IR (for example drop resources matching a pattern) | both |
| Aggregator | Combine many per-file IRs into one (for example all React messages → one resource list) | loctool |
| Translator | Decorate `resource` IR with targets from a TMS, a local TM, or a pseudo generator | loctool |
| Serializer / writer | IR → bytes on disk (resource file, localized source copy, rewritten source after a fix) | both |
| Formatter | Present Results (or other decorations) to a human or another tool | lint; also loctool reports |

Not every stage must run per file. Parsers, rules, and many transformers are per-file. Aggregation is **cross-file**: it waits until a batch of IRs is ready, then emits one source-side IR. Translation and resource writing are **per-locale**: the engine runs them once per target locale and drops that locale’s data before the next (see [Memory: one locale at a time](#memory-one-locale-at-a-time)). A stage declares its scheduling (per-IR, per-batch, per-locale); the engine, not the plugin, walks the project.

Stages are typed. The engine only feeds a stage IRs whose type matches (or `*`). A JSON resource writer never receives a Javascript AST. That is the same routing ilib-lint already does between parsers, rules, and serializers.

A **plugin package** may contribute several stage kinds (a parser, a writer, a rule set), the way ilib-lint plugins already expose `getParsers()`, `getRules()`, `getFixers()`, `getTransformers()`, `getSerializers()`, `getFormatters()`. Loctool plugins should use the same packaging idea, plus getters for aggregators, translators, and writers. One npm package can serve both tools: the Javascript plugin parses JSX, emits `resource` IR, and both pipelines proceed from there.

### How ilib-lint uses the pipeline

A typical lint file type is configured roughly as:

1. **Parser** — for example an XLIFF parser or a Javascript parser. Output: IR (`resource`, AST, lines, …).
2. **Rules** — each rule that applies to that IR type runs and attaches Results (errors, warnings, suggestions) to the IR.
3. **Fixers** — if the user asked for fixes, fixers that understand those Results apply edits, set the IR dirty, and record on each Result that it was fixed (or could not be).
4. **Transformers** — optional filters (for example drop Results that match an allowlist).
5. **Serializer** — if the IR is dirty and write-back is enabled, serialize to a `SourceFile` and write.
6. **Formatter** — print or JSON-encode the Results for the CLI, CI, or an editor.

The lint CLI’s job is to choose file types, rule sets, and formatters, then run this pipeline over the project. It does not parse Javascript itself.

### How loctool uses the pipeline

Loctool 3 only does localization. A command is a pipeline configuration: which parsers run, whether to aggregate, which translator fills in targets, and which writers emit resource files or localized copies of source. Built-in project types from version 2 (`web`, `android`, …) become **preset pipeline configurations**, not subclasses of Project.

The commands that stay in loctool:

| Command | Job |
|---------|-----|
| `init` | Write a working `loctool-config.json` (pipeline presets, plugins, locales). |
| `localize` | Scan source, aggregate, translate, write resources (and optionally localized source copies). Default command. |
| `generate` | Do **not** scan source. Start from translations already in hand and write resource files. |

#### Localization is continuous

Every `localize` run both **discovers** and **applies**. Engineers have added strings that have never been translated; translators (or an AI, or Mojito) have also returned targets for strings discovered last week. Those are not two jobs. They are the same process on this commit:

- new sources go out to the TMS (and into an optional extracted XLIFF);
- whatever targets already exist come back in and are written to resource files;
- strings with no target yet are still written according to policy (omit, copy source, or pseudo).

Splitting “extract” and “generate” looks like a clean division of responsibilities, and it matched a Jenkins glue layer (XLIFF files between loctool and `mojito`). It is the wrong model for the product. Localization does not finish. The next run will see more new strings and more arriving translations. `generate` remains only for the case where **source is not available** (see below). It is not phase two of `localize`.

#### `localize`

A typical localize run for a React app has a **stem** that runs once, then a **per-locale inner loop**.

Stem (once):

1. **Parser** — the same Javascript/JSX parser as lint. Output: `resource` IR per source file (source strings, keys, comments, locations — **no targets**).
2. **Aggregator** — merge Resource instances across files by identity (project, key, source, context, …). One source-side `resource` IR for the project (or per resource-file grouping). This is what version 2 kept as FileType `extracted`.
3. **Publish** (optional, Translator plugin) — upload new or changed sources to the TMS once. One payload, all locales share it. Not 88 uploads of the same English.

Inner loop (once per target locale, **sequentially by default**):

4. **Translator** — load or produce targets for **this locale only**. Decorate a locale view of the source IR (copy source + attach targets; do not mutate the stem IR with 88 target maps).
5. **Writer** — serialize that locale’s resources to JSON / `.js` / `.ts` / Android XML / iOS strings / …, or write localized copies of static files for this locale.
6. **Drop** — release the locale view, the translation payload, and the writer output. Let the GC reclaim it before the next locale.

The stem IR stays: it is one set of source strings, not × number of locales. An optional audit writer on the stem can still emit extracted XLIFF; that file is a *report*, not the interchange Mojito requires.

#### Memory: one locale at a time

Some users of loctool translate on the order of 88 locales for every build. A single locale’s XLIFF can be tens or even hundreds of megabytes. Loading all of them into a `resource` IR (or into `LocalRepository` as version 2 does on `init`) is tens of megabytes × 88, plus parsed `Resource` objects, which will blow out the memory of some Node processes.

Version 2 made this easy to hit: `LocalRepository` reads every matching XLIFF/PO up front, and `write(superset, locales)` holds the union while writing every locale. Version 3 must not.

Rules:

- The aggregated IR is **source-only**. Targets are not a field that grows with the locale list.
- Translator and Writer SPIs take **one locale** (`translate(sourceIR, locale)`, `write(decoratedIR, locale)`), not an array of locales.
- File-based translators open only that locale’s file (`ko-KR.xliff`, not the whole `xliffs/` directory). If a file actually contains many languages, parse with a locale filter or a streaming reader; do not materialize other languages’ units.
- A Mojito translator **pulls one locale** (or one locale’s page/stream) per inner-loop iteration. `publish()` on the stem is the only all-source TMS call.
- Pseudo translators run inside the same loop: generate `fr-FR` debug/AI/OpenCC, write, discard; do not pre-build 88 pseudo sets.
- After `write` returns, the engine drops the decorated IR. Translators must not cache every locale they have seen for the rest of the run.
- Default concurrency for the inner loop is **1**. If a machine has RAM to spare, config may allow a small number of locales in parallel; that is an opt-in, not the default.

Do not clone the entire source IR per locale if a **view** will do: a thin wrapper that reads source from the stem and targets from a per-locale map. The map dies with the iteration. Writers must not accumulate output for other locales.

```
Parse sources ──► Aggregate (source IR) ──► Publish new strings to TMS
                                              │
                                              ▼
                              for locale in locales:          // sequential
                                  load targets(locale)
                                  decorate view(source IR, targets)
                                  write resource files(locale)
                                  drop targets + view
```

This is still one `localize` process and one source walk. The locale loop is a scheduling property of the engine, not a second CLI invocation.

#### `generate` — resources from translations alone

Version 2 already has this use case. `loctool generate` does not read source files and does not emit a new extracted-strings file. It loads translation units from intermediate files (XLIFF or PO in `translationsDir`) and writes resource files for every unit that has a translation, **whether or not that string still appears in source**.

That matters when the original files are gone or are not in the tree this job is allowed to see: a translation drop from Mojito, a vendor XLIFF, or an old `xliffs/` directory is enough to rebuild resource files. It also matters when you *want* stale strings in the resource files (some runtimes look up keys that are no longer in this commit).

`generate` is not “localize without extract.” It is the **source-unavailable** pipeline, and it must obey the same memory rule: **one locale file at a time**.

1. For each target locale, **Parser** — that locale’s XLIFF/PO/TMX only. Output: `resource` IR with sources and targets for this locale.
2. **Translator** — optional hole-filling (pseudo, inheritance) for this locale only.
3. **Writer** — the same resource-file writers as `localize`.
4. **Drop** — then the next locale file.

Do not parse all 88 translation files into one set and then write. There is no source walk and no “is this string still used?” filter. If we need a generate that *does* drop unused keys, that is a different pipeline (generate + a filter against a previously saved source IR), not a change to `localize`.

#### Translator plugins

A Translator’s contract is: **attach targets to a source-side `resource` IR for one locale.** The engine calls it once per locale. Where targets come from is the plugin:

- a file-based translator that reads that locale’s XLIFF/PO/TMX;
- a pseudo translator (debug, RTL, OpenCC, word-based locale flavors, AI);
- a TMS translator (Mojito first), pulling **that locale** only.

Missing translations, review state, and TMS errors are decorations and structured errors, not a silent hole in a resource file.

The plugin may also implement **`publish(sourceIR)`** for the stem: push new/changed sources to the TMS once. That is the same plugin, a second method, not a second stage kind. File-based and pseudo translators leave `publish` as a no-op.

##### One loctool run instead of extract → Mojito → generate

Many Jenkins jobs currently do this:

1. Run loctool to extract strings and write an “extracted” XLIFF.
2. `mojito push` that XLIFF into Mojito.
3. `mojito pull` translations back to local XLIFF files (often all locales).
4. Run loctool **again** (`generate`) to turn those files into resource files.

That walks the project twice, materializes every locale’s translations on disk and in memory, and fails in four places with four log formats. One `localize` should:

1. Stem: Parser → Aggregator → Mojito `publish(sourceIR)`.
2. For each locale: Mojito pull (or file read) for that locale → decorate → write → drop.

No extracted XLIFF is required for Mojito. Push is once; pull is per locale; resource files come out of the same process that discovered the new strings.

**Should push/pull be a Translator, or a separate stage?** Still a Translator, with two call sites the engine owns:

- `publish(sourceIR)` on the stem (optional);
- `translate(sourceIR, locale)` in the inner loop (required for that plugin).

Do not invent Push and Pull stage types. The engine’s locale loop is what keeps memory bounded; splitting stages would not, if pull still loaded 88 locales into one IR.

Modes (how `publish` / `translate` behave), because CI is not always “talk to Mojito this run”:

| Mode | Stem | Inner loop |
|------|------|------------|
| `sync` | `publish` | `translate` pulls that locale. Default when Mojito is configured. |
| `push` | `publish` | skip or no-op translate; maybe audit XLIFF only. Overnight / vendor. |
| `pull` | skip publish | `translate` pulls that locale. Source already in Mojito. |
| `files` | no-op | `translate` reads that locale’s XLIFF/PO. |

A second TMS is another Translator plugin with the same two methods. If human translation takes days, that is **two loctool invocations** (`push` Monday, `sync` or `pull` Thursday), each still one source walk and a per-locale inner loop.

#### Resource file tools leave loctool

Version 2 grew a second product inside the same binary: operations on XLIFF (and other resource files) that never look at source code.

| Move out | Stays |
|----------|--------|
| `split` — split XLIFF by language or project | `init` |
| `merge` — merge XLIFF files | `localize` |
| `convert` — XLIFF/PO/JSON/strings/properties ↔ each other (and to TMX) | `generate` |
| `compare` — logical diff of two XLIFFs (added / deleted / modified units) | |
| `select` — filter translation units by criteria, uniqueness, sampling | |

These belong in a **separate tool** (working name: `restool`) built on `ilib-xliff`, `ilib-po`, and `ilib-tools-common` — the same libraries loctool already uses. `tmxtool` already exists for TMX-specific diff/split/merge; `restool` is the general resource-file sibling. Loctool then only localizes. `restool` can still run on the shared pipeline engine (XLIFF parser → transform/filter → XLIFF writer), but its presets and CLI are not loctool’s.

Version 2 also has unimplemented `export` / `import` stubs. They were meant to be XLIFF round-trips. With Translator plugins and `generate`, they are unnecessary in loctool; any leftover “reshape this XLIFF” work goes to `restool`.

Migration: loctool 3 can print a one-line “this command moved to `restool`” if someone still types `loctool select`, then exit non-zero. Do not keep hidden aliases forever; the point is a smaller loctool.

### Shared engine vs tool configuration

| Shared | Per tool |
|--------|----------|
| IR types and `IntermediateRepresentation` | Which stages run, and in which order |
| Stage SPI (parse / transform / decorate / serialize) | Default plugins and presets |
| Plugin discovery and load errors | CLI commands and exit-code policy |
| Type-based routing of IR to stages | Rule sets vs locale lists vs TMS endpoints |
| Per-file, per-batch, and per-locale scheduling | What “success” means (no unfixed errors vs all locales written) |
| Structured errors from a stage | Formatters vs resource writers |

The engine should live in a shared package. The natural starting point is `ilib-lint-common`, possibly renamed or split so that loctool does not depend on a package called “lint.” The important part is one SPI, not two that drift.

What is *not* shared: lint Results are not translations, and a Mojito translator is not a lint rule. A plugin that only makes sense in one tool simply is not listed in the other tool’s pipeline config. Unused getters stay empty, as they already do in ilib-lint’s `Plugin` base class.

### Implications for the philosophies

- **Modernized.** The explicit plugin contract *is* the stage SPI plus IR types. Shared parsers with ilib-lint fall out of this architecture instead of being a special compatibility layer.
- **Performance.** Independent per-file parses can run concurrently. After aggregation, translation and write run **one locale at a time** so 88 large XLIFF payloads never sit in memory together. Caching is cache-the-IR: if the source file and parser version have not changed, skip parse.
- **Easier to use.** A failure names the stage, the IR type, and the file. A missing translator or writer is a config error before the run, not a missing file at the end. Debug logs can print the pipeline that was actually assembled.
- **New capabilities.** Pseudo-localization and Mojito are Translator stages. A new AI pseudo plugin is a new translator, not a core fork. A second TMS is another translator plugin.
