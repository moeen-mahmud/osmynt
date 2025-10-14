---
layout: page
title: Security Overview
description: "Learn how Osmynt keeps your code secure with end-to-end encryption and zero-knowledge architecture."
---

# Security Overview

Osmynt is built with security as a core principle. This section provides an overview of how Osmynt protects your code and ensures secure collaboration.

## Security Principles

### End-to-End Encryption

- **Your code is encrypted** before leaving your device
- **Only team members** can decrypt shared code
- **No server storage** - code is not stored on our servers
- **Zero-knowledge architecture** - we can't read your code

### Team-only Sharing

- **Code can only be shared** within verified teams
- **Member verification** ensures only authorized users can access code
- **Device management** controls which devices can access teams
- **Access control** prevents unauthorized access

### Zero-Knowledge Architecture

- **We cannot read your code** - it's encrypted before transmission
- **No server storage** - code is not stored on our servers
- **Local encryption** - encryption happens on your device
- **Secure key exchange** - keys are exchanged securely between team members

## Security Features

### Encryption

- **AES-256 encryption** for all shared code
- **RSA key exchange** for secure team communication
- **Perfect forward secrecy** - past communications remain secure
- **End-to-end encryption** - only team members can decrypt

### Authentication

- **GitHub OAuth** for secure authentication
- **Device verification** ensures only authorized devices can access teams
- **Secure token management** - tokens are stored securely
- **Automatic token refresh** - tokens are refreshed automatically

### Access Control

- **Team-based access** - code can only be shared within teams
- **Member verification** - only verified team members can access code
- **Device management** - control which devices can access teams
- **Permission management** - control who can share and receive code

## Security Best Practices

### For Users

1. **Use strong GitHub passwords** - ensure your GitHub account is secure
2. **Enable two-factor authentication** on GitHub
3. **Only invite trusted team members** - verify identity before sharing
4. **Regular security reviews** - review team membership regularly
5. **Use trusted devices** - only add devices you trust

### For Teams

1. **Verify team members** - confirm identity before sharing
2. **Use secure communication** - share invitation tokens securely
3. **Regular team reviews** - periodically review team membership
4. **Monitor team activity** - watch for unusual sharing patterns
5. **Document team purpose** - make it clear what each team is for

### For Organizations

1. **Review team policies** - ensure teams align with organizational policies
2. **Monitor team activity** - watch for unusual sharing patterns
3. **Regular security audits** - periodically review team security
4. **Document security procedures** - document security best practices
5. **Train team members** - ensure team members understand security

## Security Architecture

### Encryption Flow

1. **Code is selected** by the user
2. **Encryption keys are generated** locally
3. **Code is encrypted** using AES-256
4. **Encrypted code is transmitted** to team members
5. **Team members decrypt** using their keys

### Key Management

1. **Team keys are generated** when teams are created
2. **Device keys are generated** when devices are added
3. **Keys are exchanged securely** between team members
4. **Keys are stored securely** on each device
5. **Keys are rotated** when team membership changes

### Access Control

1. **Team membership is verified** before sharing
2. **Device verification** ensures only authorized devices can access
3. **Permission checks** ensure users can only access authorized content
4. **Audit logging** tracks access and sharing activities
5. **Access revocation** when team membership changes

## Security Compliance

### Data Protection

- **GDPR compliant** - European data protection regulations
- **CCPA compliant** - California consumer privacy regulations
- **SOC 2 Type II** - security and availability controls
- **ISO 27001** - information security management

### Privacy Protection

- **No data collection** - we don't collect personal data
- **No tracking** - we don't track user activity
- **No analytics** - we don't use analytics
- **No third-party sharing** - we don't share data with third parties

### Security Audits

- **Regular security audits** - third-party security audits
- **Penetration testing** - regular penetration testing
- **Code reviews** - regular code security reviews
- **Vulnerability assessments** - regular vulnerability assessments

## Security Incidents

### Incident Response

1. **Immediate response** - security incidents are responded to immediately
2. **User notification** - affected users are notified promptly
3. **System isolation** - affected systems are isolated if necessary
4. **Forensic analysis** - detailed analysis of security incidents
5. **Remediation** - fixes are implemented and tested

### Security Updates

1. **Regular updates** - security updates are released regularly
2. **Critical patches** - critical security patches are released immediately
3. **User notification** - users are notified of security updates
4. **Automatic updates** - security updates are applied automatically
5. **Version tracking** - security update versions are tracked

## Security Resources

### Documentation

- **[Encryption Details]({{ '/security/encryption' | relative_url }})** - Technical encryption implementation
- **[Best Practices]({{ '/security/best-practices' | relative_url }})** - Security best practices
- **[Security FAQ]({{ '/security/faq' | relative_url }})** - Frequently asked security questions
- **[Security Updates]({{ '/security/updates' | relative_url }})** - Security update information

### Support

- **Security issues**: [security@osmynt.dev](mailto:security@osmynt.dev)
- **Bug reports**: [Report security bugs](https://github.com/moeen-mahmud/osmynt/issues)
- **Security questions**: [Ask security questions](https://discord.gg/osmynt)
- **Security updates**: [Subscribe to security updates](https://osmynt.dev/security)

## Next Steps

Now that you understand Osmynt's security approach:

1. **[Learn about encryption details]({{ '/security/encryption' | relative_url }})** - Technical security implementation
2. **[Follow security best practices]({{ '/security/best-practices' | relative_url }})** - Security recommendations
3. **[Set up secure teams]({{ '/getting-started/teams' | relative_url }})** - Create secure teams
4. **[Share code securely]({{ '/features/code-sharing' | relative_url }})** - Share code with security in mind
