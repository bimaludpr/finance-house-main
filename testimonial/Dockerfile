FROM node:18-alpine

# Enable corepack (for pnpm)
RUN corepack enable

WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN pnpm install

# Expose correct port
EXPOSE 6006

# Start in development mode
CMD ["pnpm", "dev"]
