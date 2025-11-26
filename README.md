# TOON Format for Visual Studio Code

> **⚠️ Development Status:** This extension is in early development. Bare minimum setup for team collaboration.

Visual Studio Code extension for TOON format support. TOON is a compact, human-readable serialization format for LLM contexts with 30-60% token reduction vs JSON.

## Features

Currently in development. Planned features:

- Syntax highlighting for `.toon` files
- Format validation and error detection
- Code formatting and auto-completion
- Integration with TOON specification

## Installation

This extension is not yet published to the Visual Studio Marketplace. To install locally:

```bash
git clone https://github.com/toon-format/vscode.git
cd toon-vscode
pnpm install
pnpm build
```

## Development

```bash
# Setup
git clone https://github.com/toon-format/vscode.git
cd toon-vscode
pnpm install

# Build
pnpm build

# Development mode (watch)
pnpm dev

# Run linting
pnpm lint

# Type check
pnpm test:types

# Package extension
pnpm package
```

## Project Status & Roadmap

Following semantic versioning towards 1.0.0:

- **v0.0.x** - Initial project setup, bare minimum structure (current)
- **v0.1.x** - Basic syntax highlighting and file recognition
- **v0.2.x** - Format validation and error detection
- **v0.3.x** - Code formatting and auto-completion
- **v1.0.0** - First stable release with full TOON format support

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Documentation

- [📜 TOON Specification](https://github.com/toon-format/spec) - Official specification
- [🐛 Issues](https://github.com/toon-format/vscode/issues) - Bug reports and features
- [🤝 Contributing](CONTRIBUTING.md) - Contribution guidelines

## Related Projects

- [toon](https://github.com/toon-format/toon) - TypeScript implementation
- [toon-python](https://github.com/toon-format/toon-python) - Python implementation
- [toon-rust](https://github.com/toon-format/toon-rust) - Rust implementation

## License

MIT License – see [LICENSE](LICENSE) for details
