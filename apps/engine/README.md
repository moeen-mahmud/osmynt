# Osmynt Engine ⚡

The backend API server for Osmynt - a secure, end-to-end encrypted, real-time code sharing platform.

## Overview

Osmynt Engine is a high-performance API server built with modern technologies to provide secure, real-time code sharing capabilities. It handles authentication, encryption, team management, and real-time communication for the Osmynt ecosystem.

## Features

### 🔐 **Security First**

- **End-to-End Encryption**: All code is encrypted before transmission using AES-256-GCM
- **Zero-Knowledge Architecture**: Server cannot decrypt user data
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse and DoS attacks
- **CORS Protection**: Configurable cross-origin resource sharing

### ⚡ **Real-Time Communication**

- **Redis Pub/Sub**: High-performance real-time messaging
- **WebSocket Support**: Real-time bidirectional communication
- **Event Broadcasting**: Instant notifications for code sharing events
- **Connection Management**: Efficient connection pooling and management

### 👥 **Team Management**

- **Team Creation**: Users can create and manage teams
- **Invitation System**: Secure team invitation with expiration
- **Role-Based Access**: Owner and member roles with different permissions
- **Member Management**: Add, remove, and manage team members

### 🔑 **Key Management**

- **Device Registration**: Secure device key registration
- **ECDH Key Exchange**: Elliptic curve Diffie-Hellman for secure key exchange
- **Multi-Device Support**: Support for multiple devices per user
- **Key Rotation**: Secure key rotation and management

### 📊 **Monitoring & Health**

