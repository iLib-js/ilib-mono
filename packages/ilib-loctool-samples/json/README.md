# ilib-loctool-json plugin sample

This is a sample project that demonstrates how to use the `ilib-loctool-json` plugin to extract strings from JSON files for localization.
The project contains a single JSON file with all the strings that need localization.


## Structure
- `project.json`: The main configuration file for the project that needs localization.** 
- `schema.json`: The schema file that defines the structure of the JSON file to be localized.
- `i18n/sample.json`: A JSON file containing strings that need to be localized. 

** For a detailed description of how to create the configuration file for the project, refer to the [loctool README](https://github.com/iLib-js/ilib-mono/tree/main/packages/loctool#configuration).

## Schema file
The schema file is used by the ilib-loctool-json plugin to extract strings from the JSON file.
Detailed information on how to create a schema file can be found in the [ilib-loctool-json README](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-loctool-json/README.md#ilib-loctool-json)

It is important to note that the schema file has custom property:
* `localizable`: The localizable keyword specifies that the value of a property should be localized.

**Example:**

A JSON schema file that defines the structure of the JSON file to be localized:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "sample-schema",
  "title": "Sample schema with localizable supported keywords (true, source, comment, key)",
  "type": "object",
  "additionalProperties": {
    "type": "object",
    "localizable": "key",
    "properties": {
      "defaultMessage": {
        "type": "string",
        "localizable": "source"
      },
      "description": {
        "type": "string",
        "localizable": "comment"
      }
    }
  }
}
```

JSON file that needs to be localized:
```json
{
  "project.whatever.key": {
    "defaultMessage": "I am a string that needs to be localized.",
    "description": "I am a comment for the string that needs to be localized."
  }
}
```

And the resulting XLIFF file:

Note that:
* the `resname` attribute is set to the JSON object key "project.whatever.key"
* the `source` tag is set to the value of the `defaultMessage` property, since it is marked as `localizable: "source"`
* the `note` tag is set to the value of the `description` property, since it is marked as `localizable: "comment"`

```xml
<trans-unit id="3" resname="project.whatever.key" restype="string" datatype="json">
    <source>I am a string that needs to be localized.</source>
    <note>I am a comment for the string that needs to be localized.</note>
</trans-unit>

```

## How it works
1. `loctool` reads the configuration file (`project.json`) and identifies the JSON file that needs to be localized.
2. `loctool` extracts the strings from the JSON file using `ilib-loctool-json` plugin and saves them in an XLIFF file.

## Usage
To extract strings from the JSON file, install dependencies by running the following command from the root directory:
```bash
yarn
```

Once the dependencies are installed, run the following command to extract strings:
```bash
yarn run loc
```

After running the command, the extracted strings will be saved in the `sample-json-extracted.xliff` file and other XLIFF files saved next to it.


## Updating the project configuration
To update the project configuration, modify the `project.json` file as needed.
Ensure that any changes to the configuration are consistent with the [loctool configuration guidelines](https://github.com/iLib-js/ilib-mono/tree/main/packages/loctool#configuration).
