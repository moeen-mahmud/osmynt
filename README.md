# Osmynt ⚡

> **Secure, Git-powered, Realtime DM for code blocks**

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt)
[![Open VSX](https://img.shields.io/badge/Open%20VSX-Marketplace-blue?logo=visual-studio-code)](https://open-vsx.org/extension/osmynt/osmynt)
[![Beta](https://img.shields.io/badge/Status-Beta-orange.svg)](https://github.com/moeen-mahmud/osmynt)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/moeen-mahmud/osmynt/osmynt-ci-cd.yml?label=Build)](https://github.com/moeen-mahmud/osmynt/actions/workflows/osmynt-ci-cd.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](https://opensource.org/licenses/AGPL-3.0)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

## The Problem

Software development is inherently collaborative, but sharing code blocks with your team remains a frustrating experience. Traditional methods like:

- 📧 **Emailing code snippets** - Context gets lost, formatting breaks
- 💬 **Slack/Teams messages** - No syntax highlighting, poor readability
- 📺 **Screen sharing** - Disrupts workflow, requires scheduling
- 🔗 **Third-party platforms** - Complex setup, context switching

These approaches break your development flow and hurt productivity. **There has to be a better way.**

## The Solution

**Osmynt** is a VS Code extension that brings seamless, secure, end-to-end encrypted code sharing directly into your editor. No context switching, no workflow disruption - just pure developer experience.

### Why Osmynt?

- **🔒 Security First**: End-to-end encryption for all shared code
- **⚡ Real-time**: Share code blocks instantly with team members
- **🛡️ Zero-knowledge**: We cannot read your code
- **👥 Team-focused**: Built for developer teams, not general collaboration
- **🔄 Git-powered**: Apply changes directly to your files
- **📱 Multi-device**: Access teams and shared code from multiple devices

## Features

### **🔒 Enterprise-Grade Security**

- **AES-256 Encryption**: Your code is encrypted before leaving your machine
- **Zero-knowledge Architecture**: We can never access your unencrypted content
- **Team-only Sharing**: Code can only be shared with verified team members
- **Device Verification**: Secure handshakes ensure you're sharing with the right people

### **⚡ Real-Time Collaboration**

- **Instant Sharing**: Share code blocks in milliseconds with real-time updates
- **No Context Switching**: Stay in your editor, no workflow disruption
- **Multi-device Support**: Share across all your development devices
- **Smart Notifications**: Respect your focus time with intelligent alerts

### **🔄 Git-like Workflow**

- **Apply Changes**: Apply shared code changes directly to your files
- **Diff View**: See exactly what changes are being applied
- **Line-by-line**: Apply changes to specific line numbers
- **Review & Accept**: Review changes before applying them

### **👥 Team Management**

- **Create Teams**: Set up secure teams for your projects
- **Invite Members**: Send secure invitations to team members
- **Role Management**: Owner and member roles with appropriate permissions
- **Device Management**: Manage and remove devices as needed

## Quick Start

### 1. Install the Extension

Download from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt) or [Open VSX Registry](https://open-vsx.org/extension/osmynt/osmynt).

### 2. Sign In

Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:
```
Osmynt: Login
```

### 3. Authenticate

Sign in with your GitHub account to get started.

### 4. Start Sharing

Select code in your editor and run:
```
Osmynt: Share Code Block
```

## Tech Stack

### **Frontend & Extension**

- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- [VS Code Extension API](https://code.visualstudio.com/api) - Extension development
- [Next.js](https://nextjs.org) - React framework for web apps
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework

### **Backend & Infrastructure**

- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Hono](https://hono.dev) - Lightweight web framework
- [Prisma](https://www.prisma.io) - Database ORM
- [PostgreSQL](https://www.postgresql.org) - Primary database
- [Redis](https://redis.io) - Real-time messaging and caching
- [Supabase](https://supabase.com) - Backend-as-a-Service

### **Development & Quality**

- [ESBuild](https://esbuild.github.io) - Fast JavaScript bundler
- [Biome](https://biomejs.dev) - Linting and formatting
- [Husky](https://typicode.github.io/husky) - Git hooks
- [Commitlint](https://commitlint.js.org) - Commit message linting
- [Changesets](https://changesets.org) - Version management
- [Docker](https://www.docker.com) - Containerization

## Project Structure

This is a **monorepo** built with Bun workspaces:

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

## Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **Bun** (latest version) - [Installation Guide](https://bun.sh/docs/installation)
- **Git**
- **VS Code** (for extension development)
- **Docker** (for database and backend development)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/moeen-mahmud/osmynt.git
   cd osmynt
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development**:
   ```bash
   # Backend Engine
   cd apps/engine && bun run dev
   
   # VS Code Extension (in new terminal)
   cd apps/osmynt && bun run dev
   
   # Landing Page (in new terminal)
   cd apps/landing && bun run dev
   
   # Documentation (in new terminal)
   cd apps/docs && bun run dev
   ```

For detailed setup instructions, see individual app READMEs:

- [Engine README](apps/engine/README.md)
- [Extension README](apps/osmynt/README.md)
- [Landing README](apps/landing/README.md)
- [Docs README](apps/docs/README.md)

## Development

### Code Style

We use **Biome** for linting and formatting:

```bash
# Check code style
bun run biome:check

# Fix code style issues
bun run biome:check:fix

# Format code
bun run biome:format
```

### Commit Convention

We use **Conventional Commits** with specific scopes:

```bash
<type>(<scope>): <description>

# Examples:
feat(@osmynt-core/engine): add real-time code sharing endpoint
fix(@osmynt-core/osmynt): resolve extension activation issue
docs(@osmynt-core/docs): update installation guide
```

### Testing

Testing is not yet implemented. If you want to contribute to testing, please open an issue and we can discuss it.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Types of Contributions

- 🐛 **Bug Reports**: Report issues and bugs
- ✨ **Feature Requests**: Suggest new features
- 🔧 **Code Contributions**: Fix bugs, implement features
- 📚 **Documentation**: Improve docs, add examples
- 🎨 **UI/UX**: Design improvements, accessibility
- 🧪 **Testing**: Add tests, improve test coverage

### Getting Help

- **Documentation**: [Osmynt Docs](https://docs.osmynt.com)
- **Issues**: [GitHub Issues](https://github.com/moeen-mahmud/osmynt/issues)
- **Discussions**: [GitHub Discussions](https://github.com/moeen-mahmud/osmynt/discussions)
- **Email**: [support@osmynt.dev](mailto:support@osmynt.dev)

## Security

### Vulnerability Reporting

If you discover a security vulnerability, please report it responsibly:

1. **Do not** create a public issue
2. **Email** security details to [moeen.mahmud007@gmail.com](mailto:moeen.mahmud007@gmail.com)
3. **Include** steps to reproduce the vulnerability
4. **Wait** for acknowledgment before public disclosure

### Security Features

- **End-to-End Encryption**: All code is encrypted before transmission
- **Zero-Knowledge Architecture**: We cannot read your code
- **Secure Key Exchange**: Cryptographic key exchange between devices
- **Team-only Sharing**: Code can only be shared within teams
- **Device Verification**: Only verified devices can access teams

## Roadmap

### Completed ✅

- Real-time code sharing
- End-to-end encryption
- Team management
- Multi-device support
- VS Code integration
- Git-like diff application

### In Progress 🚧

- File sharing
- Walkthroughs
- GitHub Gist export

### Planned 📋

- Badges in list
- Integrations
- Team organization features
- SSO gating
- Observability improvements

See our [Development Roadmap](apps/docs/src/content/development-roadmap.md) for detailed plans.

## Community

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

### Recognition

Contributors are recognized in:

- Release notes
- Contributors section
- GitHub contributors page

## License

This project is licensed under the **GNU Affero General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

## Creator

- **[Moeen Mahmud](https://github.com/moeen-mahmud)** - Core Maintainer & Lead Developer

## Acknowledgments

- Thanks to all contributors who help make Osmynt better
- Built with ❤️ for the developer community
- Inspired by the need for better code collaboration tools

---

**Ready to revolutionize your code sharing workflow?** 

[🚀 Install Osmynt Extension](https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt) | [📖 Read the Docs](https://docs.osmynt.com) | [💬 Join the Discussion](https://github.com/moeen-mahmud/osmynt/discussions)
