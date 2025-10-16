---
layout: page
title: Team Management
description: "Learn how to create, manage, and organize teams in Osmynt for secure code collaboration."
---

# Team Management

Teams are the foundation of collaboration in Osmynt. They allow you to securely share code with specific groups of developers and manage access permissions.

## Overview

Teams in Osmynt provide:

- **Secure groups** of developers who can share code with each other
- **End-to-end encrypted** communication - only team members can decrypt shared code
- **Real-time collaboration** - see updates instantly from team members
- **Persistent storage** - your team and shared code persist across sessions
- **Access control** - manage who can access your team's code

## Creating a Team

### Method 1: Through the Extension

1. **Open Osmynt Panel**
   - Click the Osmynt icon in the Activity Bar
   - Or run `Osmynt: Invite Team Member`

2. **Create Team**
   - Run `Osmynt: Invite Team Member`
   - This automatically creates a team and generates an invitation
   - Copy the invitation token to share with team members

### Method 2: Through Command Palette

1. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. **Run** `Osmynt: Invite Team Member`
3. **Copy the invitation token** that appears
4. **Share the token** with your team members

## Joining a Team

### Method 1: Using Invitation Token

1. **Get the invitation token** from a team member
2. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. **Run** `Osmynt: Accept Invitation`
4. **Paste the token** when prompted
5. **Confirm** to join the team

### Method 2: Using Invitation URL

If you received an invitation URL:

1. **Copy the token** from the URL
2. **Follow the steps above** using the extracted token

## Team Management

### Viewing Team Members

- **Osmynt Panel**: See all team members in the sidebar
- **Team Info**: Click on team name to see member details
- **Member Status**: See who's online and active

### Inviting New Members

1. **Run** `Osmynt: Invite Team Member`
2. **Copy the invitation token**
3. **Share with new member** via email, Slack, or any communication method
4. **New member joins** using `Osmynt: Accept Invitation`

### Removing Team Members

1. **Right-click on member** in the Osmynt panel
2. **Select** "Remove Member"
3. **Confirm** the removal
4. **Member is removed** and can no longer access team code

> **Note**: Only team owners can remove members. If you're not the owner, contact the team owner to remove members.

## Team Roles

### Team Owner

- **Creates the team** (first person to invite others)
- **Can remove members** from the team
- **Can invite new members**
- **Has full access** to all team features

### Team Members

- **Can share code** with the team
- **Can receive code** from team members
- **Cannot remove other members**
- **Cannot invite new members** (unless they become owner)

## Team Organization

### Creating Focused Teams

**Best practices for team organization:**

1. **Project-based teams** - separate teams for different projects
2. **Role-based teams** - teams for specific roles (frontend, backend, DevOps)
3. **Feature-based teams** - teams working on specific features
4. **Cross-functional teams** - teams with diverse skills

### Team Naming

**Good team names:**
- "Frontend Team - Project Alpha"
- "Backend API Team"
- "DevOps Infrastructure"
- "Code Review Team"

**Avoid:**
- Generic names like "Team 1" or "Development"
- Names that don't indicate purpose
- Very long names

### Team Size

**Recommended team sizes:**
- **Small teams**: 2-5 members (optimal for security)
- **Medium teams**: 6-10 members (good for collaboration)
- **Large teams**: 11+ members (consider splitting)

## Team Security

### End-to-End Encryption

- **All code is encrypted** before leaving your device
- **Only team members** can decrypt shared code
- **Team keys are generated** automatically
- **No one else** can read your shared code

### Team Verification

- **Cryptographic handshakes** ensure you're sharing with the right people
- **Device verification** prevents unauthorized access
- **Secure key exchange** when new members join

### Access Control

- **Team-only sharing** - code can only be shared within the team
- **Member verification** - only verified team members can access code
- **Device management** - control which devices can access the team

## Team Best Practices

### Security Best Practices

1. **Verify team members** - only invite people you trust
2. **Use strong GitHub accounts** - ensure team members have secure GitHub accounts
3. **Regular key rotation** - consider creating new teams periodically
4. **Monitor team activity** - watch for unusual sharing patterns

### Communication

1. **Share invitation tokens securely** - use encrypted communication
2. **Verify new members** - confirm identity before sharing tokens
3. **Document team purpose** - make it clear what the team is for
4. **Regular team reviews** - periodically review team membership

### Team Maintenance

1. **Regular cleanup** - remove inactive members periodically
2. **Monitor team size** - keep teams manageable
3. **Review team purpose** - ensure teams still serve their intended purpose
4. **Update team information** - keep team details current

## Troubleshooting Teams

### "Failed to Join Team" Error

**Common causes:**
- Invalid or expired invitation token
- Network connectivity issues
- Team no longer exists

**Solutions:**
1. **Check the token** - ensure it's copied correctly
2. **Get a new invitation** - ask team owner for a fresh token
3. **Check network** - ensure you have internet connectivity
4. **Try again** - sometimes temporary network issues cause failures

### "Team Not Found" Error

**Common causes:**
- Team was deleted
- You were removed from the team
- Token is for a different team

**Solutions:**
1. **Contact team owner** - ask for a new invitation
2. **Check team status** - verify the team still exists
3. **Get fresh token** - request a new invitation token

### "Permission Denied" Error

**Common causes:**
- You don't have permission to perform the action
- Team owner restrictions
- Account authentication issues

**Solutions:**
1. **Check your role** - ensure you have the necessary permissions
2. **Contact team owner** - ask for appropriate permissions
3. **Re-authenticate** - run `Osmynt: Login` again

### Team Members Not Appearing

**Common causes:**
- Team members haven't joined yet
- Network sync issues
- Extension cache problems

**Solutions:**
1. **Refresh the panel** - run `Osmynt: Refresh`
2. **Check member status** - ensure members have joined
3. **Clear cache** - run `Osmynt: Clear Local Cache` if needed

## Team Limits

### Current Limits

- **Team size**: No hard limit (practical limit based on security)
- **Teams per user**: No limit
- **Code sharing**: No limit on number of shares
- **Storage**: No limit on shared code size

### Recommended Limits

- **Team size**: 5-10 members for optimal security
- **Active teams**: 3-5 teams per user
- **Code size**: Keep individual shares under 1MB for best performance

## Next Steps

Now that you understand team management, you're ready to:

1. **[Learn about device management](features/device-management)** - Set up multiple devices
2. **[Learn about diff application](features/diff-application)** - Apply code changes directly to files
3. **[Learn about real-time updates](features/realtime-updates)** - Stay synchronized with your team
