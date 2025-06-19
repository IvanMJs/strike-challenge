# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Use Docker-specific environment
COPY .env.docker .env.production

# Copy environment file
COPY .env.docker .env

# Build the app
RUN npm run build

# Production stage with Nginx
FROM nginx:1.25.1-alpine

# Health check to verify nginx is running
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/ || exit 1

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
