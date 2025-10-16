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

### `Osmynt: Invite Member`

**Description**: Create a team and generate an invitation token for team members.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Invite Member`
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

### `Osmynt: Remove Member`

**Description**: Remove a team member from your team.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Remove Member`
- Press Enter
- Select member to remove
- Confirm removal

**What it does**:
- Removes member from team
- Revokes access to shared code
- Updates team permissions
- Notifies other members

**When to use**:
- Removing inactive members
- Managing team access
- Security cleanup
- Team restructuring

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

### `Osmynt: View Code blocks`

**Description**: View all shared code in the Osmynt panel.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: View Code blocks`
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

### `Osmynt: Copy Code blocks`

**Description**: Copy shared code to clipboard.

**Usage**:
- Right-click on shared code in panel
- Select "Copy Code blocks"
- Or use Command Palette

**What it does**:
- Copies code to clipboard
- Preserves formatting
- Maintains syntax highlighting
- Ready for pasting

**When to use**:
- Copying shared code
- Using code in other files
- Quick code access
- Code integration

### `Osmynt: Open Code blocks to Side`

**Description**: Open shared code in a new editor tab.

**Usage**:
- Right-click on shared code in panel
- Select "Open Code blocks to Side"
- Or use Command Palette

**What it does**:
- Opens code in new tab
- Preserves syntax highlighting
- Enables editing
- Shows full context

**When to use**:
- Reviewing shared code
- Working with code
- Full code context
- Code analysis

### `Osmynt: Insert Code blocks at Cursor`

**Description**: Insert shared code at current cursor position.

**Usage**:
- Position cursor in editor
- Right-click on shared code in panel
- Select "Insert Code blocks at Cursor"
- Or use Command Palette

**What it does**:
- Inserts code at cursor
- Preserves indentation
- Maintains formatting
- Updates file

**When to use**:
- Adding shared code
- Code integration
- Quick insertion
- Code completion

### `Osmynt: Apply Diff`

**Description**: Apply shared code changes directly to your files.

**Usage**:
- Select shared code with diff
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Apply Diff`
- Press Enter
- Review and confirm changes

**What it does**:
- Shows diff preview
- Applies changes to files
- Maintains git history
- Preserves workflow

**When to use**:
- Applying code changes
- Code integration
- Git-like workflow
- Collaborative coding

## Device Management Commands

### `Osmynt: Add Device (Primary - generate code)`

**Description**: Add a new device as primary (generates pairing code).

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Add Device (Primary - generate code)`
- Press Enter
- Copy the generated code
- Use on companion device

**What it does**:
- Generates pairing code
- Sets up device encryption
- Prepares for companion pairing
- Establishes secure connection

**When to use**:
- Adding new devices
- Setting up primary device
- Device pairing
- Multi-device setup

### `Osmynt: Add Device (Companion - paste code)`

**Description**: Add a new device as companion (uses pairing code).

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Add Device (Companion - paste code)`
- Press Enter
- Paste the pairing code
- Confirm pairing

**What it does**:
- Validates pairing code
- Sets up device encryption
- Syncs with primary device
- Establishes secure connection

**When to use**:
- Adding companion devices
- Device pairing
- Multi-device setup
- Device synchronization

### `Osmynt: Remove Device`

**Description**: Remove a device from your account.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Remove Device`
- Press Enter
- Select device to remove
- Confirm removal

**What it does**:
- Removes device access
- Revokes encryption keys
- Clears device data
- Notifies other devices

**When to use**:
- Removing old devices
- Security cleanup
- Device management
- Account maintenance

### `Osmynt: List Devices`

**Description**: List all devices associated with your account.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: List Devices`
- Press Enter

**What it does**:
- Shows all devices
- Displays device status
- Shows last activity
- Shows device types

**When to use**:
- Checking device status
- Device management
- Security audit
- Troubleshooting

### `Osmynt: Repair This Device`

**Description**: Repair device connection and encryption.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Repair This Device`
- Press Enter
- Follow repair process

**What it does**:
- Repairs device connection
- Regenerates encryption keys
- Syncs with servers
- Restores functionality

**When to use**:
- Device connection issues
- Encryption problems
- Sync failures
- Troubleshooting

### `Osmynt: Force Remove Device`

**Description**: Force remove a device (use when normal removal fails).

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Force Remove Device`
- Press Enter
- Select device to remove
- Confirm force removal

**What it does**:
- Force removes device
- Revokes all access
- Clears all data
- Notifies other devices

**When to use**:
- Normal removal failed
- Security emergency
- Device compromised
- Account cleanup

### `Osmynt: Backfill Access for Companion`

**Description**: Backfill access for companion devices (primary device only).

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Backfill Access for Companion`
- Press Enter
- Follow backfill process

**What it does**:
- Syncs historical data
- Provides access to past shares
- Updates encryption keys
- Restores full functionality

**When to use**:
- New companion device
- Missing historical data
- Sync issues
- Device setup

## Utility Commands

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

## Filter Commands

### `Osmynt: Filter Shared items by This Member`

**Description**: Filter shared code by specific team member.

**Usage**:
- Right-click on team member in panel
- Select "Filter Shared items by This Member"
- Or use Command Palette

**What it does**:
- Filters shared code
- Shows only selected member's shares
- Updates panel view
- Maintains filter state

**When to use**:
- Finding specific shares
- Member-specific code
- Code organization
- Quick access

### `Osmynt: Clear Shared items Filter`

**Description**: Clear all filters and show all shared code.

**Usage**:
- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
- Type `Osmynt: Clear Shared items Filter`
- Press Enter

**What it does**:
- Clears all filters
- Shows all shared code
- Resets panel view
- Restores full view

**When to use**:
- After filtering
- Viewing all code
- Resetting filters
- Full overview

## Context Menu Commands

| Command | Context | Description |
|---------|---------|-------------|
| `Share Selected Code` | Right-click on selected code | Share code |
| `Copy Code blocks` | Right-click on shared code | Copy code |
| `Open Code blocks to Side` | Right-click on shared code | Open in new tab |
| `Insert Code blocks at Cursor` | Right-click on shared code | Insert at cursor |
| `Filter by This Member` | Right-click on team member | Filter by member |

## Command Examples

### Basic Usage

```bash
# Login to Osmynt
Osmynt: Login

# Share selected code
Osmynt: Share Selected Code

# View shared code
Osmynt: View Code blocks

# Refresh sync
Osmynt: Refresh
```

### Team Management

```bash
# Create team and invite members
Osmynt: Invite Member

# Join existing team
Osmynt: Accept Invitation

# Remove team member
Osmynt: Remove Member
```

### Device Management

```bash
# Add primary device
Osmynt: Add Device (Primary - generate code)

# Add companion device
Osmynt: Add Device (Companion - paste code)

# List all devices
Osmynt: List Devices

# Remove device
Osmynt: Remove Device
```

### Troubleshooting

```bash
# Clear cache
Osmynt: Clear Local Cache

# Refresh sync
Osmynt: Refresh

# Repair device
Osmynt: Repair This Device
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

1. **[Learn about keyboard shortcuts](reference/shortcuts)** - Quick access shortcuts
2. **[Learn about configuration](reference/configuration)** - Customize your experience
3. **[Learn about code sharing](features/code-sharing)** - Share and receive code
4. **[Learn about team management](features/team-management)** - Manage teams and members