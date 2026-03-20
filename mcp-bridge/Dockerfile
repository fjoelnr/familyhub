FROM node:20-slim

# Install bash for shell command execution
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

# Copy server source
COPY server.js ./

# Create non-root user
RUN groupadd -r mcpbridge && useradd -r -g mcpbridge -d /app mcpbridge

# Create workspace directory for file operations
RUN mkdir -p /workspace /app/data/tasks && chown -R mcpbridge:mcpbridge /workspace /app

# Switch to non-root user
USER mcpbridge

# Expose MCP HTTP port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start the MCP Bridge Server
CMD ["node", "server.js"]
