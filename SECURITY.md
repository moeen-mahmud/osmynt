# Security Policy

## Supported Versions

Osmynt is currently in **Beta** development. We provide security updates for the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 1.0.0+  | :white_check_mark: | Beta   |
| < 1.0.0 | :x:                | N/A    |

> **Note**: As Osmynt is in active development, we recommend always using the latest version for the best security posture.

## Reporting a Vulnerability

We take security seriously and appreciate your help in keeping Osmynt and its users safe. If you discover a security vulnerability, please follow these guidelines:

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing our security team at:

**📧 [security@osmynt.dev](mailto:security@osmynt.dev)**

### What to Include

When reporting a vulnerability, please include:

- **Description**: A clear description of the vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Impact**: Potential impact and severity assessment
- **Affected Components**: Which parts of Osmynt are affected
- **Suggested Fix**: If you have ideas for how to fix the issue
- **Your Contact Information**: How we can reach you for follow-up

### What to Expect

#### Initial Response

- **Within 24 hours**: We'll acknowledge receipt of your report
- **Within 72 hours**: We'll provide an initial assessment and timeline

#### Investigation Process

- **Within 1 week**: We'll complete our initial investigation
- **Ongoing updates**: We'll keep you informed of our progress
- **Regular communication**: Expect updates at least weekly during investigation

#### Resolution Timeline

- **Critical vulnerabilities**: 24-48 hours for initial fix
- **High severity**: 1-2 weeks for resolution
- **Medium severity**: 2-4 weeks for resolution
- **Low severity**: Next scheduled release cycle

### Vulnerability Disclosure

We follow **Coordinated Disclosure** practices:

1. **Private Investigation**: We'll investigate the vulnerability privately
2. **Fix Development**: We'll develop and test a fix
3. **Release Coordination**: We'll coordinate the release with you
4. **Public Disclosure**: We'll publicly disclose after the fix is available

### Recognition

We believe in recognizing security researchers who help improve Osmynt's security:

- **Hall of Fame**: Security researchers will be listed in our security acknowledgments
- **CVE Credits**: We'll ensure proper CVE attribution when applicable
- **Public Recognition**: With your permission, we'll acknowledge your contribution

## Security Features

Osmynt implements several security measures to protect user data:

### End-to-End Encryption

- **AES-256-GCM**: All code snippets are encrypted before transmission
- **ECDH-P256**: Elliptic curve Diffie-Hellman for secure key exchange
- **Zero-Knowledge Architecture**: Server cannot decrypt user data
- **Perfect Forward Secrecy**: Each session uses unique encryption keys

### Authentication & Authorization

- **GitHub OAuth**: Secure authentication via GitHub
- **JWT Tokens**: Secure session management
- **Team-based Access Control**: Granular permission system

### Network Security

- **HTTPS Only**: All communications encrypted in transit
- **Rate Limiting**: 100 requests per 10-minute window per client
- **CORS Protection**: Configurable cross-origin resource sharing

### Data Protection

- **Encrypted Server Storage**: Code snippets are stored encrypted on servers
- **Ephemeral Handshakes**: Authentication handshakes expire in 5 minutes
- **Device Limits**: Maximum 2 devices per user account
- **Secure Key Exchange**: ECDH-P256 for secure key distribution

## Security Best Practices

### For Users

- **Keep Updated**: Always use the latest version of Osmynt
- **Secure Devices**: Ensure your development devices are secure
- **Team Management**: Regularly review team membership
- **Strong Authentication**: Use strong GitHub passwords and 2FA

### For Developers

- **Secure Coding**: Follow secure coding practices
- **Dependency Management**: Keep dependencies updated
- **Code Review**: All code changes require security review
- **Testing**: Security testing is part of our development process

## Security Contact

For security-related questions or concerns:

- **Email**: [security@osmynt.dev](mailto:security@osmynt.dev)
- **Response Time**: We aim to respond within 24 hours
- **PGP Key**: Available upon request for encrypted communications

## Security Updates

We maintain a security advisory system:

- **Security Advisories**: Published for all security fixes
- **CVE Assignment**: We work with CVE.org for vulnerability tracking
- **Release Notes**: Security fixes are documented in release notes
- **Notifications**: Users are notified of critical security updates

## Bug Bounty Program

While we don't currently have a formal bug bounty program, we do appreciate security research:

- **Responsible Disclosure**: We follow responsible disclosure practices
- **Recognition**: Security researchers are publicly acknowledged
- **Future Program**: We're considering a formal bug bounty program

## Security Resources

[Security Documentation](https://docs.osmynt.dev/security)

## Legal

### Safe Harbor
Security researchers acting in good faith and in accordance with this policy will not be subject to legal action or termination of access to Osmynt services.

### Scope

This security policy applies to:

- Osmynt VS Code Extension
- Osmynt Engine (Backend)
- Osmynt Documentation
- Osmynt Landing Page
- All associated infrastructure

### Out of Scope

The following are considered out of scope:

- Social engineering attacks
- Physical attacks
- Attacks requiring physical access to user devices
- Issues in third-party services we integrate with

---

**Thank you for helping keep Osmynt secure!** 🔒

*Last updated: October 2025*
