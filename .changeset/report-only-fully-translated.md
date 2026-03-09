---
"ilib-loctool-mdx": minor
---

Add "report-only" mode for fullyTranslated setting. When set to "report-only", the plugin writes fullyTranslated: true or fullyTranslated: false in the frontmatter based on actual translation status, but always outputs the best available translation. This decouples the status flag from the output behavior, so partially translated files keep their translations instead of reverting to the original English source.
