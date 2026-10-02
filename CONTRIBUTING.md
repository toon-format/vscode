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

`test/grammar.test.ts` checks single-line scope probes against the spec, runs the spec's decode fixtures, and snapshots the tokens of `test/fixtures/example.toon`. After an intended grammar change, update the snapshot with `pnpm test -u` and review the diff in `test/__snapshots__/`.

To try a change in VS Code, press `F5` to launch an Extension Development Host, open a `.toon` file, and run **Developer: Inspect Editor Tokens and Scopes**.

## Coding Standards

ESLint runs with `@antfu/eslint-config`. `pnpm lint:fix` fixes what it can.

## Pull Requests

Add tests or a snapshot update for every grammar change and use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages. The grammar follows [SPEC.md](https://github.com/toon-format/spec/blob/main/SPEC.md) – changes to the format itself belong in [toon-format/spec](https://github.com/toon-format/spec).

## Publishing

Maintainers release with `pnpm release`, which bumps the version and pushes a `v*` tag. The release workflow then publishes to the Visual Studio Marketplace and Open VSX. `pnpm package` builds a `.vsix` locally.

## Maintainers

- [@VishalRaut2106](https://github.com/VishalRaut2106)
- [@eveiljuice](https://github.com/eveiljuice)
- [@johannschopplich](https://github.com/johannschopplich)

## License

By contributing, you agree that your contributions are licensed under the MIT License.
