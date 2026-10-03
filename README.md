# TOON for Visual Studio Code

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/toon-format.toon)](https://marketplace.visualstudio.com/items?itemName=toon-format.toon)
[![SPEC v4.1](https://img.shields.io/badge/spec-v4.1-lightgrey)](https://github.com/toon-format/spec/blob/main/SPEC.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Highlights [TOON (Token-Oriented Object Notation)](https://github.com/toon-format/toon) in `.toon` files. TOON is a compact, indentation-based encoding of the JSON data model for LLM input.

## Installation

```bash
code --install-extension toon-format.toon
```

VSCodium and other editors that use [Open VSX](https://open-vsx.org/extension/toon-format/toon) install it from there.

## Usage

Open any `.toon` file, such as:

```toon
users[2]{id,name,role}:
  1,Ada,admin
  2,Bob,user
```

The grammar scopes:

- Keys, array headers with their length and delimiter, and field lists – including nested field groups and keyed tabular headers
- Numbers, `true`, `false`, `null`, empty arrays, and unquoted and quoted strings, with invalid escape sequences flagged
- Delimiters in inline arrays and rows, list item markers, and full-line `#` comments

Folding follows indentation, and pressing Enter after a line ending in `:` indents the next one.

## Specification

Targets [TOON spec v4.1](https://github.com/toon-format/spec/blob/main/SPEC.md).

## Resources

- **Specification:** [SPEC.md](https://github.com/toon-format/spec/blob/main/SPEC.md) – Normative rules and conformance checklists
- **Format Overview:** [toonformat.dev](https://toonformat.dev/guide/format-overview) – Every form with examples
- **Other Implementations:** [toonformat.dev](https://toonformat.dev/ecosystem/implementations) – TOON in other languages

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the development setup and pull request guidelines.

## License

[MIT](./LICENSE) License © 2025-PRESENT [Vishal Raut](https://github.com/VishalRaut2106), [Timofey Elsesser](https://github.com/eveiljuice), and [Johann Schopplich](https://github.com/johannschopplich)
