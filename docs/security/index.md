---
layout: page
title: Security
description: "Learn about Osmynt's security features including end-to-end encryption, team security, and best practices."
---

# Security

Understand Osmynt's security features and learn how to keep your code secure.

## 🔒 Security Overview

**[Security Overview]({{ '/security/overview' | relative_url }})** - Comprehensive security documentation
- End-to-end encryption
- Team security features
- Device verification
- Zero-knowledge architecture
- Security best practices

## 🔐 Encryption

**[Encryption Details]({{ '/security/encryption' | relative_url }})** - Technical details about encryption
- Encryption algorithms
- Key management
- Secure transmission
- Data protection
- Compliance standards

## 🛡️ Best Practices

**[Security Best Practices]({{ '/security/best-practices' | relative_url }})** - Keep your code secure
- Team management security
- Device security
- Code sharing security
- Network security
- Privacy protection

## 🔑 Key Security Features

### End-to-End Encryption
- **AES-256 encryption** for all code
- **RSA-4096 keys** for secure key exchange
- **Perfect Forward Secrecy** for session keys
- **Zero-knowledge architecture** - we cannot read your code

### Team Security
- **Invitation-only teams** - Only invited members can join
- **Device verification** - Only authorized devices can access
- **Role-based permissions** - Control who can share and receive
- **Audit logging** - Track all team activities

### Device Security
- **Multi-device verification** - Secure device registration
- **Device management** - Control and revoke device access
- **Secure synchronization** - Encrypted data transfer
- **Offline security** - Secure local storage

## 🚨 Security Considerations

### What We Protect
- ✅ **Your code** - End-to-end encrypted
- ✅ **Team communications** - Encrypted channels
- ✅ **Device data** - Secure synchronization
- ✅ **User privacy** - Zero-knowledge architecture

### What We Don't Protect
- ❌ **VS Code extensions** - Third-party extension security
- ❌ **System security** - Your operating system security
- ❌ **Network security** - Your network infrastructure
- ❌ **Physical security** - Device physical access

## 🔧 Security Configuration

### Recommended Settings
```json
{
  "osmynt.security.encryption": true,
  "osmynt.security.requireAuth": true,
  "osmynt.security.auditLogging": true,
  "osmynt.security.deviceVerification": true
}
```

### Security Checklist
- ✅ Enable encryption
- ✅ Use strong authentication
- ✅ Verify team members
- ✅ Manage device access
- ✅ Regular security updates
- ✅ Monitor team activities

## 🆘 Security Issues

### Report Security Vulnerabilities
- **Email**: [security@osmynt.dev](mailto:security@osmynt.dev)
- **PGP Key**: [Download our PGP key](https://osmynt.dev/pgp-key.asc)
- **Responsible disclosure**: We follow responsible disclosure practices

### Security Updates
- **Automatic updates**: Security updates are applied automatically
- **Security notifications**: We notify users of security issues
- **Update policy**: We provide security updates for 2 years

## 🔗 Related Documentation

- **[Getting Started]({{ '/getting-started/installation' | relative_url }})** - Secure installation
- **[Features]({{ '/features/code-sharing' | relative_url }})** - Secure code sharing
- **[Troubleshooting]({{ '/troubleshooting/common-issues' | relative_url }})** - Security troubleshooting
- **[Support]({{ '/resources/support' | relative_url }})** - Security support

---

**Have a security concern?** [Contact our security team →](mailto:security@osmynt.dev)
