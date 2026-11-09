---
"ilib-address": patch
"ilib-assemble": patch
"ilib-casemapper": patch
"ilib-common": patch
"ilib-csv": patch
"ilib-ctype": patch
"ilib-data-utils": patch
"ilib-env": patch
"ilib-es6": patch
"ilib-glyphstring": patch
"ilib-istring": patch
"ilib-lint": patch
"ilib-lint-apple": patch
"ilib-lint-common": patch
"ilib-lint-java": patch
"ilib-lint-javascript": patch
"ilib-lint-python": patch
"ilib-lint-python-gnu": patch
"ilib-lint-react": patch
"ilib-loader": patch
"ilib-locale": patch
"ilib-localedata": patch
"ilib-localeinfo": patch
"ilib-localematcher": patch
"ilib-loctool-android-layout": patch
"ilib-loctool-android-resource": patch
"ilib-loctool-csv": patch
"ilib-loctool-ghfm": patch
"ilib-loctool-ghfm-readmeio": patch
"ilib-loctool-haml": patch
"ilib-loctool-html": patch
"ilib-loctool-java-android-ilib": patch
"ilib-loctool-javascript": patch
"ilib-loctool-javascript-resource": patch
"ilib-loctool-json": patch
"ilib-loctool-jst": patch
"ilib-loctool-jsx": patch
"ilib-loctool-mdx": patch
"ilib-loctool-mrkdwn": patch
"ilib-loctool-objectivec": patch
"ilib-loctool-openapi": patch
"ilib-loctool-php-resource": patch
"ilib-loctool-po": patch
"ilib-loctool-properties": patch
"ilib-loctool-regex": patch
"ilib-loctool-ruby-ilib": patch
"ilib-loctool-salesforce-metaxml": patch
"ilib-loctool-strings": patch
"ilib-loctool-swift": patch
"ilib-loctool-tap-i18n": patch
"ilib-loctool-xml": patch
"ilib-loctool-yaml": patch
"ilib-loctool-yaml-resource": patch
"ilib-name": patch
"ilib-po": patch
"ilib-resbundle": patch
"ilib-scanner": patch
"ilib-tmx": patch
"ilib-tools-common": patch
"ilib-tree-node": patch
"ilib-xliff": patch
"ilib-yaml": patch
"loctool": patch
"message-accumulator": patch
"tmxtool": patch
"ilib-zic": patch
---

Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

Yarn 1 enforces engines and refuses to install these packages on newer
Node releases when the range stops at Node 23.
