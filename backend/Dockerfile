# -------- BUILD STAGE --------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# -------- RUNTIME STAGE --------
FROM node:20-alpine

WORKDIR /app

# Copy built app from builder
COPY --from=builder /app .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["npm", "start"]