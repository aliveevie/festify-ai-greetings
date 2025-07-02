# Use official Node.js LTS image (Debian-based for native module compatibility)
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy only package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the server files
COPY . .

# Expose the port the server runs on
EXPOSE 3001

# Start the server
CMD ["npm", "start"] 