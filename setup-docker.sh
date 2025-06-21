#!/bin/bash

echo "🔧 Setting up Docker with pnpm workspace support..."

# Ensure subdirectories exist
mkdir -p home announcement popup testimonial footer

# Function to create a monorepo-aware Dockerfile
create_dockerfile() {
  SERVICE=$1
  PORT=$2

  cat > $SERVICE/Dockerfile <<EOF
FROM node:18-alpine AS dependencies
RUN corepack enable
WORKDIR /app

# Copy root files
COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./

# Copy only the relevant service's package.json
COPY ./$SERVICE/package.json ./$SERVICE/package.json

RUN pnpm install --frozen-lockfile --filter ./$SERVICE...

FROM node:18-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

WORKDIR /app/$SERVICE
ENV NEXT_PRIVATE_LOCAL_WEBPACK=true
RUN pnpm build

FROM node:18-alpine AS runner
RUN corepack enable
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PRIVATE_LOCAL_WEBPACK=true
ENV DOCKER_ENV=true

RUN apk add --no-cache wget

COPY --from=builder /app/$SERVICE/public ./public
COPY --from=builder /app/$SERVICE/.next ./.next
COPY --from=builder /app/$SERVICE/package.json ./
COPY --from=builder /app/$SERVICE/next.config.js ./
COPY --from=builder /app/$SERVICE/pages-map.js* ./
COPY --from=builder /app/$SERVICE/src ./src

RUN pnpm install --prod --filter ./$SERVICE...

EXPOSE $PORT
CMD ["pnpm", "start"]
EOF

  echo "✅ Dockerfile created: $SERVICE (port $PORT)"
}

# Generate Dockerfiles
create_dockerfile home 6003
create_dockerfile announcement 6004
create_dockerfile popup 6005
create_dockerfile testimonial 6006
create_dockerfile footer 6007

echo -e "\n🎯 Dockerfiles ready!"

# Recommend lockfile generation (in case it's not done yet)
echo -e "\n💡 Run the following if pnpm-lock.yaml is not created yet:\n"
echo "pnpm install"

# Build and run containers
echo -e "\n📦 Building Docker images..."
docker compose build

echo -e "\n🚀 Starting all services..."
docker compose up -d

echo -e "\n✅ All services are running successfully!"
