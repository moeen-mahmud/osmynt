# Installation

Get Osmynt up and running in your VS Code editor in just a few minutes.

## Prerequisites

- **Visual Studio Code** (version 1.94.0 or later)
- **GitHub account** (for authentication)
- **Internet connection** (for real-time features)

## Install from VS Code Marketplace

### Method 1: VS Code Marketplace (Recommended)

1. Open VS Code
2. Go to the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Osmynt"
4. Click **Install** on the official Osmynt extension
5. Click **Reload** when prompted

### Method 2: Command Palette

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type `Extensions: Install Extensions`
3. Search for "Osmynt"
4. Click **Install**

## Alternative Installation Methods

### Open VSX Registry

If you're using VS Code alternatives like VSCodium or Theia:

1. Visit [Open VSX Registry](https://open-vsx.org/extension/osmynt/osmynt)
2. Download the `.vsix` file
3. In VS Code, open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
4. Run `Extensions: Install from VSIX...`
5. Select the downloaded `.vsix` file

### Manual Installation from GitHub

1. Go to the [Osmynt releases page](https://github.com/moeen-mahmud/osmynt/releases)
2. Download the latest `.vsix` file
3. Install using the VSIX method above

## Verify Installation

After installation, you should see:

1. **Osmynt icon** in the Activity Bar (left sidebar)
2. **Osmynt panel** in the Sidebar when you click the icon
3. **Osmynt commands** available in the Command Palette

### Quick Test

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Osmynt" - you should see all Osmynt commands
3. Click on the Osmynt icon in the Activity Bar
4. You should see the Osmynt welcome screen

## Next Steps

Once installed, you're ready to:

1. **[Authenticate with GitHub](authentication.md)** - Set up your account
2. **[Join or create a team](teams.md)** - Start collaborating
3. **[Share your first code](first-share.md)** - Learn the basics

## Troubleshooting Installation

### Extension Not Appearing

- **Reload VS Code**: Close and reopen VS Code
- **Check VS Code version**: Ensure you're running VS Code 1.94.0 or later
- **Check installation**: Go to Extensions view and verify Osmynt is installed and enabled

### Permission Issues

- **Restart VS Code as Administrator** (Windows) or with `sudo` (macOS/Linux)
- **Check VS Code permissions**: Ensure VS Code has necessary permissions

### Network Issues

- **Check internet connection**: Osmynt requires internet for authentication and real-time features
- **Firewall settings**: Ensure VS Code can access the internet
- **Corporate networks**: Check if your organization blocks certain domains

## System Requirements

### Supported Operating Systems

- **Windows**: 10/11 (x64)
- **macOS**: 10.15+ (Intel and Apple Silicon)
- **Linux**: Ubuntu 18.04+, Debian 9+, RHEL 7+, CentOS 7+

### VS Code Requirements

- **VS Code**: 1.94.0 or later
- **Node.js**: Not required (extension is self-contained)
- **Memory**: 50MB+ available RAM
- **Storage**: 10MB+ free space

## Uninstalling

To remove Osmynt:

1. Go to Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Find "Osmynt" in your installed extensions
3. Click the gear icon → **Uninstall**
4. **Reload VS Code** when prompted

> **Note**: Uninstalling will not remove your team data or shared code. Your data is stored securely on our servers and will remain accessible if you reinstall the extension.

## Need Help?

If you're having trouble with installation:

- **Email**: [support@osmynt.dev](mailto:support@osmynt.dev)
- **GitHub Issues**: [Report installation issues](https://github.com/moeen-mahmud/osmynt/issues)
- **Discord**: [Get help from the community](https://discord.gg/osmynt)
