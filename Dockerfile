# Build stage: build Vite React app
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

# Copy source
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public 2>/dev/null || true

# Build (Vite outputs to ./build per vite.config.ts)
RUN npm run build

# Runtime stage: serve with Nginx
FROM nginx:1.27-alpine AS runtime

# Replace default server config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

