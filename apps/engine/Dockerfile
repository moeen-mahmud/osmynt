# Use Bun base image
FROM oven/bun:1.2-slim

LABEL runtime="Osmynt Engine"

# Set working directory to root
WORKDIR /app


# Set production environment
ENV NODE_ENV="production"

# System deps for Prisma (libssl)
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy root package.json, lockfile, and workspace configs
COPY package.json .
COPY bun.lock .
COPY tsconfig.json .

# Copy the backend package and shared packages
COPY apps/engine ./apps/engine
COPY packages ./packages

# Install dependencies
RUN bun install

# Generate Prisma client
RUN cd packages/database && bunx prisma generate

# Ensure startup script is executable (runs migrations at container start)
RUN chmod +x /app/packages/database/start.sh

# Keep working directory at repo root; start script navigates internally

# Expose the port
EXPOSE 8080

# Run migrations at startup, then launch the app
CMD ["/bin/sh", "/app/packages/database/start.sh"]