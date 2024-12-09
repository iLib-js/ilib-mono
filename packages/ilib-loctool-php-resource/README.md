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
- `template`: The template to use when generating the output file. The
  default is `resource-files/Translation[locale].php`. See the documentation
  of the loctool itself for more information about the template syntax.

Example project.json configuration snippet:

```json
{
    "settings": {
        "locales": [
            "en-US",
            "fr-FR"
        ],
        "php": {
            "sourceLocale": "en-US",
            "template": "localized/Lang[locale].php"
        }
    }
}
```

Additionally, you must specify the plugin name in the loctool configuration
for resource file types. For example:

```json
{
    "resourceFileTypes" : {
        "[your source file data type here]" : "ilib-loctool-php-resource"
    }
}
```

This registers the plugin as the resource file type for resources from
your source. For example, if you are extracting resources from PHP files,
you would use "php" as the source file data type. See the loctool plugin
you are using to parse the source files to find out what the source file
data type is.

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
