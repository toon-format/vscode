# TOON for Visual Studio Code

Syntax highlighting for [TOON](https://github.com/toon-format/toon) (Token-Oriented Object Notation) in `.toon` files.

## Install

- [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=toon-format.toon)
- [Open VSX](https://open-vsx.org/extension/toon-format/toon) for VSCodium and other editors that use it

## Highlighting

- Keys, array headers with their length and delimiter, and field lists – including nested field groups and keyed tabular headers
- Numbers, `true`, `false`, `null`, empty arrays, and unquoted and quoted strings, with invalid escape sequences flagged
- Delimiters in inline arrays and rows, list item markers, and full-line `#` comments

Folding follows indentation, and pressing Enter after a line ending in `:` indents the next one.

The grammar targets [TOON spec v4.1](https://github.com/toon-format/spec/blob/main/SPEC.md).

## License

[MIT](LICENSE)
