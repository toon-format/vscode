# Contributing to toon-vscode

Thank you for your interest in contributing to the official Visual Studio Code extension for TOON!

## Project Setup

This project uses `pnpm` for dependency management and TypeScript for development.

```bash
# Clone the repository
git clone https://github.com/toon-format/vscode.git
cd toon-vscode

# Install dependencies
pnpm install

# Build the extension
pnpm build

# Development mode (watch)
pnpm dev

# Run linting
pnpm lint

# Type check
pnpm test:types
```

## Development Workflow

1. **Fork the repository** and create a feature branch
2. **Make your changes** following the coding standards below
3. **Add tests** for any new functionality
4. **Ensure all checks pass** (lint, type check, build)
5. **Submit a pull request** with a clear description

## Testing the Extension

To test your changes in VS Code:

1. Open the project in VS Code
2. Press `F5` to launch an Extension Development Host
3. Test your changes in the development instance
4. Check the Debug Console for errors or logs

## Coding Standards

### TypeScript

- All code must include TypeScript types
- Use strict mode (configured in `tsconfig.json`)
- Run type checking before committing:
  ```bash
  pnpm test:types
  ```

### Code Style

- We use ESLint with `@antfu/eslint-config`
- Run before committing:
  ```bash
  pnpm lint
  pnpm lint:fix  # Auto-fix issues
  ```

### Node.js Version Support

We target Node.js 24+ to match the main toon repository.

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

Publishing to the Visual Studio Marketplace is handled by the release workflow. Only maintainers can trigger releases.

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
