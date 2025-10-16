# Teams

Teams are the foundation of collaboration in Osmynt. They allow you to securely share code with specific groups of developers.

## What are Teams?

Teams in Osmynt are:

- **Secure groups** of developers who can share code with each other
- **End-to-end encrypted** - only team members can decrypt shared code
- **Real-time** - see updates instantly from team members
- **Persistent** - your team and shared code persist across sessions

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

## Best Practices

### Team Organization

1. **Create focused teams** - separate teams for different projects or purposes
2. **Use descriptive names** - make it clear what each team is for
3. **Limit team size** - smaller teams are more secure and manageable
4. **Regular cleanup** - remove inactive members periodically

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

## Need Help?

If you're having team-related issues:

- **Email**: [support@osmynt.dev](mailto:support@osmynt.dev)
<!-- - **GitHub Issues**: [Report team issues](https://github.com/moeen-mahmud/osmynt/issues)
- **Discord**: [Get help from the community](https://discord.gg/osmynt) -->

## Next Steps

Now that you understand teams, you're ready to:

1. **[Share your first code](getting-started/first-share)** - Learn the basics of code sharing
1. **[Set up multiple devices](features/device-management)** - Access from anywhere
2. **[Learn about diff application](features/diff-application)** - Apply code changes directly
