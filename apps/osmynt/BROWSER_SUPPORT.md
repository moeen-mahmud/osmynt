# Browser Support for Osmynt Extension

This document describes the browser support implementation for the Osmynt extension, allowing it to work as both a VS Code web extension and a standalone browser extension.

## Overview

The browser support adds a complete browser extension implementation alongside the existing VS Code extension, enabling users to share code snippets directly from web browsers without needing VS Code.

## Architecture

### Dual Build System
- **VS Code Extension**: Uses esbuild for Node.js/VS Code environment
- **VS Code Web Extension**: Uses Vite for VS Code web environment (vscode.dev, github.dev)
- **Browser Extension**: Uses Vite for standalone browser extension

### Key Components

#### 1. Browser-Specific Files
```
src/browser/
├── extension.ts          # Browser entry point
├── app.ts               # Main application logic
├── storage.ts           # Browser storage implementation
├── crypto.ts            # Web Crypto API implementation
├── ui.ts                # Browser UI components
├── index.html           # Standalone web app
├── popup.html           # Extension popup
├── popup.js             # Popup script
├── background.js        # Background service worker
├── content.js           # Content script
├── content.css          # Content script styles
└── manifest.json        # Extension manifest
```

#### 2. Build Configuration
- **Vite Config**: `vite.config.ts` for browser builds
- **Build Scripts**: Separate scripts for browser and VS Code builds
- **Package Scripts**: Browser extension packaging

## Features

### Core Functionality
- ✅ **Authentication**: GitHub OAuth integration
- ✅ **Code Sharing**: Share code snippets with teams
- ✅ **End-to-End Encryption**: Web Crypto API implementation
- ✅ **Real-time Updates**: WebSocket connections
- ✅ **Team Management**: Invite and manage team members
- ✅ **Device Pairing**: Multi-device support

### VS Code Web Extension Features
- ✅ **VS Code Integration**: Works in vscode.dev and github.dev
- ✅ **Command Palette**: Access via VS Code command palette
- ✅ **Editor Integration**: Share selected code from editor
- ✅ **Web Extension Host**: Runs in VS Code's web extension host

### Browser Extension Features
- ✅ **Floating Button**: Quick access from any webpage
- ✅ **Text Selection**: Share selected text instantly
- ✅ **Keyboard Shortcuts**: Ctrl/Cmd+Shift+O to open
- ✅ **Popup Interface**: Compact extension popup
- ✅ **Content Script**: Injected UI on web pages

## Setup Instructions

### 1. Install Dependencies
```bash
# Install new browser dependencies
bun install
```

### 2. Configure Environment
```bash
# Set up environment variables for browser builds
export ENGINE_BASE_URL="https://your-api-domain.com"
export SUPABASE_URL="https://your-supabase-url.com"
export SUPABASE_ANON_KEY="your-supabase-anon-key"
export UPSTASH_REDIS_URL="your-redis-url"
```

### 3. Build Extensions
```bash
# Build VS Code web extension
bun run build:web

# Build browser extension
bun run build:browser

# Build all targets
bun run build:all

# Package for distribution
bun run package:web    # VS Code web extension
bun run package:browser # Browser extension
```

### 4. Use VS Code Web Extension

The VS Code web extension works in:
- **vscode.dev**: VS Code in the browser
- **github.dev**: GitHub's web-based VS Code
- **VS Code for the Web**: Any VS Code web instance

To use:
1. Install the extension in VS Code for the Web
2. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run `Osmynt: Login` to authenticate
4. Select code and run `Osmynt: Share Selected Code`
5. Use `Osmynt: Refresh` to update your snippets

### 5. Load Browser Extension

#### Chrome/Edge
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/browser-extension` folder

#### Firefox
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file

## Development

### Development Commands
```bash
# Watch mode for browser development
bun run watch:browser

# Build all targets
bun run build:all

