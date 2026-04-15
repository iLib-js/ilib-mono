# ilib-loctool-samples/slack

This project contains a sample of a project that has slack
mrkdwn strings encoded in a js file. Each file exports a
simple javascript object with the following format:

```
    // comment for the following string
    "unique-id": "a string in slack mrkdwn syntax"
```

The markdown syntax is hidden from the translators using
xml-like components that are number sequentially as they
are found in the source string. So, the string
`This is _a *mrkdwn* string_ with a <http://slack.com|link> in it.` 
will become 
`This is <c0>a <c1>mrkdwn</c1> string</c0> with a <c2>link</c2> in it.`

Notice that the link syntax is now hidden from the translator
so they are not able to do things like localize the URL or
screw up the mrkdwn syntax which they might not be familiar with.
This assumes of course that translators are at least basically
familiar with xml, which is usually the case, but not familiar
with mrkdwn, which is a very niche syntax.

Upon localization, the components will be recomposed back into 
Slack mrkdwn syntax. Note that in the translation, the components
are allowed to be switched around or nested differently than
in the source string.

## Trying Them Out

Before you start, run `npm install` first to install everything.

Here are the targets you can run:

- loc - run the localization tool on this project. Input is in
translations/strings.js, and the output is in
translations/de/DE/strings.js and
translations/ko/KR/strings.js
- debug - run the localization tool on this project with the
chrome debugging tools. Open `chrome://inspect/#devices` in
chrome and click on "Open dedicated DevTools for Node" to watch
the localization tool running in the debugger.
- clean - clean up the localization results so that you can
run it all again.

# License

Copyright (c) 2024, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
