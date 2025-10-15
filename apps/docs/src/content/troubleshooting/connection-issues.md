---
layout: page
title: Connection Issues
description: "Troubleshoot network connectivity, synchronization, and connection problems with Osmynt."
---

# Connection Issues

This guide helps you troubleshoot network connectivity, synchronization, and connection problems with Osmynt.

## Network Connectivity Issues

### Cannot Connect to Osmynt Servers

**Symptoms:**
- "Connection failed" error messages
- Cannot authenticate with GitHub
- Sync fails repeatedly

**Common causes:**
- Internet connectivity issues
- Firewall blocking connections
- DNS resolution problems

**Solutions:**
1. **Check internet connection**: Ensure you have stable internet connectivity
2. **Test basic connectivity**: Try accessing other websites
3. **Check firewall settings**: Ensure VS Code can access the internet
4. **Try different network**: Test with different internet connection
5. **Check DNS settings**: Ensure DNS is working correctly

### Network Timeouts

**Symptoms:**
- Requests timeout frequently
- Slow response times
- Intermittent connection issues

**Common causes:**
- Network latency
- Unstable internet connection
- Server-side issues

**Solutions:**
1. **Check network speed**: Ensure fast internet connection
2. **Use wired connection**: Try using wired internet instead of WiFi
3. **Check network stability**: Ensure stable internet connection
4. **Try different time**: Test at different times of day
5. **Contact ISP**: Contact your internet service provider

### DNS Resolution Issues

**Symptoms:**
- Cannot resolve domain names
- "DNS resolution failed" errors
- Connection to wrong servers

**Solutions:**
1. **Check DNS settings**: Ensure DNS is configured correctly
2. **Try different DNS**: Use different DNS servers (8.8.8.8, 1.1.1.1)
3. **Flush DNS cache**: Clear DNS cache on your system
4. **Check network settings**: Ensure network settings are correct
5. **Contact IT department**: Ask IT department for help

## Firewall and Proxy Issues

### Firewall Blocking Connections

**Symptoms:**
- Cannot connect to Osmynt servers
- Network errors appear
- Sync fails repeatedly

**Common causes:**
- Corporate firewall blocking connections
- Personal firewall blocking VS Code
- Antivirus software blocking connections

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

**Common causes:**
- Proxy server configuration issues
- Proxy authentication problems
- Proxy server blocking connections

**Solutions:**
1. **Configure proxy**: Set up proxy in VS Code settings
2. **Check proxy credentials**: Ensure proxy credentials are correct
3. **Try different proxy**: Test with different proxy server
4. **Bypass proxy**: Try bypassing proxy for Osmynt
5. **Contact IT**: Ask IT department for proxy configuration

### Corporate Network Restrictions

**Symptoms:**
- Cannot access Osmynt from corporate network
- Authentication fails
- Network timeouts

**Common causes:**
- Corporate network policies
- Proxy server restrictions
- Firewall blocking connections

**Solutions:**
1. **Contact IT department**: Ask about network restrictions
2. **Use VPN**: Try using VPN if available
3. **Check proxy settings**: Configure proxy if needed
4. **Use personal network**: Test with personal internet connection
5. **Request access**: Ask IT department to allow Osmynt access

## Synchronization Issues

### Sync Not Working

**Symptoms:**
- Changes not appearing on other devices
- Real-time updates not working
- Manual sync fails

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

## Authentication Issues

### GitHub Authentication Fails

**Symptoms:**
- Cannot authenticate with GitHub
- "Authentication failed" error messages
- Browser doesn't open for authentication

**Common causes:**
- Network connectivity issues
- GitHub service temporarily unavailable
- Browser popup blocked

**Solutions:**
1. **Check internet connection**: Ensure stable connectivity
2. **Allow popups**: Allow popups for VS Code in your browser
3. **Try again**: GitHub services are usually restored quickly
4. **Restart VS Code**: Restart VS Code and try again
5. **Check browser settings**: Ensure browser can open popups

### Token Expiration

**Symptoms:**
- "Session expired" error messages
- Need to re-authenticate frequently
- Cannot access teams or shared code

**Common causes:**
- GitHub token expired
- Long period of inactivity
- GitHub security policy changes

**Solutions:**
1. **Re-authenticate**: Run `Osmynt: Login` again
2. **Check GitHub security**: Review your GitHub security settings
3. **Clear cache**: Run `Osmynt: Clear Local Cache` if issues persist
4. **Check token permissions**: Ensure GitHub token has necessary permissions
5. **Contact support**: If issues persist, contact support

### Permission Denied

**Symptoms:**
- "Permission denied" error messages
- Cannot access certain features
- Authentication succeeds but access is denied

