# Ilib Review — Product Requirements Document

| Field | Value |
|-------|-------|
| **Status** | Draft — ready for implementation planning pending vendor formula + subtype list |
| **Product / package name** | **ilib-review** |
| **Author** | _TBD_ |
| **Stakeholders** | Globalization engineering, localization management (_others TBD_) |
| **Last updated** | 2026-05-28 |

---

## 1. Overview

**Ilib Review** (`ilib-review`) is a library in the iLib-js monorepo that provides a **factory for producing reviewer implementations**. The factory returns a class (or equivalent construct) for the **review methodology** the caller requests. Each reviewer evaluates existing translations and returns structured quality findings according to that methodology.

The library implements **AI-based review only**. It does not perform deterministic lint checks, read XLIFF files, render UI, or enforce security policies — those concerns belong to **callers** that compose this library with other iLib packages and tooling.

**v1** implements one methodology: **[MQM-Core](https://themqm.org/)** — the seven-dimension profile from [Multidimensional Quality Metrics (MQM)](https://themqm.org/), the de facto industry standard for analytic translation quality evaluation. MQM-Core covers Terminology, Accuracy, Linguistic conventions, Style, Locale conventions, Audience appropriateness, and Design and markup (see [§9](#9-mqm-methodology-requirements-product-level) and [MQM reference links](#mqm-reference-links)). The factory design SHALL remain **open to additional review types** in future releases (e.g. other MQM profiles, alternative rubrics).

This document specifies **what** the product must do and **why**. It intentionally avoids prescribing architecture, APIs, file layout, or technology choices.

---

## 2. Problem statement

Globalization teams need to monitor translation quality continuously as content arrives from vendors or from other AI translation systems, so they can intervene when quality drops below acceptable thresholds.

Today there is **no automated way** to perform this evaluation at scale. Many organizations rely on **third-party human review vendors**, which is costly and slow. With **constrained localization budgets**, teams typically review only a **statistically small sample** of content—often focused on **priority locales**—rather than the full translation volume. As the **locale portfolio grows**, the **share of content that receives human review tends to shrink**, leaving much of the catalog without systematic quality oversight.

An **AI-based review agent** could evaluate **substantially more—or all—content across all supported locales** **much faster** and at **lower cost** than periodic human review programs, while enabling **continuous** quality monitoring instead of episodic sampling.

Currently, there is no dedicated, reusable library that:

- Presents a consistent **review abstraction** across methodologies
- Implements **MQM review** as a first-class, **fully automated** capability
- Integrates with **ilib-ai** and downstream monitoring tools
- Supports **calibration** against existing human vendor review data

---

## 3. Goals and non-goals

### 3.1 Goals

- Provide a **factory** that produces reviewer implementations for a **specified review type**; v1 ships **MQM-Core** only, with the design open to additional types later
- Support **AI-based review exclusively**, communicating with AI providers **via ilib-ai**
- Perform **fully automated LQA** — findings and scores suitable for machine consumption and operational dashboards, without a human-in-the-loop confirmation step
- Review at **single-segment granularity**; **each string stands on its own** — every error instance within a string is counted at full severity so per-string scores remain valid for **any caller-selected subset**
- Provide an **opinionated aggregation capability** with built-in per-string scoring and subset **0–100** scores; aggregation **MAY optionally** apply cross-batch repetition policies (first-only, escalate-on-repetition) when the caller wants them
- **Incorporate and refine** prior experimental MQM prompt work into `ilib-review` as **checked-in, reusable** prompt assets (usable by Mojito and other callers once calibrated)
- Enable **calibration against proprietary golden sets** derived from historical vendor human reviews, with **documented setup instructions** in the library (golden data itself is not committed to the open-source repo)
- Fit naturally into the **iLib-js ecosystem** (shared types, build, localization data models, ilib-ai)

### 3.2 Non-goals (initial release)

The following are **explicitly out of scope** for `ilib-review` itself. Callers or sibling packages may provide them by composing this library:

- **Reading or writing XLIFF files** (e.g. a future `ilib-mqm` CLI would use `ilib-xliff` for parsing and `ilib-review` for evaluation)
- **Console reporting, dashboards, or review UI**
- **Deterministic lint rules** (`ilib-lint` and related packages)
- **Persistence, querying, alerting, or workflow orchestration**
- **Security, privacy, and data-residency policy enforcement** — callers decide what content to send to AI providers
- **Integration wiring** into `ilib-lint`, loctool, Mojito, or in-context review tools — those are consumer responsibilities; v1 delivers a standalone library only
- **Multi-model consensus / merge** of evaluations from different models (future idea; not v1)
- **Performance optimization** — correctness first; throughput, latency targets, and multi-string batching in a single AI call are future concerns unless proven necessary
- **Review methodologies other than MQM-Core** (factory SHALL be extensible; additional types are not v1 deliverables)

**Development philosophy:** Make it work **right** first (calibrated to vendor golden set), then make it work **faster** if needed.

---

## 4. Users and use cases

### 4.1 Primary users

| Persona | Need |
|---------|------|
| **Globalization engineers** | Integrate automated translation quality evaluation into tools that process vendor or AI translations as they arrive; monitor quality over time and trigger interventions when scores fall below thresholds |
| **Localization managers** | Find strings that need revisiting and correction; measure quality **before and after** corrections using per-string findings and aggregated scores |

### 4.2 Use cases

1. **Continuous vendor QA** — As translated XLIFF trans-units arrive from a vendor, review each unit automatically and store per-string error findings for trend monitoring and scoring via aggregation.
2. **AI translation monitoring** — Evaluate strings produced by internal or external AI translation systems using the same rubric and scoring as vendor content.
3. **Locale- and time-based aggregation** — After per-string scores are stored, aggregate subsets (e.g. all strings in `de-DE` for March, or all locales on a given day) into a single 0–100 quality score for reporting and alerting.
4. **Golden-set calibration** — Run the library against a proprietary set of strings with known **per-error vendor annotations** (dimension, subtype, severity, etc.); iterate prompts until automated findings and aggregated scores align with human baseline (see §10).
5. **Wrong-locale detection** — Identify when target text is in the wrong language for the expected locale (e.g. Greek translation placed in an `en-GB` file due to vendor UI error) — a class of issue difficult for deterministic lint but well suited to AI review.
6. **Batch XLIFF evaluation (via a caller tool)** — A dedicated CLI tool (e.g. future `ilib-mqm`) reads XLIFF via `ilib-xliff`, invokes `ilib-review` per trans-unit, aggregates scores, and prints results — orchestration lives in the caller, not in this library.
7. **AI-assisted lint fixes (future caller)** — `ilib-lint` or similar could later use `ilib-review` to suggest or evaluate AI-based translation improvements; not in scope for v1 delivery of `ilib-review` itself.
8. **In-context review (future caller)** — A tool that evaluates strings against a running UI could supply screenshots and trans-units to `ilib-review`; the library does not embed in applications.
9. **Correction and improvement tracking** — Localization managers use review output to identify strings needing correction, then re-run review after fixes to compare before-and-after quality at the string or aggregated subset level.

---

## 5. Scope

### 5.1 In scope (v1)

- **Factory** that produces reviewer implementations by review type; **v1 implements MQM-Core only**, with the contract designed for additional types later
- **AI-only** review using **ilib-ai** — no deterministic or rule-based review paths in this library
- **Single-segment, single-locale** review: one XLIFF trans-unit per review operation, yielding **structured error instances** (each with severity); numeric scoring is produced by the **aggregation** capability, not embedded in the reviewer as fixed multipliers
- **Aggregation** operation: **opinionated** built-in rules for converting per-string error findings into numeric scores and for combining them into **0–100 aggregate scores** over caller-defined subsets; optional **critical-fail policy** (see MQM-3, FR-35–38)
- Required input fields: **project**, **unique id**, **source locale**, **target locale**, **source**, **target**, **comments/notes**
- Optional context when available: **DNT (do-not-translate) lists**, **glossary terms**, **fuzzy TM matches**, **project prompts**, **screenshots** of source-language UI for visual context
- **MQM-Core** dimensions and **standard MQM-Core subtypes** per [§9 MQM reference links](#mqm-reference-links) (canonical subtype list to be confirmed from vendor/reference material)
- **MQM prompt assets** developed from prior local experimental work, checked into this package during v1, refined during golden-set calibration, and kept **reusable** by downstream tools (e.g. Mojito)
- Documentation for **setting up and running proprietary golden-set calibration tests** outside the repo

### 5.2 Out of scope (v1)

See §3.2. In summary: XLIFF I/O, CLI/console tools, lint integration, in-context UI, storage, security policy, and review types other than MQM-Core.

---

## 6. Functional requirements

Requirements are numbered for traceability. Wording is intentionally technology-neutral.

### 6.1 Review factory

| ID | Requirement |
|----|-------------|
| FR-1 | The library SHALL expose a factory that returns a reviewer implementation for a **specified review type** (e.g. MQM-Core). |
| FR-2 | The factory SHALL reject or clearly report **unsupported review types** not yet implemented. |
| FR-3 | All reviewers produced by the factory SHALL use **ilib-ai** as the sole mechanism for obtaining review findings. |
| FR-5 | v1 SHALL implement **MQM-Core** as the only review type; the factory contract SHALL allow **additional review types** to be added without breaking existing callers. |
| FR-4 | _TBD — configuration surface for reviewers (AI provider, model, project prompts, rubric options)._ |

### 6.2 Reviewer contract (all methodologies)

| ID | Requirement |
|----|-------------|
| FR-10 | Each reviewer SHALL accept input representing a **single translation unit** to review (see FR-50). |
| FR-11 | Each reviewer SHALL return structured results that identify quality issues found during review. |
| FR-12 | Review results SHALL be attributable to the reviewed unit via the caller-supplied **unique id** and **project**. |
| FR-13 | Review operations SHALL be suitable for **asynchronous** execution (AI latency); _exact async contract TBD_. |
| FR-14 | **Review** (error annotation) and **aggregation** (numeric scoring) SHALL be distinct operations. The reviewer annotates one unit at a time; the opinionated aggregation capability scores and combines stored results. |

### 6.3 MQM reviewer

| ID | Requirement |
|----|-------------|
| FR-20 | The MQM reviewer SHALL classify each distinct error instance with a **primary MQM dimension** drawn from the agreed dimension set. |
| FR-21 | Each error instance SHALL include a **severity** from the agreed severity scale. |
| FR-22 | Each error instance SHALL include a **subtype** from the **standard MQM-Core subtype taxonomy** (canonical list to be documented; vendor uses standard subtypes). |
| FR-23 | Each error instance SHOULD include a **rationale** or description sufficient for an engineer or downstream tool to understand the finding. |
| FR-24 | The MQM reviewer SHALL NOT apply severity **multipliers** or produce final numeric scores; it SHALL return **error instances with severities** only. Multipliers and score computation belong to the aggregation capability. |
| FR-25 | The MQM reviewer SHALL accept optional **context** when supplied by the caller: **DNT (do-not-translate) lists**, glossary terms, fuzzy TM matches, project prompts, and UI screenshots — and SHALL use that context to inform classification and severity. |
| FR-26 | The MQM reviewer SHALL use the **MQM-Core** profile: seven top-level dimensions, aligned with the organization's vendor scorecard. |
| FR-27 | The MQM reviewer SHALL support **Neutral** severity for non-penalizing findings; Neutral errors SHALL be recorded but SHALL contribute **zero** penalty when default multipliers are used in aggregation. |
| FR-28 | The MQM reviewer SHALL flag **untranslated** target text (where translation was expected) as a **Critical** error. |
| FR-29 | The MQM reviewer SHALL NOT treat **identical source and target** as an automatic error — identical text may be correct (e.g. loanwords, cognates such as `"1 file"` in Italian). |
| FR-30 | The MQM reviewer SHOULD detect **wrong-language** target text relative to the expected target locale (e.g. Greek text in an English GB locale file) and classify it as a **Critical** error, optionally identifying the detected language. |
| FR-31 | Within a single trans-unit, **every distinct error instance** SHALL receive full severity; the reviewer SHALL **not** downgrade later occurrences to Neutral as "repeated" (**count every instance** per string). |

### 6.4 Score aggregation

| ID | Requirement |
|----|-------------|
| FR-35 | The library SHALL provide an **opinionated** aggregation capability that accepts a **caller-defined subset** of previously stored per-string review results (error instances with severities). |
| FR-36 | **Default aggregation** SHALL treat **each string as self-contained**: every error instance in each included string contributes to the subset score. This ensures subset scores are not artificially inflated when the subset omits the "first" occurrence of a cross-string mistake. |
| FR-37 | The aggregation capability SHALL define **built-in rules** for (a) scoring each string's error findings and (b) combining those into subset-level **0–100 quality scores** — aligned with the vendor's standard MQM-style formula (_exact formula to be mined from vendor spreadsheets_). |
| FR-38 | The aggregation capability MAY offer **optional cross-batch repetition modes** (e.g. penalize-first-only, escalate-on-repetition) as caller-selected policies; these are **not** applied during per-string review. |
| FR-39 | The aggregation capability MAY allow **limited overrides** (e.g. critical-fail policy) but SHALL NOT require callers to supply scoring formulas or severity multipliers for basic use. |
| FR-40 | The aggregation capability SHALL support an **optional critical-fail policy**: when enabled, presence of any **Critical** error in the evaluated subset forces a fail outcome regardless of the numeric score. |
| FR-41 | Callers SHALL be responsible for selecting subsets (by locale, date range, project, etc.) and persisting per-string review results; the library provides review and aggregation, not storage or querying. |

### 6.5 Input and output

| ID | Requirement |
|----|-------------|
| FR-50 | The primary input unit SHALL be an **XLIFF trans-unit** (source and target content plus associated metadata). |
| FR-51 | **Required** input metadata: **project**, **unique id**, **source locale**, **target locale**, **source** text, **target** text, **comments/notes**. **Optional** context: **DNT lists**, glossary terms, fuzzy TM matches, project prompts, UI screenshots. _XLIFF attribute mapping TBD._ |
| FR-52 | Per-string review output SHALL include structured **error instances** (dimension, severity, subtype, rationale). Numeric scores are produced by calling the aggregation capability over stored results. _Full schema and versioning TBD._ |

### 6.6 Errors and edge cases

| ID | Requirement |
|----|-------------|
| FR-60 | The library SHALL report operational failures to review (missing target, invalid configuration, AI provider failure) in a structured way distinct from translation-quality findings. |
| FR-61 | When **source equals target**, the reviewer SHALL NOT automatically report an error; context (locale, notes, DNT list, glossary) determines whether sameness is acceptable. |
| FR-62 | When **target is empty** or clearly **untranslated** where translation is required, the reviewer SHALL report a **Critical** error. |
| FR-63 | When **target language does not match the expected locale**, the reviewer SHOULD report a **Critical** error and MAY identify the detected language. |

---

## 7. Non-functional requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-1 | **Distribution** | npm package name **`ilib-review`**. **Node.js only** (consistent with other iLib packages). _ESM/CJS, TypeScript typings, supported Node versions TBD._ |
| NFR-2 | **Dependencies** | **SHALL depend on ilib-ai** for all AI communication. **SHALL NOT** depend on `ilib-xliff`, `ilib-lint`, or loctool for v1 — those are optional **consumers**. |
| NFR-3 | **Performance** | **No v1 performance targets.** Correctness and golden-set calibration take priority. Optimization (latency, throughput, **batching multiple segments in one AI call** to reduce token cost) is deferred until needed. |
| NFR-4 | **Determinism** | **Small variance is acceptable** across runs, models, and model versions — comparable to inter-human reviewer variance. Exact reproducibility is not required for v1. |
| NFR-5 | **Observability** | _TBD — logging, tracing, debug modes._ |
| NFR-6 | **Security** | The library **SHALL NOT** impose security, privacy, or data-residency requirements. Callers are responsible for deciding what content to send to AI providers and for credential handling via ilib-ai. |
| NFR-7 | **Testing** | The library SHALL document how to configure and run **proprietary golden-set calibration tests** locally or in a private environment. Golden vendor review data **SHALL NOT** be committed to the open-source repo. Open-source repo tests SHALL use non-proprietary fixtures only. |
| NFR-8 | **Documentation** | README, rubric documentation (with [MQM reference links](#mqm-reference-links)), golden-set setup guide, aggregation formula documentation (once extracted from vendor data), and examples — _extent TBD_. |
| NFR-10 | **Prompt assets** | MQM prompts SHALL live in `ilib-review` as first-class, **checked-in, reusable** assets (evolved from prior local experimental drafts), suitable for use by Mojito and other callers without copy-paste. |
| NFR-9 | **Licensing** | Align with iLib-js monorepo licensing unless otherwise specified. |

---

## 8. Integration and ecosystem

**Ilib Review is a library, not an application.** It implements automated AI review and aggregation only. **Callers** choose how to integrate it.

| System | Relationship |
|--------|--------------|
| **ilib-ai** | **Required dependency** — sole path for AI communication |
| **ilib-xliff** | **Not a dependency.** Expected consumer: a caller tool (e.g. future `ilib-mqm` CLI) reads XLIFF and passes trans-units into `ilib-review` |
| **ilib-lint** | **Not a dependency.** Future consumer: could invoke `ilib-review` for AI-based translation evaluation alongside deterministic rules |
| **loctool / Mojito** | **Not v1 integration targets** for this package; any integration is via future caller tools |
| **In-context review tools** | Future consumers: supply trans-units, optional UI screenshots, and context; library returns findings and scores |
| **Prior experimental MQM prompts** | **Starting material for v1** — local uncommitted drafts to be brought into `ilib-review`, refined during golden-set calibration, kept reusable for Mojito and other consumers |
| **Envisioned caller: `ilib-mqm` (or similar)** | Reads XLIFF via `ilib-xliff`, reviews via `ilib-review`, aggregates, prints console results — **separate package, not part of v1** |

**Composition pattern:** Caller owns file I/O, orchestration, persistence, security, and presentation. `ilib-review` owns review methodology, **reusable prompts**, AI interaction, error annotation, and aggregation math.

---

## 9. MQM methodology requirements (product-level)

These requirements describe fidelity to MQM as a **review methodology**, not implementation.

### MQM reference links

When documenting or implementing MQM-Core in `ilib-review`, link to authoritative MQM resources:

| Resource | URL | Relevance |
|----------|-----|-----------|
| **MQM home** | [themqm.org](https://themqm.org/) | MQM initiative, error typology, general guidance |
| **MQM scoring models** | [The MQM Scoring Models](https://themqm.org/error-types-2/the-mqm-scoring-models/) | Severity multipliers, quality score calculation |
| **Repeated errors** | [Repeated Errors](https://themqm.org/resources/repeatederrors/) | Policies for duplicate error instances |
| **W3C MQM Community Group** | [W3C MQMCG](https://www.w3.org/community/mqmcg/) | Community snapshots and discussion |
| **TAUS DQF** | [TAUS](https://www.taus.net/) | Commercial localization quality framework aligned with MQM 2.0 |

| ID | Requirement |
|----|-------------|
| MQM-1 | v1 dimension set SHALL be **MQM-Core** (see [MQM reference links](#mqm-reference-links)): Terminology, Accuracy, Linguistic conventions, Style, Locale conventions, Audience appropriateness, Design and markup — matching the organization's vendor rubric. |
| MQM-2 | Severity scale SHALL support at least: **Neutral, Minor, Major, Critical**. Review assigns severity per error; the **opinionated aggregation API** applies built-in penalty rules. |
| MQM-3 | Aggregation SHALL implement **opinionated** per-string scoring and subset **0–100** formulas aligned with the vendor's standard MQM-style approach. Scoring uses **severity only** — **no numeric error-type weights** (e.g. no extra penalty multiplier for Accuracy vs Style). Exact formula to be **mined from vendor spreadsheets** and documented; calibrated against the golden set. |
| MQM-7 | Error **subtypes** SHALL follow the **standard MQM-Core taxonomy** (vendor-confirmed); canonical subtype list to be documented when obtained. |
| MQM-4 | Review SHALL be **functionalist**: findings judged against project purpose and supplied specifications (DNT lists, glossary, prompts, screenshots, notes), not abstract “good writing” alone. |
| MQM-5 | Aggregation SHALL support an **optional critical-fail override**: any Critical error may force fail independent of numeric score. |
| MQM-6 | **Repeated errors — per-string (review):** **Count every instance** (Option A). Each trans-unit is scored independently so any caller subset yields a correct score. **Cross-batch repetition** (first-only, escalate-on-repetition) MAY be offered as **optional aggregation modes**, not baked into review. _Upstream/root-cause handling TBD._ |

_Prior local experimental prompt drafts are not part of the published monorepo._

---

## 10. Success metrics

| Metric | Target |
|--------|--------|
| **Per-error alignment** | Automated findings match vendor golden set on **dimension, subtype, and severity** per error instance |
| **Aggregate score alignment** | **0–100 aggregated scores** for comparable subsets match vendor scores within agreed tolerance |
| **Human score alignment (overall)** | **Both** per-error alignment and aggregate score alignment are **equally important** calibration goals |
| **Coverage** | Enable review of **100% of strings** across **100% of locales** (operational goal for consuming tools, not a library unit test) |
| **Cost** | Total AI review cost below current third-party human review spend — _measured by consuming organization, not enforced by library_ |
| _Additional metrics TBD_ | _TBD_ |

---

## 11. Assumptions and constraints

- Historical **vendor human reviews** exist with **per-error annotations** (dimension, severity, etc.) and will serve as the calibration golden set.
- Golden set data is **proprietary** and must remain outside the public repository; the library provides **instructions** for private setup and testing only.
- The vendor's **aggregation formula** is documented in spreadsheets the organization holds; it will be extracted and codified in the library (described by vendor as a standard MQM-style formula).
- **AI model and version changes** may produce slightly different scores; this is acceptable for v1.
- Review is **fully automated** — no human confirmation step in the library workflow.
- Callers own **persistence, subset selection, alerting, security, and presentation**; the library produces per-string results and aggregate scores on demand.
- **Source locale** and **target locale** are **required** on every review call (needed for wrong-language detection and locale-aware evaluation).
- **Standard MQM-Core subtypes** are used by the vendor; the canonical list will be documented when obtained.
- Scoring uses **severity only** — no numeric weights by error type/dimension.
- **Each string stands on its own** at review time (count every error instance) so scores remain valid for arbitrary caller-selected subsets.

---

## 12. Open questions

Answers from stakeholder discovery. Resolved items are reflected in the sections above.

| # | Topic | Status |
|---|-------|--------|
| 1 | Primary users | **Resolved** — globalization engineers; **localization managers** |
| 2 | Problem / pain | **Resolved** — no automation; costly vendor sampling on a small fraction of content |
| 3 | Success / golden set | **Resolved** — calibrate to vendor scores; proprietary; document setup in library |
| 4 | AI vs rules | **Resolved** — AI-only via ilib-ai |
| 5 | Human vs automated | **Resolved** — fully automated LQA |
| 6 | Determinism | **Resolved** — small variance acceptable |
| 7 | Review unit | **Resolved** — XLIFF trans-unit |
| 8 | Required / optional input | **Resolved** — see FR-51 |
| 9 | Batch vs single | **Resolved** — single-segment review + separate aggregation |
| 10 | MQM profile / multiple review types | **Resolved** — factory supports multiple types; v1 implements **MQM-Core** only (vendor rubric); extensible later |
| 11 | Per-string vs aggregate scoring | **Resolved** — review returns errors + severities; aggregation applies multipliers and computes 0–100 scores |
| 12 | Severity vs scoring | **Resolved** — review assigns severity; **opinionated aggregation** applies built-in scoring rules |
| 13 | Golden set granularity | **Resolved** — per-error severities (and annotations) available |
| 14 | Aggregation formula | **Partially resolved** — vendor formula exists (standard MQM-style); to be mined from spreadsheets and documented |
| 15 | Critical fail | **Resolved** — optional flag on aggregation API |
| 16 | Ecosystem / caller model | **Resolved** — library only; callers include future `ilib-mqm` CLI, `ilib-lint`, in-context tools, **Mojito** (reusing prompts) |
| 17 | Relationship to ilib-lint | **Resolved** — separate packages; lint may consume this library later |
| 18 | Prior experimental prompts | **Resolved** — start from local uncommitted drafts; check into `ilib-review`, refine, keep reusable |
| 19 | loctool / Mojito v1 integration | **Resolved** — not v1 wiring; Mojito may reuse calibrated prompts later |
| 20 | Explicit v1 non-goals | **Resolved** — see §3.2 |
| 21 | Runtime | **Resolved** — **Node.js only** |
| 22 | PII / data residency | **Resolved** — caller responsibility |
| 23 | Package name | **Resolved** — **`ilib-review`** |
| 24 | Identical / untranslated / wrong language | **Resolved** — see FR-61–63, FR-28–30 |
| 25 | Subtype taxonomy | **Resolved** — standard MQM-Core subtypes; canonical list to be documented later |
| 26 | Aggregation opinionated vs configurable | **Resolved** — opinionated defaults; limited overrides (critical-fail, optional repetition modes) |
| 27 | Calibration targets | **Resolved** — **both** per-error match and aggregate score match equally important |
| 28 | Required locales | **Resolved** — **source locale** and **target locale** required on every call |
| 29 | Performance | **Resolved** — defer optimization; correctness first |
| 30 | Error-type weights | **Resolved** — **none**; severity-only scoring |
| 31 | Repeated errors | **Resolved** — **Option A** at review; optional first-only / escalate at **aggregation** only |
| 32 | Vendor aggregation formula details | **Open** — to be mined from vendor spreadsheets |
| 33 | Upstream / root-cause policy | **Open** |

### Repeated-error policy (resolved)

**Review (per trans-unit): Option A — count every instance.** Each string stands on its own. Rationale: callers select arbitrary subsets for aggregation; if first-only deduplication were applied at review or default aggregation without the "first" offending string in the subset, batch scores would be artificially high.

**Aggregation (optional):** The aggregation API MAY offer cross-batch **first-only** or **escalate-on-repetition** modes for callers who want MQM-style deduplication across a known full batch. Default aggregation treats each included string's errors at full weight.

**Still open:** upstream/root-cause → Neutral handling (see MQM-6).

---

## 13. Revision history

| Date | Change |
|------|--------|
| 2026-05-28 | Initial draft skeleton for stakeholder review |
| 2026-05-28 | Incorporated stakeholder answers (users, problem, AI-only, trans-unit input, per-string + aggregation scoring, golden set, variance) |
| 2026-05-28 | MQM-Core v1 only; extensible factory; caller/ecosystem model; package name `ilib-review`; security is caller-owned |
| 2026-05-28 | Scoring split (review annotates, aggregation multiplies); golden set per-error; prompt migration; edge cases; Node-only; optional critical-fail |
| 2026-05-28 | Opinionated aggregation; standard subtypes; required locales; dual calibration targets; performance deferred |
| 2026-05-28 | No error-type weights; repeated-error policy options documented |
| 2026-05-28 | Repeated errors: Option A at review; optional dedup modes at aggregation; subset-safe scoring rationale |
| 2026-05-28 | Problem statement generalized (removed org-specific sampling figures) |
| 2026-05-28 | Clarified prior MQM prompt work is local/uncommitted, not in monorepo |
| 2026-05-28 | MQM reference links; localization managers persona; correction/improvement use case |
| 2026-05-28 | Added DNT lists as optional review context |