- **Health Checks**: Comprehensive health monitoring
- **Performance Metrics**: Memory usage, CPU usage, and response times
- **Audit Logging**: Complete audit trail for security and compliance
- **Error Tracking**: Detailed error logging and monitoring

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime
- **Framework**: [Hono](https://hono.dev) - Lightweight web framework
- **Database**: [PostgreSQL](https://www.postgresql.org) with [Prisma](https://www.prisma.io)
- **Real-time**: [Redis](https://redis.io) with [ioredis](https://github.com/luin/ioredis)
- **Authentication**: [GitHub OAuth](https://docs.github.com/en/developers/apps/building-oauth-apps)
- **Documentation**: [OpenAPI 3.0](https://swagger.io/specification/) with [Scalar](https://scalar.com)
- **Validation**: [Zod](https://zod.dev) for runtime type validation
- **Encryption**: Web Crypto API with ECDH-P256 and AES-GCM

## API Endpoints

### Authentication
- `GET /auth/github` - GitHub OAuth authorization
- `GET /auth/callback` - OAuth callback handler
- `POST /auth/handshake/init` - Initialize encryption handshake
- `GET /auth/handshake/retrieve` - Retrieve handshake result
- `POST /auth/login-with-token` - Login with GitHub token

### Teams
- `GET /teams/me` - Get user's teams and members
- `POST /teams/:teamId/invite` - Invite user to team
- `POST /teams/invite/:inviteToken` - Accept team invitation
- `DELETE /teams/:teamId/remove-member/:userId` - Remove team member

### Code Sharing
- `POST /code-share/share` - Share encrypted code snippet
- `GET /code-share/team/list` - List team's recent code shares
- `GET /code-share/:id` - Get specific code share
- `POST /code-share/:id/add-wrapped-keys` - Add additional recipients
- `GET /code-share/team/:teamId/by-author/:userId` - List by author
- `GET /code-share/dm/with/:userId` - List direct messages

### Key Management
- `POST /keys/register` - Register device encryption keys
- `GET /keys/me` - Get user's device keys
- `GET /keys/team/default` - Get default team member keys
- `GET /keys/team/:teamId` - Get team member keys
- `POST /pairing/init` - Initialize device pairing
- `POST /pairing/claim` - Claim device pairing
- `DELETE /keys/device/:deviceId` - Remove device
- `DELETE /keys/device/:deviceId/force` - Force remove device

### Health & Monitoring
- `GET /health` - Health check endpoint
- `GET /doc` - OpenAPI documentation
- `GET /reference` - Interactive API documentation

## Getting Started

### Prerequisites

- **Bun** (v1.0 or later) - [Installation Guide](https://bun.sh/docs/installation)
- **PostgreSQL** (v14 or later)
- **Redis** (v6 or later)
- **GitHub OAuth App** - [Create OAuth App](https://docs.github.com/en/developers/apps/building-oauth-apps)

### Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/moeen-mahmud/osmynt.git
   cd osmynt
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   # Server Configuration
   PORT=3000
   HOST=localhost
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   
   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_REDIRECT_URI=http://localhost:3000/osmynt-api-engine/auth/callback
   
   # Database
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Redis
   SUPABASE_REDIS_URL=your-redis-url
   SUPABASE_REDIS_TLS=true
   
   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

### Database Setup

1. **Generate Prisma client**:
   ```bash
   cd packages/database
   bun run db:generate
   ```

2. **Run database migrations**:
   ```bash
   bun run db:migrate
   ```

3. **(Optional) Open Prisma Studio**:
   ```bash
   bun run db:studio
   ```

### Running the Server

1. **Start the development server**:
   ```bash
   cd apps/engine
   bun run dev
   ```

2. **Verify the server is running**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Check [http://localhost:3000/osmynt-api-engine/reference](http://localhost:3000/osmynt-api-engine/reference) for API documentation

## Development

### Project Structure

```
apps/engine/
├── src/
│   ├── app.ts                 # Main application entry point
│   ├── config/                # Configuration files
│   │   ├── api-doc.config.ts  # OpenAPI documentation config
│   │   ├── constants.ts       # Application constants
│   │   ├── cookie-options.ts  # Cookie configuration
│   │   ├── database.config.ts # Database configuration
│   │   ├── env.config.ts      # Environment variables
│   │   ├── keys.config.ts     # Key configuration
│   │   ├── realtime.config.ts # Real-time configuration
│   │   ├── routes.config.ts   # Route definitions
│   │   ├── scalar.config.ts   # Scalar documentation config
│   │   └── supabase.config.ts # Supabase configuration
│   ├── middlewares/           # Express middlewares
│   │   ├── health-check.middleware.ts
│   │   ├── jwt.middleware.ts
│   │   ├── rate-limiter.middleware.ts
│   │   └── scalar.middleware.ts
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication module
│   │   ├── code-share/        # Code sharing module
│   │   ├── health-check/      # Health check module
│   │   ├── keys/              # Key management module
│   │   └── teams/             # Team management module
│   ├── schemas/               # Database schemas
│   ├── templates/             # Email templates
│   └── utils/                 # Utility functions
├── package.json
├── tsconfig.json
└── README.md
```

### Available Scripts

```bash
# Development
bun run dev          # Start development server with hot reload
bun run start        # Start production server

# Type checking
bun run type-check   # Run TypeScript type checking
```

### Code Style

The project uses [Biome](https://biomejs.dev) for linting and formatting:

```bash
# Check code style
bun run biome:check

# Fix code style issues
bun run biome:check:fix

# Format code
bun run biome:format
```

### Adding New Features

1. **Create a new module** in `src/modules/`
2. **Define routes** in the module's `routes/` directory
3. **Implement controllers** in the module's `controllers/` directory
4. **Add services** in the module's `services/` directory
5. **Update the main app** to include the new module

### Database Changes

1. **Update Prisma schema** in `packages/database/prisma/schema.prisma`
2. **Generate migration**:
   ```bash
   cd packages/database
   bun run db:migrate
   ```
3. **Update types** if needed

## Security

### Encryption

- **AES-256-GCM**: Used for encrypting code snippets
- **ECDH-P256**: Used for key exchange
- **JWT**: Used for authentication tokens
- **bcrypt**: Used for password hashing (if needed)

### Best Practices

- All user data is encrypted before storage
- Private keys are never stored on the server
- Rate limiting prevents abuse
- CORS is properly configured
- Input validation using Zod schemas
- SQL injection protection via Prisma

### Vulnerability Reporting

If you discover a security vulnerability, please report it responsibly:

1. **Do not** create a public issue
2. **Email** security details to [moeen.mahmud007@gmail.com](mailto:moeen.mahmud007@gmail.com)
3. **Include** steps to reproduce the vulnerability
4. **Wait** for acknowledgment before public disclosure

## API Documentation

### Interactive Documentation

Visit [http://localhost:3000/osmynt-api-engine/reference](http://localhost:3000/osmynt-api-engine/reference) for interactive API documentation powered by Scalar.

### OpenAPI Specification

The OpenAPI specification is available at [http://localhost:3000/osmynt-api-engine/doc](http://localhost:3000/osmynt-api-engine/doc).

### Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## Deployment

### Docker

The application includes a Dockerfile for containerized deployment:

```bash
# Build the image
docker build -t osmynt-engine .

# Run the container
docker run -p 3000:3000 --env-file .env osmynt-engine
```

### Environment Variables

Ensure all required environment variables are set in production:

- `NODE_ENV=production`
- `JWT_SECRET` (strong, random secret)
- `SUPABASE_URL` and related keys
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- `SUPABASE_REDIS_URL`

### Health Checks

The application provides health check endpoints for monitoring:

- `GET /health` - Basic health check
- `GET /osmynt-api-engine/health` - Detailed health information

## Monitoring

### Logs

The application uses structured logging with different levels:

- **INFO**: General application flow
- **WARN**: Warning conditions
- **ERROR**: Error conditions
- **SUCCESS**: Successful operations

### Metrics

Key metrics to monitor:

- Response times
- Memory usage
- CPU usage
- Database connection pool
- Redis connection status
- Error rates

## Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (when implemented)
5. Submit a pull request

### Code Review

All code changes require review before merging:

- Code quality and style
- Security implications
- Performance impact
- Documentation updates

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](../../LICENSE) file for details.

## Support

- **Documentation**: [Osmynt Docs](https://docs.osmynt.com)
- **Issues**: [GitHub Issues](https://github.com/moeen-mahmud/osmynt/issues)
- **Discussions**: [GitHub Discussions](https://github.com/moeen-mahmud/osmynt/discussions)
- **Email**: [support@osmynt.dev](mailto:support@osmynt.dev)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed list of changes.

---

**Built with ❤️ by the Osmynt team**