FROM node:18-alpine

# Enable corepack (for pnpm)
RUN corepack enable

WORKDIR /app

# Copy package files first
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Install cross-env explicitly if it's missing
RUN pnpm add -D cross-env

# Copy the rest of the application
COPY . .
  
# Expose correct port
EXPOSE 6004

# Start in development mode
CMD ["pnpm", "dev"]