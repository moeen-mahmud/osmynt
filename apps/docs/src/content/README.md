# Osmynt Documentation

This directory contains the complete documentation for Osmynt, a secure, git-powered, real-time code sharing extension for VS Code.

## 🚀 Quick Start

### Prerequisites

- Ruby 3.1 or later
- Bundler gem
- Git

### Local Development

1. **Install dependencies**:
   ```bash
   bundle install
   ```

2. **Start the development server**:
   ```bash
   # Option 1: Use the convenience script
   ./serve.sh
   
   # Option 2: Use Jekyll directly
   bundle exec jekyll serve --livereload
   ```

3. **View the documentation**:
   Open [http://localhost:4000](http://localhost:4000) in your browser

## 📁 Structure

```
docs/
├── _config.yml              # Jekyll configuration
├── _layouts/                 # HTML layouts
├── _includes/                # Reusable components
├── assets/                   # CSS, JS, images
├── getting-started/          # Getting started guides
├── features/                 # Feature documentation
├── reference/                # Reference documentation
├── troubleshooting/          # Troubleshooting guides
├── security/                # Security documentation
├── resources/               # Brand guidelines, roadmap, support
├── index.md                 # Homepage
├── 404.md                   # 404 error page
├── Gemfile                  # Ruby dependencies
├── serve.sh                 # Development server script
└── README.md                # This file
```

## 🛠️ Development

### Available Commands

```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve --livereload

# Build for production
bundle exec jekyll build

# Clean build artifacts
bundle exec jekyll clean

# Check for issues
bundle exec jekyll doctor
```

### Writing Content

1. **Create new pages** in the appropriate directory
2. **Use front matter** for page metadata:
   ```yaml
   ---
   layout: page
   title: Page Title
   description: "Brief description of the page"
   ---
   ```
3. **Follow the established structure** and naming conventions
4. **Test locally** before committing changes

### Styling

- **CSS Variables** are defined in `assets/css/main.css`
- **Responsive design** is built-in
- **Dark/light theme** support is automatic
- **Print styles** are included

## 🚀 Deployment

### Automatic Deployment

The documentation is automatically deployed when:

- Changes are pushed to the `main` branch
- Changes are made to files in the `docs/` directory
- Pull requests are merged to `main`

### Manual Deployment

```bash
# Build the site
bundle exec jekyll build

# Deploy to GitHub Pages (if you have access)
# This is handled automatically by GitHub Actions
```

## 🔧 Configuration

### Jekyll Settings

The main configuration is in `_config.yml`:

- **Site settings**: title, description, URL
- **Build settings**: markdown processor, highlighter, theme
- **Plugin settings**: enabled plugins and their configuration
- **Navigation**: site navigation structure

### GitHub Pages

- **Source**: GitHub Actions
- **Custom domain**: osmynt.dev
- **SSL**: Automatic HTTPS
- **CDN**: Global content delivery

## 📚 Content Guidelines

### Writing Style

- **Clear and concise** language
- **Developer-focused** content
- **Step-by-step** instructions
- **Code examples** where helpful
- **Screenshots** for complex procedures

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

### Best Practices

1. **Test all links** and examples
2. **Use consistent terminology** throughout
3. **Include troubleshooting** information
4. **Keep content up-to-date**
5. **Follow accessibility** guidelines

## 🐛 Troubleshooting

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

## 🤝 Contributing

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

## 📄 License

The documentation is licensed under the same license as the main project. See the main repository for license details.

## 🆘 Support

For documentation-related questions:

- **Email**: [docs@osmynt.dev](mailto:docs@osmynt.dev)
<!-- - **GitHub Issues**: [Report documentation issues](https://github.com/moeen-mahmud/osmynt/issues)
- **Discord**: [Get help from community](https://discord.gg/osmynt) -->

---

**Made with ❤️ for the developers, by the developers**