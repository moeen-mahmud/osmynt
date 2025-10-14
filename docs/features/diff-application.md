---
layout: page
title: Diff Application
description: "Learn how to apply shared code changes directly to your files using Osmynt's Git-like diff application feature."
---

# Diff Application

Osmynt's diff application feature allows you to apply shared code changes directly to your files, similar to how Git applies patches. This powerful feature enables seamless code collaboration without manual copy-pasting.

## Overview

Diff application in Osmynt provides:

- **Git-like diff application** - apply code changes directly to your files
- **Line-by-line precision** - apply changes to specific line numbers
- **File context preservation** - maintain file structure and formatting
- **Change preview** - review changes before applying them
- **Automatic file detection** - automatically detect target files

## How Diff Application Works

### Prerequisites

For diff application to work:

- ✅ **File context included** - the original share must include file context
- ✅ **Target file exists** - the file must exist in your workspace
- ✅ **Proper file structure** - the file structure must match the original

### The Process

1. **Code is shared** with file context included
2. **Target file is identified** using file path and metadata
3. **Changes are calculated** using line-by-line comparison
4. **Diff is generated** showing what will change
5. **Changes are applied** to the target file

## Using Diff Application

### Sharing Code with File Context

When sharing code for diff application:

1. **Select your code** in the editor
2. **Right-click** and select "Share Selected Code"
3. **Choose sharing options**:
   - ✅ **Include full file context for diff application**
   - ✅ **Include file name and extension**
4. **Complete the share** as usual

### Applying Diff Changes

When you receive code with file context:

1. **Open the shared code** in the Osmynt panel
2. **Click** "Apply Diff" button
3. **Review the changes** in the preview
4. **Confirm** to apply the changes
5. **Changes are applied** to your file

### Change Preview

Before applying changes, you'll see:

- **File path** - where the changes will be applied
- **Line numbers** - which lines will be changed
- **Added lines** - new code that will be added
- **Removed lines** - code that will be removed
- **Modified lines** - code that will be changed

## Diff Application Scenarios

### Scenario 1: Function Updates

**Original code:**
```javascript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Updated code:**
```javascript
function calculateTotal(items) {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Diff application:**
- **Line 2**: Add null check
- **Line 3**: Keep existing logic
- **Result**: Function is updated with null safety

### Scenario 2: Configuration Changes

**Original code:**
```json
{
  "database": {
    "host": "localhost",
    "port": 5432
  }
}
```

**Updated code:**
```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "ssl": true
  }
}
```

**Diff application:**
- **Line 5**: Add SSL configuration
- **Result**: Database config is updated with SSL

### Scenario 3: Error Handling

**Original code:**
```python
def api_call():
    result = requests.get(url)
    return result.json()
```

**Updated code:**
```python
def api_call():
    try:
        result = requests.get(url)
        return result.json()
    except requests.RequestException as e:
        logger.error(f"API call failed: {e}")
        return None
```

**Diff application:**
- **Line 2**: Add try block
- **Line 3**: Keep existing logic
- **Line 4**: Add except block
- **Result**: Function is updated with error handling

## Best Practices for Diff Application

### Sharing Code

1. **Include file context** - always include file context for diff application
2. **Use descriptive titles** - explain what the changes do
3. **Share focused changes** - avoid sharing entire files
4. **Test changes locally** - ensure changes work before sharing

### Applying Changes

1. **Review changes carefully** - understand what will change
2. **Backup important files** - create backups before applying changes
3. **Test after applying** - verify changes work correctly
4. **Communicate with team** - let team members know about changes

### File Management

1. **Keep files organized** - maintain clear file structure
2. **Use version control** - commit changes to Git after applying
3. **Document changes** - add comments explaining changes
4. **Regular cleanup** - remove old shared items periodically

## Troubleshooting Diff Application

### "File Not Found" Error

**Common causes:**

- Target file doesn't exist
- File path is incorrect
- File was moved or renamed

**Solutions:**

1. **Check file path** - ensure the file exists
2. **Verify file structure** - ensure file structure matches
3. **Create missing files** - create the file if it doesn't exist
4. **Update file path** - correct the file path if needed

### "Invalid File Context" Error

**Common causes:**

- File context was not included in the share
- File structure has changed
- File encoding issues

**Solutions:**

1. **Check share options** - ensure file context was included
2. **Verify file structure** - ensure file structure matches
3. **Re-share with context** - ask team member to re-share with context
4. **Check file encoding** - ensure file encoding is correct

### "Changes Cannot Be Applied" Error

**Common causes:**
- File has been modified since sharing
- Line numbers have changed
- File structure has changed

**Solutions:**
1. **Check file status** - ensure file hasn't been modified
2. **Update file context** - get fresh file context
3. **Manual application** - apply changes manually if needed
4. **Re-sync with team** - ensure you have the latest version

### "Permission Denied" Error

**Common causes:**
- File is read-only
- Insufficient permissions
- File is locked by another process

**Solutions:**
1. **Check file permissions** - ensure you can write to the file
2. **Close other editors** - close other applications using the file
3. **Run as administrator** - run VS Code with elevated permissions
4. **Check file locks** - ensure no other processes are using the file

## Advanced Diff Application

### Custom File Paths

If your file structure differs from the original:

1. **Check file path** - ensure the file exists in the expected location
2. **Update file path** - correct the file path if needed
3. **Create directory structure** - create missing directories if needed
4. **Verify file permissions** - ensure you can write to the file

### Large File Changes

For large files:

1. **Break into smaller changes** - share smaller, focused changes
2. **Use version control** - commit changes to Git frequently
3. **Test incrementally** - test changes as you apply them
4. **Communicate with team** - coordinate large changes with your team

### Complex File Structures

For complex file structures:

1. **Maintain file organization** - keep files in their expected locations
2. **Use relative paths** - use relative paths when possible
3. **Document file structure** - document your file organization
4. **Regular cleanup** - keep file structure clean and organized

## Next Steps

Now that you understand diff application, you're ready to:

1. **[Learn about real-time updates]({{ '/features/realtime-updates' | relative_url }})** - Stay synchronized with your team
2. **[Learn about code sharing]({{ '/features/code-sharing' | relative_url }})** - Share and receive code snippets
3. **[Learn about team management]({{ '/features/team-management' | relative_url }})** - Manage team members and permissions
