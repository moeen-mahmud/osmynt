---
layout: page
title: Configuration
description: "Complete reference of Osmynt configuration options and customization settings."
---

# Configuration

This document provides a complete reference of Osmynt configuration options and customization settings.

## Configuration Overview

Osmynt can be configured through VS Code settings to customize your experience. All settings are stored in your VS Code settings and can be accessed through the Settings UI or by editing the settings JSON file.

## Accessing Configuration

### Through Settings UI

1. **Open VS Code Settings** (`Ctrl+,` / `Cmd+,`)
2. **Search for "Osmynt"**
3. **Configure settings** as needed
4. **Settings are saved** automatically

### Through Settings JSON

1. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. **Run** `Preferences: Open Settings (JSON)`
3. **Add Osmynt settings** to the JSON file
4. **Save the file**

## General Settings

### `osmynt.enabled`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable or disable Osmynt extension.

```json
{
  "osmynt.enabled": true
}
```

### `osmynt.autoStart`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Automatically start Osmynt when VS Code starts.

```json
{
  "osmynt.autoStart": true
}
```

### `osmynt.showWelcome`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Show welcome message when Osmynt starts.

```json
{
  "osmynt.showWelcome": true
}
```

## Authentication Settings

### `osmynt.auth.provider`

**Type**: `string`  
**Default**: `"github"`  
**Description**: Authentication provider to use.

```json
{
  "osmynt.auth.provider": "github"
}
```

### `osmynt.auth.autoLogin`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Automatically login when VS Code starts.

```json
{
  "osmynt.auth.autoLogin": false
}
```

### `osmynt.auth.tokenExpiry`

**Type**: `number`  
**Default**: `3600`  
**Description**: Token expiry time in seconds.

```json
{
  "osmynt.auth.tokenExpiry": 3600
}
```

## Team Settings

### `osmynt.teams.maxTeams`

**Type**: `number`  
**Default**: `10`  
**Description**: Maximum number of teams per user.

```json
{
  "osmynt.teams.maxTeams": 10
}
```

### `osmynt.teams.maxMembers`

**Type**: `number`  
**Default**: `50`  
**Description**: Maximum number of members per team.

```json
{
  "osmynt.teams.maxMembers": 50
}
```

### `osmynt.teams.autoJoin`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Automatically join teams when invited.

```json
{
  "osmynt.teams.autoJoin": false
}
```

## Code Sharing Settings

### `osmynt.sharing.maxCodeSize`

**Type**: `number`  
**Default**: `1000000`  
**Description**: Maximum code size in bytes (1MB).

```json
{
  "osmynt.sharing.maxCodeSize": 1000000
}
```

### `osmynt.sharing.includeContext`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Include file context by default.

```json
{
  "osmynt.sharing.includeContext": true
}
```

### `osmynt.sharing.autoShare`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Automatically share code when selected.

```json
{
  "osmynt.sharing.autoShare": false
}
```

### `osmynt.sharing.syntaxHighlighting`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable syntax highlighting for shared code.

```json
{
  "osmynt.sharing.syntaxHighlighting": true
}
```

## Device Settings

### `osmynt.devices.maxDevices`

**Type**: `number`  
**Default**: `5`  
**Description**: Maximum number of devices per user.

```json
{
  "osmynt.devices.maxDevices": 5
}
```

### `osmynt.devices.autoSync`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Automatically sync across devices.

```json
{
  "osmynt.devices.autoSync": true
}
```

### `osmynt.devices.syncInterval`

**Type**: `number`  
**Default**: `30`  
**Description**: Sync interval in seconds.

```json
{
  "osmynt.devices.syncInterval": 30
}
```

## Security Settings

### `osmynt.security.encryption`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable end-to-end encryption.

```json
{
  "osmynt.security.encryption": true
}
```

### `osmynt.security.keyRotation`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Enable automatic key rotation.

```json
{
  "osmynt.security.keyRotation": true
}
```

### `osmynt.security.auditLogging`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Enable audit logging.

```json
{
  "osmynt.security.auditLogging": false
}
```

## UI Settings

### `osmynt.ui.showPanel`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Show Osmynt panel in sidebar.

```json
{
  "osmynt.ui.showPanel": true
}
```

### `osmynt.ui.panelPosition`

**Type**: `string`  
**Default**: `"left"`  
**Description**: Panel position in sidebar.

```json
{
  "osmynt.ui.panelPosition": "left"
}
```

### `osmynt.ui.showNotifications`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Show notifications for shared code.

```json
{
  "osmynt.ui.showNotifications": true
}
```

### `osmynt.ui.theme`

**Type**: `string`  
**Default**: `"auto"`  
**Description**: UI theme (auto, light, dark).

```json
{
  "osmynt.ui.theme": "auto"
}
```

## Network Settings

### `osmynt.network.timeout`

