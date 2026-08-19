---
"loctool": minor
---

Add `unique` and `unique:field+field+...` selection criteria to the select command so callers can control which fields identify already-seen translation units (for example `unique:key+source` when Mojito drop ids are stored in `original`/`product-name`).
