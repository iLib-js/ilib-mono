---
"loctool": patch
---

- Fixed an issue where configs with an unrecognized `projectType` were
  rejected during validation. Unknown project types are now accepted and
  handled as custom projects, preserving the original `projectType` value.
