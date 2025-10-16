FROM node:22-slim

LABEL runtime="Osmynt Landing Page"

# Set working directory
WORKDIR /app

# Install bun globally via npm
RUN npm install -g bun

# Set production environment
ENV NODE_ENV="production"
ENV PORT=9876
ENV HOST=0.0.0.0

# Copy package files
COPY package.json .
COPY tsconfig.json .
COPY biome.json .

# Copy the webapp package and shared packages
COPY . .

RUN bun install 

WORKDIR /app/apps/landing

# Build with Doppler
RUN bunx next build

EXPOSE 9876

CMD ["bunx", "next", "start", "-p", "9876"]