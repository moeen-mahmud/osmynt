# Osmynt Docs 📚

> **The official documentation site for Osmynt**

The Osmynt Docs is a modern, responsive documentation website built with Next.js and MDX. It provides comprehensive guides, API references, and resources for developers using Osmynt.

## Key Features

- **📖 MDX Support**: Write documentation in Markdown with React components
- **🎨 Modern Design**: Clean, responsive design with dark/light mode support
- **🔍 Search**: Built-in search functionality for easy navigation
- **📱 Mobile-First**: Fully responsive design that works on all devices
- **⚡ Fast**: Optimized for performance with Next.js static generation
- **🎯 SEO Optimized**: Built-in SEO features for better discoverability

## Getting Started

Follow these steps to set up and run the Osmynt Docs locally.

### Prerequisites

- **Node.js**: Version 18 or higher. [Installation Guide](https://nodejs.org/en/download/)
- **Bun**: JavaScript runtime (recommended). [Installation Guide](https://bun.sh/docs/installation)

### 1. Clone the Repository

If you haven't already, clone the main Osmynt monorepo:

```bash
git clone https://github.com/moeen-mahmud/osmynt.git
cd osmynt
```

### 2. Install Dependencies

Navigate to the root of the monorepo and install all dependencies:

```bash
bun install
```

### 3. Start the Development Server

Navigate to the `apps/docs` directory and start the development server:

```bash
cd apps/docs
bun run dev
```

The documentation site will be available at [http://localhost:9876](http://localhost:9876).

## Project Structure

```
apps/docs/
├── public/                 # Static assets
│   ├── images/            # Documentation images
│   └── *.png             # Favicons and icons
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── features/     # Feature documentation pages
│   │   ├── getting-started/ # Getting started guides
│   │   ├── reference/    # API reference pages
│   │   ├── resources/    # Resources and support
│   │   ├── security/     # Security documentation
│   │   ├── troubleshooting/ # Troubleshooting guides
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── footer.tsx   # Site footer
│   │   ├── header.tsx   # Site header
│   │   ├── markdown-content.tsx # Markdown renderer
│   │   ├── sidebar.tsx  # Navigation sidebar
│   │   └── theme-provider.tsx # Theme context
│   ├── content/         # Markdown documentation files
│   │   ├── features/    # Feature documentation
│   │   ├── getting-started/ # Getting started guides
│   │   ├── reference/   # API reference
│   │   ├── resources/   # Resources and support
│   │   ├── security/    # Security documentation
│   │   ├── troubleshooting/ # Troubleshooting guides
│   │   └── *.md        # Root documentation files
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions
│       ├── markdown.ts # Markdown processing
│       └── utils.ts    # General utilities
├── components.json     # shadcn/ui configuration
├── next.config.mjs    # Next.js configuration
├── package.json       # Dependencies and scripts
├── postcss.config.mjs # PostCSS configuration
└── tsconfig.json      # TypeScript configuration
```

## Content Management

### Adding New Documentation

1. **Create Markdown Files**: Add new `.md` files in the appropriate directory under `src/content/`
2. **Use MDX**: You can use React components in your markdown files
3. **Frontmatter**: Add metadata to your markdown files:

```markdown
---
title: "Page Title"
description: "Page description for SEO"
---

# Your Content Here
```

### Content Structure

- **Getting Started**: Installation, authentication, first share, teams
- **Features**: Code sharing, real-time updates, team management, device management
- **Reference**: Commands, configuration, shortcuts
- **Security**: Overview, encryption, best practices
- **Troubleshooting**: Common issues, connection problems, performance
- **Resources**: Brand guidelines, roadmap, support

### Writing Guidelines

- Use clear, concise language
- Include code examples where relevant
- Add screenshots for UI-related content
- Follow the existing structure and naming conventions
- Test your changes locally before submitting

## Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server on port 9876
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript type checking
```

### Code Style

We use **Biome** for linting and formatting. Ensure your code adheres to the project's style by running:

```bash
# Check for issues
bun run biome:check

# Fix issues
bun run biome:check:fix
```

### Commit Convention

We follow the **Conventional Commits** specification. Commit messages should be structured as:

```
<type>(<scope>): <description>
```

**Example**: `docs(@osmynt-core/docs): add new API reference page`

## Styling

The documentation site uses:

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable component library
- **Custom CSS**: Additional styles in `globals.css`

### Theme Support

The site supports both light and dark themes with automatic system preference detection.

## Deployment

The documentation site is automatically deployed when changes are pushed to the main branch. The build process:

1. Generates static pages from markdown files
2. Optimizes images and assets
3. Deploys to the hosting platform

## Contributing

### Adding New Pages

1. Create a new markdown file in the appropriate content directory
2. Add a corresponding page component in the app directory if needed
3. Update the sidebar navigation if necessary
4. Test your changes locally

### Updating Existing Content

1. Edit the relevant markdown file
2. Test your changes locally
3. Submit a pull request with a clear description

### Reporting Issues

If you find issues with the documentation:

1. Check if the issue already exists
2. Create a new issue with a clear description
3. Include steps to reproduce if applicable

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) - React framework with static generation
- **Language**: [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Components**: [shadcn/ui](https://ui.shadcn.com) - Reusable component library
- **Markdown**: [MDX](https://mdxjs.com) - Markdown with JSX
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful icon library
- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime

## License

This project is licensed under the **GNU Affero General Public License v3.0** - see the [LICENSE](../../LICENSE) file for details.

## Creator

- **[Moeen Mahmud](https://github.com/moeen-mahmud)** - Core Maintainer & Lead Developer

---

**Ready to contribute to the Osmynt documentation?**

[📖 Read the Contributing Guide](../../CONTRIBUTING.md) | [💬 Join the Discussion](https://github.com/moeen-mahmud/osmynt/discussions)
