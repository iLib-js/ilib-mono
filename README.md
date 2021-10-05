# ilib-loctool-xml

Ilib loctool plugin to parse and localize xml files.

This plugin can parse and localize xml files by either
understanding the schema via a schema file, or by
defaulting to a list of key/value pairs.

## Methods of Localizing

XML files are localized in one of the following
methods:

1. copy. Make a copy of the entire source file
and replace values of certain elements or attributes
in the copy with translations. The copy can be sent to
any output desired directory using a template.
"Copy" is the default method with which
localized XML files are handled.
1. sparse. Make a copy of the source file where only
the localized elements appear. The copy has the same
structure as the original XML file, but only elements
where the value is localized appear in the output.
1. resource. Make a new XML file that only contains
translations in it with a very simple format.

The first method, localizing the entire file, has the
advantage that you don't need to change your code in
order to read the translated file. You just need to pick
the right file for the current locale.

The second method is similar to the
first method above, except that it can save space
because all of the non-localizable data in the original
XML file is not duplicated.
In this case, you would need to load in the English file
first, then mix-in the localized file to override all
the localizable strings in order to create the full
data with translations embedded in it.

The third method, resource files, are similar to many
programming languages in that translations are written
to a separate, very simply formatted file which should
be easy to read and process. Basically, the xml resource
file format has the following structure:

```
<?xml version="1.0" encoding="utf-8"?>
<properties>
    <entry key="key1">translation 1</entry>
    <entry key="key2">translation 2</entry>
    ...
</properties>
```

This is similar to Java XML-format properties files and
similar XML files used in Android, although with different
element tag names.

## Default Schema

In the absence of any schema information, a default
schema will be applied. The default schema is Java XML
format properties files. That is, the
plugin will assume that the XML file is a simple object
where the root tag is "properties" and the subtags are
"entry". The text inside the tag is the source language
string.

Example:

```xml
<?xml version="1.0" encoding="utf-8"?>
<properties>
    <entry key="key1" i18n="translator note 1">source string 1</entry>
    <entry key="key2" i18n="translator note 2">source string 2</entry>
    ...
</properties>
```

Essentially, this means that we assume that the file has
the following json-XML schema:

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "properties-schema",
    "type": "object",
    "description": "A Java properties file",
    "properties": {
        "properties": {
            "type": "object",
            "properties": {
                "entry": {
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
                }
            }
        }
    }
}
```

## Configuring the Plugin

The plugin will look for the `xml` property within the `settings`
of your `project.json` file. The following settings are
used within the json property:

- schemas: a string naming a directory full of json schema files, or
  an array of strings naming some json schema files or directories to
  load. If the XML file
  does not fit any of the schema (ie. it does not validate according to
  any one of the schema), then that file will be skipped and not localized.
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
{
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
}
```

In the above example, any file named `resources.xml` will be parsed with the
`http://www.mycompany.com/xml/resources` schema. The translated resources
will be written out to a file named `resources.xml` in a resource file format
(same as a Java properties file) in a directory named for the locale.

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

## Specifying the XML Structure Using JSON Schema

The way the plugin operates is to first convert XML file to a json object
using the [xml-js](https://www.npmjs.com/package/xml-js) package. From there,
a json schema is applied to the resulting json, similar to the way that the
ilib-loctool-json plugin works.

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

Converted to JSON using xml-js:

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

See the xml-js documentation for more details on how this conversion works.

## Extensions to JSON Schema

In regular JSON Schemas, there is no built-in way to indicate that any property
is localizable or which parts of a json object form the various parts of a
resource string. However, the JSON Schema spec allows for creating extensions
to the keywords of your json schema and specifies that implementation must
ignore any keywords that it does not recognize.

Given that, the json schema is extended with a `localizable` keyword
and a `localizableType` keyword.

### The `localizable` Keyword

This plugin recognizes the new `localizable` keyword as an extension. The
`localizable` keyword specifies that parts of a XML element should be
localized. By default, objects are not localizable unless explicitly specified
using the `localizable` keyword.

In an XML document, the key of a resource, the English source text, the
translator's comment, and the source locale may all be specified in
separate XML elements within a specific parent element. They may also
be specified using the element name itself, or as the value of an attribute
on an element or sub-element. The `localizable` keyword should only be
specified for the parent element that contains all the information for a
single resource.

The `localizable` keyword is ignored for null or undefined values. For
the primitive types string, integer, number, or boolean values, the value
is directly localizable. Each localizable object can result in a
translation unit that the translators may localize.

### The `localizableType` Keyword

Because the parts of a resource may be specified in sub-elements or
attributes of a parent element, there needs to be a way to specify which
parts of which sub-elements or attributes should be assigned to the
fields in a resource. What is the mapping? That is, we need a way to
specify which one of these sub-elements or attributes contains the
English source text? The  unique key? The translator's comment?

The way this is done is via the `localizableType` keyword.

Suppose we have the following xml:

```xml
<resources>
    <string key="keyname">
        <comment>This is the translator's comment</comment>
        <value>This is the source text in English</value>
    </string>
</resources>
```

In the above example, the entire `string` element forms one localizable
string resource. The resource key is "keyname" which is taken from the `key`
attribute on the `string` element. The translator's comment is taken
from the text inside of the `comment` element. The source text is
taken from the text inside of the `value` element. Together, they
specify a single resource that is assembled as one after the entire
element is parsed. (The locale is assumed to be the source locale, so
it does not need to be specified.)

#### Resource Types

The loctool supports three resource types:

1. string
1. array
1. plural

The type of resource created for an XML element is specified using
the `type` property within the `localizableType`.

Example:

```json
"properties": {
    "strtype": {
        "type": "string",
        "localizable": true,
        "localizableType": {
            "type": "string"
        }
    }
}
```

If the only property inside of a `localizableType` is the type,
then it can be notated as a string instead of an object. The following
is equivalent to the schema above:

```json
"properties": {
    "strtype": {
        "type": "string",
        "localizable": true,
        "localizableType": "string"
    }
}
```

#### Resource Fields

Resources contain the following fields:

- "key" - the unique key of this resource
- "source" - the source text of this resource
- "comment" - a comment for the translator to give more context
- "locale" - the source locale of this resource

#### Element Parts

The various element parts that can be assigned to resource fields are:

- "_value" - the textual value within this element
- "_element" - the element name of the current element
- "_path" - the XML path to the current element. This is the
name of all the elements in the tree above the current element
plus the name of the current element, all separated by slashes

If multiple things are assigned to a resource field, the last one
is the one that will be used.

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
element in the example. The `localizableType` assigns the text value
of each item to the "source" field in the resource. In this way, each one
of them is added as an entry in the array in the order they appeared
in the original XML file.

#### Plural Resources

When the `localizable` keyword is given for an object type, that object
can encode a plural string. The `localizableType` keyword must contain
the type "plural" to specify that.

In order to fully specify a plural, elements or attributes under that
main element must contain a string for various plural categories.
To specify a category, the `localizableType` keyword contains a
`category` property, and the value of the "_value" element is assigned to
the "source" field of the resource.

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

Example JSON schema file:

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

## Not an XML Validator

Please note that this plugin is *not* a XML schema validator, though it
works in similar ways. If the XML being parsed does not conform to
the given schema, no errors or exceptions will be thrown, but it will
print some warnings to the output. The strings will merely not be
extracted/localized as expected.

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.0.0

- initial version
- support json schema style parsing of XML and also a default schema (simple key/value resources)
