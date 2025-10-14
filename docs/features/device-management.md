---
layout: page
title: Device Management
description: "Learn how to set up and manage multiple devices with Osmynt for seamless code sharing across all your development environments."
---

# Device Management

Osmynt supports multiple devices, allowing you to access your teams and shared code from anywhere. Set up your laptop, desktop, and other development machines to stay synchronized with your team.

## Overview

Multi-device support in Osmynt provides:

- **Seamless synchronization** across all your devices
- **Real-time updates** on every device
- **Secure device management** with device verification
- **Persistent access** to your teams and shared code
- **Cross-platform support** for Windows, macOS, and Linux

## Setting Up Multiple Devices

### Prerequisites

Before setting up additional devices:

- ✅ **Osmynt installed** on the new device
- ✅ **VS Code** running on the new device
- ✅ **Internet connection** for synchronization
- ✅ **GitHub account** (same account used on other devices)

### Adding a New Device

1. **Install Osmynt** on the new device
2. **Open VS Code** and click the Osmynt icon
3. **Run** `Osmynt: Login` to authenticate with GitHub
4. **Wait for synchronization** - your teams and shared code will sync automatically

### Device Verification

When adding a new device:

- **Automatic verification** - Osmynt verifies your device using your GitHub account
- **Secure key exchange** - device keys are exchanged securely
- **Team access** - you'll have access to all teams you're a member of
- **Code synchronization** - all shared code will be available on the new device

## Managing Devices

### Viewing Your Devices

- **Osmynt Panel**: See all your devices in the sidebar
- **Device Info**: Click on device name to see device details
- **Device Status**: See which devices are online and active

### Device Information

For each device, you can see:

- **Device name** (usually your computer name)
- **Operating system** (Windows, macOS, Linux)
- **Last active** timestamp
- **Connection status** (online/offline)

### Removing Devices

If you no longer use a device:

1. **Right-click on device** in the Osmynt panel
2. **Select** "Remove Device"
3. **Confirm** the removal
4. **Device is removed** and can no longer access your teams

> **Note**: Only you can remove your own devices. Team members cannot remove your devices.

## Device Synchronization

### Real-time Updates

When you share code or receive code on one device:

- **Instant synchronization** to all your other devices
- **Real-time notifications** on all devices
- **Automatic updates** - no manual refresh needed
- **Persistent storage** - changes are saved across all devices

### Offline Support

When a device is offline:

- **Queued updates** - changes are queued for when the device comes online
- **Automatic sync** - updates are applied when the device reconnects
- **No data loss** - all changes are preserved

### Network Requirements

For optimal synchronization:

- **Stable internet connection** - required for real-time updates
- **Firewall settings** - ensure VS Code can access the internet
- **Corporate networks** - check if your organization blocks certain domains

## Device Security

### Device Verification

- **Cryptographic verification** - each device is cryptographically verified
- **Secure key exchange** - device keys are exchanged securely
- **Device fingerprinting** - each device has a unique fingerprint
- **Access control** - only verified devices can access your teams

### Security Best Practices

1. **Use trusted devices** - only add devices you trust
2. **Regular device review** - periodically review your devices
3. **Remove unused devices** - remove devices you no longer use
4. **Secure GitHub account** - use strong passwords and 2FA

### Device Access Control

- **Team-based access** - devices can only access teams you're a member of
- **Encrypted communication** - all device communication is encrypted
- **Secure storage** - device keys are stored securely
- **Access revocation** - you can revoke access to specific devices

## Troubleshooting Device Issues

### Device Not Syncing

**Common causes:**
- Network connectivity issues
- Authentication problems
- Extension cache issues

**Solutions:**
1. **Check internet connection** - ensure stable connectivity
2. **Re-authenticate** - run `Osmynt: Login` again
3. **Refresh sync** - run `Osmynt: Refresh`
4. **Clear cache** - run `Osmynt: Clear Local Cache` if needed

### Device Not Appearing

**Common causes:**
- Device not properly authenticated
- Network sync issues
- Extension installation problems

**Solutions:**
1. **Verify installation** - ensure Osmynt is properly installed
2. **Check authentication** - ensure you're logged in
3. **Wait for sync** - sometimes it takes a few minutes
4. **Restart VS Code** - restart VS Code and try again

### "Device Verification Failed" Error

**Common causes:**
- GitHub authentication issues
- Network connectivity problems
- Device fingerprint mismatch

**Solutions:**
1. **Re-authenticate** - run `Osmynt: Login` again
2. **Check network** - ensure stable internet connection
3. **Restart VS Code** - restart VS Code and try again
4. **Contact support** - if issues persist, contact support

### Slow Synchronization

**Common causes:**
- Network latency
- Large code blocks
- Multiple devices syncing simultaneously

**Solutions:**
1. **Check network speed** - ensure fast internet connection
2. **Reduce code size** - keep shared code blocks smaller
3. **Stagger updates** - avoid simultaneous updates on multiple devices
4. **Check firewall** - ensure no network restrictions

## Device Best Practices

### Device Organization

1. **Use descriptive names** - name your devices clearly
2. **Regular cleanup** - remove unused devices
3. **Monitor device activity** - watch for unusual activity
4. **Keep devices updated** - ensure VS Code and Osmynt are up to date

### Security Practices

1. **Use trusted devices** - only add devices you trust
2. **Secure GitHub account** - use strong passwords and 2FA
3. **Regular device review** - periodically review your devices
4. **Remove unused devices** - remove devices you no longer use

### Performance Optimization

1. **Stable internet** - use stable internet connections
2. **Regular updates** - keep VS Code and Osmynt updated
3. **Monitor performance** - watch for performance issues
4. **Optimize code size** - keep shared code blocks reasonable

## Device Limits

### Current Limits

- **Devices per user**: No hard limit
- **Teams per device**: No limit
- **Code synchronization**: No limit on shared code size
- **Update frequency**: Real-time updates

### Recommended Limits

- **Active devices**: 3-5 devices per user
- **Code size**: Keep individual shares under 1MB for best performance
- **Update frequency**: Avoid simultaneous updates on multiple devices

## Next Steps

Now that you understand device management, you're ready to:

1. **[Learn about diff application]({{ '/features/diff-application' | relative_url }})** - Apply code changes directly to files
2. **[Learn about real-time updates]({{ '/features/realtime-updates' | relative_url }})** - Stay synchronized with your team
3. **[Learn about code sharing]({{ '/features/code-sharing' | relative_url }})** - Share and receive code snippets
