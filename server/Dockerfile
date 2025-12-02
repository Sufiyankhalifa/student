# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./

RUN npm ci --only=production

# Copy source
COPY . .

# Ensure environment is production by default
ENV NODE_ENV=production
EXPOSE 5000

# Start the server (make sure "start" script in package.json runs node server.js)
CMD ["npm", "start"]
