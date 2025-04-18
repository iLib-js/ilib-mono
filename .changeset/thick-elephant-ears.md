---
"ilib-po": patch
---

- Fixed handling of Polish plural categories in PO files. The categories `one`, `few`, and `many` are now correctly recognized and processed.
- Added logic to backfill the `many` plural category with the `other` category for Polish when `many` is missing in the incoming `Resource` object.
