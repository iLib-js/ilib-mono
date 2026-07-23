# ilib-loctool-openapi

Ilib loctool plugin to parse and localize OpenAPI json files.

This plugin can parse and localize openapi.json files by using
either default OpenAPI schema bundled with the plugin,
or custom schema.

## Configuration

Internally, this plugin uses two other loctool plugins:
[ilib-loctool-json](https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-loctool-json)
and
[ilib-loctool-ghfm](https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-loctool-ghfm)

OpenAPI plugin configuration is identical to
[JSON plugin's config](https://github.com/iLib-js/ilib-loctool-json#configuring-the-plugin).
The only difference is `openapi` key used instead of `json`
in `settings` section.

In order to use built-in OpenAPI schema use `openapi-schema`
schema id in mappings section.

Example configuration:

```json
{
    "settings": {
        "openapi": {
            "schemas": [
                "./schemas"
            ],
            "mappings": {
                "**/openapi.json": {
                    "schema": "openapi-schema",
                    "method": "copy",
                    "template": "resources/[localeDir]/appinfo.json"
                },
                "**/custom-openapi.json": {
                    "schema": "custom-schema",
                    "method": "copy",
                    "template": "[dir]/strings.[locale].json"
                }
            }
        }
    }
}
```

In the example above file `openapi.json` will be parsed using
built-in schema and `custom-openapi.json` using custom schema
from `./schemas` folder.

## License

Copyright © 2026 JEDLSoft

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-loctool-openapi/LICENSE) file in the ilib-mono repository on GitHub.

## Release Notes

See [CHANGELOG.md](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-loctool-openapi/CHANGELOG.md).

