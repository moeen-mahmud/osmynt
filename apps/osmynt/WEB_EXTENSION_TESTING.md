# VS Code Web Extension Testing Guide

This guide explains how to test your Osmynt extension in a browser environment using `@vscode/test-web`.

## 🚀 Quick Start

### 1. Build and Test
```bash
# Build the web extension
bun run build:web

# Simple test (recommended)
bun run simple:web

# Development mode (with auto-reload)
bun run dev:web
```

### 2. Quick Browser Testing
```bash
# Open in browser for development (simplified)
bun run open-in-browser
```

### 3. Manual Testing (Recommended)
```bash
# Build the extension
bun run build:web

# Open VS Code for the Web
# Go to: https://vscode.dev
# Or: https://github.dev

# Install your extension manually:
# 1. Click Extensions (Ctrl+Shift+X)
# 2. Click "..." menu → "Install from VSIX"
# 3. Upload your packaged .vsix file
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `bun run build:web` | Build the VS Code web extension |
| `bun run simple:web` | Simple browser test (recommended) |
| `bun run test:web` | Run one-time test in browser |
| `bun run dev:web` | Start development server with auto-reload |
| `bun run open-in-browser` | Alias for `simple:web` |

## 🔧 How It Works

### 1. Extension Loading
- The extension is built to `dist/browser/extension.js`
- `vscode-test-web` creates a VS Code web environment
- Your extension is loaded as a development extension
- Browser opens with VS Code web interface

### 2. Testing Environment
- **Chrome Browser**: Opens automatically for testing
- **VS Code Web**: Full VS Code interface in browser
- **Extension Host**: Your extension runs in the web extension host
- **Debug Console**: Check browser dev tools for logs

## 🎯 Testing Your Extension

### 1. Basic Functionality
1. **Open Command Palette**: `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. **Search for Osmynt**: Type "Osmynt" to see available commands
3. **Test Commands**:
   - `Osmynt: Login` - Test authentication
   - `Osmynt: Share Selected Code` - Test code sharing
   - `Osmynt: Refresh` - Test refresh functionality

### 2. Extension Features
- **Command Palette Integration**: All commands should appear
- **Editor Integration**: Select code and share it
- **UI Components**: Check for proper rendering
- **Error Handling**: Test error scenarios

### 3. Browser-Specific Features
- **Web Crypto API**: Test encryption/decryption
- **Local Storage**: Test data persistence
- **WebSocket Connections**: Test real-time features
- **OAuth Flow**: Test GitHub authentication

## 🐛 Debugging

### 1. Browser Dev Tools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API calls
- **Application**: Check localStorage and sessionStorage
- **Sources**: Set breakpoints in your code

### 2. VS Code Dev Tools
- **Extension Host**: Check extension logs
- **Output Panel**: View extension output
- **Debug Console**: Execute commands

### 3. Common Issues

#### Extension Not Loading
```bash
# Check if extension is built
ls -la dist/browser/extension.js

# Rebuild if needed
bun run build:web
```

#### Browser Not Opening
```bash
# Check if vscode-test-web is installed
bun list @vscode/test-web

# Install if missing
bun add -D @vscode/test-web
```

#### Extension Errors
- Check browser console for errors
- Verify all dependencies are available
- Check VS Code web extension compatibility

## 🔄 Development Workflow

### 1. Development Mode
```bash
# Start development server
bun run dev:web

# Make changes to your code
# Extension will auto-reload in browser
```

### 2. Testing Changes
1. **Make Code Changes**: Edit files in `src/browser/`
2. **Rebuild**: `bun run build:web`
3. **Refresh Browser**: Reload the VS Code web page
4. **Test Features**: Use Command Palette to test

### 3. Debugging
1. **Set Breakpoints**: In browser dev tools
2. **Check Logs**: Browser console and VS Code output
3. **Monitor Network**: Check API calls
4. **Test Edge Cases**: Error scenarios, offline mode

## 📦 Packaging for Distribution

### 1. Build for Production
```bash
# Build web extension
bun run build:web

# Package for VS Code Marketplace
bun run package:web
```

### 2. Test Package
```bash
# Test the packaged extension
# Install the .vsix file in VS Code for the Web
```

## 🌐 Deployment Options

### 1. VS Code Marketplace
- Upload `.vsix` file to VS Code Marketplace
- Users can install from marketplace
- Works in vscode.dev, github.dev, etc.

### 2. Manual Installation
- Share `.vsix` file directly
- Users install via "Install from VSIX"
- Good for testing and private distribution

### 3. Development Server
- Use `bun run dev:web` for local testing
- Share local server URL for team testing
- Good for development and debugging

## 🎉 Success Indicators

Your extension is working correctly when:
- ✅ Browser opens with VS Code web interface
- ✅ Extension appears in Command Palette
- ✅ Commands execute without errors
- ✅ UI components render properly
- ✅ Authentication flow works
- ✅ Code sharing functionality works
- ✅ No console errors

## 🆘 Troubleshooting

### Common Commands
```bash
# Clean and rebuild
bun run clean
bun run build:web

# Check dependencies
bun install

# Verify build output
ls -la dist/browser/
```

### Getting Help
- Check VS Code web extension documentation
- Review browser console for errors
- Test in different browsers
- Verify all APIs are web-compatible

---

**Happy Testing! 🚀**

Your Osmynt extension should now work seamlessly in VS Code for the Web!
