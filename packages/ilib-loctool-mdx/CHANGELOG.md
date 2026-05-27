# ilib-loctool-mdx

## 1.1.3

### Patch Changes

- 6b7c237: Fix handling of non-translatable HTML tags inlined in translatable text. HTML tags that should not be translated (like `<code>`) inlined in translatable text were being extracted as translation units. Additionally, segmentation of text flows with these tags was inconsistent between extraction and localization, effectively making it impossible to localize. Now, these tags are treated as non-breaking elements (`<c0/>`).

## 1.1.2

### Patch Changes

- 11c5fc0: Fixed <img> extraction so that "alt" and "title" attributes are extracted only when they are literal strings

## 1.1.1

### Patch Changes

- 8442fc2: Filter non-allowlisted frontmatter from new-strings set

## 1.1.0

### Minor Changes

- ff7399a: - Removed the ability to parse and process md files
  - That should be done by the ghfm plugin instead
  - This plugin should focus on mdx files only

## 1.0.0

### Major Changes

- 831c004: - Add a new loctool plugin ilib-loctool-mdx
  - Parses MDX files (see https://mdxjs.com/) which
    combines markdown with React JSX syntax
  - Used for documentation hosted on mintlify and
    other such services.
