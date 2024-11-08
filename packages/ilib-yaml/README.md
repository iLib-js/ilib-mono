# ilib-yaml

Library to turn yaml files into Resources and vice-versa.

# Basic Usage

This library exports a class YamlFile which reads or writes
yaml files. You can then add instances of Resource or get
an array of Resource instances.

Here is the full [API documentation](./docs/ilibYaml.md)

To read a yaml file and convert it to Resources where the strings
appear as source strings:

```javascript
import Yaml from 'ilib-yaml';
import fs from 'node:fs';

const yaml = new Yaml();
yaml.deserialize(fs.readFileSync("./my/file.yaml", "utf-8"));

const resources = yaml.getResources();
```

To read a yaml file and convert it to Resources where the
strings appear as target strings:

```javascript
import Yaml from 'ilib-yaml';

// the source strings
const src = new Yaml();

src.deserialize(fs.readFileSync("./my/en-US.yaml", "utf-8"));

// read this as target strings, and get the source
// strings from the YamlFile we pass in
const tgt = new Yaml({
    sourceYaml: src,
    locale: "de-DE"
});
tgt.deserialize(fs.readFileSync("./my/de-DE.yaml", "utf-8"));

const resources = tgt.getResources();
```

To convert an array of Resources into a yaml file:

```javascript
import Yaml from 'ilib-yaml';

const y = new Yaml(); // no argument means new, empty instance

y.addResource(resource);
// or if you have many
y.addResources(resourceArray);

fs.writeFileSync(y.serialize(), "utf-8");
```

Please note that all entries in a yaml file are converted into Resource
instances. In many yaml files, not every entry is a translatable string,
so this is possibly not what you want. It is up to the caller to filter
the Resource array afterwards to discard any entries that are not needed.
This is accomplished by passing in a filter callback function to the
constructor, or by discarding the unwanted resources after they are
retrieved from this instance.

## Filling out the Resource Instances

The above examples were simplified to show the basic usage, but in most
usages, Resource instances can contain many fields. In order to get these
fields filled out, you can specify the values to use in the constructor:

```javascript
import Yaml from 'ilib-yaml';

// the source strings
const src = new Yaml({
    pathName: "./my/en-US.yaml",
    locale: "en-US"
});

src.deserialize(fs.readFileSync("./my/en-US.yaml", "utf-8"));

// read this as target strings, and get the source
// strings from the YamlFile we pass in
const tgt = new Yaml({
    sourceYaml: src,
    // this becomes the targetLocale field because we are creating
    // full source+target resources
    locale: "de-DE",
    // these optional fields will get added to every Resource
    // instance if they are specified here in the constructor:
    pathName: "./my/de-DE.yaml",
    project: "myproject",
    context: "a",
    state: "new",
    datatype: "yaml",
    flavor: "b"
});
tgt.deserialize(fs.readFileSync("./my/de-DE.yaml", "utf-8"));

const resources = tgt.getResources();
```

Additionally, reskey field will be filled in automatically based on the key
in the yaml file itself. Different levels of keys in a yaml file will be
concatenated together with dots to form the reskey name.

Example:

```yaml
a:
    b:
        c: this is a string
```

The above simple yaml will produce a string resource with the reskey "a.b.c"
and the source string "this is a string".

Note that after the yaml file is converted into an array of Resource instances,
the caller is welcome to then amend each Resource instance to add any other
fields as necessary.

## Arrays and Plurals

Most entries in yaml files are converted into ResourceString instances, except
for yaml arrays which are converted into ResourceArray instances.

Each i18n library that uses yaml files as a way of representing translations
has its own conventions as to how plurals are represented in that yaml file.
Since there is no generally recognized way of representing plurals in yaml
files, none of the entries in a yaml file will become ResourcePlural
instances. Instead, they will be represented as multiple ResourceString
instances. It is up to the caller to take one or more ResourceString
instances and transform them into a ResourcePlural instance using the
conventions of that i18n library.

Example where a plural is represented as separate strings under a key
where the key for those strings is a CLDR plural category name:

```yaml
a:
    b:
        one: This is the singular string
        other: This is the plural string
    d: not a plural string because there are no CLDR plural categories
```

Deserializing the above yaml file will result in three ResourceString instances
with the reskeys "a.b.one" and "a.b.other" and "a.d". A caller can then post-process
those ResourceString instances into a single ResourcePlural instance with the
reskey "a.b" and two plural categories "one" and "other", followed by another
regular string that was not recognized as a plural because it did not have
subkeys that are CLDR plural category names. It is up to the caller to implement
any conventions to represent plurals based on the type of i18n library that
is being used to load these translations.

# License

Copyright 2024 JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

# Release Notes

## 1.0.1

- upgraded dependencies to avoid a dependabot problem

## 1.0.0

- extracted code from the loctool plugin ilib-loctool-yaml and made a separate
  library out of it so that it can be shared
