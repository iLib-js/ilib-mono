# ilib-loctool-php-resource

ilib-loctool-php-resource is a plugin for the loctool that
allows it to output resources in PHP format. The output is essentially
a PHP file that contains a single associative array that maps
resource keys to their values.

## Configuration

The plugin recognizes the following configuration parameters in the
project.json file:

- `sourceLocale`: The locale of the source strings. This is the locale
  that the strings in the source files are assumed to be in. The default
  is "en-US".
- `template`: The default path template to use when generating the output file
  name if the source file mapping does not specify it. The default value for 
  this default is `resource-files/Translation[locale].php` but you can set it
  here for any file types that do not set it on their own. See the documentation
  of the loctool itself for more information about path template syntax.

Example project.json configuration snippet where strings are extracted from
tmpl files and the localized resources are output to PHP files:

```json
{
    "settings": {
        "locales": [
            "en-US",
            "fr-FR"
        ],
        "resourceFileTypes" : {
            "php" : "ilib-loctool-php-resource"
        },
        "template": {
            "mappings": {
                "admin/**/*.tmpl": {
                    "sourceLocale": "en-US",
                    "template": "localized/Template[locale].php"
                },
                "src/**/*.tmpl": {
                    "sourceLocale": "en-US"
                }
            }
        }
        "php": {
            "sourceLocale": "en-US",
        }
    }
}
```

The resourceFileTypes property maps datatypes to loctool plugins. This registers
the named plugin as the resource file type for resources from your source that
have that datatype. For example, let's say we use a made up datatype of "template"
which represents a UI written in some templating language. If you are extracting
resources from template .tmpl files, you would use "template" as the source file
data type and map that to "ilib-loctool-php-resource" to output the results to
php resource files. See the loctool plugin you are using to parse your project's
source files to find out what the source file data type is.

Note that the `template` property can be specified in the mapping for your source
files (as shown above), or globally for the whole project in the settings.php.template
property. If specified in both places, the mapping property takes precedence. Note
that most of the time you will want to specify the template in the mapping property
because the source file plugin will already have a default template that may be
inappropriate for your resources and its default template overrides the one specified
in the settings.php.template property.

In the example above, the strings extracted from `admin/**/*.tmpl` files will be output
to `localized/Template[locale].php` as per the mapping, and the strings extracted
from `src/**/*.tmpl` files will be output to `localized/Lang[locale].php` as per the
global setting in the `php` property. If the template is not specified
in either location, the default template will be used which is
`resource-files/Translation[locale].php`.

## Release Notes

See the [change log](./CHANGELOG.md) for details on changes between releases.

## License

Copyright © 2024 JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
