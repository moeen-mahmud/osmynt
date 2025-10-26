# Osmynt Landing Page 🌐

> **The official landing page for Osmynt**

The Osmynt Landing Page is a modern, high-converting marketing website built with Next.js. It showcases Osmynt's features, benefits, and provides a compelling call-to-action for developers to try the VS Code extension.

## Key Features

- **🎨 Modern Design**: Clean, professional design with smooth animations
- **📱 Responsive**: Fully responsive design that works on all devices
- **⚡ Performance**: Optimized for Core Web Vitals and fast loading
- **🎯 Conversion-Focused**: Designed to drive VS Code extension installations
- **🔍 SEO Optimized**: Built-in SEO features for better discoverability
- **🌙 Dark Mode**: Automatic dark/light mode support
- **📊 Analytics Ready**: Google Analytics and other tracking integrations
- **🎬 Interactive Demo**: Embedded demo showcasing Osmynt in action

## Getting Started

Follow these steps to set up and run the Osmynt Landing Page locally.

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

Navigate to the `apps/landing` directory and start the development server:

```bash
cd apps/landing
bun run dev
```

The landing page will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
apps/landing/
├── app/                  # Next.js app directory
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── manifest.ts      # PWA manifest
│   ├── page.tsx         # Home page
│   ├── robots.ts        # Robots.txt
│   └── sitemap.ts       # Sitemap generation
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── comparison.tsx  # Feature comparison table
│   ├── cta.tsx         # Call-to-action sections
│   ├── demo/           # Interactive demo components
│   │   ├── demo-preview.tsx
│   │   ├── guided-demo.tsx
│   │   └── ...
│   ├── faq.tsx         # Frequently asked questions
│   ├── features.tsx    # Features showcase
│   ├── footer.tsx      # Site footer
│   ├── gtm.tsx         # Google Tag Manager
│   ├── header.tsx      # Site header
│   ├── hero.tsx        # Hero section
│   ├── osmynt-logo.tsx # Logo component
│   ├── performance.tsx # Performance metrics
│   ├── problem.tsx     # Problem statement
│   ├── rebrand-banner.tsx # Rebrand announcement
│   ├── security.tsx    # Security features
│   └── structured-data.tsx # SEO structured data
├── hooks/              # Custom React hooks
│   ├── use-mobile.ts   # Mobile detection hook
│   └── use-toast.ts    # Toast notification hook
├── lib/                # Utility functions
│   └── utils.ts        # General utilities
├── public/             # Static assets
│   ├── *.png          # Favicons and icons
│   └── osmynt-demo.gif # Demo animation
├── components.json     # shadcn/ui configuration
├── next.config.mjs    # Next.js configuration
├── package.json       # Dependencies and scripts
├── postcss.config.mjs # PostCSS configuration
└── tsconfig.json      # TypeScript configuration
```

## Page Sections

### Hero Section

- Compelling headline and value proposition
- Call-to-action buttons for VS Code marketplace
- Demo video/animation

### Problem Statement

- Identifies pain points in current code sharing methods
- Sets up the need for Osmynt's solution

### Features Showcase

- Key features with icons and descriptions
- Benefits-focused messaging
- Visual elements and animations

### Interactive Demo

- Live demonstration of Osmynt in action
- Guided tour of key features
- Interactive elements to engage visitors

### Comparison Table

- Feature comparison with competitors
- Highlighting Osmynt's unique advantages
- Clear differentiation

### Security Section

- Security features and benefits
- Trust signals and certifications
- Privacy-focused messaging

### Performance Metrics

- Performance benefits and statistics
- Speed and efficiency claims
- Technical advantages

### FAQ Section

- Common questions and answers
- Addresses potential concerns
- Reduces friction in decision-making

### Call-to-Action

- Multiple CTAs throughout the page
- Clear next steps for users
- Conversion optimization

## Development

### Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
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

**Example**: `feat(@osmynt-core/landing): add new hero section animation`

## Styling

The landing page uses:

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable component library
- **Framer Motion**: Smooth animations and transitions
- **Custom CSS**: Additional styles in `globals.css`

### Theme Support

The site supports both light and dark themes with automatic system preference detection.

## SEO & Performance

### SEO Features

- **Meta Tags**: Comprehensive meta tags for social sharing
- **Structured Data**: JSON-LD structured data for search engines
- **Sitemap**: Automatically generated sitemap
- **Robots.txt**: Search engine crawling instructions

### Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for faster loading
- **Static Generation**: Pre-rendered pages for better performance
- **Core Web Vitals**: Optimized for Google's Core Web Vitals

### Analytics

- **Google Analytics**: User behavior tracking
- **Google Tag Manager**: Event tracking and conversion measurement
- **Performance Monitoring**: Core Web Vitals tracking

## Deployment

The landing page is automatically deployed when changes are pushed to the main branch. The build process:

1. Generates static pages for optimal performance
2. Optimizes images and assets
3. Deploys to the hosting platform
4. Updates CDN cache

## Content Management

### Updating Content

Most content is managed directly in the React components:

1. **Hero Section**: Update `components/hero.tsx`
2. **Features**: Update `components/features.tsx`
3. **FAQ**: Update `components/faq.tsx`
4. **Demo**: Update components in `components/demo/`

### Adding New Sections

1. Create a new component in the `components/` directory
2. Import and add it to the main page (`app/page.tsx`)
3. Style it using Tailwind CSS classes
4. Test responsiveness across different screen sizes

### Images and Assets

- Add new images to the `public/` directory
- Use Next.js `Image` component for optimization
- Ensure images are optimized for web (WebP format recommended)

## A/B Testing

The landing page is set up for A/B testing:

- **Multiple CTAs**: Test different call-to-action buttons
- **Hero Variations**: Test different headlines and value propositions
- **Feature Order**: Test different feature presentation orders
- **Demo Placement**: Test demo placement and presentation

## Conversion Optimization

### Key Metrics to Track

- **Conversion Rate**: VS Code extension installations
- **Bounce Rate**: Page engagement and relevance
- **Time on Page**: Content engagement
- **Click-through Rate**: CTA effectiveness

### Optimization Strategies

- **Clear Value Proposition**: Immediately communicate benefits
- **Social Proof**: User testimonials and usage statistics
- **Urgency**: Limited-time offers or beta access
- **Trust Signals**: Security badges and certifications

## Contributing

### Adding New Features

1. Create a new component in the appropriate directory
2. Add it to the main page layout
3. Ensure it's responsive and accessible
4. Test across different devices and browsers

### Updating Existing Content

1. Edit the relevant component file
2. Test your changes locally
3. Ensure the content is accurate and up-to-date
4. Submit a pull request with a clear description

### Design Guidelines

- Follow the existing design system
- Use consistent spacing and typography
- Ensure accessibility compliance
- Test on mobile devices

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) - React framework with static generation
- **Language**: [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Components**: [shadcn/ui](https://ui.shadcn.com) - Reusable component library
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Animation library
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful icon library
- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime

## License

This project is licensed under the **GNU Affero General Public License v3.0** - see the [LICENSE](../../LICENSE) file for details.

## Creator

- **[Moeen Mahmud](https://github.com/moeen-mahmud)** - Core Maintainer & Lead Developer

---

**Ready to contribute to the Osmynt landing page?**

[📖 Read the Contributing Guide](../../CONTRIBUTING.md) | [💬 Join the Discussion](https://github.com/moeen-mahmud/osmynt/discussions)
