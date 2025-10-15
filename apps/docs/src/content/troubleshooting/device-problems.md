---
layout: page
title: Device Problems
description: "Troubleshoot multi-device setup and synchronization issues with Osmynt."
---

# Device Problems

This guide helps you troubleshoot issues related to multiple devices, synchronization, and device management in Osmynt.

## Device Setup Issues

### Device Not Appearing in Panel

**Symptoms:**

- Device doesn't appear in device list
- Cannot see device in Osmynt panel
- Multi-device setup not working

**Common causes:**

- Device not properly authenticated
- Network sync issues
- Extension installation problems

**Solutions:**

1. **Verify installation**: Ensure Osmynt is properly installed on the device
2. **Check authentication**: Ensure you're logged in with the same GitHub account
3. **Wait for sync**: Sometimes it takes a few minutes for devices to appear
4. **Restart VS Code**: Restart VS Code and try again
5. **Check network**: Ensure stable internet connection

### "Device Verification Failed" Error

**Symptoms:**

- "Device verification failed" error message
- Cannot add device to team
- Device authentication fails

**Common causes:**

- GitHub authentication issues
- Network connectivity problems
- Device fingerprint mismatch

**Solutions:**

1. **Re-authenticate**: Run `Osmynt: Login` again on the device
2. **Check network**: Ensure stable internet connection
3. **Restart VS Code**: Restart VS Code and try again
4. **Check GitHub account**: Ensure you're using the same GitHub account
5. **Contact support**: If issues persist, contact support

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
5. **Check firewall**: Ensure VS Code can access the internet

## Synchronization Issues

### Slow Synchronization

**Symptoms:**

- Updates take a long time to appear
- Sync is slow between devices
- Real-time updates not working

**Common causes:**

- Network latency
- Large code blocks
- Multiple devices syncing simultaneously

**Solutions:**

1. **Check network speed**: Ensure fast internet connection
2. **Reduce code size**: Keep shared code blocks smaller
3. **Stagger updates**: Avoid simultaneous updates on multiple devices
4. **Check firewall**: Ensure no network restrictions
5. **Use wired connection**: Try using wired internet instead of WiFi

### "Sync Failed" Error

**Symptoms:**

- "Sync failed" error message
- Cannot synchronize between devices
- Updates not appearing

**Common causes:**

- Network connectivity issues
- Authentication problems
- Server-side issues

**Solutions:**

1. **Check internet connection**: Ensure stable connectivity
2. **Re-authenticate**: Run `Osmynt: Login` again
3. **Wait and retry**: Sometimes temporary issues resolve themselves
4. **Check network settings**: Ensure no proxy or firewall issues
5. **Contact support**: If issues persist, contact support

### Offline Synchronization

**Symptoms:**

- Device goes offline and doesn't sync when back online
- Updates are lost when device is offline
- Offline queuing not working

**Solutions:**

1. **Check internet connection**: Ensure device can connect to internet
2. **Wait for sync**: Sometimes it takes a few minutes to sync
3. **Refresh manually**: Run `Osmynt: Refresh` when back online
4. **Check device status**: Ensure device is properly authenticated
5. **Clear cache**: Run `Osmynt: Clear Local Cache` if needed

## Device Management Issues

### Cannot Remove Device

**Symptoms:**

- Cannot remove device from device list
- "Remove device" option not working
- Device remains in list after removal

**Solutions:**

1. **Check permissions**: Ensure you have permission to remove devices
2. **Try different method**: Use different method to remove device
3. **Restart VS Code**: Restart VS Code and try again
4. **Check device status**: Ensure device is properly authenticated
5. **Contact support**: If issues persist, contact support

### Device Appears Multiple Times

**Symptoms:**

- Same device appears multiple times in list
- Duplicate device entries
- Confusing device list

**Solutions:**

1. **Remove duplicates**: Remove duplicate device entries
2. **Check device names**: Ensure devices have unique names
3. **Restart VS Code**: Restart VS Code and try again
4. **Clear cache**: Run `Osmynt: Clear Local Cache` if needed
5. **Re-authenticate**: Run `Osmynt: Login` again

### Device Status Issues

**Symptoms:**

- Device shows as offline when it's online
- Device status not updating
- Incorrect device information

**Solutions:**

1. **Check device status**: Ensure device is properly connected
2. **Refresh sync**: Run `Osmynt: Refresh`
3. **Re-authenticate**: Run `Osmynt: Login` again
4. **Check network**: Ensure stable internet connection
5. **Restart VS Code**: Restart VS Code and try again

## Network Issues

### Corporate Network Problems

**Symptoms:**

- Cannot sync from corporate network
- Network timeouts
- Authentication fails

**Common causes:**

- Firewall blocking connections
- Proxy server issues
- Corporate network restrictions

**Solutions:**

1. **Contact IT department**: Ask about network restrictions
2. **Use VPN**: Try using VPN if available
3. **Check proxy settings**: Configure proxy if needed
4. **Use personal network**: Test with personal internet connection
5. **Check firewall**: Ensure VS Code can access the internet

