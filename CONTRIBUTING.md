# Contributing to the TOON VS Code extension

Thank you for your interest in contributing to the official Visual Studio Code extension for TOON!

## Project Setup

This project uses `pnpm` for dependency management. The extension is a TextMate grammar (`syntaxes/toon.tmLanguage.json`) plus a language configuration – there is no build step.

```bash
# Clone the repository
git clone https://github.com/toon-format/vscode.git
cd vscode

# Install dependencies
pnpm install

# Run the grammar tests
pnpm test

# Run linting
pnpm lint
```

## Development Workflow

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the coding standards below
3. **Add tests** for any new functionality
4. **Ensure all checks pass** (lint, test)
5. **Submit a pull request** with a clear description

## Testing the Grammar

`test/grammar.test.ts` checks single-line scope probes against the spec, runs the spec's decode fixtures, and snapshots the tokens of `test/fixtures/example.toon`. After an intended grammar change, update the snapshot with `pnpm test -u` and review the diff in `test/__snapshots__/`.

To try your changes in VS Code:

1. Open the project in VS Code
2. Press `F5` to launch an Extension Development Host
3. Open a `.toon` file and run **Developer: Inspect Editor Tokens and Scopes** to check the scopes

## Coding Standards

- We use ESLint with `@antfu/eslint-config`
- Run before committing:
  ```bash
  pnpm lint
  pnpm lint:fix  # Auto-fix issues
  ```

## SPEC Compliance

All implementations must comply with the [TOON specification](https://github.com/toon-format/spec/blob/main/SPEC.md).

Before submitting changes that affect TOON format handling:
1. Verify against the official SPEC.md
2. Test with examples from the specification
3. Document any spec version requirements

## Pull Request Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what changes you made and why
- **Tests**: Include tests or manual testing instructions for your changes
- **Documentation**: Update README or documentation if needed
- **Commits**: Use clear commit messages ([Conventional Commits](https://www.conventionalcommits.org/) preferred)

Your pull request will use our standard template which guides you through the required information.

## Publishing

Maintainers release with `pnpm release`, which bumps the version and pushes a `v*` tag. The release workflow then publishes to the Visual Studio Marketplace and Open VSX.

To package the extension locally:
```bash
pnpm package  # Creates a .vsix file
```

## Communication

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Requests**: For code reviews and implementation discussion

## Maintainers

This is a collaborative project. Current maintainers:

- [@VishalRaut2106](https://github.com/VishalRaut2106)
- [@eveiljuice](https://github.com/eveiljuice)
- [@johannschopplich](https://github.com/johannschopplich)

All maintainers have equal and consensual decision-making power. For major architectural decisions, please open a discussion issue first.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
