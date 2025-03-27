---
"ilib-loctool-json": major
---

Fixed absolute schema path resolution. Updated behaviour of relative schema path resolution to be more in-line with project settings convention i.e. resolve it relative to the loctool project's root rather than current working directory (for those rare cases where someone runs loctool outside of a given project).

Migration guide: [docs/upgrades/ilib-loctool-json/2.0.0.md](docs/upgrades/ilib-loctool-json/2.0.0.md)
