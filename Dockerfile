# Use Node.js 18 Alpine for smaller image size
FROM node:22-alpine

# Update packages and install security patches
RUN echo "Updating packages..." && \
    apk update && apk upgrade && apk add --no-cache dumb-init && \
    echo "Packages updated successfully"

# Create non-root user first
RUN echo "Creating user..." && \
    addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001 && \
    echo "User created successfully"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with verbose output
RUN echo "Installing dependencies..." && \
    npm ci --verbose && \
    echo "Dependencies installed successfully"

# Copy source code
COPY . .

# Build the application with debug output
RUN echo "Starting build process..." && \
    npm run build && \
    echo "Build completed successfully" && \
    echo "Build directory contents:" && \
    ls -la build/ && \
    echo "Build file size:" && \
    du -h build/index.js

# Change ownership to non-root user
RUN chown -R appuser:nodejs /app
USER appuser

# Remove dev dependencies to reduce image size (as non-root user)
RUN echo "Pruning dev dependencies..." && \
    npm prune --production && \
    echo "Dev dependencies pruned"

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]