# Use Bun base image
FROM oven/bun:1.2-slim

LABEL runtime="Osmynt Engine"

# Set working directory
WORKDIR /app


# Set production environment
ENV NODE_ENV="production"
ENV PORT=3000

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
RUN cd packages/database && bunx prisma migrate deploy

# Copy and make startup script executable
# COPY apps/engine/start.sh /app/start.sh
# RUN chmod +x /app/start.sh

# Set working directory to engine
WORKDIR /app/apps/engine

# Expose the port
EXPOSE 3000

# Use the startup script as default command
CMD ["bun", "run", "src/app.ts"]