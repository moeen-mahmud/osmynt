# Osmynt ⚡

> **Secure, Git-powered, Realtime DM for code blocks ⚡**

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=osmynt.osmynt)
[![Open VSX](https://img.shields.io/badge/Open%20VSX-Marketplace-blue?logo=visual-studio-code)](https://open-vsx.org/extension/osmynt/osmynt)
[![Beta](https://img.shields.io/badge/Status-Beta-orange.svg)](https://github.com/moeen-mahmud/osmynt)


## The Problem

Software development is inherently collaborative, but sharing code blocks with your team remains a frustrating experience. Traditional methods like:

- 📧 **Emailing code snippets** - Context gets lost, formatting breaks
- 💬 **Slack/Teams messages** - No syntax highlighting, poor readability
- 📺 **Screen sharing** - Disrupts workflow, requires scheduling
- 🔗 **Third-party platforms** - Complex setup, context switching

These approaches break your development flow and hurt productivity. **There has to be a better way.**

## The Solution

**Osmynt** is a VSCode extension that brings seamless, secure, end-to-end encrypted code sharing directly into your editor. No context switching, no workflow disruption - just pure developer experience.

### Why Osmynt?

- **Focused**: Solves one problem exceptionally well - code sharing
- **Secure**: End-to-end encryption for all shared code
- **Fast**: Real-time sharing without leaving your editor
- **Team-first**: Built for developer teams, not general collaboration
- **Git-powered**: Apply changes directly to your files

## Features

### **Security First**

- **End-to-End Encryption**: Your code is encrypted before leaving your machine
- **Team-only Sharing**: Code can only be shared with verified team members
- **Secure Handshake**: Cryptographic verification ensures you're sharing with the right people

### **Real-time Collaboration**

- **Instant Sharing**: Share code blocks in real-time with your team
- **Real-time Updates**: See real-time updates from your team members
- **Multi-device Support**: Share across all your development devices

### **Developer Experience**

- **Git-like Diff Application**: Apply shared code changes directly to your files
- **Syntax Highlighting**: Preserve code formatting and readability
- **Command Palette Integration**: Access all features via `Ctrl+Shift+P` or `Cmd+Shift+P`

### **Versatile Use Cases**

- **Pair Programming**: Share code during live coding sessions
- **Code Reviews**: Share specific code blocks for review. Super powered while working on same project, you don't need Git at all!
- **Debugging**: Get help with problematic code snippets
- **Environment Setup**: Share configuration files, API keys, and environment variables
- **Knowledge Sharing**: Share code patterns and solutions with your team

## Getting Started

### Prerequisites

- Visual Studio Code or Editor with VSCode API
- GitHub account

### Installation

1. **Install the Extension**
   - Via VS Code Marketplace, Open VSX Registry or install from VSIX file
2. **Sign In with GitHub**
   - Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) or click on the `Get Started` button in the Osmynt sidebar
   - Run `Osmynt: Login`
   - Authenticate with GitHub
3. **Join a team or Invite team members**
   - Run `Osmynt: Join Team` to join an existing team
   - Or run `Osmynt: Invite Team Member` to invite a team member
4. **Start Sharing Code**
   - Select code in your editor with selection enabled
   - Run `Osmynt: Share Selected Code`
   - Choose team members to share with

### Quick Commands

| Command                           | Description                    |
| ----------------------------      | ------------------------------ |
| `Osmynt: Login`                   | Authenticate with GitHub       |
| `Osmynt: Logout`                  | Logout from Osmynt             |
| `Osmynt: Refresh`                 | Refresh the team list          |
| `Osmynt: Join Team`               | Join an existing team          |
| `Osmynt: Invite Team Member`      | Invite a team member           |
| `Osmynt: Remove Team Member`      | Remove a team member           |
| `Osmynt: Share Selected Code`     | Share selected code            |
| `Osmynt: View Code Blocks`        | See code shared with you       |
| `Osmynt: Apply Diff`              | Apply shared code to your file |

## Security & Privacy

- **Zero-knowledge architecture**: We can't read your code
- **End-to-end encryption**: Code is encrypted before transmission
- **Team verification**: Cryptographic handshakes ensure secure sharing
- **No data retention**: Shared code is not stored on our servers
- **Open source**: Full transparency in our security implementation


## Contributing (Coming soon)

Right now, this project is licensed under the AGPL-3.0 License.


## Support & Feedback

- **Email**: [support@osmynt.dev](mailto:support@osmynt.dev)
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/moeen-mahmud/osmynt/issues)
- **Documentation**: [Full documentation](https://docs.osmynt.dev) (coming soon)

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](./LICENSE.txt) file for details.

## Author

**Moeen Mahmud**

- GitHub: [@moeen-mahmud](https://github.com/moeen-mahmud)
- Email: [moeen@osmynt.dev](mailto:moeen@osmynt.dev)

---

<div align="center">

**Made with ❤️ for the developers, by the developers**

<!-- [⭐ Star us on GitHub](https://github.com/moeen-mahmud/osmynt) • [🐛 Report Issues](https://github.com/moeen-mahmud/osmynt/issues) • [📧 Contact Us](mailto:support@osmynt.dev) -->

</div>
