---
layout: page
title: Common Issues
description: "Solutions to the most frequently encountered problems with Osmynt."
---

# Common Issues

This guide covers the most frequently encountered problems with Osmynt and their solutions.

## Installation Issues

### Extension Not Appearing

**Symptoms:**

- Osmynt icon not visible in Activity Bar
- Extension not listed in Extensions view
- Commands not available in Command Palette

**Solutions:**

1. **Reload VS Code**: Close and reopen VS Code
2. **Check VS Code version**: Ensure you're running VS Code 1.94.0 or later
3. **Reinstall extension**: Uninstall and reinstall Osmynt
4. **Check installation**: Go to Extensions view and verify Osmynt is installed and enabled

### Permission Issues

**Symptoms:**

- "Permission denied" errors during installation
- Extension fails to load
- VS Code crashes when opening Osmynt

**Solutions:**

1. **Restart VS Code as Administrator** (Windows) or with `sudo` (macOS/Linux)
2. **Check VS Code permissions**: Ensure VS Code has necessary permissions
3. **Update VS Code**: Ensure you're running the latest version
4. **Check system permissions**: Ensure your user account has necessary permissions

## Authentication Issues

### "Authentication Failed" Error

**Symptoms:**

- Browser doesn't open for authentication
- "Authentication failed" message appears
- Cannot sign in to GitHub

**Common causes:**

- Network connectivity issues
- GitHub service temporarily unavailable
- Browser popup blocked

**Solutions:**

1. **Check internet connection**
2. **Allow popups** for VS Code in your browser
3. **Try again** - GitHub services are usually restored quickly
4. **Restart VS Code** and try again

### "Permission Denied" Error

**Symptoms:**

- "Permission denied" when trying to authenticate
- Cannot access GitHub account
- Authentication process fails

**Common causes:**

- GitHub account restrictions
- Organization policies blocking third-party apps
- Two-factor authentication issues

**Solutions:**

1. **Check GitHub settings**: Go to GitHub → Settings → Applications
2. **Check organization policies**: Contact your GitHub organization admin
3. **Use personal account**: Try with a personal GitHub account first
4. **Disable 2FA temporarily**: If possible, disable 2FA temporarily

### "Session Expired" Error

**Symptoms:**

- "Session expired" message appears
- Cannot access teams or shared code
- Need to re-authenticate frequently

**Common causes:**

- GitHub token expired
- Long period of inactivity
- GitHub security policy changes

**Solutions:**

1. **Re-authenticate**: Run `Osmynt: Login` again
2. **Check GitHub security**: Review your GitHub security settings
3. **Clear cache**: Run `Osmynt: Clear Local Cache` if issues persist
4. **Check token permissions**: Ensure GitHub token has necessary permissions

## Team Issues

### "Failed to Join Team" Error

**Symptoms:**

- Cannot join team with invitation token
- "Failed to join team" error message
- Team invitation not working

**Common causes:**

- Invalid or expired invitation token
- Network connectivity issues
- Team no longer exists

**Solutions:**

1. **Check the token**: Ensure it's copied correctly
2. **Get a new invitation**: Ask team owner for a fresh token
3. **Check network**: Ensure you have internet connectivity
4. **Try again**: Sometimes temporary network issues cause failures

### "Team Not Found" Error

**Symptoms:**

- "Team not found" error message
- Cannot access team after joining
- Team disappears from panel

**Common causes:**

- Team was deleted
- You were removed from the team
- Token is for a different team

**Solutions:**

1. **Contact team owner**: Ask for a new invitation
2. **Check team status**: Verify the team still exists
3. **Get fresh token**: Request a new invitation token
4. **Re-authenticate**: Run `Osmynt: Login` again

### Team Members Not Appearing

**Symptoms:**

- Team members don't appear in panel
- Cannot see other team members
- Team appears empty

**Common causes:**
- Team members haven't joined yet
- Network sync issues
- Extension cache problems

**Solutions:**
1. **Refresh the panel**: Run `Osmynt: Refresh`
2. **Check member status**: Ensure members have joined
3. **Clear cache**: Run `Osmynt: Clear Local Cache` if needed
4. **Wait for sync**: Sometimes it takes a few minutes

## Code Sharing Issues

### "No Code Selected" Error

**Symptoms:**
- "No code selected" error when trying to share
- Cannot share code snippets
- Share button not working

**Solutions:**
1. **Select code first**: Select some code in your editor
2. **Check selection**: Ensure code is properly selected
3. **Try different selection**: Select code using different methods
4. **Restart VS Code**: If issues persist, restart VS Code

### "Share Failed" Error

**Symptoms:**
- "Share failed" error message
- Cannot share code with team
- Sharing process fails

**Common causes:**
- Network connectivity issues
- Authentication problems
- Team access issues

**Solutions:**
1. **Check internet connection**
2. **Run** `Osmynt: Refresh` to sync
3. **Try sharing again**
4. **Check team access**: Ensure you're a member of the team

