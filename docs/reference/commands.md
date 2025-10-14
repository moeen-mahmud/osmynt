---
layout: page
title: Commands Reference
description: "Complete reference of all Osmynt commands available in VS Code."
---

# Commands Reference

This document provides a complete reference of all Osmynt commands available in VS Code.

## Authentication Commands

### `Osmynt: Login`

**Description**: Authenticate with GitHub to access Osmynt features.

**Usage**: 
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Login`
- Press Enter

**What it does**:
- Opens browser for GitHub authentication
- Exchanges OAuth tokens securely
- Sets up device authentication
- Syncs teams and shared code

**When to use**:
- First time setup
- After logging out
- When authentication expires
- When switching GitHub accounts

### `Osmynt: Logout`

**Description**: Sign out of Osmynt and clear local authentication.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Logout`
- Press Enter

**What it does**:
- Signs out of Osmynt
- Clears local authentication tokens
- Removes device from teams
- Clears local cache

**When to use**:
- When switching accounts
- When troubleshooting authentication
- When securing shared devices
- When logging out

## Team Commands

### `Osmynt: Invite Team Member`

**Description**: Create a team and generate an invitation token for team members.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Invite Team Member`
- Press Enter
- Copy the invitation token
- Share with team members

**What it does**:
- Creates a new team (if first time)
- Generates secure invitation token
- Sets up team encryption keys
- Prepares team for collaboration

**When to use**:
- Creating a new team
- Inviting new team members
- Sharing team access
- Setting up collaboration

### `Osmynt: Accept Invitation`

**Description**: Join a team using an invitation token.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Accept Invitation`
- Press Enter
- Paste the invitation token
- Confirm to join

**What it does**:
- Validates invitation token
- Adds you to the team
- Exchanges encryption keys
- Syncs team data

**When to use**:
- Joining a team
- Accepting team invitations
- Setting up team access
- Collaborating with team

## Code Sharing Commands

### `Osmynt: Share Selected Code`

**Description**: Share the currently selected code with your team.

**Usage**:
- Select code in the editor
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Share Selected Code`
- Press Enter
- Follow the prompts

**What it does**:
- Encrypts selected code
- Shares with team members
- Sends real-time notifications
- Syncs across all devices

**When to use**:
- Sharing code snippets
- Collaborating on code
- Getting code reviews
- Sharing solutions

### `Osmynt: View Shared Code`

**Description**: View all shared code in the Osmynt panel.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: View Shared Code`
- Press Enter

**What it does**:
- Opens Osmynt panel
- Shows all shared code
- Displays team members
- Shows device status

**When to use**:
- Viewing shared code
- Managing teams
- Checking device status
- Troubleshooting issues

## Device Commands

### `Osmynt: Refresh`

**Description**: Refresh synchronization and update team data.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Refresh`
- Press Enter

**What it does**:
- Syncs with Osmynt servers
- Updates team data
- Refreshes shared code
- Updates device status

**When to use**:
- After network issues
- When updates don't appear
- After authentication issues
- Regular maintenance

### `Osmynt: Clear Local Cache`

**Description**: Clear local cache and reset extension state.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Clear Local Cache`
- Press Enter
- Confirm the action

**What it does**:
- Clears local cache
- Resets extension state
- Removes temporary data
- Forces fresh sync

**When to use**:
- When troubleshooting issues
- After performance problems
- When cache is corrupted
- Regular maintenance

## Utility Commands

### `Osmynt: Show Status`

**Description**: Display current Osmynt status and connection information.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Show Status`
- Press Enter

**What it does**:
- Shows authentication status
- Displays team information
- Shows device status
- Shows connection status

**When to use**:
- Checking status
- Troubleshooting issues
- Verifying setup
- Debugging problems

### `Osmynt: Open Panel`

**Description**: Open the Osmynt panel in the sidebar.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Open Panel`
- Press Enter

**What it does**:
- Opens Osmynt panel
- Shows team members
- Displays shared code
- Shows device status

**When to use**:
- Accessing Osmynt features
- Managing teams
- Viewing shared code
- Checking status

