---
layout: page
title: Encryption Details
description: "Technical details about Osmynt's encryption implementation and security measures."
---

# Encryption Details

This document provides technical details about Osmynt's encryption implementation and security measures.

## Encryption Overview

### Encryption Standards

- **AES-256-GCM** for symmetric encryption of shared code
- **ECDH-P256** for key exchange between team members and devices
- **HMAC-SHA256** for JWT token signing
- **Web Crypto API** for all cryptographic operations

### Encryption Flow

1. **Code Selection**: User selects code to share
2. **Key Generation**: AES-256 key is generated locally
3. **Encryption**: Code is encrypted using AES-256-GCM
4. **Key Exchange**: Team keys are exchanged securely
5. **Transmission**: Encrypted code is transmitted to team members
6. **Decryption**: Team members decrypt using their keys

## Key Management

### Team Keys

- **Team keys are generated** when teams are created
- **AES-256 symmetric keys** are generated for each team
- **Team keys are shared** with all team members via ECDH
- **Keys are stored** securely in VS Code secrets
- **Keys are rotated** when team membership changes

### Device Keys

- **Device keys are generated** when devices are added
- **ECDH-P256 key pairs** are generated for each device
- **Device keys are exchanged** securely with team members
- **Device keys are stored** securely on each device
- **Device keys are revoked** when devices are removed

### Key Exchange

- **Secure key exchange** using ECDH-P256
- **Perfect forward secrecy** - past communications remain secure
- **Key rotation** when team membership changes
- **Key verification** ensures keys are authentic
- **Key storage** in secure key stores

## Encryption Implementation

### Symmetric Encryption

- **Algorithm**: AES-256-GCM
- **Key size**: 256 bits
- **Mode**: Galois/Counter Mode (GCM)
- **Authentication**: Built-in authentication
- **Randomization**: Cryptographically secure random number generation

### JWT Authentication

- **Algorithm**: HMAC-SHA256
- **Key size**: Variable (from JWT_SECRET)
- **Access token expiry**: 12 hours
- **Refresh token expiry**: 30 days
- **Key generation**: Cryptographically secure key generation

### Key Exchange

- **Algorithm**: ECDH-P256
- **Curve**: P-256 (secp256r1)
- **Key size**: 256 bits
- **Key derivation**: Direct ECDH key agreement
- **Handshake expiry**: 5 minutes

## Security Measures

### Perfect Forward Secrecy

- **Ephemeral keys** are used for each communication
- **Keys are destroyed** after use
- **Past communications** remain secure even if keys are compromised
- **Key rotation** ensures long-term security

### Authentication

- **Device authentication** using ECDH key pairs
- **Team authentication** using shared team keys
- **Message authentication** using AES-GCM built-in authentication
- **Key verification** ensures keys are authentic

### Integrity Protection

- **Message authentication codes** (MAC) for integrity via AES-GCM
- **JWT signature verification** using HMAC-SHA256
- **Tamper detection** for all communications
- **Integrity verification** for all data

## Cryptographic Protocols

### Key Exchange Protocol

1. **Device A generates** ECDH key pair
2. **Device A sends** public key to Device B
3. **Device B generates** ECDH key pair
4. **Device B sends** public key to Device A
5. **Both devices compute** shared secret
6. **Shared secret is used** to derive encryption keys

### Encryption Protocol

1. **Code is selected** by user
2. **AES-256 key is generated** locally
3. **Code is encrypted** using AES-256-GCM
4. **Encrypted code is transmitted** to team members
5. **Team members decrypt** using their keys

### Authentication Protocol

1. **Device generates** ECDH key pair
2. **Public key is shared** with team members
3. **Private key is stored** securely in VS Code secrets
4. **Messages are encrypted** using derived keys
5. **Messages are decrypted** using recipient's private key

## Security Properties

### Confidentiality

- **End-to-end encryption** ensures only authorized users can read code
- **Perfect forward secrecy** ensures past communications remain secure
- **Key rotation** ensures long-term security
- **Zero-knowledge architecture** ensures we cannot read your code

### Integrity

- **Message authentication** ensures messages are not tampered with
- **Hash-based authentication** ensures data integrity
- **Tamper detection** for all communications
- **Integrity verification** for all data

### Availability

- **Redundant systems** ensure high availability
- **Automatic failover** ensures continuous service
- **Load balancing** ensures optimal performance
- **Monitoring** ensures system health

### Non-repudiation

- **Digital signatures** ensure message authenticity
- **Audit logging** tracks all activities
- **Timestamp verification** ensures message timing
- **Identity verification** ensures user identity

## Security Audits

### Third-party Audits

- **Regular security audits** by third-party security firms
- **Penetration testing** by security experts
- **Code reviews** by security professionals
- **Vulnerability assessments** by security teams

### Internal Audits

- **Regular internal audits** by security team
- **Code reviews** by development team
- **Security testing** by QA team
- **Compliance reviews** by compliance team

### Security Updates

- **Regular security updates** for all components
- **Critical patches** for security vulnerabilities
- **Version tracking** for all security updates
- **User notification** for security updates

## Compliance

### Standards Compliance

- **Web Crypto API** - Uses browser-standard cryptographic APIs
- **Industry best practices** - Follows established cryptographic standards
- **Open source** - All cryptographic code is open source and auditable

### Regulatory Compliance

- **Data minimization** - Only collects necessary authentication data
- **User control** - Users control their own encryption keys
- **Transparency** - Open source code allows for security verification

## Security Resources

### Documentation

- **[Security Overview](security/overview)** - General security information
- **[Best Practices](security/best-practices)** - Security best practices
- **[Security FAQ](security/faq)** - Frequently asked security questions
- **[Security Updates](security/updates)** - Security update information

### Support

- **Security issues**: [security@osmynt.dev](mailto:security@osmynt.dev)
- **Bug reports**: [Report security bugs](https://github.com/moeen-mahmud/osmynt/issues)
<!-- - **Security questions**: [Ask security questions](https://discord.gg/osmynt)
- **Security updates**: [Subscribe to security updates](https://osmynt.dev/security) -->

## Next Steps

Now that you understand Osmynt's encryption implementation:

1. **[Follow security best practices](security/best-practices)** - Security recommendations
2. **[Learn about security overview](security/overview)** - General security information
3. **[Set up secure teams](getting-started/teams)** - Create secure teams
4. **[Share code securely](features/code-sharing)** - Share code with security in mind
