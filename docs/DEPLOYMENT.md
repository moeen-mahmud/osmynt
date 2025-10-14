# Documentation Deployment Guide

This guide explains how to deploy the Osmynt documentation to GitHub Pages.

## Overview

The documentation is built using Jekyll and deployed automatically to GitHub Pages when changes are pushed to the main branch.

## Local Development

### Prerequisites

- Ruby 3.1 or later
- Bundler gem
- Git

### Setup

1. **Install Ruby dependencies**:
   ```bash
   cd docs
   bundle install
   ```

2. **Serve locally**:
   ```bash
   bundle exec jekyll serve
   ```

3. **View documentation**:
   Open [http://localhost:4000](http://localhost:4000) in your browser

### Development Commands

```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve --livereload

# Build for production
bundle exec jekyll build

# Clean build artifacts
bundle exec jekyll clean
```

## Deployment

### Automatic Deployment

The documentation is automatically deployed when:

- Changes are pushed to the `main` branch
- Changes are made to files in the `docs/` directory
- Pull requests are merged to `main`

### Manual Deployment

To manually deploy the documentation:

1. **Build the site**:
   ```bash
   cd docs
   bundle exec jekyll build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   # Using GitHub CLI
   gh-pages -d _site
   
   # Or using git
   git subtree push --prefix docs/_site origin gh-pages
   ```

## Configuration

### Jekyll Configuration

The documentation is configured in `_config.yml`:

```yaml
# Site settings
title: Osmynt Documentation
description: "Secure, real-time code sharing for VS Code"
url: "https://osmynt.dev"
baseurl: ""

# Build settings
markdown: kramdown
highlighter: rouge
theme: minima
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag
```

### GitHub Pages Settings

1. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to Pages section
   - Select "GitHub Actions" as source

2. **Custom Domain** (optional):
   - Set custom domain to `osmynt.dev`
   - Add CNAME file to repository root

## File Structure

```
docs/
├── _config.yml          # Jekyll configuration
├── _layouts/             # HTML layouts
├── _includes/            # Reusable components
├── assets/               # CSS, JS, images
├── getting-started/      # Getting started guides
├── features/             # Feature documentation
├── reference/            # Reference documentation
├── troubleshooting/      # Troubleshooting guides
├── security/            # Security documentation
├── resources/           # Brand guidelines, roadmap, support
├── index.md             # Homepage
├── 404.md              # 404 error page
├── Gemfile             # Ruby dependencies
└── README.md           # Documentation README
```

## Content Guidelines

### Writing Documentation

1. **Use clear, concise language**
2. **Include code examples**
3. **Add screenshots when helpful**
4. **Follow the established structure**
5. **Test all links and examples**

### Markdown Guidelines

- Use `#` for main headings
- Use `##` for section headings
- Use `###` for subsection headings
- Use `-` for unordered lists
- Use `1.` for ordered lists
- Use `**bold**` for emphasis
- Use `*italic*` for subtle emphasis
- Use `` `code` `` for inline code
- Use ``` for code blocks

### Front Matter

Each page should include front matter:

```yaml
---
layout: page
title: Page Title
description: "Brief description of the page"
---
```

## Troubleshooting

### Common Issues

1. **Build failures**:
   - Check Ruby version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors in markdown

2. **Deployment issues**:
   - Verify GitHub Pages is enabled
   - Check workflow permissions
   - Ensure all files are committed

3. **Styling issues**:
   - Check CSS file paths
   - Verify asset loading
   - Test responsive design

### Getting Help

- **Documentation**: Check this guide and Jekyll documentation
- **GitHub Issues**: Report issues in the repository
- **Community**: Ask questions in Discord or GitHub Discussions

## Maintenance

### Regular Tasks

1. **Update dependencies**:
   ```bash
   bundle update
   ```

2. **Check for broken links**:
   ```bash
   bundle exec jekyll build
   # Check build output for errors
   ```

3. **Review content**:
   - Check for outdated information
   - Update screenshots
   - Verify code examples

### Performance Optimization

1. **Optimize images**:
   - Use appropriate formats (WebP, PNG, SVG)
   - Compress images
   - Use responsive images

2. **Minimize assets**:
   - Minify CSS and JavaScript
   - Remove unused code
   - Optimize font loading

## Security

### Best Practices

1. **Keep dependencies updated**
2. **Use HTTPS for all links**
3. **Validate user input**
4. **Regular security audits**

### Security Headers

The documentation includes security headers:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
```

## Analytics

### Google Analytics

To add Google Analytics:

1. Add tracking code to `_layouts/default.html`
2. Configure in `_config.yml`
3. Test in development environment

### Other Analytics

- **GitHub Analytics**: Built-in GitHub Pages analytics
- **Custom Analytics**: Add your preferred analytics solution

## Contributing

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test locally**
5. **Submit a pull request**

### Content Contributions

1. **Fix typos and grammar**
2. **Add missing information**
3. **Improve examples**
4. **Update screenshots**
5. **Add new sections**

### Technical Contributions

1. **Improve styling**
2. **Add new features**
3. **Fix bugs**
4. **Optimize performance**
5. **Add tests**

## License

The documentation is licensed under the same license as the main project. See the main repository for license details.

## Support

For documentation-related questions:

- **Email**: [docs@osmynt.dev](mailto:docs@osmynt.dev)
- **GitHub Issues**: [Report documentation issues](https://github.com/moeen-mahmud/osmynt/issues)
- **Discord**: [Get help from community](https://discord.gg/osmynt)
