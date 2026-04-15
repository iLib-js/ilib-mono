# Note on unstable `micromark` versions

Currently, this plugin uses the following versions of `micromark`-related dependencies:

```json
"mdast-util-from-markdown": "^0",
"mdast-util-to-markdown": "^0",
"mdast-util-gfm-strikethrough": "^0",
"micromark-extension-gfm-strikethrough": "^0"
```

this is because all these packages became ESM-only at the moment of their stable release `1.0.0`, while at the time of writing `loctool` is written in CommonJS (so it can't `import`) and loads plugins synchronously (so it can't `import()` either) - see plugin loader source at https://github.com/iLib-js/loctool/blob/v2.25.1/lib/CustomProject.js#L116.

This should be _mostly fine_, since these versions have been used publicly in `remark v13` (i.e. `remark-parse@9`). In addition, Pendo strings are expected to have low complexity due to being pre-segmented prior to export from Pendo.
