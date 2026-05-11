---
"loctool": patch
---

Add `compare` command to diff two xliff files
- New command: `loctool compare from_xliff to_xliff output_dir`
- Outputs modified.xliff, added.xliff, deleted.xliff (only if non-empty)
- added: units only in to_xliff, deleted: units only in from_xliff, modified: target changed
