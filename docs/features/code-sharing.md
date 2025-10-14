---
layout: page
title: Code Sharing
description: "Learn how to share and receive code snippets with your team using Osmynt's secure, real-time code sharing features."
---

# Code Sharing

Osmynt's core feature is secure, real-time code sharing. Share code snippets with your team instantly, with end-to-end encryption and syntax highlighting preserved.

## Overview

Code sharing in Osmynt allows you to:

- **Share code snippets** with your team in real-time
- **Receive code** from team members instantly
- **Apply code changes** directly to your files using diff application
- **View code with syntax highlighting** and proper formatting
- **Share with specific team members** or the entire team

## Sharing Code

### Selecting Code to Share

Before sharing, you need to select the code you want to share:

1. **Open a file** in VS Code with the code you want to share
2. **Select the code** using one of these methods:
   - **Single line**: Click and drag to select
   - **Multiple lines**: Click and drag across lines
   - **Entire function**: Triple-click to select a function
   - **All code**: `Ctrl+A` / `Cmd+A` to select all

### Sharing Methods

#### Method 1: Right-Click Menu

1. **Right-click** on the selected code
2. **Select** "Share Selected Code" from the context menu
3. **Follow the prompts** to complete the share

#### Method 2: Command Palette

1. **Select your code** in the editor
2. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. **Run** `Osmynt: Share Selected Code`
4. **Follow the prompts** to complete the share

#### Method 3: Osmynt Panel

1. **Select your code** in the editor
2. **Click the Osmynt icon** in the Activity Bar
3. **Click** "Share Selected Code" button
4. **Follow the prompts** to complete the share

### Sharing Configuration

When sharing code, you'll be prompted to configure several options:

#### Add a Title

Enter a descriptive title for your code:

**Good titles:**

- "Fix authentication bug in login function"
- "New API endpoint for user management"
- "Database migration script"
- "Environment configuration for production"

**Avoid:**

- "Code" or "Snippet"
- "Fix" or "Update"
- Very long titles

#### Choose Sharing Options

##### Include File Context

- **Include file name and extension**: Adds file metadata
- **Include full file context for diff application**: Enables diff application
- **Don't include**: Just the code without context

##### Choose Recipients

- **Share with team**: All team members can see it
- **Share with specific members**: Choose individual team members

## Receiving Code

### Viewing Shared Code

When team members share code with you:

1. **Open the Osmynt panel** (click the Osmynt icon)
2. **Look for new items** in the "Received Items" section
3. **Click on a shared item** to view the code
4. **Use the available actions** to interact with the code

### Available Actions

When viewing shared code, you can:

#### Copy to Clipboard

- **Click** "Copy to Clipboard" button
- **Paste** the code wherever you need it
- **Preserves formatting** and syntax highlighting

#### Open to Side

- **Click** "Open to Side" button
- **Opens the code** in a new editor tab
- **Useful for** comparing with your existing code

#### Insert to Cursor

- **Click** "Insert to Cursor" button
- **Inserts the code** at your current cursor position
- **Perfect for** applying code changes directly

#### Apply Diff

- **Click** "Apply Diff" button (if file context was included)
- **Applies the changes** directly to the target file
- **Shows a preview** before applying changes

## Code Sharing Best Practices

### What to Share

**Good examples:**

- Functions or methods
- Configuration blocks
- Error handling code
- API endpoints
- Database queries
- Environment variables

**Avoid sharing:**

- Entire files (use diff application instead)
- Sensitive data (passwords, API keys)
- Very large code blocks (over 1000 lines)

### Sharing Strategy

- **Share incrementally** - small, focused shares are better
- **Include context when needed** - for diff application
- **Choose appropriate recipients** - don't spam the entire team
- **Use descriptive titles** - explain what the code does

### Code Selection

- **Select meaningful chunks** - complete functions or logical blocks
- **Avoid very large selections** - keep under 1000 lines
- **Include relevant context** - don't cut off in the middle of a function

## Real-time Updates

### Instant Notifications

When team members share code with you:

- **Real-time notifications** appear in the Osmynt panel
- **Visual indicators** show new shared items
- **No need to refresh** - updates appear automatically

### Staying Synchronized

- **All team members** see updates instantly
- **Multi-device support** - updates appear on all your devices
- **Persistent storage** - shared code persists across sessions

## Security Features

### End-to-End Encryption

- **All code is encrypted** before leaving your device
- **Only team members** can decrypt shared code
- **No server storage** - code is not stored on our servers
- **Team-only access** - only verified team members can see it

### Access Control

- **Team-only sharing** - code can only be shared within the team
- **Member verification** - only verified team members can access code
- **Device management** - control which devices can access the team

## Troubleshooting Code Sharing

### Common Issues

#### "No Code Selected" Error

**Problem**: You didn't select any code before sharing
**Solution**: Select some code in your editor first

#### "Share Failed" Error

**Problem**: Network or authentication issues
**Solution**:
1. Check your internet connection
2. Run `Osmynt: Refresh` to sync
3. Try sharing again

#### Code Not Appearing

**Problem**: Your share doesn't appear in the panel
**Solution**:
1. Run `Osmynt: Refresh` to sync
2. Check if you're in the right team
3. Verify the share was completed successfully

### Performance Tips

- **Keep code blocks small** - under 1000 lines for best performance
- **Use appropriate sharing options** - don't include unnecessary context
- **Regular cleanup** - remove old shared items periodically

## Next Steps

Now that you understand code sharing, you're ready to:

1. **[Learn about team management]({{ '/features/team-management' | relative_url }})** - Manage team members and permissions
2. **[Set up multiple devices]({{ '/features/device-management' | relative_url }})** - Access from anywhere
3. **[Learn about diff application]({{ '/features/diff-application' | relative_url }})** - Apply code changes directly to your files