**Common causes:**
- GitHub account restrictions
- Organization policies blocking third-party apps
- Two-factor authentication issues

**Solutions:**
1. **Check GitHub settings**: Go to GitHub → Settings → Applications
2. **Check organization policies**: Contact your GitHub organization admin
3. **Use personal account**: Try with a personal GitHub account first
4. **Disable 2FA temporarily**: If possible, disable 2FA temporarily
5. **Contact support**: If issues persist, contact support

## VPN and Network Issues

### VPN Compatibility

**Symptoms:**
- Cannot connect through VPN
- VPN causes connection issues
- Network timeouts with VPN

**Common causes:**
- VPN configuration issues
- VPN blocking connections
- Network routing problems

**Solutions:**
1. **Check VPN settings**: Ensure VPN is configured correctly
2. **Try different VPN**: Test with different VPN server
3. **Bypass VPN**: Try bypassing VPN for Osmynt
4. **Check VPN logs**: Check VPN logs for errors
5. **Contact VPN provider**: Ask VPN provider for help

### Network Routing Issues

**Symptoms:**
- Cannot reach Osmynt servers
- Network routing problems
- Connection to wrong servers

**Solutions:**
1. **Check network routing**: Ensure network routing is correct
2. **Try different network**: Test with different internet connection
3. **Check network settings**: Ensure network settings are correct
4. **Contact IT department**: Ask IT department for help
5. **Use different DNS**: Try using different DNS servers

### Network Latency

**Symptoms:**
- Slow response times
- High latency
- Intermittent connection issues

**Common causes:**
- Network congestion
- Geographic distance from servers
- Network routing issues

**Solutions:**
1. **Check network speed**: Ensure fast internet connection
2. **Use wired connection**: Try using wired internet instead of WiFi
3. **Try different time**: Test at different times of day
4. **Check network routing**: Ensure network routing is optimal
5. **Contact ISP**: Contact your internet service provider

## Troubleshooting Steps

### Basic Troubleshooting

1. **Check internet connection**: Ensure stable connectivity
2. **Restart VS Code**: Restart VS Code and try again
3. **Clear cache**: Run `Osmynt: Clear Local Cache`
4. **Re-authenticate**: Run `Osmynt: Login` again
5. **Check firewall**: Ensure VS Code can access the internet

### Advanced Troubleshooting

1. **Check network settings**: Ensure network settings are correct
2. **Try different network**: Test with different internet connection
3. **Check proxy settings**: Configure proxy if needed
4. **Contact IT department**: Ask IT department for help
5. **Contact support**: If issues persist, contact support

### Network Diagnostics

1. **Ping test**: Test basic connectivity to Osmynt servers
2. **Traceroute**: Check network routing to Osmynt servers
3. **DNS test**: Test DNS resolution for Osmynt servers
4. **Port test**: Test if required ports are accessible
5. **Speed test**: Test internet speed and latency

## Best Practices

### Network Management

1. **Use stable connections**: Avoid unstable networks
2. **Check firewall settings**: Ensure proper network access
3. **Monitor network usage**: Watch for excessive usage
4. **Use VPN when needed**: Works with most VPN configurations

### Connection Optimization

1. **Use wired connection**: Prefer wired over WiFi when possible
2. **Check network speed**: Ensure fast internet connection
3. **Avoid network congestion**: Use network during off-peak hours
4. **Monitor connection quality**: Watch for connection issues

### Troubleshooting

1. **Document issues**: Keep track of connection issues
2. **Try different solutions**: Test different approaches
3. **Contact support**: Get help when needed
4. **Share information**: Provide detailed information to support

## Getting Help

### Before Contacting Support

1. **Check this guide**: Look for your specific issue
2. **Try basic solutions**: Restart VS Code, clear cache, re-authenticate
3. **Check network settings**: Ensure network settings are correct
4. **Test with different network**: Try with different internet connection

### Contacting Support

When contacting support, include:

1. **Detailed description** of the problem
2. **Steps to reproduce** the issue
3. **Network information** (ISP, connection type, etc.)
4. **Error messages** (if any)
5. **What you've tried** to fix the issue

### Support Channels

- **📧 Email**: [support@osmynt.dev](mailto:support@osmynt.dev)
- **🐛 GitHub Issues**: [Report issues](https://github.com/moeen-mahmud/osmynt/issues)
- **💬 Discord**: [Get help from community](https://discord.gg/osmynt)

## Next Steps

If you're still experiencing connection issues:

1. **[Check common issues](troubleshooting/common-issues)** - General troubleshooting
2. **[Check device problems](troubleshooting/device-problems)** - Multi-device specific issues
3. **[Check performance issues](troubleshooting/performance)** - Performance optimization
4. **[Contact support](resources/support)** - Get help from our team