### Firewall Issues

**Symptoms:**

- Cannot connect to Osmynt servers
- Network errors appear
- Sync fails repeatedly

**Solutions:**

1. **Check firewall settings**: Ensure VS Code can access the internet
2. **Add VS Code to exceptions**: Add VS Code to firewall exceptions
3. **Check corporate policies**: Contact your IT department
4. **Try different network**: Test with different internet connection
5. **Use VPN**: Try using VPN if available

### Proxy Server Issues

**Symptoms:**

- Cannot connect through proxy
- Proxy authentication fails
- Network timeouts

**Solutions:**

1. **Configure proxy**: Set up proxy in VS Code settings
2. **Check proxy credentials**: Ensure proxy credentials are correct
3. **Try different proxy**: Test with different proxy server
4. **Bypass proxy**: Try bypassing proxy for Osmynt
5. **Contact IT**: Ask IT department for proxy configuration

## Performance Issues

### High CPU Usage

**Symptoms:**

- VS Code uses excessive CPU
- System becomes slow
- Device becomes unresponsive

**Solutions:**

1. **Check for conflicts**: Disable other extensions temporarily
2. **Restart VS Code**: Restart VS Code to clear memory
3. **Update extension**: Ensure you're running the latest version
4. **Check system resources**: Ensure sufficient system resources
5. **Contact support**: If issues persist, contact support

### Memory Issues

**Symptoms:**

- VS Code uses excessive memory
- Out of memory errors
- System becomes slow

**Solutions:**

1. **Clear cache**: Run `Osmynt: Clear Local Cache`
2. **Restart VS Code**: Restart VS Code to clear memory
3. **Check for memory leaks**: Monitor memory usage over time
4. **Update extension**: Ensure you're running the latest version
5. **Check system resources**: Ensure sufficient system resources

### Slow Performance

**Symptoms:**

- Osmynt panel loads slowly
- Code sharing takes a long time
- VS Code becomes unresponsive

**Solutions:**

1. **Reduce code size**: Keep shared code blocks smaller
2. **Check network speed**: Ensure fast internet connection
3. **Disable other extensions**: Temporarily disable other extensions
4. **Restart VS Code**: Restart VS Code to clear memory
5. **Check system resources**: Ensure sufficient system resources

## Device-Specific Issues

### Windows Issues

**Common issues:**

- Permission problems
- Antivirus interference
- Windows Defender blocking

**Solutions:**

1. **Run as Administrator**: Run VS Code as Administrator
2. **Check antivirus**: Add VS Code to antivirus exceptions
3. **Check Windows Defender**: Add VS Code to Windows Defender exceptions
4. **Update Windows**: Ensure Windows is updated
5. **Check permissions**: Ensure proper file permissions

### macOS Issues

**Common issues:**

- Gatekeeper blocking
- Permission problems
- System integrity protection

**Solutions:**

1. **Check Gatekeeper**: Allow VS Code in Security & Privacy
2. **Check permissions**: Ensure proper file permissions
3. **Update macOS**: Ensure macOS is updated
4. **Check system integrity**: Ensure system integrity protection is working
5. **Check certificates**: Ensure VS Code certificates are valid

### Linux Issues

**Common issues:**
- Permission problems
- Package manager issues
- System library conflicts

**Solutions:**
1. **Check permissions**: Ensure proper file permissions
2. **Update packages**: Update system packages
3. **Check libraries**: Ensure required libraries are installed
4. **Check dependencies**: Ensure all dependencies are installed
5. **Check system logs**: Check system logs for errors

## Best Practices

### Device Management

1. **Use descriptive names**: Name your devices clearly
2. **Regular cleanup**: Remove unused devices
3. **Monitor device activity**: Watch for unusual activity
4. **Keep devices updated**: Ensure VS Code and Osmynt are updated

### Network Management

1. **Use stable connections**: Avoid unstable networks
2. **Check firewall settings**: Ensure proper network access
3. **Monitor network usage**: Watch for excessive usage
4. **Use VPN when needed**: Works with most VPN configurations

### Performance Optimization

1. **Keep code blocks small**: Avoid very large code blocks
2. **Regular cleanup**: Remove old shared items
3. **Monitor performance**: Watch for performance issues
4. **Update regularly**: Keep everything updated

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

- **📧 Email**: [support@osmynt.dev](mailto:support@osmynt.dev)
- **🐛 GitHub Issues**: [Report issues](https://github.com/moeen-mahmud/osmynt/issues)
- **💬 Discord**: [Get help from community](https://discord.gg/osmynt)

## Next Steps

If you're still experiencing device issues:

1. **[Check common issues](troubleshooting/common-issues)** - General troubleshooting
2. **[Check connection issues](troubleshooting/connection-issues)** - Network and sync problems
3. **[Check performance issues](troubleshooting/performance)** - Performance optimization
4. **[Contact support](resources/support)** - Get help from our team