## Advanced Commands

### `Osmynt: Export Team Data`

**Description**: Export team data for backup or migration.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Export Team Data`
- Press Enter
- Choose export options

**What it does**:
- Exports team data
- Creates backup file
- Includes team members
- Includes shared code

**When to use**:
- Creating backups
- Migrating teams
- Data recovery
- Team management

### `Osmynt: Import Team Data`

**Description**: Import team data from backup or migration.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Import Team Data`
- Press Enter
- Select import file

**What it does**:
- Imports team data
- Restores team members
- Restores shared code
- Sets up encryption

**When to use**:
- Restoring backups
- Migrating teams
- Data recovery
- Team setup

## Command Shortcuts

### Keyboard Shortcuts

| Command | Shortcut | Description |
|---------|----------|-------------|
| `Osmynt: Login` | `Ctrl+Shift+L` / `Cmd+Shift+L` | Quick login |
| `Osmynt: Share Selected Code` | `Ctrl+Shift+S` / `Cmd+Shift+S` | Quick share |
| `Osmynt: Open Panel` | `Ctrl+Shift+O` / `Cmd+Shift+O` | Open panel |
| `Osmynt: Refresh` | `Ctrl+Shift+R` / `Cmd+Shift+R` | Quick refresh |

### Context Menu Commands

| Command | Context | Description |
|---------|---------|-------------|
| `Share Selected Code` | Right-click on selected code | Share code |
| `Copy to Clipboard` | Right-click on shared code | Copy code |
| `Open to Side` | Right-click on shared code | Open in new tab |
| `Insert to Cursor` | Right-click on shared code | Insert at cursor |

## Command Parameters

### Share Code Parameters

- **Title**: Descriptive title for the code
- **Recipients**: Choose team members to share with
- **Context**: Include file context for diff application
- **Encryption**: End-to-end encryption (automatic)

### Team Parameters

- **Team Name**: Name for the team
- **Members**: List of team members
- **Permissions**: Access permissions for members
- **Encryption**: Team encryption keys (automatic)

### Device Parameters

- **Device Name**: Name for the device
- **Device Type**: Type of device (desktop, laptop, etc.)
- **Network**: Network configuration
- **Security**: Device security settings

## Command Examples

### Basic Usage

```bash
# Login to Osmynt
Osmynt: Login

# Share selected code
Osmynt: Share Selected Code

# View shared code
Osmynt: View Shared Code

# Refresh sync
Osmynt: Refresh
```

### Team Management

```bash
# Create team and invite members
Osmynt: Invite Team Member

# Join existing team
Osmynt: Accept Invitation

# View team status
Osmynt: Show Status
```

### Troubleshooting

```bash
# Clear cache
Osmynt: Clear Local Cache

# Refresh sync
Osmynt: Refresh

# Show status
Osmynt: Show Status
```

## Command Best Practices

### Using Commands

1. **Use Command Palette** - Access commands via Command Palette
2. **Use keyboard shortcuts** - Use shortcuts for common commands
3. **Use context menus** - Use right-click menus for quick access
4. **Use panel buttons** - Use buttons in the Osmynt panel

### Command Efficiency

1. **Learn shortcuts** - Learn keyboard shortcuts for common commands
2. **Use aliases** - Use command aliases for efficiency
3. **Use automation** - Use command automation when possible
4. **Use batch operations** - Use batch operations for multiple items

### Command Troubleshooting

1. **Check command availability** - Ensure commands are available
2. **Check prerequisites** - Ensure prerequisites are met
3. **Check permissions** - Ensure you have necessary permissions
4. **Check status** - Check command status and results

## Next Steps

Now that you understand Osmynt commands:

1. **[Learn about keyboard shortcuts]({{ '/reference/shortcuts' | relative_url }})** - Quick access shortcuts
2. **[Learn about configuration]({{ '/reference/configuration' | relative_url }})** - Customize your experience
3. **[Learn about code sharing]({{ '/features/code-sharing' | relative_url }})** - Share and receive code
4. **[Learn about team management]({{ '/features/team-management' | relative_url }})** - Manage teams and members
