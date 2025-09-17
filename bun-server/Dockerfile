# Official Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start the application
CMD ["bun", "start"]
