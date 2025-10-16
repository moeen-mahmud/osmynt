# Your First Share

Learn how to share code with your team using Osmynt. This guide will walk you through your first code share step by step.

## Prerequisites

Before you can share code, make sure you have:

- ✅ **Osmynt installed** and running
- ✅ **Authenticated with GitHub** (see [Authentication](authentication.md))
- ✅ **Joined a team** (see [Teams](teams.md))
- ✅ **Selected some code** in your editor

## Step 1: Select Code to Share

### Select Code in VS Code

1. **Open a file** in VS Code with some code
2. **Select the code** you want to share:
   - **Single line**: Click and drag to select
   - **Multiple lines**: Click and drag across lines
   - **Entire function**: Triple-click to select a function
   - **All code**: `Ctrl+A` / `Cmd+A` to select all

### What Code to Share

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

## Step 2: Share the Code

### Method 1: Right-Click Menu

1. **Right-click** on the selected code
2. **Select** "Share Selected Code" from the context menu
3. **Follow the prompts** to complete the share

### Method 2: Command Palette

1. **Select your code** in the editor
2. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. **Run** `Osmynt: Share Selected Code`
4. **Follow the prompts** to complete the share

### Method 3: Osmynt Panel

1. **Select your code** in the editor
2. **Click the Osmynt icon** in the Activity Bar
3. **Click** "Share Selected Code" button
4. **Follow the prompts** to complete the share

## Step 3: Configure Your Share

### Add a Title

When prompted, enter a descriptive title for your code:

**Good titles:**

- "Fix authentication bug in login function"
- "New API endpoint for user management"
- "Database migration script"
- "Environment configuration for production"

**Avoid:**

- "Code" or "Snippet"
- "Fix" or "Update"
- Very long titles

### Choose Sharing Options

You'll be prompted to choose sharing options:

#### Include File Context

- **Include file name and extension**: Adds file metadata
- **Include full file context for diff application**: Enables diff application
- **Don't include**: Just the code without context

#### Choose Recipients

- **Share with team**: All team members can see it
- **Share with specific members**: Choose individual team members

## Step 4: Complete the Share

### Review Your Share

Before sharing, review:

- ✅ **Code is selected correctly**
- ✅ **Title is descriptive**
- ✅ **Recipients are correct**
- ✅ **Sharing options are appropriate**

### Share the Code

1. **Click "Share"** to complete the process
2. **Wait for confirmation** - you'll see "Code shared securely"
3. **Check the Osmynt panel** - your share should appear in the list

## Step 5: Verify the Share

### Check the Osmynt Panel

1. **Open the Osmynt panel** (click the Osmynt icon)
2. **Look for your share** in the "Shared Items" section
3. **Verify the title** and recipients are correct

### Test with Team Members

1. **Ask a team member** to check their Osmynt panel
2. **They should see your share** in their "Received Items"
3. **They can view the code** by clicking on it

## Understanding Your Share

### What Gets Shared

- **The selected code** with syntax highlighting
- **File metadata** (if you chose to include it)
- **Sharing timestamp** and author information
- **Encrypted content** that only team members can decrypt

### What Doesn't Get Shared

- **Your entire file** (unless you selected all)
- **File system paths** (unless you chose to include context)
- **VS Code settings** or personal preferences
- **Unselected code** in the same file

### Security Features

- **End-to-end encryption** - only team members can decrypt
- **No server storage** - code is not stored on our servers
- **Team-only access** - only verified team members can see it
- **Device verification** - ensures secure sharing

## Common First Share Scenarios

### Scenario 1: Sharing a Function

```javascript
// Select this function
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Title**: "Calculate total function for shopping cart"
**Context**: Include file name and extension
**Recipients**: Share with team

### Scenario 2: Sharing Configuration

```json
// Select this configuration block
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp"
  }
  }
}
```

**Title**: "Database configuration for local development"
**Context**: Include full file context for diff application
**Recipients**: Share with specific members

### Scenario 3: Sharing Error Handling

```python
# Select this error handling code
try:
    result = api_call()
except APIError as e:
    logger.error(f"API call failed: {e}")
    return None
```

**Title**: "Error handling for API calls"
**Context**: Include file name and extension
**Recipients**: Share with team

## Troubleshooting Your First Share

### "No Code Selected" Error

**Problem**: You didn't select any code before sharing
**Solution**: Select some code in your editor first

### "Not Logged In" Error

**Problem**: You're not authenticated with GitHub
**Solution**: Run `Osmynt: Login` to authenticate

### "No Team" Error

**Problem**: You haven't joined a team yet
**Solution**: Join a team using `Osmynt: Accept Invitation`

### "Share Failed" Error

**Problem**: Network or authentication issues
**Solution**:

1. Check your internet connection
2. Run `Osmynt: Refresh` to sync
3. Try sharing again

### Code Not Appearing

**Problem**: Your share doesn't appear in the panel
**Solution**:

1. Run `Osmynt: Refresh` to sync
2. Check if you're in the right team
3. Verify the share was completed successfully

## Best Practices for Sharing

### Code Selection

- **Select meaningful chunks** - complete functions or logical blocks
- **Avoid very large selections** - keep under 1000 lines
- **Include relevant context** - don't cut off in the middle of a function

### Titles and Descriptions

- **Use descriptive titles** - explain what the code does
- **Include context** - mention the file or function name
- **Be specific** - "Fix login bug" is better than "Fix bug"

### Sharing Strategy

- **Share incrementally** - small, focused shares are better
- **Include context when needed** - for diff application
- **Choose appropriate recipients** - don't spam the entire team

## Next Steps

Now that you've shared your first code, you're ready to:

1. **[Learn about receiving code](features/code-sharing#receiving-code)** - How to view and use shared code
2. **[Set up multiple devices](features/device-management)** - Access from anywhere
3. **[Learn about diff application](features/diff-application)** - Apply shared code changes directly to your files
