# ilib-loctool-pendo-md

[Loctool](https://github.com/iLib-js/loctool) plugin to handle translation strings exported from [Pendo](https://www.pendo.io/).

This plugin accepts an XLIFF file exported from Pendo (`<xliff version="1.2"><file datatype="pendoguide">`) and extracts existing translation units from it mapping them 1:1 to loctool Resources with **escaped Markdown syntax**.

## Extraction

### Markdown Syntax

As per [Pendo documentation](https://support.pendo.io/hc/en-us/articles/360031866552-Use-markdown-syntax-for-guide-text-styling), the app supports a subset of classic Markdown syntax:

```md
_italics_ or _italics_
**bold**
[links](example.com)

1. ordered lists

-   unordered lists

*   unordered lists

-   unordered lists
```

And some custom extensions:

```md
~~Strikethrough~~
++Underline++
{color: #000000}colored text{/color}
```

There is a high risk of breaking this syntax by translators, so the main task of this plugin is to **escape** this syntax using XML-like component tags `<c0></c0>`.

### Escaping

Given a Pendo markdown string like

```markdown
String with _emphasis_, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)
```

transform it to an escaped string

```text
String with <c0>emphasis</c0>, <c1>underline</c1>, <c2>color</c2> and <c3>a link</c3>
```

### Unescaping (backconversion)

After parsing a source string, plugin keeps track of escaped components:

```text
- c0: emphasis
- c1: underline
- c2: color #FF0000
- c3: link https://example.com
```

Thanks to that, during localization this plugin is able to **unescape** (backconvert) these components in a translated string:

```text
Translated string, <c3>translated link</c3> <c1>translated underline</c1>, <c0>translated emphasis</c0> <c2>translated color</c2>
```

it will transform it back to the markdown syntax

```markdown
Translated string, [translated link](example.com) ++translated underline++, _translated emphasis_ {color: $FF0000}translated color{/color}
```

Note that it supports shuffled order of components, since this is often required in different languages.

## Translation

During the _localize_ step, this plugin will output a copy of the original Pendo XLIFF for each locale defined in the loctool's `project.json` settings. For each source string which has translation in loctool (i.e. provided via loctool's xliff files), this translation will optionally be unescaped as described above and will be insterted into the corresponting `<target>` element content in the output file.

Additionally, this plugin supports output locale mapping.

## Example localization process

Below you can find a step-by-step process to showcase the plugin's intention.

Given a source Pendo XLIFF file `$PROJECT/guides/A000A00Aaa0aaa-AaaaAaa00A0a_en.xliff`

```xml
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
    <file original="A000A00Aaa0aaa-AaaaAaa00A0a" datatype="pendoguide" source-language="en-US" target-language="">
        <body>
            <group id="Aaaaaaaa0aAaaAAA0AAA0A0aAaa">
                <trans-unit id="8de49842-c1fd-4536-905e-8817673b4c24|md">
                    <source><![CDATA[**Callout!**]]></source>
                    <target></target>
                    <note>TextView</note>
                </trans-unit>
            </group>
        </body>
    </file>
</xliff>
```

and the following loctool configuration

```json
{
    "name": "ilib-loctool-pendo-md-test",
    "id": "ilib-loctool-pendo-md-test",
    "description": "translate strings exported from Pendo",
    "projectType": "custom",
    "sourceLocale": "en",
    "includes": ["guides/*.xliff"],
    "settings": {
        "xliffsDir": "translations",
        "locales": ["pl-PL"],
        "localeMap": {
            "pl-PL": "pl"
        },
        "pendo": {
            "mappings": {
                "guides/*.xliff": {
                    "template": "[dir]/[basename]_[locale].[extension]"
                }
            }
        }
    },
    "plugins": ["ilib-loctool-pendo-md"]
}
```

invoking

```sh
loctool localize "$PROJECT"
```

will first run the _extract_ step and produce a loctool XLIFF with extracted **escaped** strings `$PROJECT/ilib-loctool-pendo-md-test-extracted.xliff`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2">
  <file original="" source-language="en" product-name="ilib-loctool-pendo-md-test">
    <body>
      <trans-unit id="1" resname="8de49842-c1fd-4536-905e-8817673b4c24|md" restype="string" datatype="plaintext">
        <source>&lt;c0&gt;Callout!&lt;/c0&gt;</source>
        <note>TextView [c0: strong]</note>
      </trans-unit>
    </body>
  </file>
</xliff>
```

notice that:

1. markdown strong `** **` in the source string is now escaped as components `<c0> </c0>`
2. trans-unit comment is updated to include description of the escaped components: _[c0: strong]_

Then, loctool will immediately run the _localize_ step and produce a (not really) localized copy of the source file `$PROJECT/guides/A000A00Aaa0aaa-AaaaAaa00A0a_en_pl.xliff`:

```xml
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
    <file original="A000A00Aaa0aaa-AaaaAaa00A0a" datatype="pendoguide" source-language="en-US" target-language="pl">
        <body>
            <group id="Aaaaaaaa0aAaaAAA0AAA0A0aAaa">
                <trans-unit id="8de49842-c1fd-4536-905e-8817673b4c24|md">
                    <source><![CDATA[**Callout!**]]></source>
                    <target/>
                    <note>TextView</note>
                </trans-unit>
            </group>
        </body>
    </file>
</xliff>
```

notice that:

1. target tag stays empty because there is no translation available yet
2. file name includes mapped output locale `pl` rather than the translation locale `pl-PL`
3. `target-language` attribute is also filled using the mapped output locale

Now you need to obtain translations. Assume you've sent the loctool XLIFF file `$PROJECT/ilib-loctool-pendo-md-test-extracted.xliff` to a linguist and received translations for locale `pl-PL`. Following your project's config, you put it in `$PROJECT/translations/ilib-loctool-pendo-md-test-pl-PL.xliff`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2">
  <file original="" source-language="en" target-language="pl-PL" product-name="ilib-loctool-pendo-md-test">
    <body>
      <trans-unit id="1" resname="8de49842-c1fd-4536-905e-8817673b4c24|md" restype="string" datatype="plaintext">
        <source>&lt;c0&gt;Callout!&lt;/c0&gt;</source>
        <target>&lt;c0&gt;Wywołanie!&lt;/c0&gt;</target>
        <note>TextView [c0: strong]</note>
      </trans-unit>
    </body>
  </file>
</xliff>
```

note that the target also has `<c0> </c0>` tags in it, since your linguist knew how to handle XML-like tags properly.

Running loctool again

```sh
loctool localize "$PROJECT"
```

this time, it will load the _pl-PL_ translations from the file specified in your `xliffsDir` folder and _localize_ step will backconvert and insert those translations while regenerating the (now actually) localized file `$PROJECT/guides/A000A00Aaa0aaa-AaaaAaa00A0a_en_pl.xliff`:

```xml
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
    <file original="A000A00Aaa0aaa-AaaaAaa00A0a" datatype="pendoguide" source-language="en-US" target-language="pl">
        <body>
            <group id="Aaaaaaaa0aAaaAAA0AAA0A0aAaa">
                <trans-unit id="8de49842-c1fd-4536-905e-8817673b4c24|md">
                    <source><![CDATA[**Callout!**]]></source>
                    <target state="translated">**Wywołanie!**</target>
                    <note>TextView</note>
                </trans-unit>
            </group>
        </body>
    </file>
</xliff>
```

which you can safely import back to Pendo.