# Clean build artifacts
bun run clean
```

### File Structure
```
apps/osmynt/
├── src/
│   ├── browser/           # Browser-specific code
│   ├── commands/          # VS Code commands (shared)
│   ├── services/          # Core services (shared)
│   └── ...
├── scripts/
│   ├── build-browser.ts   # Browser build script
│   ├── watch-browser.ts   # Browser watch script
│   └── package-browser.ts # Browser packaging
├── dist/
│   ├── extension.cjs     # VS Code extension
│   └── browser-extension/ # Browser extension package
└── ...
```

## API Differences

### Storage
- **VS Code**: `vscode.ExtensionContext.secrets`
- **Browser**: `chrome.storage.local` + `localStorage`

### Crypto
- **VS Code**: Node.js `crypto` module
- **Browser**: Web Crypto API (`window.crypto.subtle`)

### UI
- **VS Code**: VS Code TreeView and commands
- **Browser**: DOM manipulation and browser extension APIs

### Network
- **VS Code**: Node.js `fetch` (polyfilled)
- **Browser**: Native `fetch` API

## Security Considerations

### Browser Extension Permissions
```json
{
  "permissions": [
    "storage",      // For local data storage
    "activeTab",    // For content script injection
    "scripting"     // For dynamic content injection
  ],
  "host_permissions": [
    "https://github.com/*",     // GitHub OAuth
    "https://api.github.com/*", // GitHub API
    "*://localhost/*"           // Development
  ]
}
```

### Content Security Policy
- All scripts use strict CSP
- No inline scripts or styles
- External resources whitelisted

## Deployment

### Chrome Web Store
1. Build browser extension: `bun run build:browser`
2. Package extension: `bun run package:browser`
3. Zip the `dist/browser-extension` folder
4. Upload to Chrome Web Store Developer Dashboard

### Firefox Add-ons
1. Follow Chrome Web Store steps 1-2
2. Use `web-ext` tool for Firefox packaging
3. Upload to Firefox Add-ons Developer Hub

### Standalone Web App
1. Build with Vite: `bun run build:browser`
2. Deploy `dist/browser` folder to web server
3. Configure OAuth redirect URLs

## Testing

### Manual Testing
1. Load extension in browser
2. Test authentication flow
3. Share code snippets
4. Verify encryption/decryption
5. Test team management features

### Automated Testing
```bash
# Run browser extension tests (when implemented)
bun test:browser
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors
- Ensure API server has proper CORS headers
- Check host permissions in manifest

#### 2. Storage Issues
- Verify extension permissions
- Check storage quota limits

#### 3. Crypto API Errors
- Ensure HTTPS for Web Crypto API
- Check browser compatibility

#### 4. OAuth Flow Issues
- Verify redirect URLs
- Check client ID configuration

### Debug Mode
```bash
# Enable debug logging
export OSMYNT_DEBUG=true
bun run build:browser
```

## Future Enhancements

### Planned Features
- [ ] **Offline Support**: Service worker for offline functionality
- [ ] **Sync**: Cross-device synchronization
- [ ] **Themes**: Dark/light theme support
- [ ] **Shortcuts**: Custom keyboard shortcuts
- [ ] **Analytics**: Usage tracking and insights

### Performance Optimizations
- [ ] **Lazy Loading**: Load components on demand
- [ ] **Caching**: Intelligent content caching
- [ ] **Compression**: Bundle size optimization
- [ ] **Tree Shaking**: Remove unused code

## Contributing

### Development Setup
1. Clone repository
2. Install dependencies: `bun install`
3. Set up environment variables
4. Run development server: `bun run watch:browser`

### Code Style
- Use TypeScript for type safety
- Follow existing code patterns
- Add tests for new features
- Update documentation

### Pull Request Process
1. Create feature branch
2. Implement changes
3. Add tests
4. Update documentation
5. Submit pull request

## Support

For issues related to browser support:
- Check this documentation
- Review browser console for errors
- Test in different browsers
- Report issues with browser details

## License

Same license as the main Osmynt project (BSL1.1).
