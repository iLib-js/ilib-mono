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
    - flavor: the flavor attribute to use for Android resource files.
      The flavor usually applies to all resources in a particular
      subdirectory, and corresponds to a particular customer for a
      white label app. Each resource produced from the source file
      will have the given flavor. If not specified, there is no
      flavor attribute for the resources.
    - localeMap: an output locale map that specifies the mapping
      between locales that are used internally in the plugin, and the
      output locale that should be used for constructing
      the file name of output files. If a locale does not appear in
      the mapping, it will not be mapped. That is, the original locale
      will be used to construct the output file name.
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
                    "template": "config/config_[localeUnder].xml",
                    "localeMap": {
                        "de-DE": "de",
                        "fr-FR": "fr",
                        "ja-JP": "ja"
                    }
                },
                "customer1/src/**/strings.xml": {
                    "schema": "http://www.mycompany.com/xml/strings",
                    "method": "copy",
                    "flavor": "customer1",
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
directory, and the locale used to construct the file name goes through the
locale map first. That is, if you localized to the locale "de-DE", the locale
will be mapped to "de" and the file name will come out as "config/config_de.xml"

In the third part of the example, any `strings.xml` file that appears in
the `src` directory will be parsed with the schema
`http://www.mycompany.com/xml/strings`. A full copy of the file, including
the parts that were not localized,
will be sent to the same directory as the source file. However, the
localized file name will also contain the name of the locale to distinguish
it from the source file. Also, every resource in the strings.xml file will have
the Android flavor "customer1".

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
- "category" - the plural category for a plural resource
- "context" - the context field for this resource
- "formatted" - for Android resources, the formatted attribute of a resource

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
- "_pathname" - The full path name of the file from the root of the project
to the current file
- "_basename" - The basename of the current file without the extension

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
                            "key": "_value"
                        }
                    }
                }
            },
            "comment": {
                "_text": {
                    "type": "string",
                    "localizableType": {
                        "comment": "_value"
                    }
                }
            },
            "value": {
                "_text": {
                    "type": "string",
                    "localizableType": {
                        "source": "_value"
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
                            "key": "_value"
                        }
                    }
                }
            },
            "item": {
                "type": "string",
                "localizableType": {
                    "source": "_value"
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
                                "key": "_value"
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
                                "source": "_value",
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
                                "source": "_value",
                                "category": "other"
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

Note that the way the xml to json converter works is that a single subitem
of a node will just contain that subitem, but if there are multiple subitems
in a node, it will have an array of them.

Example: plurals with "item" subelements as in Android resource files

```xml
    <plurals name="unique">
        <item quantity="one">This is the singular string</item>
        <item quantity="other">This is the plural string</item>
    </plurals>
```

The above would convert into the following json:

```json
    "plurals": {
        "_attributes": {
            "name": "unique"
        },
        "item": [
            {
                "_attributes": {
                    "quantity": "one"
                },
                "_text": "This is the singular string"
            },
            {
                "_attributes": {
                    "quantity": "other"
                },
                "_text": "This is the plural string"
            }
        ]
    }
```

But, if there were only one item in the plural, like this:


```xml
    <plurals name="unique">
        <item quantity="other">This is the plural string</item>
    </plurals>
```

Then the above would convert into the following json:

```json
    "plurals": {
        "_attributes": {
            "name": "unique"
        },
        "item": {
            "_attributes": {
                "quantity": "other"
            },
            "_text": "This is the plural string"
        }
    }
```

In the first example, the "item" node is an array of objects. In the second,
it is a single object.

Care must be taken to account for this in your schema. Here is how you
might make a useful schema using the "anyOf" keyword in your json schema
to parse an array of plurals or just a single plural. These share the
definition of a plural and of an item in the "$defs" keyword by using "$ref"
to refer to them:

```json
    "$defs": {
        "plural-item-type": {
            "type": "object",
            "properties": {
                "_attributes": {
                    "type": "object",
                    "properties": {
                        "quantity": {
                            "type": "string",
                            "localizableType": {
                                "category": "_value"
                            }
                        }
                    }
                },
                "_text": {
                    "type": "string",
                    "localizableType": {
                        "source": "_value"
                    }
                }
            }
        },
        "plural-type": {
            "type": "object",
            "localizable": true,
            "localizableType": "plural",
            "properties": {
                "_attributes": {
                    "$ref": "#/$defs/resource-attribute-type"
                },
                "item": {
                    "anyOf": [
                        {
                            "type": "array",
                            "items": {
                                "$ref": "#/$defs/plural-item-type"
                            }
                        },
                        {
                            "$ref": "#/$defs/plural-item-type"
                        }
                    ]
                }
            }
        }
    },
    "properties": {
        "plurals": {
            "anyOf": [
                {
                    "type": "array",
                    "items": {
                        "$ref": "#/$defs/plural-type"
                    }
                },
                {
                    "$ref": "#/$defs/plural-type"
                }
            ]
        }
    }
```

#### Plural Templates

The above XML has two strings, one for singular and one for plural. What
about the other categories? In other languages, the plurals may use other
categories that are not used in the source language (English?), so how do
we notate that in the translated file? In this case, the plugin
needs to know which elements or attributes to use for those categories when
writing out the localized files. The solution is plural templates.

Plural templates allow you to specify the attributes and children of a
plural element and with special keywords that get replaced with values
from the original source. For example, you can use "[_key]" to specify
that the unique key of a resource should be placed into the template
at this point.

Example. A full plural might look something like this in an Android
resource file:

```xml
<plurals name="plural 1">
    <item quantity="one">This is the singular.</item>
    <item quantity="other">This is the plural.</item>
</plural>
```

For English, we would use the "one" and "other" categories as specified
above, but for Russian, we need to use the "one", "few", and "other"
categories, so we need a plural template to generate those.

The plural templates are specified in the schema definition inside the
`$defs` keyword. Here is a full plural template for the above
plural xml in the "$defs":

```json
    "$defs": {
        "templates": {
            "plurals": {
                "default": {
                    "_attributes": {
                        "name": "[_key]"
                    },
                    "[_forEachCategory]": {
                        "item": {
                            "_attributes": {
                                "quantity": "[_category]"
                            },
                            "_text": "[_target]"
                        }
                    }
                }
            }
        }
    }
```

Inside of "$defs/templates/plurals" is the "default" property. This is the
name of the template. The schema allows you to have multiple templates,
one for each type of plural you need to support. The name "default" is used
when no specific name is given to the template and will be used as the
default template.

Inside the template, we specify the name attribute, which takes the value
of the resource's key, and we have a special property "[_forEachCategory]".
This specifies that all of the children underneath it get replicated for
every category in the translation of a plural resource. That is, in Russian
that part of the template gets replicated 3 times, one each for "one",
"few", and "other".

Inside the "forEachCategory" property, other strings get replaced with
values from the resource. Here is a table of the replacement values:

|  *label* |  *value* |
|---------|---------|
| _key | The unique key of the resource. |
| _target | The target translation of the resource for the category |
| _category | The category of the translation |
| _locale | The locale specifier for the translation |
| _comment | The translator's comment for the resource |
| _context | The context attribute for the resource |
| _flavor  | The flavor attribute for the resource (Android) |
| _formatted  | The formatted attribute for the resource (Android) |

Let's say we have a plural resource that should look like this:

```xml
    <string-plural id="unique">
        <one>This is the singular string</one>
        <two>This is the dual string</two>
        <many>This is the many plural string</many>
        <other>This is the plural string</other>
    </string-plural>
```

That is, the subelements of "string-plural" are named for the
category instead of having an attribute that names the category.
In this case, we can use the "[_category]" substitution
in property name inside the template, like this:

```json
    "$defs": {
        "templates": {
            "plurals": {
                "default": {
                    "_attributes": {
                        "id": "[_key]"
                    },
                    "[_forEachCategory]": {
                        "[_category]": {
                            "_text": "[_target]"
                        }
                    }
                }
            }
        }
    }
```

The "[_forEachCategory]" keyword can also appear inside of
attributes if necessary.

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
        "resource-attribute-type": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "localizableType": {
                        "key": "_value"
                    }
                },
                "i18n": {
                    "type": "string",
                    "localizableType": {
                        "comment": "_value"
                    }
                },
                "locale": {
                    "type": "string",
                    "localizableType": {
                        "locale": "_value"
                    }
                }
            }
        },
        "plural-item-type": {
            "type": "object",
            "properties": {
                "_attributes": {
                    "type": "object",
                    "properties": {
                        "quantity": {
                            "type": "string",
                            "localizableType": {
                                "category": "_value"
                            }
                        }
                    }
                },
                "_text": {
                    "type": "string",
                    "localizableType": {
                        "source": "_value"
                    }
                }
            }
        },
        "plural-type": {
            "type": "object",
            "localizable": true,
            "localizableType": "plural",
            "properties": {
                "_attributes": {
                    "$ref": "#/$defs/resource-attribute-type"
                },
                "item": {
                    "anyOf": [
                        {
                            "type": "array",
                            "items": {
                                "$ref": "#/$defs/plural-item-type"
                            }
                        },
                        {
                            "$ref": "#/$defs/plural-item-type"
                        }
                    ]
                }
            }
        },
        "string-type": {
            "type": "object",
            "localizable": true,
            "localizableType": "string",
            "properties": {
                "_attributes": {
                    "$ref": "#/$defs/resource-attribute-type"
                },
                "_text": {
                    "type": "string",
                    "localizableType": {
                        "source": "_value"
                    }
                }
            }
        },
        "array-item-type": {
            "type": "object",
            "properties": {
                "_text": {
                    "type": "string",
                    "localizableType": {
                        "source": "_value"
                    }
                }
            }
        },
        "array-type": {
            "type": "object",
            "localizable": true,
            "localizableType": "array",
            "properties": {
                "_attributes": {
                    "$ref": "#/$defs/resource-attribute-type"
                },
                "item": {
                    "anyOf": [
                        {
                            "type": "array",
                            "items": {
                                "$ref": "#/$defs/array-item-type"
                            }
                        },
                        {
                            "$ref": "#/$defs/array-item-type"
                        }
                    ]
                }
            }
        },
        "templates": {
            "plurals": {
                "default": {
                    "_attributes": {
                        "name": "[_key]",
                        "i18n": "[_comment]"
                    },
                    "[_forEachCategory]": {
                        "item": {
                            "_attributes": {
                                "quantity": "[_category]"
                            },
                            "_text": "[_target]"
                        }
                    }
                }
            }
        }
    },
    "properties": {
        "resources": {
            "type": "object",
            "properties": {
                "string": {
                    "anyOf": [
                        {
                            "type": "array",
                            "items": {
                                "$ref": "#/$defs/string-type"
                            }
                        },
                        {
                            "$ref": "#/$defs/string-type"
                        }
                    ]
                },
                "plurals": {
                    "anyOf": [
                        {
                            "type": "array",
                            "items": {
                                "$ref": "#/$defs/plural-type"
                            }
                        },
                        {
                            "$ref": "#/$defs/plural-type"
                        }
                    ]
                },
                "string-array": {
                    "anyOf": [
                        {
                            "type": "array",
                            "items": {
                                "$ref": "#/$defs/array-type"
                            }
                        },
                        {
                            "$ref": "#/$defs/array-type"
                        }
                    ]
                }
            }
        }
    }
}
```

### One Last Note

Getting the schema definitions is often pretty difficult. If your schema
is not causing the plugin to extract any resources, it's probably your
schema definition. Try changing the log4js.json inside of the loctool to
set the level for the various `loctool.lib.ResourceFactory*` settings
to "debug" or "trace". This will give some clue about whether resources
are being created and if so, what types are they.

Also, it is a good idea to convert your XML to json format and examine
that before writing the JSON schema to parse it. To convert it, use the
auxiliary program `convertToJson.js` that comes along with this plugin.

```
Usage: node node_modules/ilib-loctool-xml/convertToJson.js myfile.xml
```

That will output the json to the standard output.

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

### v1.1.2

- update dependencies
- use the loctool's logger instead of its own

### v1.1.1

- Add unit tests to verify parsing the file name with locale
- Updated the way that the plugin decides which files to handle

### v1.1.0

- Add support for new replacements and tags
    - In parsing the resources, you can now extracted the
      "formatted", "context", and the "flavor" attributes for a resource.
    - In creating a plural template, you can now use those three
      attributes.
    - When getting the value of an attribute, you can now use the
      \_pathname and \_basename values, which will convert into the full
      path name of the file, and the base name of the file.
- Make sure required properties exist in the localization
    - If a property is required, it should exist in the localized
      file, even if it does not exist in the source file. This
      allows for localization of empty strings or missing source
      strings.
- fixed android resource schema file which was missing from the package
- added localeMap to the configuration of a mapping

### v1.0.0

- initial version
- support JSON schema style parsing of XML and also a default schema
  (Java properties files)
- support for plural templates
