# Contributing to the TOON VS Code Extension

## Development Setup

The extension is a TextMate grammar (`syntaxes/toon.tmLanguage.json`) plus a language configuration – there is no build step.

```bash
git clone https://github.com/toon-format/vscode.git
cd vscode
pnpm install
pnpm test
pnpm lint
```

After an intended grammar change, update the snapshots with `pnpm test -u` and review the diff in `test/__snapshots__/`.

To try a change in VS Code, press `F5` to launch an Extension Development Host, open a `.toon` file, and run **Developer: Inspect Editor Tokens and Scopes**.

## Pull Requests

A scope the spec examples don't cover gets a row in the `grammar` table in `test/grammar.test.ts`; a case the spec itself lacks goes to toon-format/spec as a fixture. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages. The grammar follows [SPEC.md](https://github.com/toon-format/spec/blob/main/SPEC.md) – changes to the format itself belong in [toon-format/spec](https://github.com/toon-format/spec).

## Publishing

Maintainers release with `pnpm release`, which bumps the version and pushes a `v*` tag. The release workflow then publishes to the Visual Studio Marketplace and Open VSX. `pnpm package` builds a `.vsix` locally.

## License

By contributing, you agree that your contributions are licensed under the MIT License.