### Code Not Appearing

**Symptoms:**
- Shared code doesn't appear in panel
- Cannot see shared code from team members
- Code sharing not working

**Solutions:**
1. **Run** `Osmynt: Refresh` to sync
2. **Check if you're in the right team**
3. **Verify the share was completed successfully**
4. **Check team member status**: Ensure team members are active

## Device Issues

### Device Not Syncing

**Symptoms:**
- Changes not appearing on other devices
- Device not receiving updates
- Multi-device sync not working

**Common causes:**
- Network connectivity issues
- Authentication problems
- Extension cache issues

**Solutions:**
1. **Check internet connection**: Ensure stable connectivity
2. **Re-authenticate**: Run `Osmynt: Login` again
3. **Refresh sync**: Run `Osmynt: Refresh`
4. **Clear cache**: Run `Osmynt: Clear Local Cache` if needed

### Device Not Appearing

**Symptoms:**
- Device doesn't appear in device list
- Cannot see device in panel
- Multi-device setup not working

**Common causes:**
- Device not properly authenticated
- Network sync issues
- Extension installation problems

**Solutions:**
1. **Verify installation**: Ensure Osmynt is properly installed
2. **Check authentication**: Ensure you're logged in
3. **Wait for sync**: Sometimes it takes a few minutes
4. **Restart VS Code**: Restart VS Code and try again

## Performance Issues

### Slow Performance

**Symptoms:**
- Osmynt panel loads slowly
- Code sharing takes a long time
- VS Code becomes unresponsive

**Common causes:**
- Large code blocks
- Network latency
- Extension conflicts

**Solutions:**
1. **Reduce code size**: Keep shared code blocks smaller
2. **Check network speed**: Ensure fast internet connection
3. **Disable other extensions**: Temporarily disable other extensions
4. **Restart VS Code**: Restart VS Code to clear memory

### High Memory Usage

**Symptoms:**
- VS Code uses excessive memory
- System becomes slow
- Out of memory errors

**Solutions:**
1. **Clear cache**: Run `Osmynt: Clear Local Cache`
2. **Restart VS Code**: Restart VS Code to clear memory
3. **Check for memory leaks**: Monitor memory usage over time
4. **Update extension**: Ensure you're running the latest version

## Network Issues

### Connection Problems

**Symptoms:**
- Cannot connect to Osmynt servers
- Network errors appear
- Sync fails repeatedly

**Common causes:**
- Firewall blocking connections
- Corporate network restrictions
- DNS resolution issues

**Solutions:**
1. **Check firewall settings**: Ensure VS Code can access the internet
2. **Check corporate policies**: Contact your IT department
3. **Try different network**: Test with different internet connection
4. **Check DNS settings**: Ensure DNS is working correctly

### Corporate Network Issues

**Symptoms:**
- Cannot access Osmynt from corporate network
- Authentication fails
- Network timeouts

**Solutions:**
1. **Contact IT department**: Ask about network restrictions
2. **Use VPN**: Try using VPN if available
3. **Check proxy settings**: Configure proxy if needed
4. **Use personal network**: Test with personal internet connection

## Getting Help

### Before Contacting Support

1. **Check this guide**: Look for your specific issue
2. **Try basic solutions**: Restart VS Code, clear cache, re-authenticate
3. **Check system requirements**: Ensure your system meets requirements
4. **Update everything**: Ensure VS Code and Osmynt are updated

### Contacting Support

When contacting support, include:

1. **Detailed description** of the problem
2. **Steps to reproduce** the issue
3. **System information** (OS, VS Code version, etc.)
4. **Error messages** (if any)
5. **What you've tried** to fix the issue

### Support Channels

> GitHub and Discord support is coming soon...

- **📧 Email**: [support@osmynt.dev](mailto:support@osmynt.dev)
<!-- - **🐛 GitHub Issues**: [Report issues](https://github.com/moeen-mahmud/osmynt/issues)
- **💬 Discord**: [Get help from community](https://discord.gg/osmynt) -->

## Prevention Tips

### Regular Maintenance

1. **Keep VS Code updated**: Ensure you're running the latest version
2. **Keep Osmynt updated**: Update the extension regularly
3. **Clear cache periodically**: Run `Osmynt: Clear Local Cache` occasionally
4. **Monitor performance**: Watch for performance issues

### Best Practices

1. **Use stable internet**: Avoid unstable network connections
2. **Keep code blocks small**: Avoid sharing very large code blocks
3. **Regular team cleanup**: Remove inactive team members
4. **Monitor device usage**: Remove unused devices

## Next Steps

If you're still experiencing issues:

1. **[Check device problems](troubleshooting/device-problems)** - Multi-device specific issues
2. **[Check connection issues](troubleshooting/connection-issues)** - Network and sync problems
3. **[Check performance issues](troubleshooting/performance)** - Performance optimization
4. **[Contact support](resources/support)** - Get help from our team
