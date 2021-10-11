# ilib-loctool-xml

Ilib loctool plugin to parse and localize xml files.

This plugin can parse and localize xml files by either
understanding the schema via a schema file, or by
defaulting to a list of key/value pairs.

# How it Works

This plugin parses XML files and extracts localizable strings from them. It
can write translations of these strings to a copy of the XML file or to a
separate file.

The way the plugin operates is to first convert the XML file to a json object
using the [xml-js](https://www.npmjs.com/package/xml-js) package. From there,
a JSON schema is applied to the resulting json, similar to the way that the
ilib-loctool-json plugin works. The JSON schema tells the plugin how to parse
the file and which parts to extract for each resource.

Example XML file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<properties>
    <entry key="key1" i18n="translator note 1">source string 1</entry>
    <entry key="key2" i18n="translator note 2key" locale="en-US">source string 2</entry>
    <entry key="key3">source string 3</entry>
    <entry>source string 4</entry>
</properties>
```

Converting that file to JSON using xml-js, we get:

```json
{
    "_declaration": {
        "_attributes": {
            "version": "1.0",
            "encoding": "utf-8"
        }
    },
    "properties": {
        "entry": [
            {
                "_attributes": {
                    "key": "key1",
                    "i18n": "translator note 1"
                },
                "_text": "source string 1"
            },
            {
                "_attributes": {
                    "key": "key2",
                    "i18n": "translator note 2",
                    "comment": "foo"
                },
                "_text": "source string 2"
            },
            {
                "_attributes": {
                    "key": "key3"
                },
                "_text": "source string 3"
            },
            {
                "_text": "source string 4"
            }
        ]
    }
}
```

In the above JSON, you can see that the multiple `entry` elements
from the XML became an array of objects in the JSON. There is a special
property `_attributes` that gives the XML attributes on an element.
The special property `_text` specifies the plain text inside of
an XML element.

See the [xml-js](https://www.npmjs.com/package/xml-js) documentation
for more details on how this conversion works.

## Methods of Localizing

XML files are localized in one of the following methods:

1. copy. Make a copy of the entire source file
and replace values of certain elements or attributes
in the copy with translations. The copy can be sent to
any output desired directory using a template.
"Copy" is the default method with which
localized XML files are handled.
1. sparse. Make a copy of the source file where only
the localized elements appear. The copy has the same
structure as the original XML file, but only elements
where text is localized appear in the output.
1. resource. Make a new XML file that only contains
translations in it with a Java properties format.

The first method, localizing the entire file, has the
advantage that you don't need to change your code in
order to read the translated file. You just need to pick
the right file for the current locale and feed it in
to the existing code.

The second method is similar to the
first method above, except that it can save space
because all of the non-localizable data in the original
XML file is not duplicated. For some XML files, the
non-localizable parts are considerable.
In this case, you would need to load in the English file
first, then mix-in the localized file to override all
the localizable strings in order to create the full
data structure with all the translations embedded in it.

The third method, resource files, are similar to many
programming languages in that source strings are extracted,
translated, and then the translations are written
to a separate, very simply formatted file which should
be easy to read and process: Android resource files. An
Android resource file has the following structure:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="key1">translation 1</string>
    <string name="key2">translation 2</string>
    ...
</resources>
```

This is also similar to XML style Java properties files, although
with different element tag names.

## Configuring the Plugin

The plugin will look for the `xml` property within the `settings`
of your `project.json` file. The following settings are
used within the json property:

- schemas: a string naming a directory full of JSON schema files, or
  an array of strings naming some JSON schema files or directories to
  load. If the XML file
  does not fit any of the schema (ie. it does not validate according to
  any one of the schema), then that file will be skipped and not localized.
  Schemas files are discussed below.
- mappings: a mapping between file matchers and an object that gives
  info used to localize the files that match it. This allows different
  XML files within the project to be processed with different schema.
  The matchers are
  a [micromatch-style string](https://www.npmjs.com/package/micromatch),
  similar to the the `includes` and `excludes` section of a
  `project.json` file. The value of that mapping is an object that
  can contain the following properties:
    - schema: schema to use with that matcher. The schema is 
      specified using the `$id` of one of the schemas loaded in the
      `schemas` property above. The default schema is "properties-schema"
      which is given in the previous section.
    - method: one of "copy" or "sparse" or "resource"
        - copy: make a copy of the source file and localize the
          string contents. (This is the default method if not specified
          explicitly.)
        - sparse: make a copy of the source file but only
          include localized strings
        - resource: write out a resource file format with the
          translations in it
    - template: a path template to use to generate the path to
      the translated
      output files. The template replaces strings in square brackets
      with special values, and keeps any characters intact that are
      not in square brackets. The default template, if not specified is
      "resources/[localeDir]/[filename]". The plugin recognizes
      and replaces the following strings in template strings:
        - [dir] the original directory where the matched source file
          came from. This is given as a directory that is relative
          to the root of the project. eg. "foo/bar/strings.xml" -> "foo/bar"
        - [filename] the file name of the matching file. 
          eg. "foo/bar/strings.xml" -> "strings.xml"
        - [basename] the basename of the matching file without any extension
          eg. "foo/bar/strings.xml" -> "strings"
        - [extension] the extension part of the file name of the source file.
          etc. "foo/bar/strings.xml" -> "xml"
        - [locale] the full BCP-47 locale specification for the target locale
          eg. "zh-Hans-CN" -> "zh-Hans-CN"
        - [language] the language portion of the full locale
          eg. "zh-Hans-CN" -> "zh"
        - [script] the script portion of the full locale
          eg. "zh-Hans-CN" -> "Hans"
        - [region] the region portion of the full locale
          eg. "zh-Hans-CN" -> "CN"
        - [localeDir] the full locale where each portion of the locale
          is a directory in this order: [langage], [script], [region].
          eg, "zh-Hans-CN" -> "zh/Hans/CN", but "en" -> "en".
        - [localeUnder] the full BCP-47 locale specification, but using
          underscores to separate the locale parts instead of dashes.
          eg. "zh-Hans-CN" -> "zh_Hans_CN"


Example configuration:

```json
    "settings": {
        "xml": {
            "schemas": "./xml/schemas",
            "mappings": {
                "**/resources.xml": {
                    "schema": "http://www.mycompany.com/xml/resources",
                    "method": "resource",
                    "template": "resources/[localeDir]/resources.xml"
                },
                "**/config.xml": {
                    "schema": "http://www.lge.com/xml/config",
                    "method": "sparse",
                    "template": "config/config_[localeUnder].xml"
                },
                "src/**/strings.xml": {
                    "schema": "http://www.mycompany.com/xml/strings",
                    "method": "copy",
                    "template": "[dir]/strings.[locale].xml"
                }
            }
        }
    }
```

In the above example, any file named `resources.xml` will be parsed with the
`http://www.mycompany.com/xml/resources` schema. The translated resources
will be written out to a file named `resources.xml` in a resource file format
(Android resource files) in a directory named for the locale.

In the second part of the example, any `config.xml` file will be parsed with
the schema `http://www.mycompany.com/xml/config`. Because the method is
`sparse`, only the parts of the XML file that have translated strings in them will
appear in the output config files. The output file is sent to the `config`
directory.

In the third part of the example, any `strings.xml` file that appears in
the `src` directory will be parsed with the schema
`http://www.mycompany.com/xml/strings`. A full copy of the file, including
the parts that were not localized,
will be sent to the same directory as the source file. However, the
localized file name will also contain the name of the locale to distinguish
it from the source file.

If the name of the localized file that the template produces is the same as
the source file name, this plugin will throw an exception, the file will not
be localized, and the loctool will continue on to the next file.

# Schema Files

This plugin uses JSON schemas to document how to extract strings from the
XML files. The JSON schema is applied to the JSON that is produced after
it is converted from XML by the [xml-js](https://www.npmjs.com/package/xml-js)
package.

## Extensions to JSON Schema

In regular JSON Schemas, there is no built-in way to indicate that the value
of a particular JSON property is localizable, nor which properties or
subproperties of a JSON object form the various parts of a resource.
However, the JSON Schema spec allows for creating extensions
to the keywords of your JSON schema and specifies that implementation must
ignore any keywords that it does not recognize.

Given that, this plugin extends the JSON schema with a `localizable` keyword
and a `localizableType` keyword.

### The `localizable` Keyword

This plugin recognizes the new `localizable` keyword as an extension to
indicate that parts of a XML element or its
sub-elements should be localized. By default, elements in XML (and
therefore objects in JSON after it is converted) are not localizable
unless explicitly specified using the `localizable` keyword.

In an XML document, the key of a resource, the English source text, the
translator's comment, and the source locale may all be specified in
separate XML elements, sub-elements, or attributes within a specific
parent element. They may also be specified using the element name itself
or the names of sub-elements. The `localizable` keyword should only be
specified for the parent element that contains all the information for a
single resource. That is, it should not be specified for the sub-elements.
The reason is that the plugin will start constructing a new resource
each time it finds a `localizable` keyword, and then assign various
parts and subparts of the element to the fields of that new resource.

The `localizable` keyword is ignored for null or undefined values. For
the primitive types string, integer, number, or boolean values, the value
is directly localizable. Each localizable element can result in a
loctool resource which becomes a translation unit in the xliff file
that the translators may localize.

### The `localizableType` Keyword

Because the parts of a resource may be specified in sub-elements or
attributes of a parent element, there needs to be a way to specify which
parts of which sub-elements or attributes should be assigned to the
fields of the new resource. That is, there needs to be a mapping
between subparts of the element and the resource fields.

This mapping is given in the `localizableType` keyword.

Suppose we have the following xml:

```xml
<resources>
    <string key="keyname">
        <comment>This is the translator's comment</comment>
        <value>This is the source text in English</value>
    </string>
</resources>
```

In the above example, the entire `string` element and its subparts
contains information for just one resource. The key is given in the
value of the "key" attribute "keyname" on the `string` element.
The translator's comment is taken
from the text inside of the `comment` element. The source text is
taken from the text inside of the `value` element. The last resource
field, locale, is assumed to be the same as the source locale because
no locale was specified in the XML. (This is common.)

#### Resource Types

The loctool supports three resource types:

1. string - single strings to translate. (This is the default)
1. array - an array of strings to translate where order matters
1. plural - a string that has different forms depending on the number
of a particular item

The type of resource created for an XML element is specified using
the `type` property within the `localizableType`.

Example JSON schema snippet:

```json
"properties": {
    "strtype": {
        "type": "string",
        "localizable": true,
        "localizableType": {
            "type": "array"
        }
    }
}
```
In this example, the "strtype" XML element is localizable, and forms
an array resource type.

If the only property inside of a `localizableType` object is the type,
then it can be notated as a string instead of an object. The following
is equivalent to the schema above:

```json
"properties": {
    "strtype": {
        "type": "string",
        "localizable": true,
        "localizableType": "array"
    }
}
```

#### Resource Fields

Resources contain the following fields which can be extracted from the
XML:

- "key" - the unique key of this resource
- "source" - the source text of this resource
- "comment" - a comment for the translator to give more context
- "locale" - the source locale of this resource

#### Element Parts

The various element parts that can be assigned to resource fields are:

- "_value" - the textual value contained within this element
- "_element" - the element name of the current element. eg. "&lt;x>" has
the element name "x".
- "_path" - the XML path to the current element. This is the
name of all the elements in the tree above the current element
plus the name of the current element, all separated by slashes. This
is similar to an xpath selector without any predicates or wildcards
in it.

#### Assigning Element Parts to Resource Fields

Use properties in the `localizableType` keyword to specify a
mapping between an element part and a resource field.

Let's take the example above of a `string` element that has an attribute
which is the key, and two sub-elements which give the translator's
comment and the source text. The schema is specified like this:

```json
    "string": {
        "type": "object",
        "localizable": true,
        "properties": {
            "_attributes": {
                "type": "object",
                "properties": {
                    "key": {
                        "type": "string",
                        "localizableType": {
                            "_value": "key"
                        }
                    }
                }
            },
            "comment": {
                "_text": {
                    "type": "string",
                    "localizableType": {
                        "_value": "comment"
                    }
                }
            },
            "value": {
                "_text": {
                    "type": "string",
                    "localizableType": {
                        "_value": "source"
                    }
                }
            }
        }
    }
```

In this example, the `string` element has an attribute called
`key`. When the XML file is converted to json, the values of
XML attributes are notated in a special property called `_attributes`
under the element that contained those attributes. We can use
regular JSON schema syntax to specify those attributes. In this
case, we are picking out the value of the `key` attribute
(notated as "_value") and assigning that to the "key" field of
the resource.

In the second section, the `comment` element lives under the
`string` element, and the text value within that element (given
as "_value") should be assigned to the "comment" field of the
element.

In the last section, the `value` element lives under the
`string` element. The text within the `value` element is
assigned to the source text of the resource.

Sometimes the sub-element of a parent element contains information
that is not related to translation. These sub-elements or attributes
should be preserved but not extracted for translation.

It is not recommended to assign an element part to a field multiple
times, but if it happens, the last one processed is the one that will
be used.

#### Array Resources

When the `localizable` keyword is given for an element that contains
an array, every item in the array is localizable and must be of a
primitive type (string, integer, number, or boolean). If any array
entries are not of a primitive type, an exception will be thrown and
the localization will be halted.

Example XML:

```xml
    <string-array id="foo">
        <item>octagon</item>
        <item>nonagon</item>
        <item>decagon</item>
        <item>undecagon</item>
        <item>dodecagon</item>
    </string-array>
```

This is specified as follows in the schema:

```json
    "string-array": {
        "type": "object",
        "localizable": true,
        "localizableType": "array",
        "properties": {
            "_attributes": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string",
                        "localizableType": {
                            "_value": "key"
                        }
                    }
                }
            },
            "item": {
                "type": "string",
                "localizableType": {
                    "_value": "source"
                }
            }
        }
    }
```

Note that multiple `item` elements appear inside of the `string-array`
element in the example XML. The `localizableType` assigns the text value
of each item to the "source" field in the resource. In this way, each one
of them is added as an entry in the array in the order they appeared
in the original XML file.

#### Plural Resources

When the `localizable` keyword is given for an object type, that object
may encode a plural string. Plurals are not possible if the JSON schema
for the current element is a primitive type like string or number. 
The `localizableType` keyword should contain a type property with
the value "plural" to specify that.

In order to fully specify a plural, elements or attributes under that
main element must contain a string for various plural categories.
To specify which category to use, the `localizableType` keyword contains a
`category` property.

The list of allowed plural categories are defined in the
[Unicode plural rules](http://cldr.unicode.org/index/cldr-spec/plural-rules):

- zero
- one
- two
- few
- many
- other

The "one" and the "other" property are required for source files in English.
Other languages will have different combinations of plural categories.

Example XML:

```xml
    <string-plural id="unique">
        <singular>This is the singular string</singular>
        <plural>This is the plural string</plural>
    </string-plural>
```

Example JSON schema file for the above XML:

```json
        "string-plural": {
            "type": "object",
            "localizable": true,
            "localizableType": "plural",
            "properties": {
                "_attributes": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "localizableType": {
                                "_value": "key"
                            }
                        }
                    }
                },
                "singular": {
                    "type": "object",
                    "properties": {
                        "_text": {
                            "type": "string",
                            "localizableType": {
                                "_value": "source",
                                "category": "one"
                            }
                        }
                    }
                },
                "plural": {
                    "type": "object",
                    "properties": {
                        "_text": {
                            "type": "string",
                            "localizableType": {
                                "_value": "source",
                                "category": "other"
                            }
                        }
                    }
                }
            }
        }
    }
}
```

The value of the "_value" element is assigned to the "source" field of the
resource in both the singular and plural elements. The difference is that
they have different categories, so they do not conflict.

#### Plural Templates

The above XML has two strings, one for singular and one for plural. What
about the other categories? In other languages, the plurals may use other
categories, so how do we notate that in the translated file? In this case,
the plugin
needs to know which elements or attributes to use for those categories when
writing out the localized files. The solution is plural templates.

Suppose we want to specify category strings like this:

```xml
<string category="one">This is the singular.</string>
```

Converted to json, it would look like this:

```json
    "string": {
        "_attributes": {
            "category": "one"
        },
        "_text": "This is the singular."
    }
```

To specify the template, simply replace the name of the category with
the special string "[_category]" and the value of the translation with
the special string "[_translation]".

Thus, the plural template would look like this:

```json
    "string": {
        "_attributes": {
            "category": "[_category]"
        },
        "_text": "[_translation]"
    }
```

The plural templates are specified in the schema definition in the
`$defs` keyword.

```json
    "$defs": {
        "templates": {
            "plural": {
                "all": {
                    "string": {
                        "_attributes": {
                            "category": "[_category]"
                        },
                        "_text": "[_translation]"
                    }
                }
            }
        }
    }
```

The above specifies that the template given inside of the "all"
property should be used with all categories.

In some forms of XML, each category needs to have a different
template. This is also specified in the `templates/plural` property:

```json
    "$defs": {
        "templates": {
            "plural": {
                "zero": {
                    "none": {
                        "_text": "[_translation]"
                    }
                },
                "one": {
                    "singular": {
                        "_text": "[_translation]"
                    }
                },
                "two": {
                    "double": {
                        "_text": "[_translation]"
                    }
                },
                "few": {
                    "few": {
                        "_text": "[_translation]"
                    }
                },
                "many": {
                    "many": {
                        "_text": "[_translation]"
                    }
                },
                "other": {
                    "plural": {
                        "_text": "[_translation]"
                    }
                }
            }
        }
    }
```

In that example, the category is implicit in the name of the XML
element that is generated. Example XML might look like this:

```xml
    <string-plural id="unique">
        <singular>This is the singular string</singular>
        <double>This is the dual string</double>
        <many>This is the many plural string</many>
        <plural>This is the plural string</plural>
    </string-plural>
```

Note that the plural templates only specify the sub-elements or
attributes of the category strings. The parent element
(ie. "string-array" in the example) stays the same as it was in the
source XML.

## Default Schema

In the absence of any schema information, a default
schema will be applied. The default schema is for an Android
resource file. That is, the
plugin will assume that the XML file is a simple object
where the root tag is "resources" and the subtags are
"string", or "plural", or "string-array". The text inside the tag
is the source language string.

Example:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="key1" i18n="translator note 1">source string 1</string>
    <string name="key2" i18n="translator note 2">source string 2</string>
    ...
</resources>
```

Essentially, this means that we assume that the file has
the following json-XML schema:

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "android-resource-schema",
    "type": "object",
    "description": "An Android resource file",
    "$defs": {
        "array-type": {
            "type": "object",
            "localizableType": "array",
            "properties": {
                "_attributes": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "localizableType": {
                                "_value": "key"
                            }
                        },
                        "i18n": {
                            "type": "string",
                            "localizableType": {
                                "_value": "comment"
                            }
                        },
                        "locale": {
                            "type": "string",
                            "localizableType": {
                                "_value": "locale"
                            }
                        }
                    }
                },
                "item": {
                    "type": "object",
                    "properties": {
                        "_text": {
                            "type": "string",
                            "localizableType": {
                                "_value": "source"
                            }
                        }
                    }
                }
            }
        },
        "templates": {
            "plurals": {
                "item": {
                    "_attributes": {
                        "quantity": "[_category]"
                    },
                    "_text": "[_source]"
                }
            }
        }
    },
    "properties": {
        "resources": {
            "type": "object",
            "properties": {
                "string": {
                    "type": "object",
                    "localizable": true,
                    "properties": {
                        "_attributes": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "localizableType": {
                                        "_value": "key"
                                    }
                                },
                                "i18n": {
                                    "type": "string",
                                    "localizableType": {
                                        "_value": "comment"
                                    }
                                },
                                "locale": {
                                    "type": "string",
                                    "localizableType": {
                                        "_value": "locale"
                                    }
                                }
                            }
                        },
                        "_text": {
                            "type": "string",
                            "localizableType": {
                                "_value": "source"
                            }
                        }
                    }
                },
                "plurals": {
                    "type": "object",
                    "localizable": true,
                    "localizableType": "array",
                    "properties": {
                        "_attributes": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "localizableType": {
                                        "_value": "key"
                                    }
                                },
                                "i18n": {
                                    "type": "string",
                                    "localizableType": {
                                        "_value": "comment"
                                    }
                                },
                                "locale": {
                                    "type": "string",
                                    "localizableType": {
                                        "_value": "locale"
                                    }
                                }
                            }
                        },
                        "item": {
                            "type": "object",
                            "properties": {
                                "_attributes": {
                                    "quantity": {
                                        "type": "string",
                                        "localizableType": {
                                            "_value": "category"
                                        }
                                    }
                                },
                                "_text": {
                                    "type": "string",
                                    "localizableType": {
                                        "_value": "source"
                                    }
                                }
                            }
                        }
                    }
                },
                "array": {
                    "$ref": "#/$defs/array-type"
                },
                "string-array": {
                    "$ref": "#/$defs/array-type"
                }
            }
        }
    }
}
```

## Not an XML Validator

Please note that this plugin is *not* a XML schema validator, though it
works in similar ways. If the XML being parsed does not conform to
the given schema, no errors or exceptions will be thrown. The plugin
will print some warnings to the output for the engineers to diagnose
what is going on, but the strings will merely not be extracted/localized
as expected.

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.0.0

- initial version
- support JSON schema style parsing of XML and also a default schema
  (Java properties files)