**Type**: `number`  
**Default**: `30000`  
**Description**: Network timeout in milliseconds.

```json
{
  "osmynt.network.timeout": 30000
}
```

### `osmynt.network.retryAttempts`

**Type**: `number`  
**Default**: `3`  
**Description**: Number of retry attempts for failed requests.

```json
{
  "osmynt.network.retryAttempts": 3
}
```

### `osmynt.network.proxy`

**Type**: `string`  
**Default**: `""`  
**Description**: Proxy server URL.

```json
{
  "osmynt.network.proxy": ""
}
```

## Performance Settings

### `osmynt.performance.cacheSize`

**Type**: `number`  
**Default**: `100`  
**Description**: Cache size in MB.

```json
{
  "osmynt.performance.cacheSize": 100
}
```

### `osmynt.performance.autoCleanup`

**Type**: `boolean`  
**Default**: `true`  
**Description**: Automatically cleanup old data.

```json
{
  "osmynt.performance.autoCleanup": true
}
```

### `osmynt.performance.cleanupInterval`

**Type**: `number`  
**Default**: `86400`  
**Description**: Cleanup interval in seconds (24 hours).

```json
{
  "osmynt.performance.cleanupInterval": 86400
}
```

## Debug Settings

### `osmynt.debug.enabled`

**Type**: `boolean`  
**Default**: `false`  
**Description**: Enable debug mode.

```json
{
  "osmynt.debug.enabled": false
}
```

### `osmynt.debug.logLevel`

**Type**: `string`  
**Default**: `"info"`  
**Description**: Log level (debug, info, warn, error).

```json
{
  "osmynt.debug.logLevel": "info"
}
```

### `osmynt.debug.logFile`

**Type**: `string`  
**Default**: `""`  
**Description**: Log file path.

```json
{
  "osmynt.debug.logFile": ""
}
```

## Configuration Examples

### Basic Configuration

```json
{
  "osmynt.enabled": true,
  "osmynt.autoStart": true,
  "osmynt.showWelcome": true,
  "osmynt.ui.showPanel": true,
  "osmynt.ui.showNotifications": true
}
```

### Security-Focused Configuration

```json
{
  "osmynt.security.encryption": true,
  "osmynt.security.keyRotation": true,
  "osmynt.security.auditLogging": true,
  "osmynt.auth.autoLogin": false,
  "osmynt.teams.autoJoin": false
}
```

### Performance-Optimized Configuration

```json
{
  "osmynt.performance.cacheSize": 200,
  "osmynt.performance.autoCleanup": true,
  "osmynt.devices.syncInterval": 60,
  "osmynt.network.timeout": 60000,
  "osmynt.sharing.maxCodeSize": 500000
}
```

### Development Configuration

```json
{
  "osmynt.debug.enabled": true,
  "osmynt.debug.logLevel": "debug",
  "osmynt.debug.logFile": "/tmp/osmynt.log",
  "osmynt.showWelcome": false,
  "osmynt.ui.showNotifications": false
}
```

## Configuration Best Practices

### General Best Practices

1. **Start with defaults** - Use default settings initially
2. **Configure gradually** - Add custom settings as needed
3. **Test configurations** - Test settings before committing
4. **Document changes** - Document custom configurations
5. **Backup settings** - Backup your settings regularly

### Security Best Practices

1. **Enable encryption** - Always enable encryption
2. **Use key rotation** - Enable automatic key rotation
3. **Disable auto-login** - Disable auto-login for security
4. **Enable audit logging** - Enable audit logging for compliance
5. **Regular security reviews** - Review security settings regularly

### Performance Best Practices

1. **Optimize cache size** - Set appropriate cache size
2. **Enable auto-cleanup** - Enable automatic cleanup
3. **Monitor performance** - Monitor performance metrics
4. **Adjust sync intervals** - Adjust sync intervals as needed
5. **Regular maintenance** - Perform regular maintenance

## Configuration Troubleshooting

### Common Issues

1. **Settings not applied** - Restart VS Code after changing settings
2. **Performance issues** - Check cache size and cleanup settings
3. **Network issues** - Check network timeout and proxy settings
4. **Authentication issues** - Check authentication settings
5. **UI issues** - Check UI settings and theme

### Debugging Configuration

1. **Enable debug mode** - Set `osmynt.debug.enabled` to `true`
2. **Check log level** - Set appropriate log level
3. **Check log file** - Check log file for errors
4. **Test settings** - Test settings in isolation
5. **Contact support** - Contact support for complex issues

## Next Steps

Now that you understand Osmynt configuration:

1. **[Learn about commands](reference/commands)** - Complete command reference
2. **[Learn about shortcuts](reference/shortcuts)** - Quick access shortcuts
3. **[Learn about code sharing](features/code-sharing)** - Share and receive code
4. **[Learn about team management](features/team-management)** - Manage teams and members
