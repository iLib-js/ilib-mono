---
"ilib-loctool-json": patch
---

Fixed absolute schema path resolution. Updated behaviour of relative schema path resolution to be more in-line with project settings convention i.e. resolve it relative to the loctool project's root rather than current working directory (for those rare cases where someone runs loctool outside of a given project).
