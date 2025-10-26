# Contributing to Osmynt ⚡

Thank you for your interest in contributing to Osmynt! This document provides guidelines and information for contributors to help you get started and ensure a smooth contribution process.

## Table of Contents

- [What is Osmynt?](#what-is-osmynt)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style and Standards](#code-style-and-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Community Guidelines](#community-guidelines)
- [Getting Help](#getting-help)

## What is Osmynt?

Osmynt is a **secure, end-to-end encrypted, real-time code sharing VS Code extension** that enables seamless collaboration between developers. Instead of using email, Slack, or screen sharing to share code snippets, Osmynt brings secure, real-time code sharing directly into your VS Code editor.

### Key Features

- 🔒 **End-to-End Encryption**: Your code is encrypted before leaving your machine
- ⚡ **Real-Time Sharing**: Share code blocks instantly with team members
- 🛡️ **Zero-Knowledge Architecture**: We cannot read your code
- 👥 **Team Management**: Create and manage teams with secure access control
- 🔄 **Multi-Device Support**: Access teams and shared code from multiple devices
- 🎯 **VS Code Integration**: Seamless integration with your development workflow

## Getting Started

### Prerequisites

Before contributing, make sure you have the following installed:

- **Node.js** (v18 or later)
- **Bun** (latest version) - [Installation Guide](https://bun.sh/docs/installation)
- **Git**
- **VS Code** (for extension development)
- **Docker** (for database and backend development)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/osmynt.git
   cd osmynt
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/moeen-mahmud/osmynt.git
   ```

## Development Setup

This is a **monorepo** built with Bun workspaces. Here's how to set up your development environment:

### 1. Install Dependencies

```bash
# Install all dependencies for the entire monorepo
bun install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

Fill in the required environment variables (see individual app READMEs for specific requirements).

### 3. Database Setup

```bash
# Navigate to the database package
cd packages/database

# Generate Prisma client
bun run db:generate

# Run database migrations
bun run db:migrate

# (Optional) Open Prisma Studio to view data
bun run db:studio
```

### 4. Start Development Servers

You can run individual applications or all at once:

```bash
# Backend Engine (API Server)
cd apps/engine
bun run dev

# VS Code Extension (in a new terminal)
cd apps/osmynt
bun run dev

# Landing Page (in a new terminal)
cd apps/landing
bun run dev

# Documentation Site (in a new terminal)
cd apps/docs
bun run dev
```

## Project Structure

```
osmynt/
├── apps/                    # Applications
│   ├── engine/             # Backend API server (Hono + Prisma)
│   ├── osmynt/             # VS Code extension
│   ├── landing/            # Marketing website (Next.js)
│   └── docs/               # Documentation site (Next.js)
├── packages/               # Shared packages
│   ├── api/                # API client library
│   ├── database/           # Database schema and client
│   └── library/            # Shared utilities and types
├── scripts/                # Build and development scripts
└── .github/                # GitHub workflows and templates
```

### Key Technologies

- **Backend**: Hono, Prisma, PostgreSQL, Supabase
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Extension**: VS Code Extension API, TypeScript
- **Build Tools**: Bun, ESBuild, Biome
- **Quality**: Husky, Commitlint, Changesets

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug Reports**: Report issues and bugs
- ✨ **Feature Requests**: Suggest new features
- 🔧 **Code Contributions**: Fix bugs, implement features
- 📚 **Documentation**: Improve docs, add examples
- 🎨 **UI/UX**: Design improvements, accessibility
- 🧪 **Testing**: Add tests, improve test coverage
- 🔍 **Code Review**: Review pull requests

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Open an issue** for significant changes to discuss the approach
3. **Read the relevant documentation** for the component you're working on
4. **Ensure your changes align** with the project's goals and architecture

## Code Style and Standards

### TypeScript and JavaScript

We use **Biome** for linting and formatting. The configuration is in `biome.json`.

```bash
# Check code style
bun run biome:check

# Fix code style issues
bun run biome:check:fix

# Format code
bun run biome:format
```

### Key Style Guidelines

- Use **TypeScript** for all new code
- Follow **tab indentation** (4 spaces)
- Use **double quotes** for strings
- **Line width**: 120 characters
- **Trailing commas**: ES5 style
- **Arrow functions**: Use parentheses as needed

### Commit Message Convention

We use **Conventional Commits** with specific scopes:

```bash
<type>(<scope>): <description>

# Examples:
feat(@osmynt-core/engine): add real-time code sharing endpoint
fix(@osmynt-core/osmynt): resolve extension activation issue
docs(@osmynt-core/docs): update installation guide
```

#### Allowed Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes
- `perf`: Performance improvements
- `wip`: Work in progress
- `hotfix`: Critical bug fixes

#### Allowed Scopes:
- `@osmynt-core/engine`: Backend API
- `@osmynt-core/osmynt`: VS Code extension
- `@osmynt-core/landing`: Marketing website
- `@osmynt-core/docs`: Documentation
- `@osmynt-core/api`: API client
- `@osmynt-core/database`: Database layer
- `@osmynt-core/library`: Shared utilities
- `osmynt-core`: Root-level changes
- `release`: Release-related changes

### Pre-commit Hooks

We use **Husky** for pre-commit hooks that automatically:
- Run Biome checks
- Validate commit messages
- Run type checking

## Testing

Testing is not yet implemented. If you want to contribute to testing, please open an issue and we can discuss it.

### Writing Tests

- Write tests for new features and bug fixes
- Aim for good test coverage
- Use descriptive test names
- Test both success and error cases

### Extension Testing

Testing is not yet implemented. If you want to contribute to testing, please open an issue and we can discuss it.

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 2. Make Your Changes

- Write clean, well-documented code
- Follow the coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all checks
bun run typecheck
bun run biome:check

# Test the specific app you modified
cd apps/your-app && bun run dev
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat(@osmynt-core/engine): add real-time code sharing endpoint"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:
- Clear title and description
- Reference any related issues
- Include screenshots for UI changes
- Add testing instructions

### 6. PR Review Process

- Maintainers will review your PR
- Address feedback promptly
- Keep PRs focused and reasonably sized
- Update your branch if conflicts arise

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and constructive
- Help others learn and grow
- Focus on what's best for the community
- Show empathy towards other community members

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests, discussions
- **GitHub Discussions**: General questions, ideas, community chat
- **Pull Requests**: Code reviews, technical discussions

### Recognition

Contributors will be recognized in:
- Release notes
- Contributors section in README
- GitHub contributors page

## Getting Help

### Documentation

- **Main README**: Project overview and setup
- **App-specific READMEs**: Detailed setup for each application
- **API Documentation**: Available at `http://localhost:3000/osmynt-api-engine/reference`
- **VS Code Extension Guide**: [Marketplace](https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt)

### Common Issues

**Build Issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules bun.lockb
bun install
```

**Database Issues:**
```bash
# Reset database
cd packages/database
bun run db:push --force-reset
```

**Extension Issues:**
```bash
# Rebuild extension
cd apps/osmynt
bun run build
```

### Still Need Help?

- Open a [GitHub Issue](https://github.com/moeen-mahmud/osmynt/issues)
- Start a [GitHub Discussion](https://github.com/moeen-mahmud/osmynt/discussions)
- Check existing issues and discussions first

## License

By contributing to Osmynt, you agree that your contributions will be licensed under the [GNU Affero General Public License v3.0](LICENSE).

---

Thank you for contributing to Osmynt! Your efforts help make secure, real-time code sharing accessible to developers worldwide. 🚀
