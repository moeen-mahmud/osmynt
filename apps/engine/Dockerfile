# Use the official Bun image
FROM oven/bun:1

LABEL runtime="TurboGist Backend"

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ENV PORT=3000

# Copy root package.json, lockfile, and workspace configs
COPY package.json .
COPY bun.lockb .
COPY tsconfig.json .

# Copy the backend package and shared packages
COPY apps/backend ./apps/backend
COPY packages ./packages

# Install dependencies
RUN bun install

# Set working directory to the backend app
WORKDIR /app/apps/backend

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/app.ts"]